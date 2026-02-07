import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function check() {
  const [total] = await sql`SELECT count(*) FROM resources`;
  const [indexed] = await sql`SELECT count(*) FROM resources WHERE is_indexed = true`;
  console.log(`📊 TOTAL RESOURCES: ${total.count}`);
  console.log(`🔐 INDEXED RESOURCES: ${indexed.count}`);
  process.exit(0);
}

check();
