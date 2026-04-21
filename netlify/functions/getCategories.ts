import { sql } from './db';

export const handler = async (event: any) => {
  try {
    const categories = await sql`SELECT * FROM categories WHERE is_active = true ORDER BY order_index ASC`;
    return {
      statusCode: 200,
      body: JSON.stringify(categories),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
