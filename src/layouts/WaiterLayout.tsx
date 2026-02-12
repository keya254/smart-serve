import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { waiterNavItems } from "@/config/dashboardConfig";

const WaiterLayout = () => {
  return (
    <DashboardLayout navItems={waiterNavItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default WaiterLayout;
