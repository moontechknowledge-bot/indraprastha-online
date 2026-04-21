import { query } from './server/lib/db';

async function setupFounderRoles() {
  try {
    // Add role column if it doesn't exist
    await query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'seller';
    `);

    const founders = ['moontechknowledge@gmail.com', 'anuragotwal@gmail.com'];
    
    for (const email of founders) {
      // Check if user exists, if not create a dummy one with founder role
      const [user] = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (user) {
        await query('UPDATE users SET role = $1 WHERE email = $2', ['founder', email]);
        console.log(`Updated ${email} to founder role`);
      } else {
        // Create a placeholder user for founders so they can login
        // Note: phone is UNIQUE NOT NULL in schema, so we need a dummy one
        const dummyPhone = '000000000' + founders.indexOf(email);
        await query(
          'INSERT INTO users (email, password, name, role, phone) VALUES ($1, $2, $3, $4, $5)',
          [email, 'founder_bypass_placeholder', 'Founder', 'founder', dummyPhone]
        );
        console.log(`Created founder user: ${email}`);
      }
    }
  } catch (error) {
    console.error('Error setting up founder roles:', error);
  }
}

setupFounderRoles();
