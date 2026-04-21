import { neon } from '@neondatabase/serverless';

async function checkDb() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('DATABASE_URL is NOT defined in the environment.');
    return;
  }

  const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@');
  console.log('DATABASE_URL exists:', maskedUrl);

  const sql = neon(databaseUrl);

  try {
    const timeResult = await sql`SELECT NOW()`;
    console.log('Connection Success! Current DB Time:', timeResult[0].now);

    try {
      const countResult = await sql`SELECT COUNT(*) FROM businesses`;
      console.log('Business Count:', countResult[0].count);
    } catch (e: any) {
      if (e.message.includes('does not exist')) {
        console.log('Businesses table does NOT exist. Creating it...');
        // Table creation logic would go here if needed, but server.ts should handle it.
      } else {
        console.error('Error checking businesses table:', e.message);
      }
    }
  } catch (e: any) {
    console.error('Connection Failed:', e.message);
  }
}

checkDb();
