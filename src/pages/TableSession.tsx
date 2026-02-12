import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatKES } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChefHat, LogIn, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const API_URL = "http://localhost:3000/api";

const TableSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: table, isLoading: isLoadingTable } = useQuery({
    queryKey: ["table", id],
    queryFn: async () => {
      // Find table by ID (simulated fetch since API lists all tables usually)
      const res = await fetch(`${API_URL}/tables`);
      const tables = await res.json();
      return tables.find((t: any) => t.id === id);
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/orders`);
      const allOrders = await res.json();
      return allOrders.filter((o: any) => o.tableId === id && o.status !== "completed" && o.status !== "cancelled");
    },
    enabled: !!table,
  });

  const payMutation = useMutation({
    mutationFn: async ({ orderId, amount }: { orderId: string; amount: number }) => {
      // In a real app, this would trigger a payment gateway
      // Here we simulate successful payment update on the order
      // We don't have a direct payment endpoint in the mockup, so we just complete the order for now?
      // Or maybe update payment status.
      // Let's assume we update status to 'completed' for simplicity of the flow.
      await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      
      // Also free up the table
       await fetch(`${API_URL}/tables/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "available", orderTotal: 0, guests: 0 }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["table"] });
      toast.success("Payment successful! Thank you for dining with us.");
    },
  });

  if (isLoadingTable) return <div className="p-8 text-center">Loading table info...</div>;
  if (!table) return <div className="p-8 text-center text-destructive">Table not found</div>;

  const totalDue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4">
      <div className="w-full max-w-md space-y-8 mt-10">
        <div className="text-center space-y-2">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Savanna Grill</h1>
          <p className="text-muted-foreground">Table {table.number}</p>
        </div>

        {table.status === "available" ? (
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
              <p className="text-muted-foreground mb-6">
                This table is currently available. Scan the menu to start ordering.
              </p>
              <Button 
                size="lg" 
                className="w-full font-bold rounded-xl"
                onClick={() => navigate(`/menu?tableId=${id}`)}
              >
                View Menu & Order <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Your Bill</span>
                  <Badge variant={totalDue > 0 ? "destructive" : "secondary"}>
                    {totalDue > 0 ? "Pending" : "Paid"}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {orders.length > 0 ? (
                  orders.map((order: any) => (
                    <div key={order.id} className="space-y-3">
                      <div className="flex justify-between text-sm text-muted-foreground font-medium">
                        <span>Order #{order.id.slice(0, 4)}</span>
                        <span>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="space-y-2 pl-2 border-l-2 border-border">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{formatKES(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border border-dashed my-2" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No active orders.</p>
                )}
                
                <div className="flex justify-between items-center text-xl font-bold pt-2">
                  <span>Total Due</span>
                  <span>{formatKES(totalDue)}</span>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border">
                {totalDue > 0 ? (
                   <Button 
                    size="lg" 
                    className="w-full font-bold rounded-xl"
                    onClick={() => {
                        // Pay all orders? For simplicity, we just pay the first one or loop?
                        // The mutation expects orderId.
                        // Let's just simulate paying the whole table.
                        orders.forEach((o: any) => payMutation.mutate({ orderId: o.id, amount: o.totalAmount }));
                    }}
                    disabled={payMutation.isPending}
                  >
                    {payMutation.isPending ? "Processing..." : `Pay ${formatKES(totalDue)}`}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full font-bold rounded-xl"
                    onClick={() => navigate(`/menu?tableId=${id}`)}
                  >
                    Order More Items
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSession;
