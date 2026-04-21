import { Request, Response } from 'express';
import { query, isValidUUID } from '../lib/db';

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const createBusiness = async (req: any, res: Response) => {
  const { 
    seller_id, seller_email, name, category_id, description,
    phone, whatsapp, address, city, state, pincode,
    image_url, images, map_url, opening_time, closing_time,
    plan_type: requested_plan_type
  } = req.body;

  console.log('[CreateBusiness] Request received');
  const start = Date.now();
  
  // 1. Identify Target Seller UID
  let target_seller_id = seller_id || req.user?.id;

  if (seller_email && req.user?.role === 'founder') {
    try {
      const [userByEmail] = await query('SELECT id FROM users WHERE email = $1', [seller_email]);
      if (userByEmail) {
        target_seller_id = userByEmail.id;
      } else {
        return res.status(404).json({ error: `User with email ${seller_email} not found.` });
      }
    } catch (err) {
      console.error("[CreateBusiness] DB lookup failed:", err);
    }
  }

  if (!target_seller_id || !isValidUUID(target_seller_id)) {
    return res.status(400).json({ error: "A valid seller ID is required." });
  }

  try {
    // 2. Optimized combined logic: Get user role and prep slug
    console.log('[CreateBusiness] Prep: Generating slug and fetching user data for ID:', target_seller_id);
    const baseSlug = generateSlug(name);
    const [userData] = await query('SELECT role FROM users WHERE id = $1::uuid', [target_seller_id]);
    console.log('[CreateBusiness] User role found:', userData?.role || 'User not found');
    
    let plan_type = requested_plan_type || 'free';
    let payment_status = plan_type === 'free' ? 'SUCCESS' : 'PENDING';
    let status = 'pending';
    let finalSlug = baseSlug;

    // Special Auto-Approve logic for admins/founders
    const canAutoApprove = (userData && (userData.role === 'admin' || userData.role === 'founder')) || 
                           (req.user && (req.user.role === 'admin' || req.user.role === 'founder'));
    
    if (canAutoApprove) {
      console.log('[CreateBusiness] Auto-approving for admin/founder');
      plan_type = requested_plan_type || 'prime';
      payment_status = 'SUCCESS';
      status = 'approved'; 
    }

    // 3. Optimized Multi-Insert/Check
    console.log('[CreateBusiness] DB INSERT starting for slug:', finalSlug);
    let business;
    try {
      const results = await query(`
        INSERT INTO businesses (
          seller_id, name, category_id, description, phone, whatsapp, 
          address, city, state, pincode, image_url, images, 
          status, plan_type, payment_status, map_url, slug, 
          opening_time, closing_time
        ) VALUES (
          $1::uuid, $2, $3::text, $4, $5, $6, 
          $7, $8, $9, $10, $11, $12, 
          $13, $14, $15, $16, $17, 
          $18, $19
        ) RETURNING *
      `, [
        target_seller_id, name, category_id || null, description || null, phone, whatsapp || null,
        address || null, city, state || null, pincode || null, image_url || null, images || [],
        status, plan_type, payment_status, map_url || null, finalSlug,
        opening_time || '09:00', closing_time || '21:00'
      ]);
      business = results[0];
      console.log('[CreateBusiness] INSERT successful, ID:', business?.id);
    } catch (e: any) {
      if (e.code === '23505') { // Unique constraint violation (slug collision)
        console.log('[CreateBusiness] Slug collision detected, retrying with random suffix');
        finalSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
        const retryResults = await query(`
          INSERT INTO businesses (
            seller_id, name, category_id, description, phone, whatsapp, 
            address, city, state, pincode, image_url, images, 
            status, plan_type, payment_status, map_url, slug, 
            opening_time, closing_time
          ) VALUES (
            $1::uuid, $2, $3::text, $4, $5, $6, 
            $7, $8, $9, $10, $11, $12, 
            $13, $14, $15, $16, $17, 
            $18, $19
          ) RETURNING *
        `, [
          target_seller_id, name, category_id || null, description || null, phone, whatsapp || null,
          address || null, city, state || null, pincode || null, image_url || null, images || [],
          status, plan_type, payment_status, map_url || null, finalSlug,
          opening_time || '09:00', closing_time || '21:00'
        ]);
        business = retryResults[0];
        console.log('[CreateBusiness] Retry INSERT successful, ID:', business?.id);
      } else {
        console.error('[CreateBusiness] DB Insert error details:', e);
        throw e;
      }
    }

    if (!business) {
      console.error('[CreateBusiness] No business returned after INSERT');
      throw new Error("No business data returned after insertion");
    }

    // 4. Update user role asynchronously
    if (userData && userData.role === 'buyer') {
      console.log('[CreateBusiness] Updating user role to seller');
      query('UPDATE users SET role = $1 WHERE id = $2::uuid', ['seller', target_seller_id])
        .then(() => console.log('[CreateBusiness] Role update successful'))
        .catch(err => console.error('[CreateBusiness] Role update fail:', err));
    }

    console.log(`[CreateBusiness] All steps completed in ${Date.now() - start}ms`);
    return res.status(201).json(business);

  } catch (error) {
    console.error("[CreateBusiness] Server error:", error);
    return res.status(500).json({ error: "Server registration failed. Please try again or refresh." });
  }
};

