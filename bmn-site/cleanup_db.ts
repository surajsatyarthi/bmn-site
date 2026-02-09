
    import { config } from 'dotenv';
    config({ path: '.env.local' });
    import postgres from 'postgres';
    import { drizzle } from 'drizzle-orm/postgres-js';
    import { sql } from 'drizzle-orm';

    async function cleanupDuplicates() {
      const connectionString = process.env.DATABASE_URL;
      console.log('Connecting to:', connectionString);
      
      const client = postgres(connectionString!, {
        prepare: false,
        max: 1,
        ssl: 'prefer', // Matches src/lib/db/index.ts
      });
      const db = drizzle(client);

      try {
        console.log('Checking for duplicates in companies table...');
        
        // Find duplicates
        const duplicates = await db.execute(sql`
          SELECT profile_id, COUNT(*) 
          FROM companies 
          GROUP BY profile_id 
          HAVING COUNT(*) > 1
        `);
        
        console.log('Duplicate profile_ids found:', duplicates.length);

        if (duplicates.length > 0) {
          console.log('Deleting duplicates (keeping latest)...');
          
          await db.execute(sql`
            DELETE FROM companies a USING (
              SELECT min(ctid) as ctid, profile_id
              FROM companies 
              GROUP BY profile_id HAVING COUNT(*) > 1
            ) b
            WHERE a.profile_id = b.profile_id 
            AND a.ctid <> b.ctid
          `);
          
          console.log('Duplicates deleted.');
        } else {
          console.log('No duplicates found.');
        }
        
      } catch (e) {
        console.error('Error cleaning up:', e);
      } finally {
        await client.end();
      }
      process.exit(0);
    }
    cleanupDuplicates();
    
