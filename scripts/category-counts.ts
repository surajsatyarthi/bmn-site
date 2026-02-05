import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function getCounts() {
  try {
    const results = await sql`
      SELECT c.name, count(r.id) as count
      FROM categories c
      LEFT JOIN resources r ON c.id = r.category_id
      GROUP BY c.name
      ORDER BY count DESC
    `;
    
    console.log('📊 RESOURCE COUNTS BY CATEGORY:');
    results.forEach(row => {
      console.log(`${row.name}: ${row.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fetching counts:', error);
    process.exit(1);
  }
}

getCounts();
