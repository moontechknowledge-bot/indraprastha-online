import 'dotenv/config'; 
import express from 'express';
import path from 'path';
import cors from 'cors';

// Imports with mandatory .js extensions for ESM
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

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', msg: 'Indraprastha Ready' }));

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

// Database Init
app.get('/api/init-db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, message: 'DB Connected' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default app;