export const getBusinesses = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  let city = req.query.city as string;
  let category_id = req.query.category_id as string;
  let search = req.query.search as string;
  let open_now = req.query.open_now === 'true';
  let top_rated = req.query.top_rated === 'true';

  // Handle "undefined" or "null" strings from frontend
  if (city === 'undefined' || city === 'null') city = undefined as any;
  if (category_id === 'undefined' || category_id === 'null') category_id = undefined as any;
  if (search === 'undefined' || search === 'null') search = undefined as any;
  const offset = (page - 1) * limit;

  try {
    console.log(`[API Debug] Fetching businesses with params:`, { city, category_id, search, open_now, top_rated, page, limit });
    
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

    const results = await query(`
      SELECT b.*, c.name as category_name,
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(r.id) as review_count
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN reviews r ON b.id = r.business_id
      WHERE b.is_active = true 
        AND b.status = 'approved'
        AND (
          $1::text IS NULL OR 
          b.city ILIKE '%' || $1 || '%' OR 
          $1 ILIKE '%' || b.city || '%' OR
          $5::text IS NOT NULL -- If searching by text, relax city constraint
        )
        AND ($2::text IS NULL OR b.category_id = $2::text)
        AND ($5::text IS NULL OR (
          b.name ILIKE '%' || $5 || '%' OR 
          b.description ILIKE '%' || $5 || '%' OR 
          c.name ILIKE '%' || $5 || '%'
        ))
        AND ($6::boolean = false OR (
          b.opening_time IS NOT NULL AND b.closing_time IS NOT NULL AND
          $7::text >= b.opening_time AND $7::text <= b.closing_time
        ))
      GROUP BY b.id, c.name
      HAVING ($8::boolean = false OR COALESCE(AVG(r.rating), 0) >= 4)
      ORDER BY 
        b.is_verified DESC, 
        (b.plan_type = 'prime') DESC, 
        avg_rating DESC,
        b.created_at DESC
      LIMIT $3::integer OFFSET $4::integer
    `, [city || null, category_id || null, limit, offset, search || null, open_now, currentTime, top_rated]);

    console.log(`[API Debug] Businesses fetched: ${results.length}`);
    if (results.length > 0) {
      console.log(`[API Debug] Sample business:`, results[0].name);
    }

    const [countResult] = await query(`
      SELECT count(DISTINCT b.id) 
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN reviews r ON b.id = r.business_id
      WHERE b.is_active = true 
        AND b.status = 'approved'
        AND (
          $1::text IS NULL OR 
          b.city ILIKE '%' || $1 || '%' OR 
          $1 ILIKE '%' || b.city || '%' OR
          $3::text IS NOT NULL -- If searching by text, relax city constraint
        )
        AND ($2::text IS NULL OR b.category_id = $2::text)
        AND ($3::text IS NULL OR (
          b.name ILIKE '%' || $3 || '%' OR 
          b.description ILIKE '%' || $3 || '%' OR 
          c.name ILIKE '%' || $3 || '%'
        ))
        AND ($4::boolean = false OR (
          b.opening_time IS NOT NULL AND b.closing_time IS NOT NULL AND
          $5::text >= b.opening_time AND $5::text <= b.closing_time
        ))
      HAVING ($6::boolean = false OR COALESCE(AVG(r.rating), 0) >= 4)
    `, [city || null, category_id || null, search || null, open_now, currentTime, top_rated]);
    
    const totalResults = countResult ? parseInt(countResult.count) : 0;
    const totalPages = Math.ceil(totalResults / limit);

    res.json({
      total_results: totalResults,
      current_page: page,
      total_pages: totalPages,
      businesses: results || []
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBusinessById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    let results;
    if (isValidUUID(id)) {
      results = await query(`
        SELECT b.*, c.name as category_name, u.email as seller_email
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN users u ON b.seller_id = u.id
        WHERE b.id = $1::uuid
      `, [id]);
    } else {
      // Try fetching by slug
      results = await query(`
        SELECT b.*, c.name as category_name, u.email as seller_email
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN users u ON b.seller_id = u.id
        WHERE b.slug = $1
      `, [id]);
    }
    
    if (!results || results.length === 0) return res.status(404).json({ error: "Business not found" });
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching business:", error);
    res.status(404).json({ error: "Business not found" });
  }
};

export const getBusinessesBySeller = async (req: Request, res: Response) => {
  const { seller_id } = req.params;
  
  if (!isValidUUID(seller_id)) {
    return res.status(400).json({ error: "Invalid seller ID format" });
  }

  try {
    const results = await query(`
      SELECT id, name, city, phone, status, plan_type, payment_status, created_at 
      FROM businesses 
      WHERE seller_id = $1::uuid 
      ORDER BY created_at DESC
    `, [seller_id]);
    
    res.json(results || []);
  } catch (error) {
    console.error("Error fetching seller businesses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBusiness = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  if (!isValidUUID(id)) {
    return res.status(400).json({ error: "Invalid business ID format" });
  }

  try {
    const [updated] = await query(`
      UPDATE businesses 
      SET 
        name = $1,
        category_id = $2::text,
        description = $3,
        phone = $4,
        whatsapp = $5,
        address = $6,
        city = $7,
        state = $8,
        pincode = $9,
        image_url = $10,
        images = $11,
        map_url = $13,
        opening_time = $14,
        closing_time = $15
      WHERE id = $12::uuid
      RETURNING *
    `, [
      data.name,
      data.category_id || null,
      data.description || null,
      data.phone,
      data.whatsapp || null,
      data.address || null,
      data.city,
      data.state || null,
      data.pincode || null,
      data.image_url || null,
      data.images || [],
      id,
      data.map_url || null,
      data.opening_time || null,
      data.closing_time || null
    ]);

    if (!updated) return res.status(404).json({ error: "Business not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating business:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBusiness = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({ error: "Invalid business ID format" });
  }

  try {
    const [deleted] = await query(`
      DELETE FROM businesses WHERE id = $1::uuid RETURNING id
    `, [id]);

    if (!deleted) return res.status(404).json({ error: "Business not found" });
    res.json({ success: true, id: deleted.id });
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
