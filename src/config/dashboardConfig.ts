import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  ChefHat,
  ClipboardList,
  QrCode,
  Settings,
  History,
  BarChart,
  UserCog
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: any;
  path: string;
}

export const adminNavItems: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Menu Management", icon: UtensilsCrossed, path: "/admin/menu" },
  { label: "Staff", icon: UserCog, path: "/admin/staff" },
  { label: "Tables & QR", icon: QrCode, path: "/admin/tables" },
  { label: "Reports", icon: BarChart, path: "/admin/reports" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export const waiterNavItems: NavItem[] = [
  { label: "My Tables", icon: LayoutDashboard, path: "/waiter" },
  { label: "New Order", icon: UtensilsCrossed, path: "/menu" },
  { label: "Active Orders", icon: ClipboardList, path: "/waiter/orders" },
  { label: "Order History", icon: History, path: "/waiter/history" },
];

export const kitchenNavItems: NavItem[] = [
  { label: "Active Orders", icon: ChefHat, path: "/kitchen" },
  { label: "History", icon: History, path: "/kitchen/history" },
];
