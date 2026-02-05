import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

async function countResources() {
  try {
    const [{ count }] = await sql`SELECT count(*) FROM resources`;
    console.log(`Total Resources in DB: ${count}`);
    
    // Also check how many are "verified"
    const [{ verifiedCount }] = await sql`SELECT count(*) as "verifiedCount" FROM resources WHERE verified = true`;
    console.log(`Verified Resources: ${verifiedCount}`);

  } catch (e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}

countResources();
