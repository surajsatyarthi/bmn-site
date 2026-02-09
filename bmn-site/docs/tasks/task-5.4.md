# Task 5.4 — Admin Dashboard (Internal Tools)

**Block:** 5.4
**Status:** TODO
**Prerequisites:** Block 5.3 COMPLETE
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Build internal admin dashboard to view and manage users, matches, and campaigns. Read-only for Phase 5 (edit capabilities in Phase 6).

---

## Deliverable 1: Admin Authentication & Authorization

### Role-based access control

**Database schema:**
```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Update your admin account
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Middleware:**
```typescript
// src/middleware/admin-auth.ts
export async function requireAdmin(userId: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId)
  })

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }
}
```

**Admin route protection:**
- All routes under `/admin/*` check `requireAdmin()`
- Non-admins get 403 Forbidden

---

## Deliverable 2: Users Management Page

**Route:** `/admin/users`

**UI Components:**
- Search bar (filter by email, name, company)
- User table with columns:
  - Name
  - Email
  - Company
  - Trade Role
  - Onboarding Status (complete/incomplete)
  - Match Count
  - Campaign Count
  - Created At
- Pagination (50 users per page)
- Click row → navigate to `/admin/users/[id]`

**API Route:**
```typescript
// GET /api/admin/users?search=&page=1&limit=50
// Returns: { users: [...], total: number, page: number }
```

---

## Deliverable 3: User Detail Page

**Route:** `/admin/users/[id]`

**Sections:**

**1. User Info Card**
- Full name, email, phone, company
- Trade role, onboarding completion %
- Created date, last login

**2. Profile Data**
- Products (HS codes)
- Target markets
- Certifications
- Business details

**3. Matches Tab**
- List of all matches for this user
- Match tier, country, revealed status
- Link to match detail

**4. Campaigns Tab**
- List of campaigns this user is in
- Campaign status, created date
- Link to campaign detail

**No edit functionality** in Phase 5 (read-only).

---

## Deliverable 4: Matches Management Page

**Route:** `/admin/matches`

**UI Components:**
- Filter by: revealed status, tier, country
- Match table with columns:
  - User (profile name)
  - Counterparty Company
  - Country
  - Tier (Best/Great/Good)
  - Revealed (Yes/No)
  - Created At
- Pagination (50 matches per page)
- Click row → navigate to `/admin/matches/[id]`

**API Route:**
```typescript
// GET /api/admin/matches?tier=&revealed=&page=1
// Returns: { matches: [...], total: number }
```

---

## Deliverable 5: Campaigns Management Page

**Route:** `/admin/campaigns`

**UI Components:**
- Filter by: status (draft/active/paused/completed)
- Campaign table with columns:
  - User (profile name)
  - Campaign Name
  - Status
  - Emails Sent
  - Responses
  - Created At
- Pagination (50 campaigns per page)
- Click row → navigate to `/admin/campaigns/[id]`

**API Route:**
```typescript
// GET /api/admin/campaigns?status=&page=1
// Returns: { campaigns: [...], total: number }
```

---

## Deliverable 6: Admin Navigation

**Layout:** `/admin/layout.tsx`

**Sidebar navigation:**
- Dashboard (overview stats)
- Users
- Matches
- Campaigns
- Logout

**Header:**
- Admin badge/indicator
- User dropdown (logout)

---

## Deliverable 7: Admin Dashboard (Overview)

**Route:** `/admin` (dashboard home)

**Stats Cards:**
1. Total Users (with growth %)
2. Total Matches (revealed vs unrevealed)
3. Total Campaigns (active vs completed)
4. Recent Activity (last 10 user signups, match reveals, campaign launches)

**Charts (optional for Phase 5, nice-to-have):**
- User signups over time (last 30 days)
- Match reveals over time
- Campaign performance

---

## Constraints

- **Read-only:** No create/edit/delete in Phase 5
- **Admin only:** 403 for non-admin users
- **No PII exposure:** Admin can see data, but don't log sensitive info
- **Pagination required:** Don't load all users/matches at once
- **Mobile not required:** Admin dashboard is desktop-only

---

## Evidence Required

Save to `docs/evidence/block-5.4/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| Admin dashboard screenshots | `admin-overview.png`, `admin-users.png`, `admin-user-detail.png`, `admin-matches.png`, `admin-campaigns.png` |
| 403 error screenshot | `admin-403-non-admin.png` |
| Pagination screenshot | `admin-pagination.png` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

**Manual tests:**
1. Login as admin → access /admin → see dashboard
2. Login as regular user → access /admin → get 403
3. Search users by email → results appear
4. Click user row → navigate to detail page
5. Pagination works (next/prev buttons)

Update `docs/governance/project_ledger.md` under Block 5.4. Mark as **SUBMITTED**.
