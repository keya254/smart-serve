import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { adminNavItems } from "@/config/dashboardConfig";

const AdminLayout = () => {
  return (
    <DashboardLayout navItems={adminNavItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminLayout;
