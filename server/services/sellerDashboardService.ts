import { query, isValidUUID } from '../lib/db';

export interface BusinessData {
  name: string;
  description: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  image_url?: string;
  seller_id: string;
  category_id: string;
}

export interface ProductData {
  name: string;
  price?: number;
  image_url?: string;
  description: string;
  business_id: string;
  seller_id: string;
}

export interface SocialLinksData {
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export const sellerDashboardService = {
  // Business Management
  async createBusiness(data: BusinessData & { images?: string[], opening_time?: string, closing_time?: string }) {
    const sql = `
      INSERT INTO businesses (
        name, description, phone, 
        whatsapp, address, city, state, pincode, image_url, images, seller_id, category_id,
        opening_time, closing_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::uuid, $12, $13, $14)
      RETURNING *
    `;
    const params = [
      data.name, data.description, data.phone,
      data.whatsapp, data.address, data.city, data.state, data.pincode, data.image_url, data.images || [], data.seller_id, data.category_id,
      data.opening_time || '09:00', data.closing_time || '21:00'
    ];
    const [result] = await query(sql, params);
    return result;
  },

  async updateBusiness(id: string, data: Partial<BusinessData & { images?: string[] }>) {
    if (!isValidUUID(id)) return null;
    const fields = Object.keys(data).filter(k => k !== 'seller_id');
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const sql = `UPDATE businesses SET ${setClause} WHERE id = $1::uuid RETURNING *`;
    const params = [id, ...fields.map(f => (data as any)[f])];
    const [result] = await query(sql, params);
    return result;
  },

  async deleteBusiness(id: string) {
    if (!isValidUUID(id)) return null;
    const sql = `DELETE FROM businesses WHERE id = $1::uuid RETURNING id`;
    const [result] = await query(sql, [id]);
    return result;
  },

  async getBusinessesBySeller(seller_id: string) {
    if (!isValidUUID(seller_id)) return [];
    const sql = `
      SELECT b.*, c.name as category_name 
      FROM businesses b 
      LEFT JOIN categories c ON b.category_id = c.id 
      WHERE b.seller_id = $1::uuid 
      ORDER BY b.created_at DESC
    `;
    return await query(sql, [seller_id]);
  },

  async seedDemoData(sellerId: string) {
    console.log('sellerDashboardService: seeding demo data for', sellerId);
    try {
      // Ensure user exists (especially for test users)
      const userCheck = await query('SELECT id FROM users WHERE id = $1::uuid', [sellerId]);
      if (userCheck.length === 0) {
        if (sellerId === '00000000-0000-0000-0000-000000000999') {
          console.log('sellerDashboardService: test user missing, creating it');
          await query(
            'INSERT INTO users (id, email, full_name, role) VALUES ($1::uuid, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
            [sellerId, 'test@example.com', 'Test User', 'seller']
          );
        } else {
          throw new Error('User not found in database. Please log in again.');
        }
      }

      // Check if user already has businesses
      const existing = await query('SELECT id FROM businesses WHERE seller_id = $1::uuid LIMIT 1', [sellerId]);
      if (existing.length > 0) {
        console.log('sellerDashboardService: user already has businesses, skipping seed');
        return;
      }

      // Get some categories
      const categories = await query('SELECT id FROM categories LIMIT 5');
      if (categories.length === 0) {
        console.error('sellerDashboardService: no categories found, cannot seed businesses');
        return;
      }

      // Seed 5 dummy businesses for this seller
      for (let i = 1; i <= 5; i++) {
        const catId = categories[(i - 1) % categories.length].id;
        const [biz] = await query(
          `INSERT INTO businesses (
            name, description, category_id, seller_id, 
            address, city, state, pincode, phone, email, 
            status, is_active, is_verified, plan_type, images
          ) VALUES ($1, $2, $3, $4::uuid, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING id`,
          [
            `Demo Business ${i}`,
            `This is a demo business for testing your dashboard.`,
            catId,
            sellerId,
            '123 Demo Street',
            'Delhi-NCR',
            'Delhi',
            '110001',
            '9876543210',
            'demo@example.com',
            'approved',
            true,
            true,
            i % 2 === 0 ? 'prime' : 'free',
            []
          ]
        );

        if (biz) {
          // Seed a dummy lead for each business
          await query(
            'INSERT INTO leads (business_id, type) VALUES ($1::uuid, $2)',
            [biz.id, i % 2 === 0 ? 'call' : 'whatsapp']
          );
        }
      }
      console.log('sellerDashboardService: demo data seeded successfully');
    } catch (error) {
      console.error('sellerDashboardService: error seeding demo data:', error);
      throw error;
    }
  },

  // Product Management
  async addProduct(data: ProductData) {
    const sql = `
      INSERT INTO products (name, price, image_url, description, business_id, seller_id)
      VALUES ($1, $2, $3, $4, $5::uuid, $6::uuid)
      RETURNING *
    `;
    const params = [data.name, data.price, data.image_url, data.description, data.business_id, data.seller_id];
    const [result] = await query(sql, params);
    return result;
  },

  async updateProduct(id: string, data: Partial<ProductData>) {
    if (!isValidUUID(id)) return null;
    const fields = Object.keys(data).filter(k => k !== 'seller_id' && k !== 'business_id');
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const sql = `UPDATE products SET ${setClause} WHERE id = $1::uuid RETURNING *`;
    const params = [id, ...fields.map(f => (data as any)[f])];
    const [result] = await query(sql, params);
    return result;
  },

  async deleteProduct(id: string) {
    if (!isValidUUID(id)) return null;
    const sql = `DELETE FROM products WHERE id = $1::uuid RETURNING id`;
    const [result] = await query(sql, [id]);
    return result;
  },

  async getProductsByBusiness(business_id: string) {
    if (!isValidUUID(business_id)) return [];
    const sql = `SELECT * FROM products WHERE business_id = $1::uuid ORDER BY created_at DESC`;
    return await query(sql, [business_id]);
  },

  // Social Links
  async updateSocialLinks(seller_id: string, data: SocialLinksData) {
    const sql = `
      INSERT INTO social_links (seller_id, website, instagram, facebook, youtube)
      VALUES ($1::uuid, $2, $3, $4, $5)
      ON CONFLICT (seller_id) DO UPDATE SET
        website = EXCLUDED.website,
        instagram = EXCLUDED.instagram,
        facebook = EXCLUDED.facebook,
        youtube = EXCLUDED.youtube
      RETURNING *
    `;
    const params = [seller_id, data.website, data.instagram, data.facebook, data.youtube];
    const [result] = await query(sql, params);
    return result;
  },

  async getSocialLinks(seller_id: string) {
    if (!isValidUUID(seller_id)) return { website: '', instagram: '', facebook: '', youtube: '' };
    const sql = `SELECT * FROM social_links WHERE seller_id = $1::uuid`;
    const [result] = await query(sql, [seller_id]);
    return result || { website: '', instagram: '', facebook: '', youtube: '' };
  }
};
