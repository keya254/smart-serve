import { useState } from "react";
import { menuItems, menuCategories, formatKES } from "@/data/mock";
import { ShoppingCart, Plus, Minus, Search, Star, ChefHat, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { usePOS } from "@/contexts/POSContext";
import { useAuth } from "@/contexts/AuthContext";

const CustomerMenu = () => {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("tableId") || "t1";
  
  const [activeCategory, setActiveCategory] = useState("Starters");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const { cart, addToCart, removeFromCart, totalItems, totalAmount } = useCart();
  const { getOrdersByTable, tables } = usePOS();
  const { user } = useAuth();
  
  const activeOrders = getOrdersByTable(tableId).filter(o => o.status !== 'completed' && o.status !== 'cancelled' && o.status !== 'delivered');
  const tableInfo = tables.find(t => t.id === tableId);

  const getQty = (id: string) => cart.find((c) => c.id === id)?.quantity || 0;

  const filtered = menuItems.filter(
    (i) => i.category === activeCategory && i.name.toLowerCase().includes(search.toLowerCase())
  );

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case 'admin': return '/admin';
      case 'waiter': return '/waiter';
      case 'kitchen': return '/kitchen';
      default: return '/menu';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 md:px-8 py-3 shadow-sm">
        <div className="w-full max-w-[2000px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Savanna Grill</h1>
              <p className="text-xs text-muted-foreground font-medium">
                Table {tableInfo?.number || tableId} · {tableInfo?.status === 'occupied' ? 'Occupied' : 'Welcome'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                 variant="ghost"
                 size="sm"
                 className="h-9 w-9 px-0 rounded-full hover:bg-muted"
                 onClick={() => navigate(getDashboardLink())}
              >
                {user ? <LayoutDashboard className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              </Button>

              {activeOrders.length > 0 && (
                 <Button
                  variant="secondary"
                  size="sm"
                  className="relative animate-pulse rounded-full text-xs font-bold"
                  onClick={() => navigate(`/cart?tableId=${tableId}&tab=active`)}
                >
                  <ChefHat className="h-4 w-4 mr-1" />
                  Status
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                className="relative rounded-full"
                onClick={() => navigate(`/cart?tableId=${tableId}`)}
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center border-2 border-background">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for delicious food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="sticky top-[110px] z-30 bg-background/95 backdrop-blur border-b border-border py-2">
        <div className="w-full max-w-[2000px] mx-auto flex gap-2 px-4 md:px-8 overflow-x-auto scrollbar-hide pb-1">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="w-full max-w-[2000px] mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {filtered.map((item) => {
            const qty = getQty(item.id);
            return (
              <div
                key={item.id}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  
                  {item.popular && (
                    <Badge variant="secondary" className="absolute top-3 left-3 bg-yellow-400/90 text-yellow-950 hover:bg-yellow-400 border-0 font-bold shadow-sm backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-current mr-1" /> Popular
                    </Badge>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                     <span className="text-white font-extrabold text-xl drop-shadow-md">{formatKES(item.price)}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h3 className="font-bold text-lg leading-tight mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{item.description}</p>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-end">
                    {qty > 0 ? (
                      <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-1 pr-3 border border-border/50">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 rounded-lg bg-background shadow-sm border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-base font-bold w-4 text-center">{qty}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="h-8 w-8 rounded-lg bg-primary text-primary-foreground shadow-sm flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => addToCart(item)}
                        className="rounded-xl w-full font-bold shadow-sm hover:shadow-md transition-all"
                      >
                        Add to Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300 pointer-events-none">
          <div className="max-w-lg mx-auto pointer-events-auto">
            <Button
              className="w-full h-16 text-lg font-bold rounded-2xl shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-between px-6 border-2 border-white/20 backdrop-blur-sm"
              onClick={() => navigate(`/cart?tableId=${tableId}`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center text-sm">
                  {totalItems}
                </div>
                <span>View Order</span>
              </div>
              <span>{formatKES(totalAmount)}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
