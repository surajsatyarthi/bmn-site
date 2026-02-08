# Research Task: Trade News Data Sources

**Assigned To:** Antigravity  
**Prerequisites:** Block 6B.1 task assignment  
**Deadline:** Before implementation begins (research phase)  
**Deliverable:** Comprehensive list of RSS feeds, APIs, and data sources

---

## Objective

Identify and validate **free** data sources for two types of trade news:

1. **Personalized News** (filtered by user's products/countries)
2. **General Trade News** (broad industry coverage)

---

## Research Scope

### Category 1: Government & Official Sources

**Priority:** P0 (Required for MVP)

Research these government/official sites for RSS feeds:

| Country/Org | Website | RSS Feed URL | Status | Notes |
|-------------|---------|--------------|--------|-------|
| **US Dept of Commerce** | commerce.gov | TBD | ⏳ Research | Check news section |
| **USTR (Trade Rep)** | ustr.gov | TBD | ⏳ Research | Press releases feed |
| **US Customs (CBP)** | cbp.gov | TBD | ⏳ Research | Media releases |
| **India Min of Commerce** | commerce.gov.in | TBD | ⏳ Research | Feed may exist |
| **DGFT (India)** | dgft.gov.in | TBD | ⏳ Research | Check trade policy section |
| **EU Trade** | ec.europa.eu/trade | TBD | ⏳ Research | News RSS confirmed |
| **WTO** | wto.org | TBD | ⏳ Research | News feed available |
| **UNCTAD** | unctad.org | TBD | ⏳ Research | UN trade body |

**Deliverable:** List of working RSS URLs + sample content (test fetch)

---

### Category 2: Chambers of Commerce

**Priority:** P1 (Recommended for MVP)

Research these chambers for RSS/news APIs:

| Organization | Website | Access Method | Status | Notes |
|--------------|---------|---------------|--------|-------|
| **ICC (Intl)** | iccwbo.org | RSS | ⏳ Research | Check news section |
| **FICCI (India)** | ficci.in | Scraping? | ⏳ Research | May need manual parsing |
| **CII (India)** | cii.in | Scraping? | ⏳ Research | Press release section |
| **US Chamber** | uschamber.com | RSS | ⏳ Research | Latest news feed |
| **USCIB** | uscib.org | RSS | ⏳ Research | News/updates |

**Deliverable:** RSS URLs OR scraping strategy (if no RSS available)

---

### Category 3: Business News (General Trade)

**Priority:** P1 (For "Other News" tab)

Research these business news sites:

| Source | Website | RSS Available? | Status | Notes |
|--------|---------|----------------|--------|-------|
| **Bloomberg Trade** | bloomberg.com/news/economy | TBD | ⏳ Research | May be paywalled |
| **Reuters Business** | reuters.com/business | TBD | ⏳ Research | RSS likely available |
| **The Loadstar** | theloadstar.com | TBD | ⏳ Research | Shipping/logistics news |
| **Trade Finance Global** | tradefinanceglobal.com | TBD | ⏳ Research | Free RSS? |
| **World Bank News** | worldbank.org/news | TBD | ⏳ Research | Economic indicators |
| **IMF News** | imf.org/news | TBD | ⏳ Research | Global economic news |

**Deliverable:** Working RSS feeds (free only, skip paywalled sources)

---

### Category 4: Social Media APIs

**Priority:** P2 (Optional, risky due to API limits)

**Twitter/X API:**
- Free tier: 1500 tweets/month (very limited)
- Research: Can we monitor specific govt accounts without exceeding limits?
- Target accounts: @CommerceGov, @DGCIS_India, @EU_Trade
- **Verdict:** Skip for MVP (unreliable free tier), consider Phase 2

**Reddit API:**
- Free tier: JSON endpoint access (unlimited for read)
- Subreddits to monitor:
  - r/InternationalTrade
  - r/ExportImport
  - r/economics (broader)
- **Verdict:** Include for MVP (easy to fetch, free)

**Deliverable:** 
- Twitter: Skip (document why)
- Reddit: Working subreddit JSON endpoints + sample posts

---

### Category 5: Economic Indicators

**Priority:** P2 (For "Other News" tab)

Research sources for economic data affecting trade:

| Indicator | Source | Access Method | Status | Notes |
|-----------|--------|---------------|--------|-------|
| **Exchange Rates** | ECB, Fed | API/RSS | ⏳ Research | Daily rates |
| **Commodity Prices** | World Bank, IMF | API | ⏳ Research | CSV/JSON downloads |
| **Shipping Costs** | Freightos Baltic Index | Public data? | ⏳ Research | May be paywalled |
| **Inflation Data** | BLS, Eurostat | API | ⏳ Research | CPI/PPI data |

**Deliverable:** List of free APIs (if any), else mark as "Phase 2 - paid sources"

---

## Research Methodology

### Step 1: RSS Feed Discovery
1. Visit each website
2. Look for RSS icon or "Subscribe" link
3. Check `/rss`, `/feed`, or `/rss.xml` URLs manually
4. Test feed with online RSS validator (feedvalidator.org)
5. Document feed URL + last updated timestamp

### Step 2: Content Sampling
1. Fetch 10 most recent items from each feed
2. Check freshness (<48 hours old?)
3. Verify relevance (trade/export/import keywords present?)
4. Document sample headlines

### Step 3: API Testing (for non-RSS sources)
1. Check if site has public API (look for `/api` docs)
2. Test authentication (API key required? Free tier limits?)
3. Document rate limits and access restrictions
4. Test sample query

### Step 4: Scraping Viability (last resort)
1. Check robots.txt (is scraping allowed?)
2. Inspect page structure (consistent HTML selectors?)
3. Test manual fetch (curl or Python requests)
4. Document scraping complexity (easy/medium/hard)

---

## Deliverable Format

Create a markdown file: `docs/research/news-sources-inventory.md`

**Structure:**
```markdown
# Trade News Sources Inventory

**Researched By:** Antigravity  
**Date:** [Date]  
**Status:** Complete

## Summary
- Total sources found: X
- RSS feeds: Y (working)
- APIs: Z (working)
- Scraping candidates: W (if no RSS/API)

## Validated Sources

### Government (RSS)
1. **US Dept of Commerce**
   - URL: https://...
   - Freshness: <24 hours
   - Sample: "New tariff on steel imports..."
   - Status: ✅ Working

2. [More sources...]

### Business News (RSS)
[List...]

### Reddit (API)
[List...]

## Rejected Sources
- Source Name: Reason (paywalled, no RSS, etc.)

## Recommendations
- Use govt RSS for personalized feed
- Use business news + Reddit for general feed
- Skip Twitter (rate limits too restrictive)
```

---

## Acceptance Criteria

Research complete when:
- [ ] 10+ govt/official RSS feeds validated (working URLs)
- [ ] 5+ business news RSS feeds validated
- [ ] 2+ Reddit subreddit endpoints tested
- [ ] Sample content fetched from each source
- [ ] Inventory document created with recommendations
- [ ] PM reviews and approves source list

---

## Timeline

**Estimated Effort:** 4-6 hours  
**Deadline:** Before Block 6B.1 implementation begins

---

## Questions for PM

1. Should we prioritize India sources (local user base) or US sources (larger coverage)?  
   *PM Answer:* Both equally — BMN targets global trade

2. If RSS feed exists but is >7 days stale, include it?  
   *PM Answer:* No, freshness is critical (<48hr requirement)

3. For sources requiring manual scraping, should we build scraper or skip?  
   *PM Answer:* Skip for MVP, note as "Phase 2" if valuable

---

**Status:** Awaiting Antigravity assignment  
**Next Step:** PM assigns Block 6B.1, Antigravity begins research
