import { Request, Response } from 'express';
import { query, isValidUUID } from '../lib/db';

const checkBusinessOwnership = async (businessId: string, userId: string, role: string) => {
  if (role === 'founder' || role === 'admin') return true;
  const [business] = await query('SELECT seller_id FROM businesses WHERE id = $1::uuid', [businessId]);
  return business && business.seller_id === userId;
};

export const createProduct = async (req: any, res: Response) => {
  const { business_id, name, price, description, image_url } = req.body;
  const seller_id = req.user.id;
  const role = req.user.role;

  if (!business_id || !name) {
    return res.status(400).json({ error: "business_id and name are required" });
  }

  try {
    const isOwner = await checkBusinessOwnership(business_id, seller_id, role);
    if (!isOwner) {
      return res.status(403).json({ error: "Unauthorized to add products to this business" });
    }

    const [product] = await query(`
      INSERT INTO products (
        business_id, 
        seller_id, 
        name, 
        price, 
        description, 
        image_url
      ) VALUES (
        $1::uuid, 
        $2::uuid, 
        $3, 
        $4, 
        $5, 
        $6
      ) RETURNING *
    `, [
      business_id, 
      seller_id, 
      name, 
      price || null, 
      description || null, 
      image_url || null
    ]);

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductsByBusiness = async (req: Request, res: Response) => {
  const { business_id } = req.params;

  try {
    let resolvedId = business_id;
    if (!isValidUUID(business_id)) {
      const [biz] = await query('SELECT id FROM businesses WHERE slug = $1', [business_id]);
      if (!biz) return res.status(404).json({ error: "Business not found" });
      resolvedId = biz.id;
    }

    const results = await query(`
      SELECT * FROM products 
      WHERE business_id = $1::uuid 
      ORDER BY created_at DESC
    `, [resolvedId]);
    
    res.json(results || []);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  if (!isValidUUID(id)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }

  try {
    const [product] = await query('SELECT business_id FROM products WHERE id = $1::uuid', [id]);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const isOwner = await checkBusinessOwnership(product.business_id, userId, role);
    if (!isOwner) {
      return res.status(403).json({ error: "Unauthorized to update this product" });
    }

    const [updated] = await query(`
      UPDATE products 
      SET 
        name = $1,
        price = $2,
        description = $3,
        image_url = $4
      WHERE id = $5::uuid
      RETURNING *
    `, [
      data.name,
      data.price || null,
      data.description || null,
      data.image_url || null,
      id
    ]);

    res.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  if (!isValidUUID(id)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }

  try {
    const [product] = await query('SELECT business_id FROM products WHERE id = $1::uuid', [id]);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const isOwner = await checkBusinessOwnership(product.business_id, userId, role);
    if (!isOwner) {
      return res.status(403).json({ error: "Unauthorized to delete this product" });
    }

    const [deleted] = await query(`
      DELETE FROM products WHERE id = $1::uuid RETURNING id
    `, [id]);

    res.json({ success: true, id: deleted.id });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
