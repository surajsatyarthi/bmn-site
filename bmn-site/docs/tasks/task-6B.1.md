# Task 6B.1 — Trade News Section (Engagement Feature)

**Block:** 6B.1
**Status:** TODO
**Prerequisites:** Block 5.3 COMPLETE (Email Notifications - for news digest emails)
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Add personalized trade news section to dashboard and homepage preview to increase daily active users and platform stickiness.

**Business Impact:**
- Transform from "weekly check-in" to "daily habit" platform
- Target: +40-60% daily visits, +103% session duration, +38-48% 30-day retention
- Cost: $0 infrastructure (free RSS feeds)

---

## Deliverable 1: News Aggregation Backend

### Database Schema

```sql
CREATE TABLE trade_news (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  summary text NOT NULL,
  url text NOT NULL,
  source text NOT NULL, -- 'govt', 'business', 'reddit'
  category text NOT NULL, -- 'policy', 'tariff', 'certification', 'market', 'industry'
  countries text[], -- ['US', 'IN', 'UAE']
  hs_codes text[], -- ['09', '0901', '090111']
  keywords text[], -- extracted for matching
  published_at timestamp NOT NULL,
  fetched_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_trade_news_countries ON trade_news USING GIN (countries);
CREATE INDEX idx_trade_news_hs_codes ON trade_news USING GIN (hs_codes);
CREATE INDEX idx_trade_news_published_at ON trade_news (published_at DESC);
```

### RSS Feed Sources

**Government sources (10+):**
- DGFT India (export policy updates)
- USITC (US trade commission)
- EU Trade Policy
- WTO News
- APEDA (agri products)
- MPEDA (marine products)
- Ministry of Commerce (India)
- CBP (US Customs)
- HMRC (UK Customs)
- Customs.gov.au

**Business sources (5+):**
- Trade Finance Global
- JOC.com (Journal of Commerce)
- Supply Chain Dive
- FreightWaves
- Global Trade Magazine

**Reddit (optional):**
- r/internationaltrade
- r/logistics
- r/ImportExport

### Cron Job

**Route:** `/api/cron/fetch-news`

**Schedule:** Every 6 hours (`0 */6 * * *`)

**Logic:**
1. Fetch RSS feeds from all sources
2. Parse title, summary, URL, publish date
3. Extract keywords using simple keyword matching (countries, HS chapters, certifications)
4. Categorize: policy, tariff, certification, market, industry
5. Deduplicate by URL
6. Insert into `trade_news` table
7. Delete news older than 90 days

**Acceptance:**
- Cron job fetches 100+ news items daily
- Keywords extracted for countries, HS codes
- No duplicate URLs
- Old news auto-deleted

---

## Deliverable 2: Dashboard News Section (Two Tabs)

### Route: `/dashboard`

**Tab 1: "For You" (Personalized)**

**Filtering logic:**
```typescript
// Match news to user profile
const userHsCodes = user.products.map(p => p.hs_code.slice(0, 2)) // Chapter level
const userCountries = user.tradeInterests.map(t => t.country_code)
const userCerts = user.certifications.map(c => c.type)

const personalizedNews = await db.query.tradeNews.findMany({
  where: or(
    arrayOverlaps(tradeNews.hs_codes, userHsCodes),
    arrayOverlaps(tradeNews.countries, userCountries),
    arrayContains(tradeNews.keywords, userCerts)
  ),
  orderBy: desc(tradeNews.published_at),
  limit: 20
})
```

**Display:**
- List of news cards (title, summary, source, category badge, time ago)
- "Read More" link opens article in new tab
- Empty state: "No personalized news yet. Check back soon!"

**Tab 2: "Other News" (General)**

**Filtering logic:**
```typescript
// Show all news NOT in "For You"
const generalNews = await db.query.tradeNews.findMany({
  where: and(
    not(arrayOverlaps(tradeNews.hs_codes, userHsCodes)),
    not(arrayOverlaps(tradeNews.countries, userCountries))
  ),
  orderBy: desc(tradeNews.published_at),
  limit: 20
})
```

**Display:**
- Same card design as "For You"
- Shows news about other countries/products for discovery

**User Actions:**
- Dismiss news (sets user preference to hide)
- Save for later (Phase 7 feature)

**Acceptance:**
- Two tabs render correctly
- Personalized news matches user's HS codes + countries
- General news shows other topics
- Mobile responsive (375px)
- Dashboard load time <2s with news

---

## Deliverable 3: Homepage News Preview + Industries Section

### Route: `/` (Landing page)

**Section 1: Latest Trade News (Below "How It Works")**

**Display:**
- Heading: "Latest Trade News & Insights"
- Show 5 latest news items (mix of categories)
- Each card: Title, summary (truncated to 100 chars), category badge
- "Sign Up to Read More" CTA (content gate)
- Clicking article → `/login` with redirect back

**Section 2: Industries We Cover (Below Stats)**

**Display:**
- Heading: "Industries & Products"
- Grid of 9 industry icons (similar to countries section on existing landing page)
- Icons:
  - 🌾 Agriculture & Food
  - 👕 Textiles & Apparel
  - ⚙️ Engineering Goods
  - 💊 Pharma & Healthcare
  - 💎 Gems & Jewelry
  - 🧪 Chemicals
  - 🪵 Wood & Furniture
  - 🏗️ Construction Materials
  - 📱 Electronics
- Clicking icon → `/signup` with product pre-selected

**Acceptance:**
- News preview shows 5 items
- Content gate redirects to signup
- Industries grid responsive (3 cols mobile, 4 cols tablet, 5 cols desktop)
- Icons match BMN design system

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/news` | GET | List news with filters (personalized, general, category) |
| `/api/news/[id]` | GET | Get single news item |
| `/api/cron/fetch-news` | GET | Cron job to fetch RSS feeds |

---

## Constraints

- News fetched every 6 hours (not real-time)
- Max 20 news items per tab
- News older than 90 days auto-deleted
- No user-generated content (RSS only)
- Desktop + mobile responsive required
- Dashboard load time must stay <2s

---

## Evidence Required

Save to `docs/evidence/block-6B.1/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| RSS feed inventory | `rss-sources.txt` (10+ govt, 5+ business) |
| Cron job logs | `cron-fetch-news.txt` (100+ items) |
| Dashboard "For You" tab | `dashboard-news-for-you.png` |
| Dashboard "Other News" tab | `dashboard-news-other.png` |
| Homepage news preview | `homepage-news-preview.png` |
| Homepage industries section | `homepage-industries.png` |
| Mobile screenshots | `mobile-news-for-you.png`, `mobile-news-other.png`, `mobile-homepage-news.png` |
| Performance test | `lighthouse-performance.png` (≥90 score) |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

**Manual tests:**
1. Run cron job → verify 100+ news items fetched
2. Login as user with products → verify "For You" shows relevant news
3. Check "Other News" tab → verify shows different content
4. Homepage preview → verify 5 items visible, signup gate works
5. Test on mobile 375px → verify responsive
6. Lighthouse test → verify Performance ≥90

**Performance requirements:**
- Dashboard load <2s with news section
- Lighthouse Performance ≥90
- No layout shift when news loads

Update `docs/governance/project_ledger.md` under Block 6B.1. Mark as **SUBMITTED**.
