import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "customer" | "waiter" | "kitchen" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for each role
const DEMO_USERS: Record<string, User & { password: string }> = {
  "admin@smartserve.com": { id: "u1", name: "Alex Admin", email: "admin@smartserve.com", role: "admin", password: "admin123" },
  "waiter@smartserve.com": { id: "u2", name: "James M.", email: "waiter@smartserve.com", role: "waiter", password: "waiter123" },
  "kitchen@smartserve.com": { id: "u3", name: "Chef Kamau", email: "kitchen@smartserve.com", role: "kitchen", password: "kitchen123" },
  "customer@smartserve.com": { id: "u4", name: "Guest User", email: "customer@smartserve.com", role: "customer", password: "customer123" },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("smartserve_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("smartserve_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("smartserve_user");
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser && demoUser.password === password) {
      const { password: _, ...userData } = demoUser;
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
