
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

async function queryInstanceIds() {
  try {
    const result = await sql`
      SELECT DISTINCT instance_id, count(*) as count 
      FROM auth.users 
      GROUP BY instance_id
    `;
    console.log('Instance IDs in database:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sql.end();
  }
}

queryInstanceIds();
