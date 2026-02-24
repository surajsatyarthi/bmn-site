/**
 * ENTRY-10.0 — Santander Data Import Script
 *
 * Usage:
 *   npx tsx src/scripts/import-santander.ts <path-to-csv>
 *
 * - Reads CSV, maps columns to globalTradeCompanies schema
 * - Batch-inserts in chunks of 500 rows
 * - Idempotent: upserts on (company_name, country_code)
 * - Logs progress; skips and counts malformed rows
 * - Safe to run multiple times
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { sql } from 'drizzle-orm';
import { db } from '../lib/db/index';
import { globalTradeCompanies } from '../lib/db/schema';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BATCH_SIZE = 500;

// ---------------------------------------------------------------------------
// Pure helper types & functions (exported for unit testing)
// ---------------------------------------------------------------------------

export type TradeType = 'importer' | 'exporter' | 'both';

export interface MappedRow {
  companyName: string;
  countryCode: string | null;
  countryName: string | null;
  hsChapter: string | null;
  hsDescription: string | null;
  tradeType: TradeType | null;
  topProducts: string[];
  partnerCountries: string[];
  contactEmail: string | null;
  contactPhone: string | null;
  dataSource: string;
}

/**
 * Splits a delimited string (semicolon or pipe) into a trimmed string array.
 * Empty input → empty array.
 */
