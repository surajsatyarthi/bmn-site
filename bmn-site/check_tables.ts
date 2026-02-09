
    import { db } from './src/lib/db';
    import { sql } from 'drizzle-orm';

    async function checkTables() {
      try {
        const result = await db.execute(sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `);
        console.log('Tables in public schema:', result.rows.map(r => r.table_name));
      } catch (e) {
        console.error('Error checking tables:', e);
      }
      process.exit(0);
    }
    checkTables();
    
