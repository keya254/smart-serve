import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db';
import { createRoutes } from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// CORS configuration for dev (Vite) and prod
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add other origins if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Database
initDb();

// Socket.IO setup
const io = new Server(httpServer, {
  cors: corsOptions
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Example: Client joining a specific room (e.g., 'kitchen', 'waiter')
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });
});

// API Routes
app.use('/api', createRoutes(io));

// Serve static files in production
const distPath = path.resolve(__dirname, '../dist');
// Check if dist exists (optional logic, but good for deployment)
app.use(express.static(distPath));

// Fallback for SPA
app.get(/.*/, (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
