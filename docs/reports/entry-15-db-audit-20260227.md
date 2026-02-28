# ENTRY-15.0 — DB Audit Report

**Date:** 2026-02-27T06:23 IST
**Branch:** fix/entry-15-import-fix
**Purpose:** Stage 1 pre-import audit — establish baseline row counts and DB size before script rewrite

---

## Query Results (production DB — bxyjkcdqxaeorcwhntqq)

| Query | Result |
|-------|--------|
| `SELECT pg_size_pretty(pg_database_size(current_database()))` | **309 MB** |
| `SELECT pg_size_pretty(pg_total_relation_size('trade_shipments'))` | **4432 kB** |
| `SELECT COUNT(*) FROM trade_shipments` | **10,000** |
| `SELECT COUNT(*) FROM global_trade_companies` | **500,000** |

---

## Analysis

- **DB total size:** 309 MB — free tier limit is 500 MB → **191 MB headroom**
- **trade_shipments current:** 10,000 rows (deliberately capped in previous session due to disk pressure)
- **10k rows = 4.4 MB** → 178,083 rows ≈ **~78 MB** projected (linear estimate)
- **Headroom after full import:** 191 MB − 78 MB ≈ **113 MB remaining** — safe to proceed

## Conclusion

Space is available for the full 178,083-row import. Stage 2 (script rewrite + full import) is safe to run.

**Awaiting PM go-ahead for Stage 2.**
