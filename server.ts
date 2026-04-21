// server.ts - Final Type-Safe Vercel Code
import 'dotenv/config'; 
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';

// Database Import
import { pool } from './server/lib/db.js';

// Route Imports
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

// PORT ko fix karein (Type Error hatane ke liye)
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', msg: 'Indraprastha Server is LIVE!', time: new Date().toISOString() });
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

// Local only
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server: http://localhost:${PORT}`);
  });
}