// server/lib/db.ts - Ready for Vercel (No Heartbeat)
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Neon Database handles SSL automatically via WebSocket driver
neonConfig.webSocketConstructor = ws;

const rawUrl = (process.env.DATABASE_URL || '').trim();

if (!rawUrl) {
  console.error('[DB FATAL] DATABASE_URL is not defined in environment variables!');
}

// Removing unnecessary parameters for cleaner connection
const databaseUrl = rawUrl
  .replace(/([?&])channel_binding=[^&]*/g, '$1')
  .replace(/([?&])sslmode=[^&]*/g, '$1')
  .replace(/\?&/g, '?')
  .replace(/&&+/g, '&')
  .replace(/[?&]$/g, '');

export const pool = new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 10000, // 10 seconds timeout
});

pool.on('error', (err) => {
  console.error('[DB Pool Error]', err);
});

// Helper for simplified queries
export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await pool.query(text, params);
    return result.rows as T[];
  } catch (error) {
    console.error('[DB Error]', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export default pool;