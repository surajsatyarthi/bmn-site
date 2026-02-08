
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

const sql = postgres(connectionString, { ssl: 'require' });

async function fixInstanceId() {
  try {
    // Get correct instance_id
    const result = await sql`
      SELECT instance_id FROM auth.users 
      WHERE is_super_admin = false AND instance_id != '00000000-0000-0000-0000-000000000000'
      LIMIT 1
    `;
    
    let correctInstanceId = '00000000-0000-0000-0000-000000000000';
    
    if (result.length > 0) {
      correctInstanceId = result[0].instance_id;
      console.log(`Found valid instance_id: ${correctInstanceId}`);
    } else {
        console.log('No other valid instance_id found. Using default.');
    }

    const email = 'manual_1770543555811@example.com';
    
    console.log(`Updating user ${email} to instance_id: ${correctInstanceId}...`);
    
    const update = await sql`
      UPDATE auth.users 
      SET instance_id = ${correctInstanceId}
      WHERE email = ${email}
      RETURNING id, instance_id
    `;
    
    console.log('Updated:', update);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

fixInstanceId();
