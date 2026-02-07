# Task 4.1 — Campaigns Schema, Seed Data & Display

**Block:** 4.1
**Status:** TODO
**Prerequisites:** Block 3.2 (JSONB remediation) PASSED
**PRD Reference:** Sections 4.5 (Campaigns Page), 5 (Database Schema — `campaigns` table), Phase 3 tasks 3.1-3.6

---

## Objective

Build the campaigns infrastructure: database table, seed script, API routes, and the campaigns listing/detail pages. Campaigns are **read-only dashboards** in this phase — BMN's ops team creates and manages campaigns manually (Section 16 of PRD). The client sees status and metrics only.

This covers PRD Phase 3 items: 3.1 through 3.6 (campaigns) + 3.5 (dashboard campaign section).

---

## Deliverable 1: Schema — `campaigns` table

### Add to `src/lib/db/schema.ts`:

**`campaigns` table:**

| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | `defaultRandom()` |
| profileId | uuid (FK) | Yes | References `profiles.id`, cascade delete |
| name | text | Yes | Campaign display name (e.g., "Basmati Rice — UAE Buyers") |
| targetDescription | text | Yes | Target audience (e.g., "UAE Basmati Rice Importers") |
| status | campaignStatusEnum | Yes | Uses existing `campaign_status` enum: `'draft'`, `'active'`, `'paused'`, `'completed'` |
| emailsSent | integer | Yes | Default 0 |
| emailsOpened | integer | Yes | Default 0 |
| emailsReplied | integer | Yes | Default 0 |
| meetingsBooked | integer | Yes | Default 0 |
| metricsUpdatedAt | timestamp | No | When stats were last batch-updated by ops team |
| startedAt | timestamp | No | When campaign was activated |
| completedAt | timestamp | No | When campaign finished |
| createdAt | timestamp | Yes | `defaultNow()` |
| updatedAt | timestamp | Yes | `defaultNow()` |

### Add Drizzle relations:
- `profiles` → `many(campaigns)` (add to existing `profilesRelations`)
- `campaigns` → `one(profiles)`

---

## Deliverable 2: Migration

### Create: `supabase/migrations/005_campaigns_schema.sql`

**Note:** Number this `005` if Block 3.2's JSONB migration is `004`. If Block 3.2 is skipped or numbered differently, adjust accordingly.

- Create `campaigns` table with proper types, defaults, foreign keys
- Add RLS policies (users can only see their own campaigns)
- Add index on `campaigns.profile_id`
- Add index on `campaigns.status`
- Add `updated_at` trigger
- **INSERT policy:** `WITH CHECK (true)` — campaigns are created by ops/admin, not by users

---

## Deliverable 3: Seed Script

### Create: `scripts/seed-campaigns.ts`

Generate realistic test campaign data for a given user. Run with `npx tsx scripts/seed-campaigns.ts [profileId]`.

The script should:
1. Take a `profileId` as argument (or use first profile in DB)
2. Read the user's products and trade interests from DB
3. Generate 3-5 campaigns with realistic data:
   - **Campaign 1:** Active, 2-4 weeks old, good metrics (150+ sent, 30-40% open, 4-6% reply, 1-3 meetings)
   - **Campaign 2:** Active, 1-2 weeks old, early stage (50-80 sent, 25-35% open, 2-4% reply, 0-1 meetings)
   - **Campaign 3:** Completed, 6-8 weeks old, full run (300+ sent, 35% open, 5% reply, 4-6 meetings)
   - **Campaign 4:** Draft, not started yet (all metrics 0, no startedAt)
   - **Campaign 5 (optional):** Paused, partial run
4. Campaign names should reference the user's actual products and target countries (e.g., "{ProductName} — {Country} Buyers")
5. `metricsUpdatedAt` should be within last 24 hours for active campaigns
6. Insert all campaigns via Drizzle
7. Log results

**This script is for development only.** `any` types are acceptable.

---

## Deliverable 4: API Routes

### Create: `src/app/api/campaigns/route.ts` (GET)

- Authenticate via Supabase
- Query campaigns for the authenticated user
- Support query params:
  - `status` — filter by campaign status (`draft`, `active`, `paused`, `completed`)
  - `sort` — `recent` (default, by createdAt desc), `active_first` (active first, then by createdAt)
