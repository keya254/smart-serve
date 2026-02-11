import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  LayoutDashboard,
  ChefHat,
  ClipboardList,
  QrCode,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Menu", icon: UtensilsCrossed, path: "/menu" },
  { label: "Waiter", icon: Users, path: "/waiter" },
  { label: "Kitchen", icon: ChefHat, path: "/kitchen" },
  { label: "Orders", icon: ClipboardList, path: "/orders" },
  { label: "Tables & QR", icon: QrCode, path: "/admin/tables" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border min-h-screen p-4">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
          <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">SmartServe</h1>
          <p className="text-xs text-sidebar-foreground/50">Restaurant OS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-semibold text-sidebar-accent-foreground">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "Guest"}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{user?.role || "unknown"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
