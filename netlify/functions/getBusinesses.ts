import { sql } from './db';

export const handler = async (event: any) => {
  const { categoryId, city, search } = event.queryStringParameters || {};
  
  try {
    let query = sql`SELECT b.*, c.name as category_name FROM businesses b JOIN categories c ON b.category_id = c.id WHERE 1=1`;
    
    if (categoryId) {
      query = sql`SELECT b.*, c.name as category_name FROM businesses b JOIN categories c ON b.category_id = c.id WHERE b.category_id = ${categoryId}`;
    }
    
    // Note: Simple filtering for demo. In production use more robust query building.
    const businesses = await query;
    
    return {
      statusCode: 200,
      body: JSON.stringify(businesses),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
