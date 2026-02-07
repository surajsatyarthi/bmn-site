import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { prepare: false, ssl: 'require' });

async function batchIngest() {
  console.log('🚀 Starting Batch Ingestion from pending-resources.json...');

  try {
    // 1. Read pending resources
    const filePath = resolve(process.cwd(), 'scripts/pending-resources.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const resources = JSON.parse(rawData);

    console.log(`📦 Found ${resources.length} resources to process.`);

    // 2. Fetch Categories for mapping
    const categories = await sql`SELECT id, slug FROM categories`;
    const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

    // 3. Fetch Admin User
    const [admin] = await sql`SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1`;
    const adminId = admin?.id || 'default-admin-id';

    let successCount = 0;
    let errorCount = 0;

    for (const res of resources) {
      const categoryId = categoryMap.get(res.category);
      
      if (!categoryId) {
        console.warn(`⚠️ Skipping "${res.title}": Category "${res.category}" not found.`);
        errorCount++;
        continue;
      }

      // Generate slug if not present or sanitize title for slug
      const slug = (res.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 5))
        .replace(/-+$/, '');

      try {
        await sql`
          INSERT INTO resources (
            id, title, slug, description, url, category_id, author_id, 
            verified, featured, github_stars, github_forks, is_indexed, last_validated_at
          ) VALUES (
            ${uuidv4()}, 
            ${res.title}, 
            ${slug}, 
            ${res.description}, 
            ${res.url}, 
            ${categoryId}, 
            ${adminId},
            true,
            false,
            ${res.stars || 0},
            0,
            false,
            NOW()
          )
        `;
        successCount++;
        console.log(`✅ Ingested: ${res.title}`);
      } catch (err) {
        console.error(`❌ Failed to ingest "${res.title}":`, err);
        errorCount++;
      }
    }

    console.log(`\n🏁 Ingestion Complete!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed/Skipped: ${errorCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Batch Ingestion failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

batchIngest();
