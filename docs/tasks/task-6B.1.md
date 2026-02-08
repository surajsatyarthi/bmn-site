# Task 6B.1 — News Aggregation Backend (Phase 6B)

**Block:** 6B.1
**Status:** TODO
**Prerequisites:** Phase 6 (Transactional Emails) COMPLETE
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Build the backend infrastructure for aggregating trade news from RSS feeds, social media, and business news sources. This backend will power both the dashboard news section and homepage news preview.

**Why:** BMN currently has no daily-refresh content. News transforms the platform from "weekly check-in" (for matches) to "daily habit" (for news + matches).

---

## Deliverable 1: Database Schema

### Table: `trade_news`

```sql
CREATE TABLE trade_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  source_url TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL, -- e.g., "WTO", "Commerce.gov", "TradeReady"
  published_at TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Categorization
  categories TEXT[] NOT NULL, -- e.g., ["policy", "tariffs", "trade-agreement"]
  countries TEXT[] NOT NULL, -- ISO country codes e.g., ["US", "IN", "CN"]
  hs_codes TEXT[], -- Relevant HS code prefixes e.g., ["01", "08", "87"]
  keywords TEXT[] NOT NULL, -- Extracted keywords for matching
  
  -- Metadata
  image_url TEXT,
  read_time_minutes INT, -- Estimated reading time
  relevance_score FLOAT, -- Algorithm-calculated relevance (0-1)
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trade_news_published ON trade_news(published_at DESC);
CREATE INDEX idx_trade_news_countries ON trade_news USING GIN(countries);
CREATE INDEX idx_trade_news_hs_codes ON trade_news USING GIN(hs_codes);
CREATE INDEX idx_trade_news_keywords ON trade_news USING GIN(keywords);
```

**Migration File:** `bmn-site/drizzle/migrations/XXXX_add_trade_news_table.sql`

**Acceptance:**
- Drizzle schema updated in `src/lib/db/schema.ts`
- Migration runs without errors
- All indexes created

---

## Deliverable 2: RSS Feed Research

### Task: Antigravity Researches Data Sources

**Goal:** Identify 15+ free RSS feeds covering trade news across:
1. **Government sources (10+):** WTO, US Commerce, DGFT India, UK Gov Trade, etc.
2. **Business news (5+):** Reuters Trade, Bloomberg Supply Chain, TradeReady, etc.
3. **Social/Community (optional):** Reddit r/import_export, Twitter trade hashtags

**Deliverable File:** `docs/governance/news-sources-inventory.md`

**Required Fields Per Source:**
- Source name
- RSS feed URL
- Update frequency (hourly/daily/weekly)
- Content quality (High/Medium/Low)
- Geographic focus
- Topic coverage (tariffs, policy, shipping, etc.)

**Acceptance:**
- 10+ government sources documented
- 5+ business news sources documented
- Each source tested (fetched at least 1 article successfully)

**Sample Sources to Start With:**
- https://www.wto.org/english/news_e/rss_e.htm
- https://www.commerce.gov/news/rss.xml
- https://www.trade.gov/news-rss
- https://www.dgft.gov.in/ (check for RSS)
- Bloomberg RSS (verify free tier)

---

## Deliverable 3: RSS Parser Service

### Service: `src/services/news-aggregator.ts`

**Functions:**

```typescript
export async function fetchRSSFeed(feedUrl: string): Promise<NewsItem[]>
export async function extractKeywords(content: string): Promise<string[]>
export async function categorizeNews(title: string, content: string): Promise<string[]>
export async function detectCountries(content: string): Promise<string[]>
export async function detectHSCodes(content: string): Promise<string[]>
export async function calculateRelevance(newsItem: NewsItem, userProfile: Profile): Promise<number>
```

**Libraries:**
- `rss-parser` for RSS parsing
- `natural` or `compromise` for keyword extraction (NLP)
- Country detection: regex patterns for country names + ISO codes
- HS code detection: regex for 2-digit HS prefixes (01-99)

**Acceptance:**
- Fetches at least 1 feed successfully
- Extracts title, summary, link, published date
- Keyword extraction returns 5-15 relevant keywords per article
- Country detection finds at least 1 country mention (if present)
- Unit tests for all functions

---

## Deliverable 4: Cron Job Setup

### API Route: `src/app/api/cron/fetch-news/route.ts`

**Endpoint:** `POST /api/cron/fetch-news`

**Behavior:**
1. Fetch all RSS feeds from config (or DB table `news_sources`)
2. Parse each feed
3. For each new article:
   - Extract keywords, countries, HS codes
   - Categorize article
   - Insert into `trade_news` table (skip duplicates by `source_url`)
4. Log results

**Rate Limiting:** Use existing `rateLimit` utility to prevent abuse

**Vercel Cron Config:** `vercel.json`
```json
{
  "crons": [{
    "path": "/api/cron/fetch-news",
    "schedule": "0 */6 * * *"
  }]
}
```
(Runs every 6 hours)

**Acceptance:**
- Manual POST to `/api/cron/fetch-news` fetches 50+ news items
- Duplicate articles are skipped (no duplicate `source_url`)
- Logs show: "Fetched 123 articles, inserted 87 new, skipped 36 duplicates"

---

## Deliverable 5: Keyword Matching Algorithm

### Function: `matchNewsToProfile(profile: Profile): Promise<NewsItem[]>`

**Logic:**
1. Get user's HS codes, target countries, certifications
2. Query `trade_news` WHERE:
   - `hs_codes` overlaps with user's products (array intersection)
   - OR `countries` overlaps with user's target markets
   - OR `keywords` contains certification names
3. Order by `published_at DESC`
4. Calculate `relevance_score` per article:
   - +0.5 if HS code match
   - +0.3 if country match
   - +0.2 if keyword match
5. Return top 20 articles with score > 0.3

**Acceptance:**
- User with HS code "01" sees news tagged with "01"
- User targeting US sees news tagged with ["US"]
- Relevance scoring prioritizes multi-match articles

---

## Deliverable 6: Admin Verification Tool

### Page: `/admin/news`

**Features:**
- Table showing all fetched news items
- Filters: source, date range, categories, countries
- "Refresh Now" button to trigger manual fetch
- Stats: total articles, sources active, last fetch time

**Acceptance:**
- Admin can view all news items
- Admin can manually trigger cron job
- Stats update in real-time

---

## Constraints

- **No paid APIs** — only free RSS feeds, no NewsAPI or paid aggregators
- **Storage limit** — delete news older than 90 days (cron cleanup job)
- **Performance** — cron job completes in <2 minutes
- **Deduplication** — use `source_url` as unique constraint

---

## Evidence Required

Save all to `docs/evidence/block-6B.1/`:

| Evidence | File |
|----------|------|
| Gate output (build + lint + ralph + test) | `gates.txt` |
| Pre-submission gate run | `pre-submission-gate.txt` |
| News sources research | `news-sources-inventory.md` |
| Migration output | `migration-output.txt` |
| Cron job test output | `cron-test-output.txt` |
| Database screenshot (pgAdmin showing trade_news table) | `db-screenshot.png` |
| Admin news page screenshot | `admin-news.png` |
| Test output | `test-output.txt` |
| Self-audit checklist | `self-audit.txt` |

**No evidence, no PASS.**

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # 0 errors
npm run ralph:scan     # Must show 6/6 PASSED
npm run test           # All unit tests pass
```

All four gates must pass. Cron job must successfully fetch 50+ articles.

Update `docs/governance/project_ledger.md` under Block 6B.1. Mark as **`SUBMITTED`**.
