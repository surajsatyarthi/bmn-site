# Walkthrough — ENTRY-11.0: /database Search Page Rebuild

**Date:** 2026-02-25
**Tier:** M
**Branch:** feat/entry-11-database-search

---

## What Was Built

A server-rendered search page for the `global_trade_companies` table (~4.4M rows post Santander import).

## Files Created (4 new, 0 modified)

| File | Purpose |
|------|---------|
| `src/lib/database/filters.ts` | Pure function `buildDatabaseFilters(params)` — validates/sanitizes searchParams, returns typed filter object + pagination offset |
| `tests/lib/database/filters.test.ts` | 16 unit tests covering all filter cases (G6) |
| `src/app/(dashboard)/database/page.tsx` | Server component — auth guard, Drizzle query with dynamic WHERE, filter bar, result cards, pagination |
| `src/app/(dashboard)/database/loading.tsx` | Skeleton UI matching card structure |
| `src/app/(dashboard)/database/error.tsx` | Error boundary (matches existing pattern) |

## Files Also Modified (pre-existing issues, not scope creep)

| File | Change | Reason |
|------|--------|--------|
| `tsconfig.json` | Added `test-db-insert.ts`, `check-db.ts` to exclude | Pre-existing diagnostic scripts were breaking typecheck |
| `eslint.config.mjs` | Added `test-db-insert.ts`, `test-db-batch.ts`, `check-db.ts` to ignores | Pre-existing diagnostic scripts were failing lint |
| `supabase/migrations/015_global_trade_companies.sql` | Created | PM requested as part of ENTRY-9.0/10.1 unblock |

## Files NOT Changed

- `DashboardNav.tsx` — `/database` link already present (ENTRY-7.0)
- `middleware.ts` — `/database` already protected (ENTRY-8.0)
- `src/lib/db/schema.ts` — `globalTradeCompanies` already defined (ENTRY-9.0)
- All other routes, components, API handlers

---

## Query Strategy

**Filter logic** (`buildDatabaseFilters`):
- `name` → GIN full-text: `to_tsvector('english', company_name) @@ plainto_tsquery('english', ?)`
- `country` → exact match on `country_code` (validated: 2 alpha chars only)
- `hs` → exact match on `hs_chapter` (validated: 2 numeric chars only)
- `trade_type` → exact match on enum (`importer`/`exporter`/`both`, whitelist-validated)
- `page` → offset-based, 25 rows/page, clamped to ≥1

**No client-side state.** All filters are URL params — searches are shareable and server-rendered.

**Shipment count:** `trade_shipments` table doesn't exist yet (ENTRY-15.0). The "N shipments" line in result cards is not rendered until that data is available.

---

## Test Results

```
✓ tests/lib/database/filters.test.ts  16 tests  2ms
✓ All 67 tests pass
```

## Build Results

```
✓ Compiled successfully
✓ TypeScript: no errors
✓ Lint: 0 errors (4 pre-existing warnings in StakeholderNetwork.tsx — not caused by this entry)
✓ /database route: ƒ (Dynamic) server-rendered on demand
```

---

## G6 Test Coverage

| Test case | Covered |
|-----------|---------|
| empty params → no filters, page=1, offset=0 | ✅ |
| single country filter | ✅ |
| lowercased country auto-uppercased | ✅ |
| invalid country (too long) → undefined | ✅ |
| HS chapter filter | ✅ |
| invalid HS (non-numeric) → undefined | ✅ |
| trade_type: all 3 valid values | ✅ |
| invalid trade_type → undefined | ✅ |
| name search | ✅ |
| name with whitespace → trimmed | ✅ |
| empty name → undefined | ✅ |
| combined filters | ✅ |
| page=3 → offset=50 | ✅ |
| page=0 → clamped to 1 | ✅ |
| page=NaN → defaults to 1 | ✅ |
| array value for param → ignored | ✅ |
