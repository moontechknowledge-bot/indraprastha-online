import { Request, Response } from 'express';
import { query, isValidUUID } from '../lib/db';

export const getAllBusinesses = async (req: Request, res: Response) => {
  const { status } = req.query;
  try {
    let sql = `
      SELECT b.*, u.phone as seller_phone, u.email as seller_email 
      FROM businesses b
      LEFT JOIN users u ON b.seller_id = u.id
    `;
    const params = [];
    
    if (status) {
      sql += ` WHERE b.status = $1`;
      params.push(status);
    }
    
    sql += ` ORDER BY b.created_at DESC`;
    
    const businesses = await query(sql, params);
    res.json(businesses);
  } catch (error) {
    console.error('Error in getAllBusinesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    console.log('[API Debug] getAllCategories called');
    const categories = await query('SELECT * FROM categories ORDER BY order_index ASC');
    console.log(`[API Debug] Categories found: ${categories.length}`);
    res.json(categories);
  } catch (error) {
    console.error('[API Debug] Error in getAllCategories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, icon, order_index } = req.body;
  const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  try {
    const [category] = await query(
      'INSERT INTO categories (id, name, slug, icon, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [slug, name, slug, icon, order_index || 0]
    );
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

export const updateBusinessStatus = async (req: Request, res: Response) => {
  const { status, plan_type } = req.body;
  if (!isValidUUID(req.params.id)) {
    return res.status(400).json({ error: 'Invalid business ID format' });
  }
  try {
    let sql = 'UPDATE businesses SET status = $1';
    const params = [status, req.params.id];
    
    if (status === 'approved') {
      sql += ', is_active = true, is_verified = true';
    }
    
    if (plan_type) {
      sql += `, plan_type = $${params.length + 1}`;
      params.push(plan_type);
      if (plan_type === 'prime') {
        sql += ', is_featured = true';
      }
    }
    
    sql += ' WHERE id = $2::uuid RETURNING *';
    
    const [business] = await query(sql, params);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    console.error('Error in updateBusinessStatus:', error);
    res.status(500).json({ error: 'Failed to update business' });
  }
};

export const deleteBusiness = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidUUID(id)) {
    return res.status(400).json({ error: 'Invalid business ID format' });
  }
  try {
    // Delete related data first (products, links, etc. if not cascaded)
    await query('DELETE FROM products WHERE business_id = $1::uuid', [id]);
    await query('DELETE FROM business_links WHERE business_id = $1::uuid', [id]);
    await query('DELETE FROM businesses WHERE id = $1::uuid', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in deleteBusiness:', error);
    res.status(500).json({ error: 'Failed to delete business' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const [userCountResult, businessCountResult, categoryCountResult, primeCountResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM users'),
      query('SELECT COUNT(*) as count FROM businesses'),
      query('SELECT COUNT(*) as count FROM categories'),
      query("SELECT COUNT(*) as count FROM businesses WHERE plan_type = 'prime'")
    ]);

    const userCount = userCountResult[0];
    const businessCount = businessCountResult[0];
    const categoryCount = categoryCountResult[0];
    const primeCount = primeCountResult[0];

    res.json({
      users: parseInt(userCount.count),
      businesses: parseInt(businessCount.count),
      categories: parseInt(categoryCount.count),
      prime: parseInt(primeCount.count)
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
