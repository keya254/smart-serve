import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database
export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      price INTEGER,
      category TEXT,
      image TEXT,
      popular BOOLEAN,
      available BOOLEAN
    );

    CREATE TABLE IF NOT EXISTS tables (
      id TEXT PRIMARY KEY,
      number INTEGER,
      seats INTEGER,
      status TEXT,
      session_id TEXT,
      waiter TEXT,
      guests INTEGER,
      order_total INTEGER,
      last_activity TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      table_id TEXT,
      table_number INTEGER,
      status TEXT,
      priority TEXT,
      created_at TEXT,
      payment_status TEXT DEFAULT 'unpaid',
      total_amount INTEGER DEFAULT 0,
      paid_amount INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      menu_item_id TEXT,
      menu_item_name TEXT,
      quantity INTEGER,
      notes TEXT,
      status TEXT,
      FOREIGN KEY(order_id) REFERENCES orders(id)
    );

    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT,
      code TEXT UNIQUE,
      active BOOLEAN DEFAULT 1
    );
  `);

  // Seed data if empty
  const categoriesCount = db.prepare('SELECT count(*) as count FROM categories').get() as { count: number };
  
  if (categoriesCount.count === 0) {
    console.log('Seeding database...');
    
    // Seed Categories
    const categories = ["Starters", "Mains", "Grills", "Sides", "Beverages", "Desserts"];
    const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
    categories.forEach(cat => insertCategory.run(cat));

    // Seed Menu Items
    const menuItems = [
      { 
        id: "1", 
        name: "Spiced Chicken Wings", 
        description: "Crispy wings with our signature peri-peri glaze", 
        price: 650, 
        category: "Starters", 
        popular: 1, 
        available: 1,
        image: "https://images.unsplash.com/photo-1527477396000-64ca9c0016cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
      },
      { 
        id: "2", 
        name: "Garlic Mushroom Soup", 
        description: "Creamy soup with toasted ciabatta", 
        price: 450, 
        category: "Starters", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1547592166-23acbe3b624b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "3", 
        name: "Spring Rolls", 
        description: "Vegetable spring rolls with sweet chili dip", 
        price: 400, 
        category: "Starters", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1536510344784-b46e9649f363?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "4", 
        name: "Nyama Choma Platter", 
        description: "Grilled goat ribs with kachumbari and ugali", 
        price: 1800, 
        category: "Mains", 
        popular: 1, 
        available: 1,
        image: "https://images.unsplash.com/photo-1544025162-d76690b67f14?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "5", 
        name: "Grilled Tilapia", 
        description: "Whole tilapia with lemon herb butter, served with chips", 
        price: 1500, 
        category: "Mains", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "6", 
        name: "Chicken Tikka Masala", 
        description: "Tender chicken in aromatic tomato-based curry", 
        price: 1200, 
        category: "Mains", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "7", 
        name: "Ribeye Steak", 
        description: "300g aged ribeye with pepper sauce", 
        price: 2200, 
        category: "Grills", 
        popular: 1, 
        available: 1,
        image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "8", 
        name: "Lamb Chops", 
        description: "Rosemary-marinated lamb with mint jelly", 
        price: 1900, 
        category: "Grills", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "9", 
        name: "Masala Chips", 
        description: "Crispy fries tossed in tangy masala spice", 
        price: 350, 
        category: "Sides", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "10", 
        name: "Garden Salad", 
        description: "Mixed greens with balsamic dressing", 
        price: 300, 
        category: "Sides", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "11", 
        name: "Fresh Mango Juice", 
        description: "Freshly blended tropical mango", 
        price: 250, 
        category: "Beverages", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "12", 
        name: "Tusker Lager", 
        description: "500ml cold draft", 
        price: 350, 
        category: "Beverages", 
        popular: 1,
        available: 1,
        image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "13", 
        name: "Dawa Cocktail", 
        description: "Vodka, honey, lime — Kenyan classic", 
        price: 550, 
        category: "Beverages", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1536935338788-843bb631366f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "14", 
        name: "Chocolate Lava Cake", 
        description: "Warm molten chocolate with vanilla ice cream", 
        price: 600, 
        category: "Desserts", 
        popular: 1, 
        available: 1,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      { 
        id: "15", 
        name: "Fruit Platter", 
        description: "Seasonal tropical fruits", 
        price: 400, 
        category: "Desserts", 
        popular: 0,
        available: 1,
        image: "https://images.unsplash.com/photo-1619533394727-57d522857f89?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
    ];

    const insertMenuItem = db.prepare(`
      INSERT INTO menu_items (id, name, description, price, category, image, popular, available)
      VALUES (@id, @name, @description, @price, @category, @image, @popular, @available)
    `);
    
    menuItems.forEach(item => insertMenuItem.run({ ...item, popular: item.popular ? 1 : 0, available: item.available ? 1 : 0 }));

    // Seed Tables
    const tables = [
      { id: "t1", number: 1, seats: 4, status: "occupied", sessionId: "s1", waiter: "James", guests: 3, orderTotal: 4250, lastActivity: "2 min ago" },
      { id: "t2", number: 2, seats: 2, status: "available", sessionId: null, waiter: null, guests: null, orderTotal: null, lastActivity: null },
      { id: "t3", number: 3, seats: 6, status: "occupied", sessionId: "s2", waiter: "James", guests: 5, orderTotal: 8900, lastActivity: "5 min ago" },
      { id: "t4", number: 4, seats: 4, status: "needs-attention", sessionId: "s3", waiter: "James", guests: 4, orderTotal: 3200, lastActivity: "8 min ago" },
      { id: "t5", number: 5, seats: 2, status: "billing", sessionId: "s4", waiter: "James", guests: 2, orderTotal: 2100, lastActivity: "1 min ago" },
      { id: "t6", number: 6, seats: 8, status: "available", sessionId: null, waiter: null, guests: null, orderTotal: null, lastActivity: null },
      { id: "t7", number: 7, seats: 4, status: "occupied", sessionId: "s5", waiter: "James", guests: 4, orderTotal: 5600, lastActivity: "3 min ago" },
      { id: "t8", number: 8, seats: 4, status: "available", sessionId: null, waiter: null, guests: null, orderTotal: null, lastActivity: null },
    ];

    const insertTable = db.prepare(`
      INSERT INTO tables (id, number, seats, status, session_id, waiter, guests, order_total, last_activity)
      VALUES (@id, @number, @seats, @status, @sessionId, @waiter, @guests, @orderTotal, @lastActivity)
    `);

    tables.forEach(table => insertTable.run(table));

    // Seed Orders
    const kitchenOrders = [
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

    const insertOrder = db.prepare(`
      INSERT INTO orders (id, table_id, table_number, status, priority, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, notes, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    kitchenOrders.forEach(order => {
        // Find table ID by number
        const table = db.prepare('SELECT id FROM tables WHERE number = ?').get(order.tableNumber) as { id: string };
        const tableId = table ? table.id : `t${order.tableNumber}`; // Fallback

        insertOrder.run(order.id, tableId, order.tableNumber, 'pending', order.priority, order.createdAt);
        
        order.items.forEach(item => {
            // Find menu item ID by name (simplified for seeding)
            const menuItem = db.prepare('SELECT id FROM menu_items WHERE name = ?').get(item.name) as { id: string };
            const menuItemId = menuItem ? menuItem.id : 'unknown';

            insertOrderItem.run(order.id, menuItemId, item.name, item.quantity, item.notes || null, item.status);
        });
    });

    console.log('Database seeded successfully.');
  }
};

export default db;
