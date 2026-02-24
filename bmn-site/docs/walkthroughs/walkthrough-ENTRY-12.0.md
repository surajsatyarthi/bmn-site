# Walkthrough — ENTRY-12.0: /database/[id] Company Detail Page

**Date:** 2026-02-25
**Tier:** M
**Branch:** feat/entry-12-company-detail

---

## What Was Built

A responsive, server-rendered detail page for individual companies in the global trade database. It includes four main tabs (Overview, Exports, Imports, Contact Info) with states accurately reflecting the user's active plan (Free vs Hunter) and data availability.

## Files Created (5 new, 0 modified)

| File | Purpose |
|------|---------|
| `src/lib/database/company-detail.ts` | Pure functions for `maskContactField`, `formatTradeValue`, and `getShipmentSummary`. |
| `tests/lib/database/company-detail.test.ts` | Unit tests for pure functions covering 6 G6 test cases. |
| `src/app/(dashboard)/database/[id]/loading.tsx` | Skeleton UI layout for the detail page. |
| `src/app/(dashboard)/database/[id]/error.tsx` | Standardized error boundary component for failed fetches. |
| `src/app/(dashboard)/database/[id]/page.tsx` | The server-rendered page handling `searchParams` for tabs, DB queries, and rendering all defined sub-views. |
| `src/app/(dashboard)/database/[id]/ContactRevealButton.tsx` | The client-side interactive reveal button to trigger a temporary toast until ENTRY-17.0. |

## Files NOT Changed
- `src/lib/db/schema.ts` — Used existing definitions for `globalTradeCompanies` and `profiles`.
- `src/lib/database/filters.ts` — No filter changes needed.
- `middleware.ts` — `/database/[id]` inherits protection from `/database`.
- `DashboardNav.tsx` — Not affected.
- `bmn-site/PROJECT_LEDGER.md` — Erroneously created ledger was removed.

---

## Query Strategy

**Tab logic** (`page.tsx`):
- `Overview` → Basic summary view integrating shipment counts (`getShipmentSummary`), `topProducts` and `partnerCountries`. Gated to show max 3 countries if plan is 'free'.
- `Exports` → Tab dedicated to the summary count of 'export' trades and an upgrade prompt if data exists.
- `Imports` → Tab dedicated to the summary count of 'import' trades and an upgrade prompt if data exists.
- `Contact` → Displays three states correctly: Data masked by `maskContactField` (State A), explicitly revealed data mock logic (State B), or a custom empty zero-state (State C) when email/phone are both NULL.

**No client-side state for major layout shifts.** All main layout tabs are URL params (`?tab=overview|exports|imports|contact`) — the entire view is server-rendered except for the ContactRevealButton component.

---

## Test Results

```
 ✓ tests/lib/database/company-detail.test.ts  6 tests  15ms
 ✓ All 73 tests pass
```

## Build Results

```
✓ Compiled successfully
✓ TypeScript: no errors
✓ Lint: 0 errors (only pre-existing UI warnings left)
✓ Security Scan: 9/10 Passed (only non-related POST rate-limiting warnings remain)
✓ /database/[id] route: ƒ (Dynamic) server-rendered on demand
```

---

## G6 Test Coverage

| Test case (pure functions) | Covered |
|-----------|---------|
| maskContactField: masks an email address, preserving domain | ✅ |
| maskContactField: masks a phone number completely | ✅ |
| maskContactField: handles empty inputs correctly | ✅ |
| formatTradeValue: formats numbers to exact dollar string with commas | ✅ |
| formatTradeValue: handles null or undefined safely with '—' sentinel | ✅ |
| getShipmentSummary: returns empty summary state | ✅ |
