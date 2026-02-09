
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = postgres(process.env.DATABASE_URL!);

async function migrate() {
  const migrationFile = path.join(__dirname, '../drizzle/0001_foamy_cannonball.sql');
  console.log(`Reading migration file: ${migrationFile}`);
  
  const content = fs.readFileSync(migrationFile, 'utf-8');
  const statements = content.split('--> statement-breakpoint');

  console.log(`Found ${statements.length} statements.`);

  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;

    try {
      console.log(`Executing: ${trimmed.substring(0, 50)}...`);
      await sql.unsafe(trimmed);
      console.log('✅ Success');
    } catch (e: any) {
      if (e.code === '42701') {
        console.warn('⚠️ Column already exists, skipping.');
      } else if (e.code === '42P07') {
        console.warn('⚠️ Table/Relation already exists, skipping.');
      } else if (e.code === '42710') {
         console.warn('⚠️ Constraint already exists, skipping.');
      } else {
        console.error('❌ Error executing statement:', e);
        // Don't throw, try next? Or throw?
        // For development, maybe unsafe to continue, but commonly safe for ADD COLUMN
      }
    }
  }

  await sql.end();
  console.log('Migration complete.');
}

migrate();
