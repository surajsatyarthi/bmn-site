# Walkthrough — ENTRY-DB-2: Apollo-style Database Layout

**Date:** 2026-02-26
**Branch:** `feat/entry-db2-apollo-layout`
**PR:** https://github.com/surajsatyarthi/bmn-site/pull/30

## What Changed

### Problem
`/database` had filters in a horizontal top grid and results as cards. CEO requires Apollo.io-style layout: left vertical filter panel + right tabular results.

### Files Changed

| File | Change |
|------|--------|
| `bmn-site/src/components/database/FilterPanel.tsx` | **[NEW]** Left-side filter panel |
| `bmn-site/src/app/(dashboard)/database/page.tsx` | **[MODIFY]** New flex layout + table results |

### FilterPanel

- `w-64` sticky left panel (`position: sticky`, `top-[calc(4rem+2rem)]` below header)
- 4 filter inputs: Company Name (text), Country (text, maxLength 2), HS Chapter (text, maxLength 2), Trade Type (select: All/Importer/Exporter/Both)
- Search button (submit) + Clear link (`/database`)
- Standard `<form method="GET">` — works without JavaScript

### Results Table

Replaced card layout with `<table>`:

| Flag | Company | Country | Type (badge) | HS | Trades With | View → |
|------|---------|---------|-------------|-----|------------|--------|

- Trade type badges: green (exporter), blue (importer), purple (both) — preserved from original
- Partner countries: first 3, pipe-separated
- `data-testid="company-card"` on View → link — preserved for Playwright tests

### Query Logic (Unchanged)

All query logic from the original page is preserved without modification:
- `buildDatabaseFilters()` from `@/lib/database/filters`
- Drizzle `eq()` / `sql`` tsvector` conditions
- Offset pagination (`PAGE_SIZE`)

## Gate Evidence

| Gate | Status | Evidence |
|------|--------|---------|
| G1 — Component Audit | ✅ | New component `FilterPanel` — no duplicates with existing |
| G3 — Blueprint | ✅ | PM APPROVED in PROJECT_LEDGER.md 2026-02-26 |
| G4 — Implementation Integrity | ✅ | Diff: exactly 2 files, layout matches blueprint |
| G5 — Zero Lint Suppression | ✅ | `npx eslint FilterPanel.tsx database/page.tsx --max-warnings=0` → 0 errors |
| G12 — Documentation | ✅ | This file |
| CI | ⏳ | Running on PR |
| G13 — Browser Walkthrough | ⏳ | Pending Vercel preview URL |
| G14 — PM APPROVED | ✅ | Approved in PROJECT_LEDGER.md |
