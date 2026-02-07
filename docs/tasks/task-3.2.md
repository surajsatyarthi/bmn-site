# Task 3.2 — JSONB Column Remediation

**Block:** 3.2
**Status:** TODO
**Prerequisites:** Block 3.1 PASSED
**Priority:** Must complete before Phase 4 begins
**Estimated scope:** Small (schema + migration + remove JSON.parse/stringify calls)

---

## Objective

Convert 6 JSON columns in the `matches` table from `text` to `jsonb`. Currently these columns store JSON as plain text strings, requiring manual `JSON.parse()` / `JSON.stringify()` throughout the codebase. Using native Postgres `jsonb` gives us:

1. **DB-level JSON validation** — corrupt JSON cannot be stored
2. **GIN index support** — enables efficient queries inside JSON (e.g., "find matches containing HS code 0901")
3. **Native Postgres operators** — `->`, `->>`, `@>`, `?`, `jsonb_agg`, `jsonb_array_elements`
4. **Drizzle auto-serialization** — Drizzle handles parse/stringify automatically for `jsonb()` columns

This is a foundational schema fix. Cheap now, expensive after real data accumulates.

---

## Deliverable 1: Schema Update

### Update: `src/lib/db/schema.ts`

Import `jsonb` from `drizzle-orm/pg-core` and change these 6 columns in the `matches` table from `text()` to `jsonb()` with proper TypeScript types:

| Column | Current | New | Type Annotation |
|---|---|---|---|
| `matchedProducts` | `text('matched_products').notNull()` | `jsonb('matched_products').notNull().$type<{ hsCode: string; name: string }[]>()` | Array of product objects |
| `scoreBreakdown` | `text('score_breakdown').notNull()` | `jsonb('score_breakdown').notNull().$type<Record<string, number>>()` | Component scores object |
| `matchReasons` | `text('match_reasons').notNull()` | `jsonb('match_reasons').notNull().$type<string[]>()` | Array of explanation strings |
| `matchWarnings` | `text('match_warnings')` | `jsonb('match_warnings').$type<string[] | null>()` | Nullable array of warning strings |
| `tradeData` | `text('trade_data')` | `jsonb('trade_data').$type<{ volume: string; frequency: string; yearsActive: number } | null>()` | Nullable trade data object |
| `counterpartyContact` | `text('counterparty_contact')` | `jsonb('counterparty_contact').$type<{ name: string; title: string; email: string; phone: string; website: string | null } | null>()` | Nullable contact info |

**Important:** With `jsonb()`, Drizzle automatically serializes on insert and deserializes on read. This means all `JSON.parse()` and `JSON.stringify()` calls for these fields must be removed.

---

## Deliverable 2: Migration

### Create: `supabase/migrations/004_jsonb_columns.sql`

```sql
-- Convert text columns to jsonb in matches table
-- Data is already valid JSON stored as text

ALTER TABLE public.matches
  ALTER COLUMN matched_products TYPE jsonb USING matched_products::jsonb,
  ALTER COLUMN score_breakdown TYPE jsonb USING score_breakdown::jsonb,
  ALTER COLUMN match_reasons TYPE jsonb USING match_reasons::jsonb,
  ALTER COLUMN match_warnings TYPE jsonb USING match_warnings::jsonb,
  ALTER COLUMN trade_data TYPE jsonb USING trade_data::jsonb,
  ALTER COLUMN counterparty_contact TYPE jsonb USING counterparty_contact::jsonb;
```

The `USING column_name::jsonb` clause converts existing text data to jsonb in-place. Safe because all existing data was written via `JSON.stringify()` and is valid JSON.

---

## Deliverable 3: Remove JSON.parse() calls

With Drizzle `jsonb()`, the values are already parsed JS objects when read from DB. **Remove all `JSON.parse()` calls** on these 6 fields in:

### Files to update:

1. **`src/app/api/matches/route.ts`** — Remove `JSON.parse()` on matchedProducts, matchReasons, matchWarnings, tradeData, counterpartyContact (lines ~95-105)

2. **`src/app/api/matches/[id]/route.ts`** — Remove `JSON.parse()` on same fields in GET handler (lines ~65-75)

3. **`src/app/api/matches/[id]/reveal/route.ts`** — Remove `JSON.parse()` on same fields in both the "already revealed" response and the "new reveal" response (two locations)

4. **`src/app/(dashboard)/matches/page.tsx`** — Remove `JSON.parse()` in the `transformedMatches` mapping (lines ~41-44). The `as` type casts can stay.

5. **`src/app/(dashboard)/matches/[id]/page.tsx`** — Remove `JSON.parse()` on matchedProducts, matchReasons, matchWarnings, tradeData, counterpartyContact (lines ~67-72)

6. **`src/app/(dashboard)/dashboard/page.tsx`** — Remove `JSON.parse()` on matchedProducts in the `transformedMatches` mapping (line ~92)

### Pattern:

**Before (text column):**
```typescript
matchedProducts: JSON.parse(match.matchedProducts),
matchReasons: JSON.parse(match.matchReasons),
matchWarnings: match.matchWarnings ? JSON.parse(match.matchWarnings) : null,
```

**After (jsonb column):**
```typescript
matchedProducts: match.matchedProducts,
matchReasons: match.matchReasons,
matchWarnings: match.matchWarnings,
```

The values are already the correct JS types. No parsing needed.

---

## Deliverable 4: Remove JSON.stringify() calls

### Update: `scripts/seed-matches.ts`

Remove `JSON.stringify()` wrappers when building match insert objects. Pass the JS objects directly — Drizzle serializes them for jsonb.

**Before:**
```typescript
matchedProducts: JSON.stringify(matchedProductsList),
scoreBreakdown: JSON.stringify(generateScoreBreakdown(score)),
matchReasons: JSON.stringify(generateMatchReasons(matchedProductsList.length)),
matchWarnings: JSON.stringify(generateMatchWarnings()),
tradeData: JSON.stringify(generateTradeData()),
counterpartyContact: JSON.stringify(generateContactInfo()),
```

**After:**
```typescript
matchedProducts: matchedProductsList,
scoreBreakdown: generateScoreBreakdown(score),
matchReasons: generateMatchReasons(matchedProductsList.length),
matchWarnings: generateMatchWarnings(),
tradeData: generateTradeData(),
counterpartyContact: generateContactInfo(),
```

---

## Constraints

- No new npm dependencies
- Do NOT change any business logic, only data serialization
- All existing functionality must work identically after the change
- The `MatchResponse` interfaces in API routes may need type adjustments since the fields are no longer strings

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # New/modified files: 0 errors, 0 warnings
npm run ralph:scan     # Must pass
```

All three gates must pass. Zero errors, zero warnings on all modified files.

**Test:** After applying migration, run `npx tsx scripts/seed-matches.ts` to verify seeding still works with jsonb columns.

Update `docs/governance/project_ledger.md` under Block 3.2. Mark as **`SUBMITTED`**.