- Return: `{ campaigns: Campaign[] }`

### Create: `src/app/api/campaigns/[id]/route.ts` (GET)

- Authenticate user
- Fetch single campaign by ID
- Verify campaign belongs to authenticated user
- Return: `{ campaign: Campaign }`

**Note:** No PATCH/POST/DELETE for campaigns — they are managed by ops team only in this phase.

---

## Deliverable 5: Campaigns Page

### Create: `src/app/(dashboard)/campaigns/page.tsx`

Server Component. Auth + onboarding guards (same pattern as dashboard/matches).

Query all campaigns for the user. Display as a list.

**Page layout:**
- Heading: "Your Campaigns"
- Subheading: "Outreach campaigns BMN runs on your behalf"
- Stats row: Active count, Total emails sent (sum), Total replies (sum)
- Campaign cards list
- Empty state: "No campaigns yet. Once you mark matches as 'Interested', our team will create targeted outreach campaigns."

### Create: `src/components/campaigns/CampaignCard.tsx` (Client Component)

Each card shows:
- **Campaign name** — bold
- **Target description** — subtitle text
- **Status badge** — colored pill:
  - `active` → green (`bg-green-100 text-green-700`)
  - `paused` → yellow (`bg-yellow-100 text-yellow-700`)
  - `completed` → gray (`bg-gray-100 text-gray-600`)
  - `draft` → blue (`bg-blue-100 text-bmn-blue`)
- **4 metric boxes** in a row:
  - Sent (total count)
  - Opened (count + percentage)
  - Replied (count + percentage)
  - Meetings (count)
- **"Last updated"** timestamp — show `metricsUpdatedAt` formatted as relative time or date
- **"View Details"** link → navigates to `/campaigns/[id]`

Card style: `bg-white rounded-xl border border-bmn-border p-6 shadow-sm`

### Create: `src/app/(dashboard)/campaigns/[id]/page.tsx`

Campaign detail page. Server Component. Auth + onboarding + ownership guards.

Shows:
- Back button to `/campaigns`
- Campaign name + status badge
- Target description
- **Metrics section** — 4 large stat cards (same as card but bigger):
  - Emails Sent — total count
  - Opened — count + percentage of sent
  - Replied — count + percentage of sent
  - Meetings Booked — count + percentage of sent
- **Timeline section:**
  - Created: `createdAt`
  - Started: `startedAt` (if present)
  - Completed: `completedAt` (if present)
  - Last metrics update: `metricsUpdatedAt`
- **"Last updated: {date}"** notice at bottom

---

## Deliverable 6: Dashboard Campaign Section

### Update: `src/app/(dashboard)/dashboard/page.tsx`

Add a "Campaign Activity" section below the "Recent Matches" section:

- Query campaigns for the user (limit 3, active first, then recent)
- Show compact campaign cards (name, status badge, sent/replied counts)
- "View All Campaigns" link to `/campaigns`
- If no campaigns: "No campaigns yet. Mark matches as 'Interested' to get started."

### Update: `src/components/dashboard/DashboardNav.tsx`

- Enable the "Campaigns" link — change `href` from `null` to `/campaigns`, remove disabled styling
- Update the icon if desired (BarChart3 is fine, or switch to Megaphone per PRD)
- Add active link detection for `/campaigns` and `/campaigns/*`

---

## Constraints

- No new npm dependencies
- All API routes must authenticate via Supabase and verify the campaign belongs to the requesting user
- Campaign data is **read-only** from the client perspective — no create/update/delete APIs for users
- Icons from `lucide-react` only
- Follow existing design system (card styles, typography, tier badge patterns)
- Percentages: calculate `opened/sent * 100`, `replied/sent * 100`, `meetings/sent * 100`. Handle division by zero (show 0% if sent is 0).

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # New/modified files: 0 errors, 0 warnings
npm run ralph:scan     # Must pass — no secrets, no P0 security issues
npx tsx scripts/seed-campaigns.ts   # Must complete without errors
```

All four gates must pass. Zero errors, zero warnings on all new/modified files.

Update `docs/governance/project_ledger.md` under Block 4.1. Mark as **`SUBMITTED`**.
