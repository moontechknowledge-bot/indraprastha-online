import 'dotenv/config'; 
import express from 'express';
import path from 'path';
import cors from 'cors';

// Database Import
import { pool } from './server/lib/db.js';

// Route Imports (SAB ME .js LAGA HAI AUR YEHI SAHI HAI KYUNKI package.json MODULE HAI)
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

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Health Check (Zaroori hai test karne ke liye)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', msg: 'Indraprastha Server is LIVE!', time: new Date().toISOString() });
});

// Manual DB Init Route (Sirf manual call par chalega)
app.get('/api/init-db', async (req, res) => {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await pool.query('CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(255) UNIQUE NOT NULL, google_id VARCHAR(255) UNIQUE, full_name VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    res.json({ success: true, message: 'DB setup triggered successfully' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
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

// Serve static files from dist
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback for frontend
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Export for Vercel
export default app;

// Local listening (Sirf apne PC par chalane ke liye)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server: http://localhost:${PORT}`);
  });
}