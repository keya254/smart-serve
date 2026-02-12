import StatCard from "@/components/StatCard";
import { formatKES } from "@/data/mock";
import { DollarSign, Users, ShoppingCart, TrendingUp, Clock, UserCircle } from "lucide-react";
import { usePOS } from "@/contexts/POSContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const waiters = [
  { id: "james", name: "James" },
  { id: "sarah", name: "Sarah" },
  { id: "david", name: "David" },
];

const AdminDashboard = () => {
  const { tables, orders, assignWaiter } = usePOS();
  
  const occupied = tables.filter((t) => t.status !== "available").length;
  // Calculate revenue from active orders (or completed ones if we tracked history)
  const totalRevenue = orders.reduce((a, o) => a + (o.paidAmount || 0), 0);
  const activeOrderCount = orders.filter(o => o.status !== 'completed').length;

  const handleAssignWaiter = (tableId: string, waiterId: string) => {
    assignWaiter(tableId, waiterId);
    toast.success(`Assigned ${waiters.find(w => w.id === waiterId)?.name} to Table`);
  };

  return (
    <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">The Savanna Grill · Overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Total Revenue (Session)"
            value={formatKES(totalRevenue)}
            icon={DollarSign}
            trend={{ value: "Live", positive: true }}
          />
          <StatCard
            title="Active Tables"
            value={`${occupied}/${tables.length}`}
            icon={Users}
            subtitle={`${tables.length - occupied} available`}
          />
          <StatCard
            title="Active Orders"
            value={activeOrderCount.toString()}
            icon={ShoppingCart}
          />
           <StatCard
            title="Avg Order Value"
            value={formatKES(orders.length > 0 ? totalRevenue / orders.length : 0)}
            icon={TrendingUp}
          />
        </div>

        {/* Table Management */}
        <div className="glass-card rounded-xl mb-8">
           <div className="px-5 py-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold">Live Floor Status</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
             {tables.map(table => (
               <div key={table.id} className="border border-border rounded-lg p-3 bg-card/50">
                 <div className="flex justify-between items-center mb-2">
                   <span className="font-bold">Table {table.number}</span>
                   <span className={`text-xs px-2 py-0.5 rounded-full ${table.status === 'available' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                     {table.status}
                   </span>
                 </div>
                 <div className="flex items-center gap-2 mt-2">
                   <UserCircle className="h-4 w-4 text-muted-foreground" />
                   <Select 
                      defaultValue={waiters.find(w => w.name === table.waiter)?.id || "unassigned"}
                      onValueChange={(val) => handleAssignWaiter(table.id, val)}
                    >
                     <SelectTrigger className="h-8 text-xs w-full">
                       <SelectValue placeholder="Assign Waiter" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="unassigned">Unassigned</SelectItem>
                       {waiters.map(w => (
                         <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Recent Orders (from context) */}
        <div className="glass-card rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Recent Orders (Live)</h2>
          </div>
          <div className="divide-y divide-border">
            {orders.slice().reverse().slice(0, 5).map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono font-bold text-muted-foreground">#{order.id.slice(0,4)}</span>
                  <div>
                    <p className="text-sm font-medium">Table {order.tableNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.items.reduce((a,b)=>a+b.quantity,0)} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                  <span className="text-sm font-semibold">{formatKES(order.totalAmount)}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="p-5 text-center text-muted-foreground">No orders yet.</p>}
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;

