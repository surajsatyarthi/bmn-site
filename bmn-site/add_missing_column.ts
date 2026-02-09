
    import { config } from 'dotenv';
    config({ path: '.env.local' });
    import postgres from 'postgres';
    import { drizzle } from 'drizzle-orm/postgres-js';
    import { sql } from 'drizzle-orm';

    async function addColumn() {
      const connectionString = process.env.DATABASE_URL;
      const client = postgres(connectionString!, { ssl: 'prefer' });
      const db = drizzle(client);

      try {
        console.log('Adding certification_docs column...');
        await db.execute(sql`
          ALTER TABLE profiles 
          ADD COLUMN IF NOT EXISTS certification_docs jsonb DEFAULT '[]'::jsonb;
        `);
        console.log('Column added successfully.');
      } catch (e) {
        console.error('Error adding column:', e);
      } finally {
        await client.end();
      }
      process.exit(0);
    }
    addColumn();
    
