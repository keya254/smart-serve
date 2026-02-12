import express, { Router } from 'express';
import { Server } from 'socket.io';
import db from './db';
import crypto from 'crypto';

const router = Router();

export const createRoutes = (io: Server) => {

  // --- Menu Items ---
  router.get('/menu-items', (req, res) => {
    const items = db.prepare('SELECT * FROM menu_items').all();
    // Convert popular/available back to boolean
    const formattedItems = items.map((item: any) => ({
      ...item,
      popular: !!item.popular,
      available: !!item.available
    }));
    res.json(formattedItems);
  });

  router.post('/menu-items', (req, res) => {
    const { name, description, price, category, image, popular, available } = req.body;
    const id = crypto.randomUUID();
    try {
      db.prepare(`
        INSERT INTO menu_items (id, name, description, price, category, image, popular, available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, name, description, price, category, image, popular ? 1 : 0, available ? 1 : 0);
      io.emit('menu_updated');
      res.status(201).json({ id, ...req.body });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Categories ---
  router.get('/categories', (req, res) => {
    const categories = db.prepare('SELECT name FROM categories').all();
    res.json(categories.map((c: any) => c.name));
  });

  // --- Tables ---
  router.get('/tables', (req, res) => {
    const tables = db.prepare('SELECT * FROM tables').all();
    res.json(tables);
  });

  router.post('/tables', (req, res) => {
    const { number, seats } = req.body;
    const id = `t${number}`; // Simple ID generation for tables
    try {
        db.prepare(`
            INSERT INTO tables (id, number, seats, status)
            VALUES (?, ?, ?, 'available')
        `).run(id, number, seats);
        io.emit('tables_updated');
        res.status(201).json({ id, number, seats, status: 'available' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
  });

  router.put('/tables/:id', (req, res) => {
    const { id } = req.params;
    const { status, sessionId, waiter, guests, orderTotal, lastActivity } = req.body;
    
    // Dynamic update query
    const fields = [];
    const values = [];

    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (sessionId !== undefined) { fields.push('session_id = ?'); values.push(sessionId); }
    if (waiter !== undefined) { fields.push('waiter = ?'); values.push(waiter); }
    if (guests !== undefined) { fields.push('guests = ?'); values.push(guests); }
    if (orderTotal !== undefined) { fields.push('order_total = ?'); values.push(orderTotal); }
    if (lastActivity !== undefined) { fields.push('last_activity = ?'); values.push(lastActivity); }
    
    values.push(id);

    if (fields.length === 0) return res.json({ message: 'No changes' });

    try {
      db.prepare(`UPDATE tables SET ${fields.join(', ')} WHERE id = ?`).run(...values);
      io.emit('tables_updated');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Orders ---
  router.get('/orders', (req, res) => {
    const orders = db.prepare('SELECT * FROM orders').all();
    const ordersWithItems = orders.map((order: any) => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return {
        id: order.id,
        tableId: order.table_id,
        tableNumber: order.table_number,
        status: order.status,
        priority: order.priority,
        createdAt: order.created_at,
        paymentStatus: order.payment_status || 'unpaid',
        totalAmount: order.total_amount || 0,
        paidAmount: order.paid_amount || 0,
        items: items.map((item: any) => ({
            id: item.id,
            menuItemId: item.menu_item_id,
            name: item.menu_item_name,
            quantity: item.quantity,
            notes: item.notes,
            status: item.status,
            // Assuming price is in menu_items, we could fetch it or store it in order_items
            price: db.prepare('SELECT price FROM menu_items WHERE id = ?').get(item.menu_item_id)?.price || 0
        }))
      };
    });
    res.json(ordersWithItems);
  });

  router.post('/orders', (req, res) => {
    const { tableId, items, priority } = req.body;
    const id = crypto.randomUUID();
    const table = db.prepare('SELECT number FROM tables WHERE id = ?').get(tableId) as { number: number };
    
    if (!table) return res.status(404).json({ error: 'Table not found' });

    const createdAt = new Date().toISOString();
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    try {
      const insertOrder = db.prepare(`
        INSERT INTO orders (id, table_id, table_number, status, priority, created_at, payment_status, total_amount, paid_amount)
        VALUES (?, ?, ?, 'pending', ?, ?, 'unpaid', ?, 0)
      `);
      
      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, notes, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `);

      const transaction = db.transaction(() => {
        insertOrder.run(id, tableId, table.number, priority || 'normal', createdAt, totalAmount);
        items.forEach((item: any) => {
          insertItem.run(id, item.id, item.name, item.quantity, item.notes);
        });
      });

      transaction();
      
      io.emit('orders_updated');
      // Also update table status/last activity
      db.prepare("UPDATE tables SET status = 'occupied', last_activity = 'Just now' WHERE id = ?").run(tableId);
      io.emit('tables_updated');

      res.status(201).json({ id, status: 'success' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
      io.emit('orders_updated');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update specific item status
  router.put('/order-items/:id/status', (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
      
      try {
          db.prepare('UPDATE order_items SET status = ? WHERE id = ?').run(status, id);
          io.emit('orders_updated');
          res.json({ success: true });
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  });

  // --- Staff ---
  router.get('/staff', (req, res) => {
    const staff = db.prepare('SELECT * FROM staff').all();
    res.json(staff.map((s: any) => ({ ...s, active: !!s.active })));
  });

  router.post('/staff', (req, res) => {
    const { name, role, code } = req.body;
    const id = crypto.randomUUID();
    try {
      db.prepare(`
        INSERT INTO staff (id, name, role, code, active)
        VALUES (?, ?, ?, ?, 1)
      `).run(id, name, role, code);
      res.status(201).json({ id, name, role, code, active: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/staff/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM staff WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
