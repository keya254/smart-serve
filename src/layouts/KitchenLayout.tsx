import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { kitchenNavItems } from "@/config/dashboardConfig";

const KitchenLayout = () => {
  return (
    <DashboardLayout navItems={kitchenNavItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default KitchenLayout;
