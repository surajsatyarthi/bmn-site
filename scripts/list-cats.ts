import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

async function listCats() {
  try {
    const categories = await sql`SELECT * FROM categories`;
    console.log(JSON.stringify(categories, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}

listCats();
