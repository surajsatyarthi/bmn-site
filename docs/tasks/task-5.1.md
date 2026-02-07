# Task 5.1 — Ops Dashboard: Admin Auth, User Management & Match Upload

**Block:** 5.1
**Status:** TODO
**Prerequisites:** Phase 4 COMPLETE
**PRD Reference:** Section 17, Phase 6 tasks 6.1-6.3

---

## Objective

Build the internal ops dashboard that allows the BMN team to manage clients, view profiles, and upload buyer matches. This is the critical operational tool — without it, the team cannot deliver the "Done-For-You" service described in PRD Section 16.

The admin dashboard is a **separate route group** (`/admin/*`) accessible only to users with `isAdmin = true`. It reuses the existing Supabase auth — no separate login system.

---

## Deliverable 1: Schema — Add `isAdmin` to profiles

### Update: `src/lib/db/schema.ts`

Add to the `profiles` table:

```typescript
isAdmin: boolean('is_admin').default(false).notNull(),
```

Place it after `plan` and before `createdAt`.

### Create: `supabase/migrations/006_add_admin_flag.sql`

```sql
ALTER TABLE public.profiles
  ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
```

Simple, non-destructive migration. No RLS changes needed — the existing SELECT policy already lets users read their own profile, and admin checks happen at the application layer.

---

## Deliverable 2: Admin Script — `scripts/make-admin.ts`

**Replace** the existing legacy `scripts/make-admin.ts` with a working version that uses the current schema.

Usage: `npx tsx scripts/make-admin.ts <email>`

The script should:
1. Take an email address as CLI argument
2. Look up the user in Supabase auth (`supabase.auth.admin.listUsers()` or direct DB query)
3. Find the matching profile
4. Set `isAdmin = true`
5. Log success with user name and email
6. If no user found, log error and exit 1

**Also create:** `scripts/remove-admin.ts` — same thing but sets `isAdmin = false`.

---

## Deliverable 3: Admin Middleware & Layout

### Create: `src/lib/admin.ts`

Helper function to check admin status:

```typescript
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  if (!profile?.isAdmin) redirect('/dashboard');

  return { user, profile };
}
```

### Create: `src/app/(admin)/layout.tsx`

Admin layout with:
- Top bar: "BMN Admin" title (left), admin user name (right), "Back to Dashboard" link, "Logout" button
- Sidebar navigation:
  - Users (`/admin/users`)
  - Upload Matches (`/admin/matches/upload`)
  - Campaigns (`/admin/campaigns`) — placeholder for Block 5.2
- Content area

Style: Use `bg-gray-900` sidebar with white text for visual distinction from the client dashboard. The admin UI should look clearly different from the client-facing UI so ops team never confuses the two.

### Create: `src/components/admin/AdminNav.tsx` (Client Component)

Sidebar navigation with active link detection (same pattern as DashboardNav but dark theme).

---

## Deliverable 4: Admin Dashboard Home — `/admin`

### Create: `src/app/(admin)/admin/page.tsx`

Server Component. Calls `requireAdmin()`.

Shows 4 stat cards:

| Stat | Query | Display |
|---|---|---|
| Total Users | `count(*)` from profiles | Number |
| Onboarding Complete | `count(*)` where `onboardingCompleted = true` | Number + percentage |
| Total Matches | `count(*)` from matches | Number |
| Active Campaigns | `count(*)` from campaigns where `status = 'active'` | Number |

Below stats: "Recent Signups" list — last 10 profiles ordered by `createdAt desc`, showing:
- Full name
- Email (query from Supabase auth or store in profile — see note below)
- Trade role
- Onboarding status (completed/step X)
- Signed up date (relative time)
- "View" link to `/admin/users/[id]`

**Email note:** The `profiles` table doesn't store email (it's in Supabase `auth.users`). For the admin dashboard, query `auth.users` via Supabase admin API or add a `email` column to profiles. Simplest approach: use Supabase admin client (`createClient({ supabaseKey: SERVICE_ROLE_KEY })`) to list users, then join with profiles in memory. Do NOT store email in profiles unless needed.

---

## Deliverable 5: User Management — `/admin/users`

### Create: `src/app/(admin)/admin/users/page.tsx`

Server Component. Calls `requireAdmin()`.

**User list table** with columns:
- Name
- Trade Role (exporter/importer/both)
- Company Name (from companies table)
- Products Count
- Matches Count
- Campaigns Count
- Onboarding Status (badge: "Complete" green or "Step X" yellow)
- Joined (date)
- Actions: "View" link

Query: Join profiles with counts from related tables. Use Drizzle subqueries or `sql` template for counts.

**Filters (optional but nice to have):**
- Trade role dropdown
- Onboarding status (complete / in progress)

