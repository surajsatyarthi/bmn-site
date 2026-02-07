# Task 3.1 — Matches Schema, Seed Data & Match Display

**Block:** 3.1
**Status:** TODO
**Prerequisites:** Phase 2 COMPLETE (Blocks 2.1-2.3 PASSED)
**PRD Reference:** Sections 4.4 (Matches Page), 5 (Database Schema — `matches` + `match_reveals` tables)

---

## Objective

Build the core buyer matching infrastructure: database tables, seed script, API routes, and the matches listing page with tier badges and free-tier reveal gating. This is the highest-value feature in the product — it's what users pay for.

This task covers PRD Phase 2 items: 2.1 through 2.11.

---

## Deliverable 1: Schema — `matches` + `match_reveals` tables

### Add to `src/lib/db/schema.ts`:

**`matches` table:**

| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | `defaultRandom()` |
| profileId | uuid (FK) | Yes | References `profiles.id`, cascade delete |
| counterpartyName | text | Yes | Matched company name |
| counterpartyCountry | text | Yes | Country name |
| counterpartyCity | text | No | |
| matchedProducts | jsonb | Yes | Array of `{ hsCode: string, name: string }` |
| matchScore | integer | Yes | 0-100, internal only — NEVER expose to frontend |
| matchTier | text | Yes | `'best'` (80-100), `'great'` (60-79), `'good'` (50-59) |
| scoreBreakdown | jsonb | Yes | Component scores object (internal only) |
| matchReasons | jsonb | Yes | Array of explanation strings |
| matchWarnings | jsonb | No | Array of warning strings |
| status | matchStatusEnum | Yes | Uses existing `match_status` enum: `'new'`, `'viewed'`, `'interested'`, `'dismissed'` |
| revealed | boolean | Yes | Default false |
| tradeData | jsonb | No | `{ volume, frequency, yearsActive }` |
| counterpartyContact | jsonb | No | Contact info — only send to client when `revealed === true` |
| createdAt | timestamp | Yes | `defaultNow()` |
| updatedAt | timestamp | Yes | `defaultNow()` |

**`matchReveals` table:**

| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | `defaultRandom()` |
| profileId | uuid (FK) | Yes | References `profiles.id`, cascade delete |
| matchId | uuid (FK) | Yes | References `matches.id`, cascade delete |
| revealedAt | timestamp | Yes | `defaultNow()` |
| monthKey | text | Yes | Format: `'2026-02'` — for counting reveals per month |

### Add Drizzle relations:
- `profiles` → `many(matches)`, `many(matchReveals)`
- `matches` → `one(profiles)`, `many(matchReveals)`
- `matchReveals` → `one(profiles)`, `one(matches)`

### Create migration: `supabase/migrations/003_matches_schema.sql`
- Create both tables with proper types, indexes, and foreign keys
- Add RLS policies (users can only see their own matches/reveals)
- Add index on `matches.profile_id` and `matches.match_score`
- Add index on `match_reveals.profile_id` and `match_reveals.month_key`
- Add `updated_at` trigger on `matches`

---

## Deliverable 2: Seed Script

### Create: `scripts/seed-matches.ts`

Generate realistic test match data for a given user. Run with `npx tsx scripts/seed-matches.ts`.

The script should:
1. Take a `profileId` as an argument (or use a hardcoded test user ID)
2. Read the user's products and trade interests from DB
3. Generate 15-25 fake matches with:
   - Realistic company names (e.g., "Al Rashid Trading LLC", "XYZ Imports GmbH", "Sakura Foods Co. Ltd")
   - Countries matching the user's trade interests
   - Products overlapping with the user's selected HS codes
   - Scores distributed across tiers: ~5 best (80-100), ~8 great (60-79), ~5 good (50-59)
   - Realistic `matchReasons` arrays (e.g., "Exact product match on 2 categories", "Active buyer — 12 shipments in last 6 months", "Volume compatible with your capacity")
   - Realistic `scoreBreakdown` objects matching the PRD formula
   - Some with `tradeData` and `counterpartyContact`, some without
   - All start with `status: 'new'`, `revealed: false`
4. Insert all matches via Drizzle
5. Log results

**This script is for development only.** It does not need to be production-quality. `any` types are acceptable here since it's in `scripts/`.

---

## Deliverable 3: API Routes

### Create: `src/app/api/matches/route.ts` (GET)

- Authenticate via Supabase
- Query matches for the authenticated user
- Support query params:
  - `tier` — filter by `matchTier` (`best`, `great`, `good`)
  - `country` — filter by `counterpartyCountry`
  - `status` — filter by status (`new`, `viewed`, `interested`, `dismissed`)
  - `sort` — `relevance` (default, by score desc), `recent` (by createdAt desc)
  - `page` and `limit` (default 20 per page)
- **CRITICAL:** Strip `counterpartyContact` from the response for matches where `revealed === false`. Never send contact info for unrevealed matches.
- Return: `{ matches: Match[], total: number, page: number, totalPages: number }`

### Create: `src/app/api/matches/[id]/route.ts` (GET, PATCH)

