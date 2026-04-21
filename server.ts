// server.ts - Final Vercel Optimized (No more crashes)
import 'dotenv/config'; 
import express from 'express';
import path from 'path';
import cors from 'cors';

// Imports (Extensions are needed for ESM)
import { pool } from './server/lib/db.js';
import authRoutes from './server/routes/authRoutes.js';
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
import { getAllCategories } from './server/controllers/adminController.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Health Check - Pehle ise check karenge
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Indraprastha Server is Live!' }));

// Manual DB Init (Only run this when needed)
app.get('/api/init-db', async (req, res) => {
  try {
    console.log('Manual Init: Starting...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await pool.query(`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(255) UNIQUE NOT NULL, google_id VARCHAR(255) UNIQUE, full_name VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    // Note: Saari tables auth/business routes me apne aap bhi handle ho jati hain
    res.json({ success: true, message: 'Database initialized successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Init failed', details: err instanceof Error ? err.message : String(err) });
  }
});

// Routes
app.use('/api/auth', authRoutes);
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
app.get('/api/categories', getAllCategories);

// Serve Static Files only if NOT on Vercel (Vercel handles this via rewrites)
if (!process.env.VERCEL) {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;