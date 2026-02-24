# G1 Component Audit — ENTRY-10.0 Santander Import Script

**Date:** 2026-02-24
**Task:** ENTRY-10.0
**Auditor:** Antigravity AI Coder

---

## Codebase Search: Does an import script already exist?

```bash
$ grep -r "import-santander\|santander.*import\|importSantander" src/
(no results — safe to build)

$ ls bmn-site/scripts/ 2>/dev/null
(directory does not exist — no scripts directory)

$ grep -r "globalTradeCompanies" src/scripts/ 2>/dev/null
(directory does not exist)

$ grep -r "csv-parse\|papaparse\|csvParse" src/
(no results — no CSV parser in use anywhere in src/)
```

## Files That Will Be Created

| File | Reason |
|------|--------|
| `bmn-site/src/scripts/import-santander.ts` | New import script (the entire task) |
| `bmn-site/tests/scripts/import-santander.test.ts` | G6 unit tests for pure helper functions |

## Files That Will Be Modified

| File | Reason |
|------|--------|
| `bmn-site/package.json` | Add `csv-parse` dependency |
| `bmn-site/pnpm-lock.yaml` | Lock file update for csv-parse |

## Files Intentionally NOT Changed

| File | Reason |
|------|--------|
| `bmn-site/src/lib/db/schema.ts` | `globalTradeCompanies` already present (ENTRY-9.0 merged) |
| Any `src/app/**` files | Script-only change — no UI |
| Any migration files | Migration 015 already applied to production |

## Conclusion

No duplicate implementation exists. Safe to build.