### Create: `src/app/(admin)/admin/users/[id]/page.tsx`

Server Component. Calls `requireAdmin()`.

**User detail view** showing:

1. **Profile header:** Name, trade role, plan, onboarding status, joined date
2. **Company card:** All company fields (name, type, city, state, IEC, website)
3. **Products list:** All products with HS code, name, trade type
4. **Trade Interests:** Countries with interest type (export_to / import_from)
5. **Certifications:** Type, certificate number, valid until
6. **Matches summary:** Total matches count, breakdown by tier, breakdown by status
7. **Campaigns summary:** Total campaigns, active/draft/completed/paused counts

Each section in a card. Back button to `/admin/users`.

**Important:** This page shows ALL data including `matchScore` and `scoreBreakdown` — admin sees internal data. This is intentional per PRD Section 16.4.

---

## Deliverable 6: Match Upload — `/admin/matches/upload`

### Create: `src/app/(admin)/admin/matches/upload/page.tsx`

Client Component (`'use client'`). Admin-only page for uploading matches.

**Two modes:**

### Mode 1: Single Match Form

A form with fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| User | Select dropdown | Yes | List all users (profileId + name) |
| Counterparty Name | Text input | Yes | Buyer company name |
| Counterparty Country | Text input | Yes | Country name |
| Counterparty City | Text input | No | City |
| Matched Products | JSON textarea | Yes | Array of `{ hsCode, name }` |
| Match Score | Number input (0-100) | Yes | Internal score |
| Match Tier | Select (best/great/good) | Yes | Display tier |
| Score Breakdown | JSON textarea | Yes | `{ productMatch: 30, ... }` |
| Match Reasons | JSON textarea | Yes | Array of strings |
| Match Warnings | JSON textarea | No | Array of strings or null |
| Trade Data | JSON textarea | No | `{ volume, frequency, yearsActive }` |
| Counterparty Contact | JSON textarea | No | `{ name, title, email, phone, website }` |

Submit button: "Upload Match"

### Mode 2: Bulk JSON Upload

A large textarea where the admin pastes a JSON array of match objects. Each object follows the same structure as the single form.

"Upload All" button processes the array.

### Create: `src/app/api/admin/matches/route.ts` (POST)

- Authenticate user via Supabase
- Verify `isAdmin === true` — return 403 if not
- Accept `{ match: MatchInput }` for single or `{ matches: MatchInput[] }` for bulk
- Validate required fields
- Insert into `matches` table via Drizzle
- Return `{ success: true, count: N }`

### Create: `src/app/api/admin/users/route.ts` (GET)

- Admin-only: verify `isAdmin`
- Return list of all profiles with related counts
- Support `?role=` and `?onboarding=` filters

---

## Deliverable 7: Admin API — Users Detail

### Create: `src/app/api/admin/users/[id]/route.ts` (GET)

- Admin-only
- Fetch full profile with all relations (company, products, interests, certifications)
- Include match count by tier and status
- Include campaign count by status
- **Include** `matchScore` and `scoreBreakdown` — admin sees everything

---

## Evidence Required (submit with delivery)

Save all to `docs/evidence/block-5.1/`:

| Evidence | File |
|----------|------|
| Gate output (build + lint + ralph) | `gates.txt` |
| make-admin script output | `make-admin-output.txt` |
| Admin dashboard screenshot | `screenshot-admin-dashboard.png` |
| User list screenshot | `screenshot-admin-users.png` |
| User detail screenshot | `screenshot-admin-user-detail.png` |
| Match upload form screenshot | `screenshot-admin-match-upload.png` |
| API curl: GET /api/admin/users | `api-admin-users.txt` |
| API curl: POST /api/admin/matches (single) | `api-admin-match-upload.txt` |
| API curl: GET /api/admin/users/[id] | `api-admin-user-detail.txt` |

**No evidence, no PASS.**

---

## Constraints

- No new npm dependencies
- Admin routes under `(admin)` route group — completely separate from `(dashboard)`
- All admin API routes MUST verify `isAdmin === true` — 403 for non-admins
- Admin UI uses dark sidebar (`bg-gray-900`) to visually distinguish from client UI
- Admin CAN see `matchScore`, `scoreBreakdown`, and `counterpartyContact` — no gating
- JSON textareas for match data fields — no need for fancy JSON editors
- Icons from `lucide-react` only
- Server Components for all pages except match upload form (needs `useState`)

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # New/modified files: 0 errors, 0 warnings
npm run ralph:scan     # Must pass
```

All three gates must pass. Zero errors, zero warnings on all new/modified files.

Update `docs/governance/project_ledger.md` under Block 5.1. Mark as **`SUBMITTED`**.
