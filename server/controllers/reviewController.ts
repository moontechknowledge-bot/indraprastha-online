import { Request, Response } from 'express';
import { pool } from '../lib/db.ts';

export const getBusinessReviews = async (req: Request, res: Response) => {
  const { businessId } = req.params;
  try {
    const result = await pool.query(`
      SELECT r.*, u.full_name as user_name, u.picture as user_picture
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.business_id = $1
      ORDER BY r.created_at DESC
    `, [businessId]);
    res.json(result.rows);
  } catch (err) {
    console.error('getBusinessReviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  const { business_id, rating, comment } = req.body;
  const user_id = (req as any).user?.id;

  if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
  if (!business_id || !rating) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const result = await pool.query(`
      INSERT INTO reviews (business_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (business_id, user_id) 
      DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [business_id, user_id, rating, comment]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('createReview error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).user?.id;

  if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Review not found or unauthorized' });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteReview error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
