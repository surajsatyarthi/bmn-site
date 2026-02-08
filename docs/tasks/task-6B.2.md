# Task 6B.2 — Dashboard News Section (Phase 6B)

**Block:** 6B.2
**Status:** TODO
**Prerequisites:** Block 6B.1 PASSED (News backend ready)
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Add a two-tab news section to the dashboard showing personalized trade news ("For You") and general industry news ("Other News"). This increases daily visits by giving users fresh content beyond weekly match updates.

**Why:** Users currently only check BMN when new matches arrive (weekly). Daily news creates a daily habit loop.

---

## Deliverable 1: Dashboard News Section UI

### Location: `/dashboard` page

**Layout:**
```
┌─────────────────────────────────────────┐
│  Dashboard Stats (existing)              │
├─────────────────────────────────────────┤
│  📰 Trade News                           │
│  ┌──────────┬──────────┐                │
│  │ For You  │Other News│ ← Tabs         │
│  └──────────┴──────────┘                │
│  ┌─────────────────────────────────┐    │
│  │ [News Card 1]                   │    │
│  │ Title, summary, source, date    │    │
│  ├─────────────────────────────────┤    │
│  │ [News Card 2]                   │    │
│  └─────────────────────────────────┘    │
│  Show More ↓                             │
└─────────────────────────────────────────┘
```

**Implementation:**
- Use Radix UI Tabs for tab component
- "For You" tab: Fetch news matched to user's profile (HS codes, countries)
- "Other News" tab: Fetch latest general trade news (all categories)
- Infinite scroll or "Load More" button (20 items per page)

**Acceptance:**
- Two tabs render correctly
- "For You" shows only relevant news (verify user with HS code "01" sees agriculture news)
- "Other News" shows all recent trade news
- Mobile responsive at 375px

---

## Deliverable 2: News Card Component

### Component: `src/components/news/NewsCard.tsx`

**Props:**
```typescript
interface NewsCardProps {
  id: string
  title: string
  summary: string
  sourceName: string
  publishedAt: Date
  imageUrl?: string
  categories: string[]
  onDismiss?: () => void
  onSave?: () => void
}
```

**Design:**
```
┌────────────────────────────────────┐
│ 📰 WTO News              [×][★]    │ ← Dismiss & Save buttons
│ New Tariff Exemptions for Tech    │ ← Title
│ Summary text lorem ipsum dolor... │ ← Summary (2 lines max)
│ 🏷️ Policy, US, Tech  •  2h ago    │ ← Categories + timestamp
└────────────────────────────────────┘
```

**Features:**
- Dismiss button (×): Hides card, saves to `dismissed_news` table
- Save button (★): Saves to `saved_news` table for later reading
- Click card → navigates to news detail page
- Relative timestamps ("2h ago", "yesterday", "1 week ago")

**Acceptance:**
- Card displays all fields correctly
- Dismiss removes card from view (persists in DB)
- Save button toggles saved state
- Clicking card navigates to `/news/[id]`

---

## Deliverable 3: News Detail Page

### Route: `/news/[id]`

**Content:**
- Full article title
- Source name + published date
- Categories badges
- Full content (if available) or summary
- "Read Full Article" link (opens `source_url` in new tab)
- Related news section (3-5 similar articles)

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Trade News - BMN",
  description: "Latest trade news and insights"
}
```

**Acceptance:**
- Page renders full news details
- External link opens in new tab
- Related news shows articles with overlapping categories/countries
- Mobile responsive

---

## Deliverable 4: Personalization API

### API Route: `src/app/api/news/personalized/route.ts`

**Endpoint:** `GET /api/news/personalized`

**Query Params:**
- `tab`: "for-you" | "other-news"
- `page`: number (pagination)
- `limit`: number (default 20)

**Behavior:**
1. Get authenticated user's profile
2. If `tab === "for-you"`:
   - Query `trade_news` WHERE hs_codes/countries match user's profile
   - Order by relevance_score DESC, published_at DESC
3. If `tab === "other-news"`:
   - Query `trade_news` (all)
   - Order by published_at DESC
4. Exclude dismissed news for this user
5. Return paginated results

**Acceptance:**
- Returns 20 items per page
- "For You" tab only shows relevant news
- Dismissed news is filtered out
- Pagination works correctly

---

## Deliverable 5: User Actions (Dismiss & Save)

### API Routes:

**POST /api/news/[id]/dismiss**
- Marks news as dismissed for current user
- Stores in `user_news_actions` table (user_id, news_id, action: 'dismissed')

**POST /api/news/[id]/save**
- Marks news as saved for current user
- Stores in `user_news_actions` table (user_id, news_id, action: 'saved')

**GET /api/news/saved**
- Returns all saved news for current user
- Used for "Saved Articles" page (future)

### Schema Addition:
```sql
CREATE TABLE user_news_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  news_id UUID REFERENCES trade_news(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('dismissed', 'saved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, news_id, action)
);
```

**Acceptance:**
- Dismiss action hides news from feed
- Save action marks article as saved
- User can save AND dismiss same article (different actions)

---

## Deliverable 6: Empty States

### Scenarios:

**"For You" tab (no relevant news):**
```
📰 No personalized news yet

We're still learning about trade news in your industry.
Check back soon or explore Other News.

[Browse Other News →]
```

**"Other News" tab (no news fetched):**
```
📰 No news available

Our news feed is still loading fresh content.
Check back in a few hours.
```

**Acceptance:**
- Empty states show friendly messages
- CTA buttons work correctly
- No blank screens

---

## Deliverable 7: Mobile Optimization

### Requirements:
- News cards stack vertically on mobile
- Tabs are touch-friendly (44px min height)
- Text truncates properly on small screens
- Images are lazy-loaded

**Acceptance:**
- Test at 375px viewport (iPhone SE)
- No horizontal scroll
- All interactions work on touch
- Performance: <2s load time

---

## Constraints

- **No external API calls from frontend** — all news fetched via internal API
- **Pagination required** — don't load all news at once
- **Accessibility** — aria-labels on dismiss/save buttons, keyboard navigation
- **Performance** — Lighthouse score ≥90

---

## Evidence Required

Save all to `docs/evidence/block-6B.2/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Dashboard screenshot (For You tab) | `dashboard-for-you.png` |
| Dashboard screenshot (Other News tab) | `dashboard-other-news.png` |
| News detail page screenshot | `news-detail.png` |
| Mobile screenshots (375px) | `mobile-news-*.png` |
| Empty state screenshots | `empty-state-*.png` |
| Test output | `test-output.txt` |
| Self-audit | `self-audit.txt` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

Update ledger under Block 6B.2. Mark as **`SUBMITTED`**.
