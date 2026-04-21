import { Router } from 'express';
import { sellerDashboardService } from '../services/sellerDashboardService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all seller routes
router.use(authMiddleware);

// Helper to get seller_id from decoded token
const getSellerId = (req: any) => req.user.id;

// Health check for seller dashboard
router.get('/health', async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    // Simple query to test DB
    const result = await sellerDashboardService.getBusinessesBySeller(sellerId);
    res.json({ 
      status: 'ok', 
      db: 'connected', 
      sellerId, 
      businessCount: result.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('GET /api/seller/health - Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Business Routes
router.get('/businesses', async (req, res) => {
  console.log('GET /api/seller/businesses - Request received');
  try {
    const sellerId = getSellerId(req);
    console.log('GET /api/seller/businesses - Seller ID:', sellerId);
    const businesses = await sellerDashboardService.getBusinessesBySeller(sellerId);
    console.log('GET /api/seller/businesses - Businesses found:', businesses.length);
    res.json(businesses);
  } catch (error) {
    console.error('GET /api/seller/businesses - Error:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

router.post('/seed-demo-data', async (req, res) => {
  console.log('POST /api/seller/seed-demo-data - Request received');
  try {
    const sellerId = getSellerId(req);
    await sellerDashboardService.seedDemoData(sellerId);
    res.json({ message: 'Demo data seeded successfully' });
  } catch (error) {
    console.error('POST /api/seller/seed-demo-data - Error:', error);
    res.status(500).json({ error: 'Failed to seed demo data' });
  }
});

router.post('/businesses', async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    const business = await sellerDashboardService.createBusiness({ ...req.body, seller_id: sellerId });
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create business' });
  }
});

router.put('/businesses/:id', async (req, res) => {
  try {
    const business = await sellerDashboardService.updateBusiness(req.params.id, req.body);
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update business' });
  }
});

router.delete('/businesses/:id', async (req, res) => {
  try {
    await sellerDashboardService.deleteBusiness(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete business' });
  }
});

// Product Routes
router.get('/products/:businessId', async (req, res) => {
  try {
    const products = await sellerDashboardService.getProductsByBusiness(req.params.businessId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    const product = await sellerDashboardService.addProduct({ ...req.body, seller_id: sellerId });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await sellerDashboardService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await sellerDashboardService.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Social Links Routes
router.get('/social-links', async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    const links = await sellerDashboardService.getSocialLinks(sellerId);
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

router.post('/social-links', async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    const links = await sellerDashboardService.updateSocialLinks(sellerId, req.body);
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update social links' });
  }
});

export default router;
