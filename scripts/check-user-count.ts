
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { users, resources } from '../src/drizzle/schema';
import { count } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(client);

async function checkCount() {
  try {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [resCount] = await db.select({ count: count() }).from(resources);
    
    console.log(`Users: ${userCount.count}`);
    console.log(`Resources: ${resCount.count}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkCount();
