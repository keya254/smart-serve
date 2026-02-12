import StatusBadge from "@/components/StatusBadge";
import { formatKES } from "@/data/mock";
import { Bell, MessageSquare, Clock, Users, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePOS } from "@/contexts/POSContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const WaiterDashboard = () => {
  const { tables, orders, updateOrderStatus } = usePOS();
  
  // In a real app, filter by logged-in waiter ID
  const activeTables = tables.filter((t) => t.status !== "available");
  const availableTables = tables.filter((t) => t.status === "available");
  
  const pendingOrders = orders.filter(o => o.status === 'pending_approval');

  const handleApprove = (orderId: string) => {
    updateOrderStatus(orderId, 'kitchen_pending');
    toast.success("Order approved and sent to kitchen");
  };

  const handleReject = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
    toast.error("Order rejected");
  };

  return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Waiter Dashboard</h1>
            <p className="text-sm text-muted-foreground">My Zone · {activeTables.length} active tables</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 relative">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {pendingOrders.length}
              </span>
            )}
          </Button>
        </div>

        {/* Incoming Orders Section */}
        {pendingOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Incoming Orders <Badge variant="destructive">{pendingOrders.length}</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pendingOrders.map((order) => (
                <div key={order.id} className="glass-card rounded-xl p-4 border-l-4 border-l-warning bg-card/50">
                   <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-lg">Table {order.tableNumber}</span>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <Badge variant="outline">New Request</Badge>
                  </div>
                  <div className="space-y-1 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="text-muted-foreground">{formatKES(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatKES(order.totalAmount)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => handleReject(order.id)}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                     <Button size="sm" className="flex-1" onClick={() => handleApprove(order.id)}>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Tables */}
        <h2 className="text-lg font-semibold mb-3">Active Tables</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8">
          {activeTables.map((table) => (
            <div
              key={table.id}
              className={`glass-card rounded-xl p-4 animate-fade-in-up cursor-pointer hover:shadow-xl transition-shadow ${
                table.status === "needs-attention" ? "ring-2 ring-destructive/50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">T{table.number}</span>
                  <StatusBadge status={table.status} />
                </div>
                {table.status === "needs-attention" && (
                  <MessageSquare className="h-4 w-4 text-destructive animate-pulse-soft" />
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> Guests
                  </span>
                  <span className="font-medium">{table.guests || 0}/{table.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Total</span>
                  <span className="font-semibold text-primary">{formatKES(table.orderTotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Last activity
                  </span>
                  <span className="text-xs">{table.lastActivity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Available Tables */}
        <h2 className="text-lg font-semibold mb-3">Available Tables</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {availableTables.map((table) => (
            <div
              key={table.id}
              className="glass-card rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <span className="text-xl font-bold">T{table.number}</span>
              <p className="text-xs text-muted-foreground mt-1">{table.seats} seats</p>
              <StatusBadge status="available" className="mt-2" />
            </div>
          ))}
        </div>
      </div>
  );
};

export default WaiterDashboard;
