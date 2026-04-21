import { Request, Response } from 'express';
import { pool } from '../lib/db';

export const createUsedItem = async (req: Request, res: Response) => {
  const { title, description, price, category, condition, city, image_url } = req.body;
  const seller_id = (req as any).user.id;

  try {
    // 1. Get user details and their rank in the system
    const userResult = await pool.query(`
      SELECT role, plan, marketplace_plan, created_at,
             (SELECT COUNT(*) FROM users u2 WHERE u2.created_at <= users.created_at) as rank
      FROM users WHERE id = $1
    `, [seller_id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    const isEarlyBird = parseInt(user.rank) <= 1000;
    const isLifetime = user.marketplace_plan === 'lifetime' || isEarlyBird;
    
    // 2. Define limits
    if (user.role === 'founder') {
      // Founders have high limits
    } else if (isLifetime) {
      // Lifetime members (including early birds) have high limits (e.g., 50 items)
      const countResult = await pool.query('SELECT COUNT(*) FROM used_items WHERE seller_id = $1', [seller_id]);
      const totalCount = parseInt(countResult.rows[0].count);
      if (totalCount >= 50) {
        return res.status(403).json({ 
          error: 'Listing limit reached', 
          details: 'You have reached your lifetime plan limit of 50 items. Contact support for more.' 
        });
      }
    } else {
      // Free plan: 1 item per month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthlyCountResult = await pool.query(
        'SELECT COUNT(*) FROM used_items WHERE seller_id = $1 AND created_at >= $2',
        [seller_id, monthStart]
      );
      
      const monthlyCount = parseInt(monthlyCountResult.rows[0].count);
      
      if (monthlyCount >= 1) {
        return res.status(403).json({ 
          error: 'Monthly limit reached', 
          details: 'Your free plan allows 1 item per month. You can upgrade to a lifetime plan for ₹999 for unlimited listings!' 
        });
      }
    }

    const result = await pool.query(
      'INSERT INTO used_items (seller_id, title, description, price, category, condition, city, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [seller_id, title, description, price, category, condition, city, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating used item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsedItems = async (req: Request, res: Response) => {
  const { category, city, search } = req.query;
  let query = 'SELECT u.*, s.name as seller_name, s.phone as seller_phone FROM used_items u JOIN users s ON u.seller_id = s.id WHERE u.status = \'available\'';
  const params: any[] = [];

  if (category) {
    params.push(category);
    query += ` AND u.category = $${params.length}`;
  }

  if (city) {
    params.push(city);
    query += ` AND u.city = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (u.title ILIKE $${params.length} OR u.description ILIKE $${params.length})`;
  }

  query += ' ORDER BY u.created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching used items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyUsedItems = async (req: Request, res: Response) => {
  const seller_id = (req as any).user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM used_items WHERE seller_id = $1 ORDER BY created_at DESC',
      [seller_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching my used items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUsedItemStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const seller_id = (req as any).user.id;

  try {
    const result = await pool.query(
      'UPDATE used_items SET status = $1 WHERE id = $2 AND seller_id = $3 RETURNING *',
      [status, id, seller_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating used item status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUsedItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const seller_id = (req as any).user.id;

  try {
    const result = await pool.query(
      'DELETE FROM used_items WHERE id = $1 AND seller_id = $2 RETURNING *',
      [id, seller_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting used item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMarketplaceStatus = async (req: Request, res: Response) => {
  const seller_id = (req as any).user.id;

  try {
    const userResult = await pool.query(`
      SELECT role, plan, marketplace_plan, created_at,
             (SELECT COUNT(*) FROM users u2 WHERE u2.created_at <= users.created_at) as rank
      FROM users WHERE id = $1
    `, [seller_id]);
    
    const user = userResult.rows[0];
    const isEarlyBird = parseInt(user.rank) <= 1000;
    const isLifetime = user.marketplace_plan === 'lifetime' || isEarlyBird;
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthlyCountResult = await pool.query(
      'SELECT COUNT(*) FROM used_items WHERE seller_id = $1 AND created_at >= $2',
      [seller_id, monthStart]
    );
    
    const totalCountResult = await pool.query('SELECT COUNT(*) FROM used_items WHERE seller_id = $1', [seller_id]);
    
    res.json({
      plan: isLifetime ? 'lifetime' : 'free',
      isEarlyBird,
      rank: parseInt(user.rank),
      monthlyCount: parseInt(monthlyCountResult.rows[0].count),
      totalCount: parseInt(totalCountResult.rows[0].count),
      monthlyLimit: isLifetime ? 50 : 1, // High for lifetime
      nextResetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    });
  } catch (error) {
    console.error('Error fetching marketplace status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const upgradeToLifetime = async (req: Request, res: Response) => {
  const seller_id = (req as any).user.id;
  try {
    await pool.query('UPDATE users SET marketplace_plan = $1 WHERE id = $2', ['lifetime', seller_id]);
    res.json({ message: 'Successfully upgraded to Lifetime Unlimited plan!' });
  } catch (error) {
    console.error('Error upgrading to lifetime:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
