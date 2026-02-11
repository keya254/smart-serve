import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { menuItems, MenuItem, TableInfo, tables as initialTables } from '../data/mock';

// Enhanced Types
export type OrderStatus = 'pending_approval' | 'kitchen_pending' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';
export type PaymentMethod = 'cash' | 'card' | 'mpesa';

export interface OrderItem extends MenuItem {
  quantity: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  createdAt: string; // ISO String
  waiterId?: string;
  guestName?: string; // For tracking who ordered if needed
}

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  phoneNumber?: string; // For M-Pesa
  timestamp: string;
}

interface POSContextType {
  tables: TableInfo[];
  orders: Order[];
  menuItems: MenuItem[];
  
  // Actions
  placeOrder: (tableId: string, items: OrderItem[]) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  assignWaiter: (tableId: string, waiterId: string) => void;
  processPayment: (orderId: string, amount: number, method: PaymentMethod, phoneNumber?: string) => Promise<boolean>;
  getOrdersByTable: (tableId: string) => Order[];
  getOrdersByWaiter: (waiterId: string) => Order[];
  getKitchenOrders: () => Order[];
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with some dummy data for "Live" feel, or empty if starting fresh
  const [tables, setTables] = useState<TableInfo[]>(initialTables);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Load from local storage on mount (persistence simulation)
  useEffect(() => {
    const savedOrders = localStorage.getItem('pos_orders');
    const savedTables = localStorage.getItem('pos_tables');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    // Merge saved tables with initial tables to keep structure if needed, or just use saved
    if (savedTables) setTables(JSON.parse(savedTables));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('pos_orders', JSON.stringify(orders));
    localStorage.setItem('pos_tables', JSON.stringify(tables));
  }, [orders, tables]);

  const placeOrder = async (tableId: string, items: OrderItem[]) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) throw new Error("Table not found");

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      tableId,
      tableNumber: table.number,
      items: items.map(i => ({ ...i, status: 'pending' })),
      status: 'pending_approval', // Goes to waiter first
      paymentStatus: 'unpaid',
      totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paidAmount: 0,
      createdAt: new Date().toISOString(),
      waiterId: table.waiter,
    };

    setOrders(prev => [...prev, newOrder]);
    
    // Update table status
    setTables(prev => prev.map(t => 
      t.id === tableId 
        ? { ...t, status: 'needs-attention', orderTotal: (t.orderTotal || 0) + newOrder.totalAmount, lastActivity: 'Just now' } 
        : t
    ));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateOrderItemStatus = (orderId: string, itemId: string, status: OrderItem['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const updatedItems = o.items.map(i => i.id === itemId ? { ...i, status } : i);
      
      // Auto-update order status based on items? 
      // Simplified: If all items ready -> Order Ready
      const allReady = updatedItems.every(i => i.status === 'ready' || i.status === 'served');
      const orderStatus = allReady ? 'ready' : o.status === 'pending_approval' ? 'kitchen_pending' : o.status;

      return { ...o, items: updatedItems, status: orderStatus };
    }));
  };

  const assignWaiter = (tableId: string, waiterId: string) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, waiter: waiterId } : t));
  };

  const processPayment = async (orderId: string, amount: number, method: PaymentMethod, phoneNumber?: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const newPaidAmount = o.paidAmount + amount;
      const isFullyPaid = newPaidAmount >= o.totalAmount;
      
      return {
        ...o,
        paidAmount: newPaidAmount,
        paymentStatus: isFullyPaid ? 'paid' : 'partially_paid',
        status: isFullyPaid ? 'completed' : o.status
      };
    }));
    
    // If fully paid, free up the table? Or let waiter do it? 
    // Usually waiter clears the table.
    
    return true;
  };

  const getOrdersByTable = (tableId: string) => orders.filter(o => o.tableId === tableId);
  const getOrdersByWaiter = (waiterId: string) => orders.filter(o => o.waiterId === waiterId);
  const getKitchenOrders = () => orders.filter(o => ['kitchen_pending', 'preparing'].includes(o.status));

  return (
    <POSContext.Provider value={{
      tables,
      orders,
      menuItems,
      placeOrder,
      updateOrderStatus,
      updateOrderItemStatus,
      assignWaiter,
      processPayment,
      getOrdersByTable,
      getOrdersByWaiter,
      getKitchenOrders
    }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
