import { sql } from './db';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { id, ...updates } = data;

    // Simple update logic for demo
    const result = await sql`
      UPDATE businesses 
      SET name = ${updates.name}, description = ${updates.description}
      WHERE id = ${id}::uuid
      RETURNING *
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(result[0]),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
