import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { POSProvider } from "@/contexts/POSContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import CustomerMenu from "./pages/CustomerMenu";
import CartBill from "./pages/CartBill";
import WaiterDashboard from "./pages/WaiterDashboard";
import KitchenDisplay from "./pages/KitchenDisplay";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import WaiterLayout from "./layouts/WaiterLayout";
import KitchenLayout from "./layouts/KitchenLayout";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminReports from "./pages/admin/AdminReports";
import AdminTables from "./pages/admin/AdminTables";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminSettings from "./pages/admin/AdminSettings";
import TableSession from "./pages/TableSession";
import WaiterHistory from "./pages/waiter/WaiterHistory";

const queryClient = new QueryClient();

// Placeholder components for new routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <POSProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/tables/:id" element={<TableSession />} />
              <Route path="/" element={<Navigate to="/menu" replace />} />
              
              {/* Customer Routes */}
              <Route path="/menu" element={<CustomerMenu />} />
              <Route path="/cart" element={<CartBill />} />

              {/* Waiter Routes */}
              <Route path="/waiter" element={
                <ProtectedRoute allowedRoles={["waiter", "admin"]}>
                  <WaiterLayout />
                </ProtectedRoute>
              }>
                <Route index element={<WaiterDashboard />} />
                <Route path="orders" element={<PlaceholderPage title="Active Orders" />} />
                <Route path="history" element={<WaiterHistory />} />
              </Route>

              {/* Kitchen Routes */}
              <Route path="/kitchen" element={
                <ProtectedRoute allowedRoles={["kitchen", "admin"]}>
                  <KitchenLayout />
                </ProtectedRoute>
              }>
                <Route index element={<KitchenDisplay />} />
                <Route path="history" element={<PlaceholderPage title="Kitchen History" />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="menu" element={<AdminMenu />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="tables" element={<AdminTables />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </POSProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
