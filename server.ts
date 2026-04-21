// server.ts - Bulletproof Vercel Version
import 'dotenv/config'; 
import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';

// Database Import (Bina .js ke)
import { pool } from './server/lib/db'; 

// Route Imports (SAB ME SE .js HATA DIYA HAI)
import authRoutes from './server/routes/authRoutes';
import businessRoutes from './server/routes/businessRoutes';
import productRoutes from './server/routes/productRoutes';
import adminRoutes from './server/routes/adminRoutes';
import paymentRoutes from './server/routes/paymentRoutes';
import leadRoutes from './server/routes/leadRoutes';
import businessLinkRoutes from './server/routes/businessLinkRoutes';
import sellerRoutes from './server/routes/sellerRoutes';
import reviewRoutes from './server/routes/reviewRoutes';
import favoriteRoutes from './server/routes/favoriteRoutes';
import usedItemRoutes from './server/routes/usedItemRoutes';
import { getAllCategories } from './server/controllers/adminController';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Health Check (Zaroori hai test karne ke liye)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    msg: 'Indraprastha Server is LIVE!', 
    time: new Date().toISOString() 
  });
});

// Manual DB Init Route
app.get('/api/init-db', async (req: Request, res: Response) => {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await pool.query('CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(255) UNIQUE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    res.json({ success: true, message: 'DB setup triggered' });
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
app.get('/api/categories', getAllCategories as any);

// Export for Vercel
export default app;

// Local listening (Sirf apne PC par chalega)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Local: http://localhost:${PORT}`));
}