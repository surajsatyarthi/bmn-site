
    import { config } from 'dotenv';
    config({ path: '.env.local' });
    import postgres from 'postgres';
    import { drizzle } from 'drizzle-orm/postgres-js';
    import { eq } from 'drizzle-orm';
    import * as schema from './src/lib/db/schema';

    async function debugQuery() {
      const connectionString = process.env.DATABASE_URL;
      console.log('Connecting to DB...');
      
      const client = postgres(connectionString!, {
        prepare: false,
        max: 1,
        ssl: 'prefer',
      });
      const db = drizzle(client, { schema });

      try {
        console.log('Running debug query...');
        const userId = 'bfa903ab-f496-4b58-88c6-7f2631743fbc'; 
        
        const profile = await db.query.profiles.findFirst({
          where: eq(schema.profiles.id, userId),
          with: {
              company: true,
          }
        });
        
        console.log('Query successful. Profile found:', !!profile);
        if (profile) console.log(profile);
      } catch (e) {
        console.error('Query failed:', e);
      } finally {
        await client.end();
      }
      process.exit(0);
    }
    debugQuery();
    
