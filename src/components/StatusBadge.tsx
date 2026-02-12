import { cn } from "@/lib/utils";

type Status = 
  | "available" 
  | "occupied" 
  | "needs-attention" 
  | "billing" 
  | "pending" 
  | "preparing" 
  | "ready" 
  | "rush" 
  | "normal"
  | "pending_approval"
  | "kitchen_pending"
  | "delivered"
  | "served"
  | "completed"
  | "cancelled"
  | "paid"
  | "unpaid";

const statusStyles: Record<Status, string> = {
  // Table Statuses
  available: "bg-green-100 text-green-800",
  occupied: "bg-blue-100 text-blue-800",
  "needs-attention": "bg-red-100 text-red-800",
  billing: "bg-purple-100 text-purple-800",
  
  // Order Statuses
  pending: "bg-gray-100 text-gray-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  kitchen_pending: "bg-orange-100 text-orange-800",
  preparing: "bg-indigo-100 text-indigo-800",
  ready: "bg-teal-100 text-teal-800",
  delivered: "bg-green-100 text-green-800",
  served: "bg-green-100 text-green-800",
  completed: "bg-slate-100 text-slate-800",
  cancelled: "bg-red-100 text-red-800",
  
  // Priorities/Payment
  rush: "bg-red-100 text-red-800",
  normal: "bg-gray-100 text-gray-800",
  paid: "bg-emerald-100 text-emerald-800",
  unpaid: "bg-amber-100 text-amber-800",
};

const statusLabels: Record<Status, string> = {
  available: "Available",
  occupied: "Occupied",
  "needs-attention": "Needs Attention",
  billing: "Billing",
  pending: "Pending",
  pending_approval: "Approval Needed",
  kitchen_pending: "Sent to Kitchen",
  preparing: "Preparing",
  ready: "Ready to Serve",
  delivered: "Delivered",
  served: "Served",
  completed: "Completed",
  cancelled: "Cancelled",
  rush: "Rush",
  normal: "Normal",
  paid: "Paid",
  unpaid: "Unpaid",
};

const StatusBadge = ({ status, className }: { status: string; className?: string }) => {
  const normalizedStatus = status as Status;
  const style = statusStyles[normalizedStatus] || "bg-gray-100 text-gray-800";
  const label = statusLabels[normalizedStatus] || status.replace(/_/g, " ").replace(/-/g, " ");

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border", style, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current opacity-70")} />
      {label}
    </span>
  );
};

export default StatusBadge;