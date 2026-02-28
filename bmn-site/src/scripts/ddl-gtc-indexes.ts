/**
 * DDL helper for global_trade_companies indexes.
 * Usage:
 *   set -a && source .env.local && set +a
 *   npx tsx src/scripts/ddl-gtc-indexes.ts drop
 *   npx tsx src/scripts/ddl-gtc-indexes.ts create
 */
import { sql } from 'drizzle-orm';
import { db } from '../lib/db/index';

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not set. Run: set -a && source .env.local && set +a');
  process.exit(1);
}

const action = process.argv[2];

async function main() {
  if (action === 'drop') {
    console.log('Dropping indexes on global_trade_companies...');
    await db.execute(sql`DROP INDEX IF EXISTS idx_gtc_name`);
    console.log('  ✓ idx_gtc_name (GIN) dropped');
    await db.execute(sql`DROP INDEX IF EXISTS idx_gtc_country`);
    console.log('  ✓ idx_gtc_country (btree) dropped');
    await db.execute(sql`DROP INDEX IF EXISTS idx_gtc_hs`);
    console.log('  ✓ idx_gtc_hs (btree) dropped');
    console.log('Done. Run the import, then recreate with: npx tsx src/scripts/ddl-gtc-indexes.ts create');
  } else if (action === 'create') {
    console.log('Recreating indexes on global_trade_companies (CONCURRENTLY — may take several minutes)...');
    await db.execute(sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gtc_name ON global_trade_companies USING gin(to_tsvector('english', company_name))`);
    console.log('  ✓ idx_gtc_name (GIN) created');
    await db.execute(sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gtc_country ON global_trade_companies(country_code)`);
    console.log('  ✓ idx_gtc_country (btree) created');
    await db.execute(sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gtc_hs ON global_trade_companies(hs_chapter)`);
    console.log('  ✓ idx_gtc_hs (btree) created');
    console.log('Done. All indexes restored.');
  } else {
    console.error('Usage: npx tsx src/scripts/ddl-gtc-indexes.ts [drop|create]');
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  const e = err as { cause?: { message?: string }; message?: string };
  console.error('Fatal:', e?.cause?.message || e?.message || String(err));
  process.exit(1);
});
