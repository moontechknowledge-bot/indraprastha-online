import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const rawUrl = (process.env.DATABASE_URL || '').trim();

export const pool = new Pool({
  connectionString: rawUrl,
  ssl: rawUrl.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

export function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}