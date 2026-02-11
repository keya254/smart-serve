export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  popular?: boolean;
  available?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface TableInfo {
  id: string;
  number: number;
  seats: number;
  status: "available" | "occupied" | "needs-attention" | "billing";
  sessionId?: string;
  waiter?: string;
  guests?: number;
  orderTotal?: number;
  lastActivity?: string;
}

export interface KitchenOrder {
  id: string;
  tableNumber: number;
  items: { name: string; quantity: number; notes?: string; status: "pending" | "preparing" | "ready" }[];
  createdAt: string;
  priority: "normal" | "rush";
}

export const menuCategories = ["Starters", "Mains", "Grills", "Sides", "Beverages", "Desserts"];

export const menuItems: MenuItem[] = [
  { 
    id: "1", 
    name: "Spiced Chicken Wings", 
    description: "Crispy wings with our signature peri-peri glaze", 
    price: 650, 
    category: "Starters", 
    popular: true, 
    available: true,
    image: "https://images.unsplash.com/photo-1527477396000-64ca9c0016cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
  },
  { 
    id: "2", 
    name: "Garlic Mushroom Soup", 
    description: "Creamy soup with toasted ciabatta", 
    price: 450, 
    category: "Starters", 
    available: true,
    image: "https://images.unsplash.com/photo-1547592166-23acbe3b624b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "3", 
    name: "Spring Rolls", 
    description: "Vegetable spring rolls with sweet chili dip", 
    price: 400, 
    category: "Starters", 
    available: true,
    image: "https://images.unsplash.com/photo-1536510344784-b46e9649f363?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "4", 
    name: "Nyama Choma Platter", 
    description: "Grilled goat ribs with kachumbari and ugali", 
    price: 1800, 
    category: "Mains", 
    popular: true, 
    available: true,
    image: "https://images.unsplash.com/photo-1544025162-d76690b67f14?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "5", 
    name: "Grilled Tilapia", 
    description: "Whole tilapia with lemon herb butter, served with chips", 
    price: 1500, 
    category: "Mains", 
    available: true,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "6", 
    name: "Chicken Tikka Masala", 
    description: "Tender chicken in aromatic tomato-based curry", 
    price: 1200, 
    category: "Mains", 
    available: true,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "7", 
    name: "Ribeye Steak", 
    description: "300g aged ribeye with pepper sauce", 
    price: 2200, 
    category: "Grills", 
    popular: true, 
    available: true,
    image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "8", 
    name: "Lamb Chops", 
    description: "Rosemary-marinated lamb with mint jelly", 
    price: 1900, 
    category: "Grills", 
    available: true,
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "9", 
    name: "Masala Chips", 
    description: "Crispy fries tossed in tangy masala spice", 
    price: 350, 
    category: "Sides", 
    available: true,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "10", 
    name: "Garden Salad", 
    description: "Mixed greens with balsamic dressing", 
    price: 300, 
    category: "Sides", 
    available: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "11", 
    name: "Fresh Mango Juice", 
    description: "Freshly blended tropical mango", 
    price: 250, 
    category: "Beverages", 
    available: true,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "12", 
    name: "Tusker Lager", 
    description: "500ml cold draft", 
    price: 350, 
    category: "Beverages", 
    popular: true, 
    available: true,
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "13", 
    name: "Dawa Cocktail", 
    description: "Vodka, honey, lime — Kenyan classic", 
    price: 550, 
    category: "Beverages", 
    available: true,
    image: "https://images.unsplash.com/photo-1536935338788-843bb631366f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "14", 
    name: "Chocolate Lava Cake", 
    description: "Warm molten chocolate with vanilla ice cream", 
    price: 600, 
    category: "Desserts", 
    popular: true, 
    available: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  { 
    id: "15", 
    name: "Fruit Platter", 
    description: "Seasonal tropical fruits", 
    price: 400, 
    category: "Desserts", 
    available: true,
    image: "https://images.unsplash.com/photo-1619533394727-57d522857f89?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
];

export const tables: TableInfo[] = [
  { id: "t1", number: 1, seats: 4, status: "occupied", sessionId: "s1", waiter: "James", guests: 3, orderTotal: 4250, lastActivity: "2 min ago" },
  { id: "t2", number: 2, seats: 2, status: "available" },
  { id: "t3", number: 3, seats: 6, status: "occupied", sessionId: "s2", waiter: "James", guests: 5, orderTotal: 8900, lastActivity: "5 min ago" },
  { id: "t4", number: 4, seats: 4, status: "needs-attention", sessionId: "s3", waiter: "James", guests: 4, orderTotal: 3200, lastActivity: "8 min ago" },
  { id: "t5", number: 5, seats: 2, status: "billing", sessionId: "s4", waiter: "James", guests: 2, orderTotal: 2100, lastActivity: "1 min ago" },
  { id: "t6", number: 6, seats: 8, status: "available" },
  { id: "t7", number: 7, seats: 4, status: "occupied", sessionId: "s5", waiter: "James", guests: 4, orderTotal: 5600, lastActivity: "3 min ago" },
  { id: "t8", number: 8, seats: 4, status: "available" },
];

export const kitchenOrders: KitchenOrder[] = [
  {
    id: "k1", tableNumber: 1, priority: "normal", createdAt: "2 min ago",
    items: [
      { name: "Spiced Chicken Wings", quantity: 2, status: "preparing" },
      { name: "Garlic Mushroom Soup", quantity: 1, status: "ready" },
    ],
  },
  {
    id: "k2", tableNumber: 3, priority: "rush", createdAt: "5 min ago",
    items: [
      { name: "Nyama Choma Platter", quantity: 2, status: "preparing" },
      { name: "Masala Chips", quantity: 3, status: "pending" },
      { name: "Garden Salad", quantity: 2, status: "ready" },
    ],
  },
  {
    id: "k3", tableNumber: 7, priority: "normal", createdAt: "1 min ago",
    items: [
      { name: "Ribeye Steak", quantity: 1, notes: "Medium rare", status: "pending" },
      { name: "Lamb Chops", quantity: 1, status: "pending" },
      { name: "Grilled Tilapia", quantity: 2, status: "pending" },
    ],
  },
  {
    id: "k4", tableNumber: 4, priority: "normal", createdAt: "10 min ago",
    items: [
      { name: "Chicken Tikka Masala", quantity: 2, status: "ready" },
      { name: "Spring Rolls", quantity: 1, status: "ready" },
    ],
  },
];

export const formatKES = (amount: number) => `KES ${amount.toLocaleString()}`;
