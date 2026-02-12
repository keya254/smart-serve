import { formatKES } from "@/data/mock";
import { usePOS } from "@/contexts/POSContext";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminReports = () => {
    const { orders } = usePOS();
    const paidOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'completed' && o.status !== 'delivered');
    const completedOrders = orders.filter(o => o.status === 'completed');

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Sales</h3>
                    <p className="text-3xl font-bold mt-2 text-primary">{formatKES(orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0))}</p>
                </div>
                 <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Completed Orders</h3>
                    <p className="text-3xl font-bold mt-2">{completedOrders.length}</p>
                </div>
                 <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Average Order Value</h3>
                    <p className="text-3xl font-bold mt-2">{formatKES(orders.length > 0 ? (orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length) : 0)}</p>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card">
                <div className="p-6 border-b border-border">
                    <h2 className="font-semibold text-lg">Recent Transactions</h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Table</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium font-mono">#{order.id.slice(0, 8)}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>Table {order.tableNumber}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right font-bold">{formatKES(order.totalAmount)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminReports;