**GET:**
- Fetch single match by ID for authenticated user
- Auto-update status to `'viewed'` if currently `'new'`
- Strip `counterpartyContact` if not revealed

**PATCH:**
- Accept `{ status: 'interested' | 'dismissed' }` to update match status
- Validate the status value

### Create: `src/app/api/matches/[id]/reveal/route.ts` (POST)

- Authenticate user
- Check reveal eligibility:
  1. Is the match already revealed? If yes, return success (idempotent)
  2. Is user on free tier? (`profile.plan === 'free'`)
  3. Count reveals this month: `matchReveals WHERE profileId = ? AND monthKey = ?`
  4. If count >= 3 and free tier: return `{ error: 'Reveal limit reached', remaining: 0 }` with status 403
- If eligible:
  1. Set `matches.revealed = true`
  2. Insert into `matchReveals` with current `monthKey`
  3. Return the full match including `counterpartyContact`
- Return: `{ match: Match, reveals: { used: number, remaining: number, total: 3 } }`

---

## Deliverable 4: Matches Page

### Create: `src/app/(dashboard)/matches/page.tsx`

Server Component. Auth + onboarding guards (same pattern as dashboard/profile).

Query all matches for the user. Display as a list of match cards.

### Create: `src/components/matches/MatchCard.tsx` (Client Component)

Each card shows:
- **Match tier badge** — colored pill:
  - "Best Match" → `bg-blue-100 text-bmn-blue`
  - "Great Match" → `bg-teal-100 text-teal-700`
  - "Good Match" → `bg-gray-100 text-gray-600`
- **Company name** — bold
- **Location** — `counterpartyCity, counterpartyCountry` (or just country if no city)
- **Matched products** — comma-separated list from `matchedProducts` array
- **Match reasons** — first 2 reasons from `matchReasons` array, preceded by checkmark icons
- **Status indicator** — small dot: blue for `new`, gray for `viewed`, green for `interested`
- **Action buttons:**
  - "View Details" → expands or navigates (for now, just navigate to `/matches/[id]`)
  - "Interested" / "Dismiss" → calls PATCH API

Card style: `bg-white rounded-xl border border-bmn-border p-6 shadow-sm hover:shadow-md transition-shadow`

### Create: `src/app/(dashboard)/matches/[id]/page.tsx`

Match detail page. Shows full match information:
- All match reasons with checkmark icons
- Match warnings (if any) with warning icons
- Trade data section (volume, frequency, years active) — if available
- **Business Details section:**
  - If `revealed === true`: show `counterpartyContact` (name, email, phone, website)
  - If `revealed === false`: show a locked/blurred card with:
    - "Unlock Business Details"
    - Remaining reveals count: "X of 3 free reveals remaining this month"
    - Unlock button that calls POST `/api/matches/[id]/reveal`
    - After unlock: refresh and show contact info
- Back button to `/matches`

### Create: `src/components/matches/RevealGate.tsx` (Client Component)

The gating component for unrevealed matches:
- Shows a blurred/overlay card placeholder
- "Unlock Business Details" heading
- Remaining reveals counter
- Unlock button (calls reveal API, shows loading state)
- After reveal: disappears and shows the contact info
- When limit reached: show "Upgrade to Pro for unlimited reveals" (disabled button, no upgrade flow yet)

---

## Deliverable 5: Dashboard Enhancement

### Update: `src/app/(dashboard)/dashboard/page.tsx`

Replace the placeholder card with real stat cards and recent matches:

**Stat cards row (3 cards):**
1. **Profile Completion** — calculate from filled fields (trade role, products count, countries count, company name, certifications count). Show as percentage.
2. **Matches Found** — count of matches with score >= 50
3. **Active Campaigns** — hardcode `0` for now (campaigns not built yet)

**Recent Matches section:**
- Show top 5 matches sorted by score
- Use a compact version of MatchCard (no action buttons, just name/country/tier/products)
- "View All Matches" link to `/matches`

---

## Deliverable 6: Enable Sidebar Links

### Update: `src/components/dashboard/DashboardNav.tsx`

- Enable the "Matches" link — change `href` from `null` to `/matches`, remove disabled styling
- "Campaigns" stays disabled

---

## Constraints

- No new npm dependencies
- `matchScore` and `scoreBreakdown` must NEVER appear in any frontend component or API response to the client. These are internal fields only. The API must strip them before returning.
- All API routes must authenticate via Supabase and verify the match belongs to the requesting user
- Icons from `lucide-react` only
- Follow existing design system

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # New/modified files: 0 errors, 0 warnings
npm run ralph:scan     # Must pass — no secrets, no P0 security issues
npx tsx scripts/seed-matches.ts   # Must complete without errors
```

All four gates must pass. Zero errors, zero warnings on all new/modified files.

**Security note for this task:** The reveal API handles monetization-adjacent logic (free tier gating). Ralph Protocol compliance is especially critical here — ensure no bypass vectors exist (e.g., direct DB access via API, match ownership not verified, contact data leaking in unrevealed responses).

Update `docs/governance/project_ledger.md` under Block 3.1. Mark as **`SUBMITTED`**.
