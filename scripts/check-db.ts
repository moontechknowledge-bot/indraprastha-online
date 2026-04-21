import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function check() {
  try {
    const userCount = await sql`SELECT count(*) FROM users`;
    const categoryCount = await sql`SELECT count(*) FROM categories`;
    const businessCount = await sql`SELECT count(*) FROM businesses`;
    const leadCount = await sql`SELECT count(*) FROM leads`;
    const sampleUsers = await sql`SELECT id, email, role FROM users LIMIT 5`;
    const sampleCategories = await sql`SELECT id, name FROM categories LIMIT 50`;
    const businessOwnership = await sql`SELECT seller_id, count(*) FROM businesses GROUP BY seller_id`;
    const sampleBusinesses = await sql`SELECT id, name, category_id, city, status, is_active, seller_id FROM businesses LIMIT 50`;
    
    console.log(JSON.stringify({
      counts: {
        users: parseInt(userCount[0].count),
        categories: parseInt(categoryCount[0].count),
        businesses: parseInt(businessCount[0].count),
        leads: parseInt(leadCount[0].count)
      },
      samples: {
        users: sampleUsers,
        categories: sampleCategories,
        businesses: sampleBusinesses
      }
    }, null, 2));
  } catch (error) {
    console.error(error);
  }
}

check();
