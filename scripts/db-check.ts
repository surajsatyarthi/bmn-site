import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

async function check() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  try {
    console.log('--- DB Connectivity Check ---');
    const result = await sql`SELECT 1 as connected`;
    console.log('Connection Result:', result);

    console.log('\n--- Checking Resources Table Schema ---');
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'resources' 
      AND column_name = 'integrations'
    `;
    
    if (columns.length > 0) {
      console.log('✅ Column "integrations" exists:', columns[0]);
    } else {
      console.log('❌ Column "integrations" is MISSING');
    }

    console.log('\n--- Checking Auth Secret ---');
    console.log('AUTH_SECRET exists:', !!process.env.AUTH_SECRET);

  } catch (error) {
    console.error('❌ Connection Failed:', error);
  } finally {
    await sql.end();
  }
}

check();
