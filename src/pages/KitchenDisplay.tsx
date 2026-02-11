import { usePOS } from "@/contexts/POSContext";
import StatusBadge from "@/components/StatusBadge";
import { ChefHat, Clock, Flame, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const KitchenDisplay = () => {
  const { getKitchenOrders, updateOrderItemStatus, updateOrderStatus } = usePOS();
  const orders = getKitchenOrders();

  const handleStatusChange = (orderId: string, itemId: string, newStatus: "preparing" | "ready") => {
    updateOrderItemStatus(orderId, itemId, newStatus);
  };
  
  const handleMarkAllReady = (orderId: string) => {
    // We update the order status directly to ready, and perhaps all items too?
    // For simplicity, let's just update the order status to 'ready' which removes it from kitchen view usually
    // Or we can loop items.
    updateOrderStatus(orderId, 'ready');
    toast.success("Order marked as ready!");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ChefHat className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Kitchen Display</h1>
              <p className="text-xs text-muted-foreground">{orders.length} active orders</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Live
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
          </div>
        </div>
      </header>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {orders.length === 0 ? (
           <div className="col-span-full text-center py-20 text-muted-foreground">
             <ChefHat className="h-12 w-12 mx-auto mb-3 opacity-20" />
             <p>No active orders</p>
           </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="glass-card rounded-xl overflow-hidden animate-fade-in-up"
            >
              <div className="px-4 py-3 bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">Table {order.tableNumber}</span>
                  {/* Priority logic can be added later, assuming normal for now */}
                </div>
                <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>

              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.quantity}x {item.name}
                      </p>
                      {item.notes && <p className="text-xs text-primary mt-0.5">Note: {item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      {item.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleStatusChange(order.id, item.id, "preparing")}
                        >
                          Start
                        </Button>
                      )}
                      {item.status === "preparing" && (
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => handleStatusChange(order.id, item.id, "ready")}
                        >
                          <Check className="h-3 w-3" /> Done
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 bg-muted/30 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleMarkAllReady(order.id)}
                >
                  Mark All Ready
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;
