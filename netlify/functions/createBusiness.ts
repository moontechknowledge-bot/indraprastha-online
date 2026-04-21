import { sql } from './db';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, category_id, description, phone, whatsapp, address, city, state, pincode, image_url } = data;

    const result = await sql`
      INSERT INTO businesses (name, category_id, description, phone, whatsapp, address, city, state, pincode, image_url)
      VALUES (${name}, ${category_id}, ${description}, ${phone}, ${whatsapp}, ${address}, ${city}, ${state}, ${pincode}, ${image_url})
      RETURNING *
    `;

    return {
      statusCode: 201,
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
