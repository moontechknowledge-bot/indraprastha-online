import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for @neondatabase/serverless to work in Node.js environments like Vercel
neonConfig.webSocketConstructor = ws;

const rawDatabaseUrl = process.env.DATABASE_URL;
// Sanitize URL: Remove channel_binding=require which causes issues on Vercel/Serverless
const databaseUrl = rawDatabaseUrl?.replace(/&channel_binding=require/g, '').replace(/\?channel_binding=require&/g, '?');

export const pool = new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 15000, // 15s connection timeout
  max: 20, // Max connections
});

pool.on('error', (err) => {
  console.error('[DB Pool Error]', err);
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DB Pool] New client connected');
  }
});

// Periodic heartbeat to keep Neon connection warm (every 5 minutes)
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    if (process.env.NODE_ENV !== 'production') console.log('[DB Heartbeat] Keepalive success');
  } catch (err) {
    console.error('[DB Heartbeat] Keepalive failed', err);
  }
}, 300000);

/**
 * Scalable query function for PostgreSQL using Neon Serverless.
 */
export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined. Please set it in Vercel Environment Variables.');
  }

  const start = Date.now();
  
  // Create a timeout promise to prevent infinite waiting
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Database query timed out after 90s: ${text.substring(0, 50)}...`)), 90000);
  });

  try {
    const queryPromise = pool.query(text, params);
    const result = await Promise.race([queryPromise, timeoutPromise]);
    const duration = Date.now() - start;
    
    if (duration > 1000 || process.env.NODE_ENV !== 'production') {
      console.log(`[DB Query] executed in ${duration}ms`, { rows: result.rowCount });
    }
    
    return result.rows as T[];
  } catch (error) {
    console.error('[DB Error]', {
      message: error instanceof Error ? error.message : 'Unknown error',
      query: text.substring(0, 100),
      duration: Date.now() - start,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * Validates if a string is a valid UUID.
 */
export function isValidUUID(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export default pool;
