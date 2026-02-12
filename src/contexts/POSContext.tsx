import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

// Types
export type OrderStatus = 'pending_approval' | 'kitchen_pending' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';
export type PaymentMethod = 'cash' | 'card' | 'mpesa';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  popular?: boolean;
  available?: boolean;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface TableInfo {
  id: string;
  number: number;
  seats: number;
  status: "available" | "occupied" | "needs-attention" | "billing";
  sessionId?: string;
  waiter?: string;
  guests?: number;
  orderTotal?: number;
  lastActivity?: string;
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
  createdAt: string;
  waiterId?: string;
  guestName?: string;
}

interface POSContextType {
  tables: TableInfo[];
  orders: Order[];
  menuItems: MenuItem[];
  categories: string[];
  
  // Actions
  placeOrder: (tableId: string, items: OrderItem[]) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  assignWaiter: (tableId: string, waiterId: string) => void;
  processPayment: (orderId: string, amount: number, method: PaymentMethod, phoneNumber?: string) => Promise<boolean>;
  getOrdersByTable: (tableId: string) => Order[];
  getOrdersByWaiter: (waiterId: string) => Order[];
  getKitchenOrders: () => Order[];
  
  // Loading states
  isLoading: boolean;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const API_URL = 'http://localhost:3000/api';
const socket = io('http://localhost:3000');

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Socket listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('menu_updated', () => queryClient.invalidateQueries({ queryKey: ['menuItems'] }));
    socket.on('tables_updated', () => queryClient.invalidateQueries({ queryKey: ['tables'] }));
    socket.on('orders_updated', () => queryClient.invalidateQueries({ queryKey: ['orders'] }));

    return () => {
      socket.off('connect');
      socket.off('menu_updated');
      socket.off('tables_updated');
      socket.off('orders_updated');
    };
  }, [queryClient]);

  // Queries
  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/menu-items`);
      return res.json();
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/categories`);
      return res.json();
    }
  });

  const { data: tables = [] } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tables`);
      const data = await res.json();
      return data.map((t: any) => ({
        id: t.id,
        number: t.number,
        seats: t.seats,
        status: t.status,
        sessionId: t.session_id,
        waiter: t.waiter,
        guests: t.guests,
        orderTotal: t.order_total,
        lastActivity: t.last_activity
      }));
    }
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/orders`);
      return res.json();
    }
  });

  // Mutations
  const placeOrderMutation = useMutation({
    mutationFn: async ({ tableId, items }: { tableId: string, items: OrderItem[] }) => {
      await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, items, priority: 'normal' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: OrderStatus }) => {
      await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
  });
  
  const updateOrderItemStatusMutation = useMutation({
      mutationFn: async ({ orderId, itemId, status }: { orderId: string, itemId: string, status: OrderItem['status'] }) => {
           await fetch(`${API_URL}/order-items/${itemId}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status }),
            });
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
  });

  const updateTableMutation = useMutation({
    mutationFn: async ({ tableId, updates }: { tableId: string, updates: Partial<TableInfo> }) => {
      await fetch(`${API_URL}/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables'] })
  });

  // Actions
  const placeOrder = async (tableId: string, items: OrderItem[]) => {
    await placeOrderMutation.mutateAsync({ tableId, items });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  const updateOrderItemStatus = (orderId: string, itemId: string, status: OrderItem['status']) => {
    updateOrderItemStatusMutation.mutate({ orderId, itemId, status });
  };

  const assignWaiter = (tableId: string, waiterId: string) => {
    updateTableMutation.mutate({ tableId, updates: { waiter: waiterId } });
  };

  const processPayment = async (orderId: string, amount: number, method: PaymentMethod, phoneNumber?: string): Promise<boolean> => {
    // Placeholder for payment logic
    // In real app, call payment API
    console.log('Processing payment', { orderId, amount, method, phoneNumber });
    // Simulate updating order status to paid locally or via API
    // For now, just update status if full amount?
    // We need a payment endpoint.
    return true;
  };

  const getOrdersByTable = (tableId: string) => orders.filter((o: Order) => o.tableId === tableId);
  const getOrdersByWaiter = (waiterId: string) => orders.filter((o: Order) => o.waiterId === waiterId);
  const getKitchenOrders = () => orders.filter((o: Order) => ['kitchen_pending', 'preparing', 'pending'].includes(o.status));

  return (
    <POSContext.Provider value={{
      tables,
      orders,
      menuItems,
      categories,
      placeOrder,
      updateOrderStatus,
      updateOrderItemStatus,
      assignWaiter,
      processPayment,
      getOrdersByTable,
      getOrdersByWaiter,
      getKitchenOrders,
      isLoading: false // Simplified
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