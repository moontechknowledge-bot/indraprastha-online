import { neon } from '@neondatabase/serverless';

async function listEmails() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log('DATABASE_URL not defined');
    return;
  }
  const sql = neon(databaseUrl);
  try {
    const users = await sql`SELECT email FROM users WHERE email IS NOT NULL`;
    console.log('--- EMAIL LIST START ---');
    users.forEach(u => console.log(u.email));
    console.log('--- EMAIL LIST END ---');
  } catch (e) {
    console.error('Error fetching emails:', e);
  }
}

listEmails();
