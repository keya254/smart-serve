import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <ShieldX className="h-16 w-16 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          You don't have permission to access this page. Please log in with the correct role.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          <Button onClick={() => { logout(); navigate("/login"); }}>Switch Account</Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
