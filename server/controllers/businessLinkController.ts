import { Request, Response } from 'express';
import { query, isValidUUID } from '../lib/db';

export const upsertBusinessLinks = async (req: Request, res: Response) => {
  const { business_id, website, instagram, facebook, youtube } = req.body;

  if (!business_id || !isValidUUID(business_id)) {
    return res.status(400).json({ error: "Valid business_id is required" });
  }

  try {
    const [links] = await query(`
      INSERT INTO business_links (business_id, website, instagram, facebook, youtube)
      VALUES ($1::uuid, $2, $3, $4, $5)
      ON CONFLICT (business_id) DO UPDATE 
      SET 
        website = EXCLUDED.website,
        instagram = EXCLUDED.instagram,
        facebook = EXCLUDED.facebook,
        youtube = EXCLUDED.youtube
      RETURNING *
    `, [
      business_id, 
      website || null, 
      instagram || null, 
      facebook || null, 
      youtube || null
    ]);

    res.json(links);
  } catch (error) {
    console.error("Error upserting business links:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBusinessLinks = async (req: Request, res: Response) => {
  const { business_id } = req.params;

  try {
    let resolvedId = business_id;
    if (!isValidUUID(business_id)) {
      const [biz] = await query('SELECT id FROM businesses WHERE slug = $1', [business_id]);
      if (!biz) return res.status(404).json({ error: "Business not found" });
      resolvedId = biz.id;
    }

    const [links] = await query(`
      SELECT * FROM business_links WHERE business_id = $1::uuid
    `, [resolvedId]);
    
    res.json(links || {});
  } catch (error) {
    console.error("Error fetching business links:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
