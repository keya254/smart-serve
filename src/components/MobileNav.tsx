import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, Users, ChefHat, ClipboardList } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Menu", icon: UtensilsCrossed, path: "/menu" },
  { label: "Waiter", icon: Users, path: "/waiter" },
  { label: "Kitchen", icon: ChefHat, path: "/kitchen" },
  { label: "Orders", icon: ClipboardList, path: "/orders" },
];

const MobileNav = () => {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around py-2 px-1">
      {items.map((item) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
