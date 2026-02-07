import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

/**
 * Drip-Feed Indexer
 * This script "releases" a batch of resources to search engines
 * by flipping the is_indexed flag.
 */

async function dripFeed(batchSize: number = 10) {
  console.log(`🚀 Starting Drip-Feed Indexer (Batch Size: ${batchSize})...`);

  try {
    // 1. Fetch resources that are NOT yet indexed
    const resources = await sql`
      SELECT id, title, slug 
      FROM resources 
      WHERE is_indexed = false 
      ORDER BY created_at ASC 
      LIMIT ${batchSize}
    `;

    if (resources.length === 0) {
      console.log('✅ No pending resources to index.');
      return;
    }

    console.log(`📡 Preparing to index ${resources.length} resources...`);

    for (const resource of resources) {
      await sql`
        UPDATE resources 
        SET is_indexed = true, indexed_at = NOW() 
        WHERE id = ${resource.id}
      `;
      console.log(`🔓 Indexed: ${resource.title}`);
    }

    console.log('🏁 Drip-Feed batch complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Drip-Feed failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Default to 10, but can be overridden
const size = parseInt(process.argv[2]) || 5;
dripFeed(size);
