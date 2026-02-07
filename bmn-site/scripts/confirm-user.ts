import postgres from 'postgres';
import { config } from 'dotenv';

if (!process.env.DATABASE_URL) {
  config({ path: '.env.local' });
}

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: 'require' });

async function confirmUser() {
  console.log(`Confirming user: ${email}...`);
  try {
    const result = await sql`
      UPDATE auth.users
      SET email_confirmed_at = now(),
          updated_at = now()
      WHERE email = ${email}
      RETURNING id, email, email_confirmed_at
    `;

    if (result.length === 0) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log(`✅ User confirmed: ${result[0].email} (${result[0].id})`);
    
    // Also ensure a profile exists (triggers should handle this, but just in case)
    // We won't insert here to avoid complexity, relying on triggers.
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to confirm user:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

confirmUser();
