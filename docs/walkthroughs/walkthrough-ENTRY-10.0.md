# Walkthrough — ENTRY-10.0: Santander Data Import Script

**Date:** 2026-02-24
**Branch:** `feat/entry-10-santander-import`
**Tier:** M
**Gate:** CI, G1, G3, G4, G5, G6, G13, G14, G11, G12

---

## What Changed

### New: `bmn-site/src/scripts/import-santander.ts`

A standalone TypeScript import script runnable via:
```bash
npx tsx src/scripts/import-santander.ts <path-to-csv>
```

Key design decisions:
- **Stream-parsed** CSV via `csv-parse` — handles multi-million row files without loading into memory
- **Flexible header matching** — normalizes CSV headers (case, spaces, underscores) before mapping, so variations like `"Company Name"`, `"company_name"`, or `"COMPANY_NAME"` all work
- **Batch size 500** — at 500 rows/batch, a 4.4M row file = 8,800 batches; Supabase handles this comfortably at ~50ms/batch (~7 min total)
- **Upsert on `(company_name, country_code)`** — idempotent; safe to run multiple times
- **Error isolation** — single bad row never aborts a batch; bad batches are logged and skipped; script always exits with a summary

### New: `bmn-site/tests/scripts/import-santander.test.ts`

33 unit tests covering all pure helper functions:
- `splitList` — 7 tests
- `normalizeTrade` — 10 tests
- `chunkArray` — 4 tests
- `normalizeKey` — 4 tests
- `mapCsvRow` — 8 tests

No database connection required — tests exercise only the mapping logic.

### Dependency: `csv-parse@6.1.0`

Added to `dependencies` (not devDependencies) since the script uses it at runtime.

---

## Why It Changed

ENTRY-10.0 is required to populate `global_trade_companies` with the 4.4M Santander records. Without data, ENTRY-11.0 (`/database` search) and ENTRY-12.0 (company detail) cannot function.

---

## How to Verify It's Working

### 1. Run the script against a real CSV

```bash
cd bmn-site
npx tsx src/scripts/import-santander.ts /path/to/santander-export.csv
```

Expected output:
```
[ENTRY-10.0] Starting Santander import from: /path/to/santander-export.csv
[ENTRY-10.0] Batch size: 500 rows
[batch 1] ✓ 500 rows upserted | Total inserted: 500 | Errors skipped: 0
[batch 2] ✓ 500 rows upserted | Total inserted: 1000 | Errors skipped: 0
...
============================================================
[ENTRY-10.0] Import complete
  CSV rows read    : 1000
  Rows upserted    : 1000
  Rows skipped     : 0
============================================================
```

### 2. Check Supabase

```sql
SELECT COUNT(*) FROM global_trade_companies WHERE data_source = 'santander';
```

### 3. Idempotency check

Run the same CSV a second time. Row counts in Supabase should remain unchanged (upsert, not duplicate insert).

### 4. Run G6 tests

```bash
cd bmn-site
pnpm test -- tests/scripts/import-santander.test.ts
# Result: 33 passed (33)
```

---

## How to Roll Back

This script only writes to `global_trade_companies`. To roll back imported data:

```sql
-- Remove all Santander-sourced rows
DELETE FROM global_trade_companies WHERE data_source = 'santander';
```

The script itself has no migrations and no schema changes. Rolling back requires only the SQL above.

The script is not deployed to any server — it is a local/CI one-off tool. No Vercel rollback needed.
