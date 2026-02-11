import { cn } from "@/lib/utils";

type Status = "available" | "occupied" | "needs-attention" | "billing" | "pending" | "preparing" | "ready" | "rush" | "normal";

const statusStyles: Record<Status, string> = {
  available: "bg-success/15 text-success",
  occupied: "bg-primary/15 text-primary",
  "needs-attention": "bg-destructive/15 text-destructive",
  billing: "bg-warning/15 text-warning",
  pending: "bg-muted text-muted-foreground",
  preparing: "bg-primary/15 text-primary",
  ready: "bg-success/15 text-success",
  rush: "bg-destructive/15 text-destructive",
  normal: "bg-muted text-muted-foreground",
};

const StatusBadge = ({ status, className }: { status: Status; className?: string }) => (
  <span className={cn("status-badge", statusStyles[status], className)}>
    <span className={cn("h-1.5 w-1.5 rounded-full", {
      "bg-success": status === "available" || status === "ready",
      "bg-primary": status === "occupied" || status === "preparing",
      "bg-destructive": status === "needs-attention" || status === "rush",
      "bg-warning": status === "billing",
      "bg-muted-foreground": status === "pending" || status === "normal",
    })} />
    {status.replace("-", " ")}
  </span>
);

export default StatusBadge;
