import { UtensilsCrossed, QrCode, ChefHat, CreditCard, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  { icon: QrCode, title: "QR Ordering", desc: "Guests scan, browse, and order from their phone" },
  { icon: CreditCard, title: "Live Billing & Split Pay", desc: "Real-time bills with M-Pesa STK push integration" },
  { icon: ChefHat, title: "Kitchen Display", desc: "Live order queue with priority and status tracking" },
  { icon: Users, title: "Waiter Dashboard", desc: "Table overview with alerts and service requests" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <UtensilsCrossed className="h-4 w-4" />
            Restaurant Operating System
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Smart<span className="text-primary">Serve</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            QR ordering, live billing, kitchen displays, and waiter dashboards — all in one system built for modern restaurants.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base font-bold rounded-xl gap-2">
              <Link to="/menu">
                View Demo Menu <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl">
              <Link to="/admin">Open Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card rounded-xl p-6 animate-fade-in-up">
              <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Customer Menu", path: "/menu" },
            { label: "Waiter View", path: "/waiter" },
            { label: "Kitchen", path: "/kitchen" },
            { label: "Admin", path: "/admin" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="glass-card rounded-xl p-4 text-center text-sm font-semibold hover:border-primary/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
