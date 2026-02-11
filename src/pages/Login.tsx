import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { UtensilsCrossed, LogIn, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const DEMO_ACCOUNTS: { label: string; email: string; password: string; role: UserRole }[] = [
  { label: "Admin", email: "admin@smartserve.com", password: "admin123", role: "admin" },
  { label: "Waiter", email: "waiter@smartserve.com", password: "waiter123", role: "waiter" },
  { label: "Kitchen", email: "kitchen@smartserve.com", password: "kitchen123", role: "kitchen" },
  { label: "Customer", email: "customer@smartserve.com", password: "customer123", role: "customer" },
];

const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: "/admin",
  waiter: "/waiter",
  kitchen: "/kitchen",
  customer: "/menu",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      const account = DEMO_ACCOUNTS.find((a) => a.email === email.toLowerCase());
      navigate(account ? ROLE_REDIRECTS[account.role] : "/");
    } else {
      toast({ title: "Login failed", description: "Invalid email or password", variant: "destructive" });
    }
  };

  const quickLogin = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-primary items-center justify-center mb-4">
            <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Smart<span className="text-primary">Serve</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-11 font-bold rounded-xl gap-2" disabled={loading}>
            <LogIn className="h-4 w-4" />
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        {/* Quick Login */}
        <div className="space-y-3">
          <p className="text-xs text-center text-muted-foreground">Quick demo login</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => quickLogin(acc)}
                className="glass-card rounded-lg px-3 py-2.5 text-left hover:border-primary/50 transition-colors"
              >
                <p className="text-sm font-semibold">{acc.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
