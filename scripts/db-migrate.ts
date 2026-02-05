import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

async function migrate() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  try {
    console.log('--- Applying Schema Sync (Direct SQL) ---');
    
    // Add integrations column if it doesn't exist
    // Using simple ALTER TABLE. If it fails because column exists, it will catch.
    await sql`
      ALTER TABLE resources 
      ADD COLUMN IF NOT EXISTS integrations TEXT[] DEFAULT '{}'
    `;
    console.log('✅ Column "integrations" added to "resources" table.');

    // Also check for category "group" which was mentioned in the plan
    await sql`
      ALTER TABLE categories 
      ADD COLUMN IF NOT EXISTS "group" TEXT
    `;
    console.log('✅ Column "group" added to "categories" table.');

  } catch (error) {
    console.error('❌ Migration Failed:', error);
  } finally {
    await sql.end();
  }
}

migrate();
