import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import MobileNav from "./MobileNav";
import { NavItem } from "@/config/dashboardConfig";

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
}

const DashboardLayout = ({ children, navItems }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar navItems={navItems} />
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav navItems={navItems} />
    </div>
  );
};

export default DashboardLayout;
