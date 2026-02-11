import { useState, useEffect } from "react";
import { formatKES } from "@/data/mock";
import { ArrowLeft, CreditCard, Users, Smartphone, Banknote, CheckCircle2, Clock, ChefHat, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { usePOS, Order } from "@/contexts/POSContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const CartBill = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("tableId") || "t1";
  const initialTab = searchParams.get("tab") || "cart";

  const { cart, removeFromCart, clearCart, totalAmount: cartTotal } = useCart();
  const { placeOrder, getOrdersByTable, processPayment, tables } = usePOS();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  
  const activeOrders = getOrdersByTable(tableId).filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const activeTotal = activeOrders.reduce((sum, o) => sum + (o.totalAmount - o.paidAmount), 0);
  const tableInfo = tables.find(t => t.id === tableId);

  // Payment State
  const [splitMode, setSplitMode] = useState<"full" | "equal">("full");
  const [splitCount, setSplitCount] = useState(2);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);

  useEffect(() => {
    // If cart is empty and we have active orders, switch to active tab
    if (cart.length === 0 && activeOrders.length > 0 && activeTab === 'cart') {
      setActiveTab('active');
    }
  }, [cart.length, activeOrders.length]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacing(true);
    try {
      await placeOrder(tableId, cart);
      clearCart();
      toast.success("Order sent to kitchen!");
      setActiveTab("active");
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  };

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      if (splitMode === 'full') {
        const phone = phoneNumbers[0];
        if (!phone || phone.length < 10) {
          toast.error("Please enter a valid M-Pesa number");
          setIsPaying(false);
          return;
        }
        // Pay all active orders
        for (const order of activeOrders) {
          const remaining = order.totalAmount - order.paidAmount;
          if (remaining > 0) {
            await processPayment(order.id, remaining, 'mpesa', phone);
          }
        }
        toast.success("Payment successful! STK Push sent.");
      } else {
        // Split Equal
        const amountPerPerson = Math.ceil(activeTotal / splitCount);
        // Simulate sending to multiple numbers
        // In a real app, we'd loop through phoneNumbers array
        
        // Just pay off the full amount for demo purposes effectively
        // Logic: We assume everyone pays their share
         for (const order of activeOrders) {
          const remaining = order.totalAmount - order.paidAmount;
          if (remaining > 0) {
            await processPayment(order.id, remaining, 'mpesa', 'MULTIPLE');
          }
        }
        toast.success(`STK Pushes sent to ${splitCount} numbers!`);
      }
      navigate(`/menu?tableId=${tableId}`);
    } catch (e) {
      toast.error("Payment failed");
    } finally {
      setIsPaying(false);
    }
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const newPhones = [...phoneNumbers];
    newPhones[index] = value;
    setPhoneNumbers(newPhones);
  };

  // Adjust phone number inputs based on split count
  useEffect(() => {
    if (splitMode === 'equal') {
      setPhoneNumbers(prev => {
        const newArr = [...prev];
        while (newArr.length < splitCount) newArr.push("");
        return newArr.slice(0, splitCount);
      });
    } else {
      setPhoneNumbers(prev => [prev[0] || ""]);
    }
  }, [splitCount, splitMode]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(`/menu?tableId=${tableId}`)} className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Your Order</h1>
            <p className="text-xs text-muted-foreground">Table {tableInfo?.number} · {tableInfo?.waiter ? 'Waiter Assigned' : 'Self Service'}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="cart">New Order ({cart.length})</TabsTrigger>
            <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="space-y-4 max-w-lg mx-auto">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Utensils className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button variant="outline" onClick={() => navigate(`/menu?tableId=${tableId}`)}>
                  Go to Menu
                </Button>
              </div>
            ) : (
              <>
                <div className="glass-card rounded-xl divide-y divide-border/50">
                  {cart.map((item, i) => (
                    <div key={`${item.id}-${i}`} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} · {formatKES(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold">{formatKES(item.price * item.quantity)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                          <span className="sr-only">Remove</span>
                          <ArrowLeft className="h-4 w-4 rotate-45" /> 
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatKES(cartTotal)}</span>
                  </div>
                </div>

                <Button className="w-full h-14 text-base font-bold rounded-xl shadow-lg" onClick={handlePlaceOrder} disabled={isPlacing}>
                  {isPlacing ? "Sending to Kitchen..." : "Place Order"}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            {activeOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No active orders</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Order Status Cards */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg md:hidden">Orders</h3>
                  {activeOrders.map((order) => (
                    <div key={order.id} className="glass-card rounded-xl p-4 border-l-4 border-l-primary">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={order.status === 'ready' ? 'default' : 'outline'} className="capitalize">
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                            <span>{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Section */}
                <div className="space-y-4 sticky top-24">
                  <h3 className="font-bold text-lg hidden md:block">Payment</h3>
                  <div className="glass-card rounded-xl p-4 space-y-2">
                     <div className="flex justify-between text-lg font-bold">
                      <span>Total Outstanding</span>
                      <span className="text-primary">{formatKES(activeTotal)}</span>
                    </div>
                  </div>

                  {/* Split Controls */}
                  <div className="glass-card rounded-xl p-4 space-y-4">
                    <div className="flex gap-2">
                      <Button 
                        variant={splitMode === 'full' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setSplitMode('full')}
                      >
                        Full Bill
                      </Button>
                      <Button 
                        variant={splitMode === 'equal' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setSplitMode('equal')}
                      >
                        Split Bill
                      </Button>
                    </div>

                    {splitMode === 'equal' && (
                       <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                            className="h-8 w-8 rounded-md bg-background shadow-sm flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold">{splitCount} People</span>
                          <button
                            onClick={() => setSplitCount(splitCount + 1)}
                            className="h-8 w-8 rounded-md bg-background shadow-sm flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Per Person</p>
                          <p className="font-bold text-primary">{formatKES(Math.ceil(activeTotal / splitCount))}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label>M-Pesa Number{splitMode === 'equal' ? 's' : ''}</Label>
                      {phoneNumbers.map((phone, idx) => (
                        <div key={idx} className="flex items-center gap-2 animate-fade-in-up">
                          <span className="text-xs font-mono text-muted-foreground w-6">{idx + 1}.</span>
                          <Input 
                            placeholder="07..." 
                            value={phone} 
                            onChange={(e) => updatePhoneNumber(idx, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full h-14 text-base font-bold rounded-xl gap-2" onClick={handlePayment} disabled={isPaying || activeTotal <= 0}>
                    <Smartphone className="h-5 w-5" />
                    {isPaying ? "Processing STK Push..." : `Pay ${formatKES(activeTotal)} via M-Pesa`}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 rounded-xl">
                        <Banknote className="h-4 w-4 mr-2" /> Cash
                    </Button>
                     <Button variant="outline" className="h-12 rounded-xl">
                        <CreditCard className="h-4 w-4 mr-2" /> Card
                    </Button>
                  </div>

                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CartBill;