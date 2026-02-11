import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <POSProvider>
            <Routes>
              <Route path="/" element={<CustomerMenu />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/menu" element={<CustomerMenu />} />
              <Route path="/cart" element={<CartBill />} />
              <Route path="/waiter" element={
                <ProtectedRoute allowedRoles={["waiter", "admin"]}>
                  <WaiterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/kitchen" element={
                <ProtectedRoute allowedRoles={["kitchen", "admin"]}>
                  <KitchenDisplay />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </POSProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
