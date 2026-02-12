import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Utensils, 
  CreditCard, 
  Clock, 
  Users, 
  Receipt,
  ChefHat
} from "lucide-react";
import { API_BASE_URL } from '@/config/api';
import { usePOS } from "@/contexts/POSContext";
import StatusBadge from "@/components/StatusBadge";
import { format } from "date-fns";

const API_URL = `${API_BASE_URL}/api`;

const TableSession = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { tables, getOrdersByTable } = usePOS();

  const table = tables.find(t => t.id === tableId);
  const orders = tableId ? getOrdersByTable(tableId) : [];

  // Calculate bill from orders
  const billItems = orders.flatMap(order => 
    order.items.map(item => ({
      ...item,
      orderId: order.id
    }))
  );

  const totalAmount = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const payMutation = useMutation({
    mutationFn: async () => {
      // In a real app, this would initiate a payment flow
      // For now, we'll just update the table status
      const res = await fetch(`${API_URL}/tables/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "available",
          guests: null,
          orderTotal: null,
          session_id: null
        }),
      });
      if (!res.ok) throw new Error("Failed to process payment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] }); // Also invalidate orders
      toast({
        title: "Payment Successful",
        description: "Table has been cleared.",
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!table) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="hover:bg-transparent hover:text-primary -ml-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Table {table.number}</h1>
            <p className="text-muted-foreground mt-1">Session started {table.lastActivity}</p>
          </div>
          <StatusBadge status={table.status} className="self-start text-sm px-3 py-1" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Guests</span>
                  <p className="font-medium text-lg">{table.guests || "-"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Waiter</span>
                  <p className="font-medium text-lg">{table.waiter || "Not Assigned"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Utensils className="h-5 w-5 text-muted-foreground" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate(`/menu?tableId=${tableId}`)}
              >
                <Utensils className="mr-2 h-4 w-4" />
                Add Items to Order
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
              >
                <ChefHat className="mr-2 h-4 w-4" />
                Call Waiter
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders Status */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Active Orders
                </CardTitle>
                <CardDescription>Track the progress of your kitchen orders</CardDescription>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No active orders</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <div className="space-y-0.5">
                                        <span className="text-sm font-medium">Order #{order.id.slice(0, 8)}</span>
                                        <p className="text-xs text-muted-foreground">
                                            {order.createdAt ? format(new Date(order.createdAt), 'h:mm a') : 'Just now'}
                                        </p>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{item.quantity}x</span>
                                                <span>{item.name}</span>
                                            </div>
                                            <StatusBadge status={item.status} className="scale-90" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Bill Summary */}
        <Card className="border-t-4 border-t-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-muted-foreground" />
              Bill Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {billItems.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.name}
                  </span>
                  <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              {billItems.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No items ordered yet</p>
              )}
            </div>
            
            <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>KES {totalAmount.toLocaleString()}</span>
            </div>

            <Button 
              className="w-full mt-4" 
              size="lg"
              disabled={billItems.length === 0}
              onClick={() => payMutation.mutate()}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Bill
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TableSession;