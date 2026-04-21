// server/lib/db.ts - Ready for Vercel (HTTP Mode)
import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg'; // Standard Postgres pool for local/fallback

const databaseUrl = (process.env.DATABASE_URL || '').trim();

if (!databaseUrl) {
  console.error('[DB FATAL] DATABASE_URL is missing!');
}

// 1. Neon HTTP Client (Vercel ke liye Best aur Fast)
const sql = neon(databaseUrl);

// 2. Postgres Pool (Local Dev ke liye)
export const pool = new Pool({
  connectionString: databaseUrl,
});

/**
 * Scalable query function: Vercel par HTTP use karega, Local par Pool.
 */
export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  try {
    // Agar Vercel par hain, toh direct HTTP query karein (Isse WebSocket error nahi aayega)
    if (process.env.VERCEL) {
      const result = await sql(text, params);
      return result as T[];
    }
    
    // Local par standard Pool use karein
    const result = await pool.query(text, params);
    return result.rows as T[];
  } catch (error) {
    console.error('[DB Error]', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export default pool;