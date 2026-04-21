import { neon } from '@neondatabase/serverless';

async function check() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("DATABASE_URL is missing");
    return;
  }
  const sql = neon(databaseUrl);
  try {
    const count = await sql`SELECT count(*) FROM businesses`;
    const samples = await sql`SELECT name, city, status, is_active FROM businesses LIMIT 5`;
    console.log("Count:", count[0].count);
    console.log("Samples:", samples);
  } catch (err) {
    console.error("Error:", err);
  }
}
check();
