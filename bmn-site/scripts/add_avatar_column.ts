
import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local from root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const client = postgres(process.env.DATABASE_URL);

async function main() {
  console.log('Adding avatar_url column to profiles table...');
  try {
    await client`
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    `;
    console.log('✅ Success: avatar_url column added.');
  } catch (error) {
    console.error('❌ Error adding column:', error);
  } finally {
    await client.end();
  }
}

main();
