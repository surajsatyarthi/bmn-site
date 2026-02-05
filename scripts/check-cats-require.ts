const postgres = require('postgres');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function checkCats() {
  try {
    const cats = await sql`SELECT * FROM categories ORDER BY "order"`;
    console.log('Categories:', cats);
  } catch (e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}

checkCats();
