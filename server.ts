import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';

// Database Import
import { pool } from './server/lib/db.js';

// Route Imports
import businessRoutes from './server/routes/businessRoutes.js';
import productRoutes from './server/routes/productRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import paymentRoutes from './server/routes/paymentRoutes.js';
import leadRoutes from './server/routes/leadRoutes.js';
import businessLinkRoutes from './server/routes/businessLinkRoutes.js';
import sellerRoutes from './server/routes/sellerRoutes.js';
import reviewRoutes from './server/routes/reviewRoutes.js';
import favoriteRoutes from './server/routes/favoriteRoutes.js';
import usedItemRoutes from './server/routes/usedItemRoutes.js';
import authRoutes from './server/routes/authRoutes.js';
import { getAllCategories } from './server/controllers/adminController.js';

const app = express();
// Render automatically gives a PORT, local will use 3005
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// --- Database Init (Creates tables on first run) ---
async function initDb() {
  console.log('🔄 Initializing Database Tables...');
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
        email VARCHAR(255) UNIQUE NOT NULL, 
        full_name VARCHAR(255), 
        role VARCHAR(50) DEFAULT 'buyer', 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY, 
        name TEXT NOT NULL, 
        slug TEXT UNIQUE NOT NULL, 
        icon TEXT, 
        order_index INTEGER DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS businesses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
        name VARCHAR(255) NOT NULL, 
        city VARCHAR(100) NOT NULL, 
        status TEXT DEFAULT 'pending', 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database Ready!');
  } catch (err) {
    console.error('❌ Database Init Error:', err);
  }
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', getAllCategories);
app.use('/api/businesses', businessRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/business-links', businessLinkRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/used-items', usedItemRoutes);

// Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

async function startServer() {
  await initDb();

  // Logic for Render (Production) vs Local (Dev)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: { port: 3006 }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const __dirname = path.resolve();
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();