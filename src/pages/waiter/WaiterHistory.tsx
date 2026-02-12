import { usePOS } from "@/contexts/POSContext";
import { formatKES } from "@/data/mock";
import { Badge } from "@/components/ui/badge";

const WaiterHistory = () => {
  const { orders } = usePOS();
  // In real app, filter by logged-in user
  const myOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      
      <div className="space-y-4">
        {myOrders.map((order) => (
          <div key={order.id} className="border border-border rounded-xl p-4 bg-card/50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-bold text-lg">Table {order.tableNumber}</span>
                <span className="text-xs text-muted-foreground ml-2">#{order.id.slice(0, 8)}</span>
              </div>
              <Badge variant={order.status === 'completed' ? 'default' : 'destructive'}>{order.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <div className="flex justify-between items-center font-bold border-t border-border pt-2 mt-2">
              <span>Total</span>
              <span>{formatKES(order.totalAmount)}</span>
            </div>
          </div>
        ))}
        {myOrders.length === 0 && <p className="text-center text-muted-foreground">No history found.</p>}
      </div>
    </div>
  );
};

export default WaiterHistory;
