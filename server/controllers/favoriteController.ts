import { Response } from 'express';
import { query, isValidUUID } from '../lib/db';

export const toggleFavorite = async (req: any, res: Response) => {
  const { business_id } = req.body;
  const user_id = req.user.id;

  if (!isValidUUID(business_id)) {
    return res.status(400).json({ error: 'Invalid business ID' });
  }

  try {
    // Check if already favorited
    const [existing] = await query(
      'SELECT id FROM favorites WHERE user_id = $1::uuid AND business_id = $2::uuid',
      [user_id, business_id]
    );

    if (existing) {
      await query('DELETE FROM favorites WHERE id = $1::uuid', [existing.id]);
      return res.json({ favorited: false });
    } else {
      await query(
        'INSERT INTO favorites (user_id, business_id) VALUES ($1::uuid, $2::uuid)',
        [user_id, business_id]
      );
      return res.json({ favorited: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserFavorites = async (req: any, res: Response) => {
  const user_id = req.user.id;

  try {
    const results = await query(`
      SELECT b.*, c.name as category_name
      FROM favorites f
      JOIN businesses b ON f.business_id = b.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE f.user_id = $1::uuid
      ORDER BY f.created_at DESC
    `, [user_id]);

    res.json(results || []);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkFavoriteStatus = async (req: any, res: Response) => {
  const { businessId } = req.params;
  const user_id = req.user.id;

  if (!isValidUUID(businessId)) {
    return res.status(400).json({ error: 'Invalid business ID' });
  }

  try {
    const [existing] = await query(
      'SELECT id FROM favorites WHERE user_id = $1::uuid AND business_id = $2::uuid',
      [user_id, businessId]
    );
    res.json({ favorited: !!existing });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
