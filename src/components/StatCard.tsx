import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend }: StatCardProps) => (
  <div className="glass-card rounded-xl p-5 animate-fade-in-up">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trend.positive ? "text-success" : "text-destructive"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
  </div>
);

export default StatCard;