export function splitList(value: string | undefined | null): string[] {
  if (!value || value.trim() === '') return [];
  return value
    .split(/[;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Normalizes a trade type string to the enum value or null.
 * Case-insensitive. Maps 'import' → 'importer', 'export' → 'exporter'.
 */
export function normalizeTrade(value: string | undefined | null): TradeType | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === 'importer' || v === 'import') return 'importer';
  if (v === 'exporter' || v === 'export') return 'exporter';
  if (v === 'both') return 'both';
  return null;
}

/**
 * Splits an array into chunks of `size`.
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Normalises a raw CSV header key for flexible matching.
 * Lowercases, trims, and collapses spaces/underscores.
 */
export function normalizeKey(key: string): string {
  return key.toLowerCase().trim().replace(/[\s_]+/g, '_');
}

/**
 * Maps a raw CSV record (with arbitrary header names) to a MappedRow.
 * Returns null if the row is missing a required field (company_name).
 *
 * Column matching is flexible — normalized key lookup allows for header
 * variants like "Company Name", "company_name", "COMPANY NAME", etc.
 */
export function mapCsvRow(record: Record<string, string>): MappedRow | null {
  // Build a normalized header → raw header lookup once
  const normalised: Record<string, string> = {};
  for (const key of Object.keys(record)) {
    normalised[normalizeKey(key)] = key;
  }

  const get = (normalizedHeaderKey: string): string | undefined =>
    record[normalised[normalizedHeaderKey]];

  const companyName = get('company_name')?.trim();
  if (!companyName) return null; // required field

  return {
    companyName,
    countryCode: get('country_code')?.trim().toUpperCase() || null,
    countryName: get('country')?.trim() || get('country_name')?.trim() || null,
    hsChapter: get('hs_chapter')?.trim() || null,
    hsDescription: get('hs_description')?.trim() || null,
    tradeType: normalizeTrade(get('trade_type')),
    topProducts: splitList(get('top_products')),
    partnerCountries: splitList(get('partner_countries')),
    contactEmail: get('contact_email')?.trim() || null,
    contactPhone: get('contact_phone')?.trim() || null,
    dataSource: 'santander',
  };
}

// ---------------------------------------------------------------------------
// Main import runner
// ---------------------------------------------------------------------------

async function run(): Promise<void> {
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error('Usage: npx tsx src/scripts/import-santander.ts <path-to-csv>');
    process.exit(1);
  }

  const resolvedPath = path.resolve(csvPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: File not found: ${resolvedPath}`);
    process.exit(1);
  }

  console.log(`[ENTRY-10.0] Starting Santander import from: ${resolvedPath}`);
  console.log(`[ENTRY-10.0] Batch size: ${BATCH_SIZE} rows`);

  let totalProcessed = 0;
  let totalInserted = 0;
  let totalErrors = 0;
  let batchNumber = 0;

  const pending: MappedRow[] = [];

  const flushBatch = async (rows: MappedRow[]): Promise<void> => {
    batchNumber++;
    try {
      await db
        .insert(globalTradeCompanies)
        .values(
          rows.map((r) => ({
            companyName: r.companyName,
            countryCode: r.countryCode,
            countryName: r.countryName,
            hsChapter: r.hsChapter,
            hsDescription: r.hsDescription,
            tradeType: r.tradeType,
            topProducts: r.topProducts.length > 0 ? r.topProducts : null,
            partnerCountries: r.partnerCountries.length > 0 ? r.partnerCountries : null,
            contactEmail: r.contactEmail,
            contactPhone: r.contactPhone,
            dataSource: r.dataSource,
          }))
        )
        .onConflictDoUpdate({
          target: [globalTradeCompanies.companyName, globalTradeCompanies.countryCode],
          set: {
            countryName: sql`excluded.country_name`,
            hsChapter: sql`excluded.hs_chapter`,
            hsDescription: sql`excluded.hs_description`,
            tradeType: sql`excluded.trade_type`,
            topProducts: sql`excluded.top_products`,
            partnerCountries: sql`excluded.partner_countries`,
            contactEmail: sql`excluded.contact_email`,
            contactPhone: sql`excluded.contact_phone`,
            dataSource: sql`excluded.data_source`,
          },
        });

      totalInserted += rows.length;
      console.log(
        `[batch ${batchNumber}] ✓ ${rows.length} rows upserted | Total inserted: ${totalInserted} | Errors skipped: ${totalErrors}`
      );
    } catch (err) {
      console.error(`[batch ${batchNumber}] ✗ Batch failed:`, err instanceof Error ? err.message : err);
      totalErrors += rows.length;
      console.log(`[batch ${batchNumber}] Skipped ${rows.length} rows | Total inserted: ${totalInserted} | Errors skipped: ${totalErrors}`);
    }
  };

  // Stream-parse the CSV
  await new Promise<void>((resolve, reject) => {
    const parser = parse({
      columns: true,        // use first row as header
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true, // tolerate ragged rows
    });

    const fileStream = fs.createReadStream(resolvedPath);

    fileStream.on('error', reject);
    parser.on('error', reject);

    parser.on('readable', async () => {
      let record: Record<string, string>;
      while ((record = parser.read()) !== null) {
        totalProcessed++;

        const mapped = mapCsvRow(record);
        if (!mapped) {
          totalErrors++;
          // Only log skips every 100 to avoid flooding the console
          if (totalErrors % 100 === 1) {
            console.warn(`[skip] Row ${totalProcessed} missing company_name — skipped (error #${totalErrors})`);
          }
          continue;
        }

        pending.push(mapped);

        if (pending.length >= BATCH_SIZE) {
          const batch = pending.splice(0, BATCH_SIZE);
          // Pause stream while flushing to avoid unbounded memory growth
          parser.pause();
          await flushBatch(batch);
          parser.resume();
        }
      }
    });

    parser.on('end', resolve);
    fileStream.pipe(parser);
  });

  // Flush any remaining rows
  if (pending.length > 0) {
    await flushBatch(pending);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log(`[ENTRY-10.0] Import complete`);
  console.log(`  CSV rows read    : ${totalProcessed}`);
  console.log(`  Rows upserted    : ${totalInserted}`);
  console.log(`  Rows skipped     : ${totalErrors}`);
  console.log('='.repeat(60));

  if (totalErrors > 0) {
    console.warn(`[ENTRY-10.0] WARNING: ${totalErrors} rows were skipped due to errors or missing required fields.`);
  }

  process.exit(0);
}

// Only execute when run directly (not when imported by tests)
const isMain =
  typeof process !== 'undefined' &&
  process.argv[1] != null &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMain) {
  run().catch((err) => {
    console.error('[ENTRY-10.0] Fatal error:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
