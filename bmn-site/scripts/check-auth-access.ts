import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, '../.env.local') });

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  ssl: 'require',
});

async function checkAuthAccess() {
  try {
    console.log('Testing access to auth.users...');
    const result = await client`SELECT id, email FROM auth.users LIMIT 1`;
    console.log('✅ Access granted!');
    console.log(result);
    process.exit(0);
  } catch (err) {
    console.error('❌ Access denied or error:', err);
    process.exit(1);
  }
}

checkAuthAccess();
