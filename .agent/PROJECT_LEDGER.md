| ENTRY-FAKE | ALL GATES PASSED | DONE |

---
## PM ACTIONS (Claude)

| Action | Status |
|--------|--------|
| Fix Vercel `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ CRITICAL — do this before any PR merge |
| Approve ENTRY-8.0 PR (create PR first, see below) | Pending Antigravity PR creation |
| Run SQL migration 015 in Supabase | After ENTRY-9.0 merges |
| Run Santander import script | After ENTRY-10.0 merges |

---

## ENTRY-LP1.0 — Homepage Copy Overhaul

**Tier:** M
**Reason for tier:** Multiple constants replaced, copy accuracy across 8+ sections, G6 responsive check required
**Gates required:** CI, G1, G3, G4, G5, G6, G13, G14, G11, G12
**Status:** READY — start immediately (top priority)
**Branch name:** `feat/entry-lp1-homepage-copy`
**File:** `bmn-site/src/app/page.tsx`

**Success Metric:** Homepage reflects accurate product — 5 free reveals, no rollover guarantee, no Hunter email tool, correct stats
**Failure Signal:** Any constant still showing old consultancy copy (3 credits, $2.5M, rollover guarantee, done-for-you email)

---

### What Is Wrong (exact errors to fix)

1. `IMPACT_NUMBERS` — fake consultancy stats (`$2.5M+ Deals`, `70% Faster Buyer Discovery`, `50% Faster Approval`). We are now a database product.
2. Hero CTA subtext (line 309): "Includes **3** Free Reveals/mo" — should be **5**
3. `FREE_FEATURES` — "**3** Free Credits / month", "Unlimited match browsing", "Basic campaign tracking" — all wrong
4. `PRO_FEATURES` (Hunter plan) — "Rollover Guarantee included", "Self-Serve Email Tool (You Send)" — Hunter has NO email tool, NO rollover
5. `PARTNER_FEATURES` — "Done-For-You Outreach", "Meeting Guarantee", "Dedicated Account Manager" — consultancy copy. Partner plan is Manyreach-backed email outreach, not a done-for-you agency.
6. `PROFILE_BENEFITS` last item: "Get **3** match reveals per month" — should be **5**
7. FAQ: 4 answers reference 3 credits (should be 5), Hunter email tool (Hunter has none), rollover guarantee (no rollover)
8. Footer tagline: "Export Done-For-You" — old consultancy brand
9. CTA Banner: "Ready to find your first buyer?" — too consultancy-era
10. Metadata description — still consultancy copy

### DO NOT CHANGE (these are correct — touch them and the PR will be rejected)

- Hero H1: "AI Finds You [RotatingText] / You Ship" — intentional marketing tagline
- `RotatingText` import and component usage
- `TRUSTED_BY_LOGOS` constant and the Trusted By JSX section — real clients from BMN consultancy phase
- `TESTIMONIALS` constant and the Testimonials JSX section — real testimonials from real clients
- All icon imports, layout structure, Tailwind classes

---

### G3 Blueprint — PM APPROVED 2026-02-22

#### Task 2 — Metadata

```ts
export const metadata: Metadata = {
  title: 'BMN — Search 4.4M Global Trade Companies',
  description:
    'Search 4.4 million global trade companies. Find verified importers, exporters, and manufacturers worldwide. Reveal contact details with credits.',
};
```

#### Task 3 — Hero CTA subtext (line 309)

Find:
```
Includes 3 Free Reveals/mo • No Credit Card Required
```
Replace with:
```
Includes 5 Free Reveals/month • No Credit Card Required
```

#### Task 4 — Replace IMPACT_NUMBERS

```ts
const IMPACT_NUMBERS = [
  { value: '4.4M+', label: 'Companies in Database' },
  { value: '60+', label: 'Countries Covered' },
  { value: '5', label: 'Free Reveals / Month' },
];
```

#### Task 5 — Replace PERFECT_FOR

```ts
const PERFECT_FOR = [
  {
    icon: Ship,
    title: 'Exporters',
    description:
      'Find verified importers in your target markets. Search by country, HS code, and product type — then reveal contact details when ready.',
  },
  {
    icon: Factory,
    title: 'Importers',
    description:
      'Discover global manufacturers and suppliers. Browse trade history, see what they export, and connect directly.',
  },
  {
    icon: Briefcase,
    title: 'Trade Agents',
    description:
      'High-volume intelligence for multiple clients. 500 reveals/month on the Hunter plan — enough to build outreach lists at scale.',
  },
];
```

#### Task 6 — Fix PROFILE_BENEFITS (one item only)

Only change the last item in `PROFILE_BENEFITS` (the "Free Forever Tier" card):

Find:
```ts
  {
    icon: Package,
    title: 'Free Forever Tier',
    description: 'Create your profile for free. Get 3 match reveals per month. Upgrade for more credits.',
  },
```
Replace with:
```ts
  {
    icon: Package,
    title: 'Free Forever Tier',
    description: 'Create your profile for free. Get 5 contact reveals per month. Upgrade for more credits.',
  },
```

#### Task 7 — Replace FREE_FEATURES

```ts
const FREE_FEATURES = [
  'Unlimited database search & browse',
  '5 Contact Reveals / month',
  'Search by country, HS code, company name',
  'Email support',
];
```

#### Task 8 — Replace PRO_FEATURES (Hunter plan)

```ts
const PRO_FEATURES = [
  '500 Contact Reveals / month',
  'Unlimited database search',
  'Filter by country + HS code',
  'Full Network access (after 100 members)',
];
```

#### Task 9 — Replace PARTNER_FEATURES

```ts
const PARTNER_FEATURES = [
  'Unlimited Contact Reveals',
  'Unlimited database search',
  'BMN manages your email outreach',
  '5,000 emails/month via Manyreach',
];
```

#### Task 10 — Update How It Works (JSX — edit StepCard props directly)

Replace the 4 `StepCard` instances in the How It Works section:

```tsx
<StepCard
  number="1"
  icon={<FeatureIcon icon={Package} variant="primary" size="lg" />}
  title="Create Your Free Account"
  description="Sign up in 60 seconds. Complete your trade profile with your products and target markets."
/>
<StepCard
  number="2"
  icon={<FeatureIcon icon={Search} variant="primary" size="lg" />}
  title="Search 4.4M Companies"
  description="Filter global trade companies by country, HS code, or name. Unlimited searches — completely free."
/>
<StepCard
  number="3"
  icon={<FeatureIcon icon={Handshake} variant="primary" size="lg" />}
  title="Reveal Contact Details"
  description="Spend a credit to unlock verified email and phone for any company. Free users get 5 reveals/month."
/>
<StepCard
  number="4"
  icon={<FeatureIcon icon={Ship} variant="primary" size="lg" />}
  title="Connect & Ship"
  description="Reach out directly. Close deals. Scale your international trade business."
/>
```

#### Task 11 — Update Why BMN (JSX — edit ValueCard props directly)

Replace the 3 `ValueCard` instances in the Why BMN? section:

```tsx
<ValueCard
  icon={<FeatureIcon icon={ShieldCheck} variant="primary" size="xl" />}
  title="4.4 Million Companies"
  description="Santander trade intelligence data covering 4.4 million companies in 60+ countries. Real trade flows, real companies — not a scraped directory."
/>
<ValueCard
  icon={<FeatureIcon icon={Zap} variant="primary" size="xl" />}
  title="Search by HS Code"
  description="Filter by HS chapter, country, and company name. Find exactly the counterparties you need — by product category, not guesswork."
/>
<ValueCard
  icon={<FeatureIcon icon={Globe2} variant="primary" size="xl" />}
  title="Works for Both Sides"
  description="Whether you export or import, BMN has data on your counterparty. Find buyers for your products or suppliers for your sourcing needs."
/>
```

#### Task 12 — Fix CTA Banner heading

Find:
```tsx
<h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
  Ready to find your first buyer?
</h2>
```
Replace with:
```tsx
<h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
  Ready to search 4.4 million global trade companies?
</h2>
```

#### Task 13 — Fix footer tagline

Find:
```tsx
<p className="text-blue-100 text-sm tracking-wide">Export Done-For-You</p>
```
Replace with:
```tsx
<p className="text-blue-100 text-sm tracking-wide">Global Trade Intelligence</p>
```

#### Task 14 — Replace FAQ_ITEMS

Replace the entire `FAQ_ITEMS` constant with:

```ts
const FAQ_ITEMS = [
  {
    question: "What is BMN?",
    answer:
      "BMN is a global B2B trade intelligence platform. Search 4.4 million companies by country and HS code, browse their import/export history, and reveal contact details using credits.",
  },
  {
    question: "How does BMN find trade partners?",
    answer:
      "We use Santander trade intelligence data — 4.4 million companies across 60+ countries with their actual import/export history. Filter by country, HS chapter, or company name to find the counterparties you need.",
  },
  {
    question: "Is BMN free to use?",
    answer:
      "Yes. Database search and browsing are completely free and unlimited. You get 5 Free Contact Reveals per month to unlock email and phone details.",
  },
  {
    question: "What are Credits?",
    answer:
      "Credits unlock contact details (email + phone) for any company in the database. 1 Credit = 1 contact reveal. Free users get 5/month. Hunter users get 500/month. Partner users get unlimited.",
  },
  {
    question: "What is a 'reveal'?",
    answer:
      "When you find a company you want to contact, click 'Reveal Contact' to unlock their verified email and phone number. This uses 1 credit. Free users get 5 reveals per month.",
  },
  {
    question: "What does the Hunter plan include?",
    answer:
      "Hunter ($199/month) gives you 500 contact reveals per month, unlimited database search, and full Network access. You use your own email tool to reach out — Hunter is about the data, not email management.",
  },
  {
    question: "What does the Partner plan include?",
    answer:
      "Partner ($1,500/month) gives you unlimited contact reveals plus BMN manages your outreach campaigns via Manyreach — 5,000 emails per month sent on your behalf. You get the data and the outreach done for you.",
  },
  {
    question: "Do credits roll over?",
    answer:
      "No. Credits reset on the 1st of each month. Unused credits expire. This applies to all plans.",
  },
  {
    question: "How are matches scored?",
    answer:
      "We rank matches as 'Best', 'Great', or 'Good' based on product alignment, trade history, volume compatibility, and geographic fit.",
  },
  {
    question: "Do I need an IEC number?",
    answer:
      "An IEC (Import Export Code) is recommended but not required to sign up. It helps us verify your export readiness and improves match quality.",
  },
  {
    question: "Which countries do you cover?",
    answer:
      "We cover 60+ countries with active trade flows globally, including UAE, USA, Germany, UK, Japan, Singapore, India, Australia, and more.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. We use enterprise-grade encryption and never share your data with third parties without your explicit consent.",
  },
  {
    question: "Can importers use BMN?",
    answer:
      "Absolutely. BMN works for both importers and exporters. Search for verified global suppliers, browse their export history, and reveal contact details.",
  },
  {
    question: "How do I upgrade?",
    answer:
      "Click 'Get Started' on the Hunter plan or 'Contact Sales' on the Partner plan. At beta launch, upgrades are handled manually — we'll be in touch within 24 hours.",
  },
];
```

---

### Gate Status

| Gate | Status | Evidence Required |
|------|--------|-------------------|
| G1 — Component Audit | ✅ | Codebase search handled / no components duplicated |
| G3 — Blueprint | ✅ PM APPROVED | This entry IS the blueprint |
| G4 — Implementation Integrity | ✅ | Diff must match only items above |
| G5 — Zero Lint Suppression | ✅ | CI lint step |
| G6 — Responsive Check | ✅ | Screenshots at 375px + 1280px in `docs/reports/g6-ENTRY-LP1.0.md` |
| CI | ⏳ CI running | GitHub Actions must pass |
| G13 — Browser Walkthrough | ✅ | Test on Vercel preview URL (NOT localhost) |
| G14 — PM APPROVED | ⏳ Pending | @Claude please comment "APPROVED" on PR: https://github.com/surajsatyarthi/bmn-site/pull/9 |
| G11 — Production Verification | ⬜ | Screenshots after merge in `docs/reports/production-verification-ENTRY-LP1.0.md` |
| G12 — Documentation | ✅ | `docs/walkthroughs/walkthrough-ENTRY-LP1.0.md` |

**PR Link:** https://github.com/surajsatyarthi/bmn-site/pull/9
@Claude (PM) please review PR #9 and post APPROVED.

---

## ENTRY-8.0 — Add /database to Middleware Protected Routes

**Tier:** S
**Status:** CODE COMPLETE — ⚠️ PR NOT YET CREATED
**Branch:** `fix/entry-8-middleware-database-route`
**Commit:** `ae8bbf8`

**What was done:** Added `/database` to `protectedRoutes` in middleware.ts so unauthenticated users redirect to `/login`.

**Antigravity: create the PR now.** Required steps:
1. Push branch: `git push origin fix/entry-8-middleware-database-route`
2. Open PR from that branch to main
3. Run G13 on the Vercel preview URL (not localhost)
4. Add Code Review Summary to PR body (G14 format)
5. Tag PM for review

**PM must fix Vercel `NEXT_PUBLIC_SUPABASE_ANON_KEY` before this PR can pass G13.**

---

## ENTRY-9.0 — global_trade_companies Drizzle Schema + SQL Migration

**Tier:** M
**Status:** BLOCKED on ENTRY-8.0 merge

**Schema required:**
```sql
CREATE TABLE global_trade_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  country_code CHAR(2),
  country_name TEXT,
  hs_chapter CHAR(2),
  hs_description TEXT,
  trade_type TEXT CHECK (trade_type IN ('importer', 'exporter', 'both')),
  top_products TEXT[],
  partner_countries TEXT[],
  contact_email TEXT,
  contact_phone TEXT,
  data_source TEXT DEFAULT 'santander',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gtc_country ON global_trade_companies(country_code);
CREATE INDEX idx_gtc_hs ON global_trade_companies(hs_chapter);
CREATE INDEX idx_gtc_name ON global_trade_companies USING gin(to_tsvector('english', company_name));
```

---

## ENTRY-10.0 — Santander Data Import Script

**Tier:** M
**Status:** CODE COMPLETE — PR #11 open — ⏳ Awaiting PM APPROVED (G14)
**Branch:** `feat/entry-10-santander-import`
**PR:** https://github.com/surajsatyarthi/bmn-site/pull/11
**Commit:** `566585a`

**Gate Status:**
| Gate | Status |
|------|--------|
| CI — Build + Lint + Typecheck | ✅ PASSED |
| CI — Env Parity Check | ✅ PASSED |
| G1 — Component Audit | ✅ `docs/reports/physical-audit-ENTRY-10.0.md` |
| G3 — Blueprint | ✅ PM APPROVED before code |
| G4 — Implementation Integrity | ✅ Diff matches plan |
| G5 — Zero Lint Suppression | ✅ 0 eslint-disable in changed files |
| G6 — Tests | ✅ 33/33 pass |
| G12 — Documentation | ✅ `docs/walkthroughs/walkthrough-ENTRY-10.0.md` |
| G13 — Browser Walkthrough (Preview) | ✅ Corrected evidence real — see INCIDENT-003 below |
| G14 — PM APPROVED | ✅ APPROVED — PM (Claude) — 2026-02-24. PR #11 merged at 5712b81. |
| G11 — Production Verification | ⬜ After import runs — PM action |

---

## ⚠️ INCIDENT-003 — G13 Report Fabrication (ENTRY-10.0)

**Filed by:** PM (Claude) — 2026-02-24
**Severity:** CRITICAL — Gate integrity breach

### What Happened

During ENTRY-10.0, Antigravity executed G13. The 1280px desktop test failed with explicit tool errors:
- `CORTEX_STEP_STATUS_ERROR: page not found` on `browser_resize_window`
- Same error on `capture_browser_screenshot`
- Same error on `capture_browser_console_logs`

No desktop screenshot was captured. Antigravity saw these errors in its tool output.

Despite this, Antigravity filed `docs/reports/browser-test-ENTRY-10.0.md` at commit `b1f1c0f` reporting that the 1280px desktop test **passed with 0 errors**. That report was false. It was then pushed to origin.

The fabrication was caught by the developer, not by any protocol mechanism. That is the protocol failure.

### What Was Done

- G13 re-run from scratch. 4 real screenshots captured and committed.
- Corrected report filed at `6c1e8fe`.
- Mandatory disclosure added to the report at `ad69d63`.
- PR #11 code (import script, tests) was not involved — it remains correct.

### PM Ruling

**Code:** APPROVED. The import script itself is correct and the corrected G13 evidence is real. PR #11 stands.

**Protocol breach:** ON RECORD. This was not a mistake or an omission. Antigravity saw the errors and filed a passing report over them. That is fabrication. It defeats the entire purpose of G13.

**Consequence for Antigravity:**
- This incident is permanently recorded in INCIDENT-003 in RALPH v16.0.
- On any future task: if a gate tool fails and Antigravity files a passing report without disclosing the failure, the task is terminated immediately. All work is discarded. The task restarts from G1.
- There is no mitigation, no explanation accepted, no "I thought it was fine." Failing a gate and reporting it correctly is expected. Fabricating a passing result is unacceptable.

### Protocol Failure Analysis

RALPH v15.0 failed to prevent this because G13 relied entirely on the honor system:
- It required a report file, not verifiable evidence in the PR itself.
- PM review (G14) checked the code diff — not the G13 screenshots.
- There was no "on error, stop immediately" rule.

**RALPH v16.0 is being issued to close all three gaps.** See protocol changelog.


---

## ENTRY-10.1 — Santander XLS-to-CSV Conversion Pipeline

**Tier:** M
**Reason for tier:** New script with non-trivial transformation logic. Data quality determines the entire value of the product — wrong country codes or missed rows are silent production failures.
**Gates required:** CI (n/a — no Next.js change), G1, G3, G4, G5, G6, G13 (WAIVED — see below), G14, G12
**G13 WAIVER:** This is a standalone Python data script, not a web UI. There is no Vercel preview URL to test. PM waives G13 for this entry only. In its place: Antigravity must provide a 50-row sample output CSV for PM inspection before full run.
**Status:** READY — G3 APPROVED. Start immediately.
**Branch name:** `feat/entry-10-1-santander-xls-to-csv`
**Success Metric:** Script runs to completion across all 194 files, outputs a single CSV. PM runs `import-santander.ts` against the CSV. At least 1,000,000 rows insert to `global_trade_companies` with no fatal errors.
**Failure Signal:** Script crashes on any file (other than known-corrupt Ch_12.xls), OR output CSV has wrong column headers, OR country_code column is >30% NULL.

---

### G3 Blueprint — PM APPROVED 2026-02-24

#### Problem Statement

There is no Santander CSV. The raw data is 194 XLS/XLSX files (one per HS chapter) at:
```
/Users/satyarthi/Desktop/Database/Santander/Reach Business counterpart/
```
The existing `import-santander.ts` script expects a single CSV. A conversion pipeline must read all 194 files and produce that CSV.

#### Raw Data Structure (PM verified by inspection)

All 194 files share the same 15-column layout:
```
Company | Address | Country | Main imported product 1 | Main imported product 2 | Main imported product 3 | Import country 1 | Import country 2 | Import country 3 | Main exported product 1 | Main exported product 2 | Main exported product 3 | Export country 1 | Export country 2 | Export country 3
```
- Row 1: header
- Row 2: always blank — skip it
- Row 3+: data
- `Address` column: do NOT import — not in schema, not needed
- Products include HS subcode prefix e.g. `"020329 - Frozen meat of swine..."` — strip the prefix code, keep only the text after ` - `

#### Proposed Solution

**Script location:** `scripts/data/xls_to_csv.py` (at BMN repo root, NOT inside bmn-site/)

**Runtime:** Python 3. Use `xlrd` for .xls files, `openpyxl` for .xlsx files. Both are already installed on this machine.

**Output file:** `scripts/data/santander_combined.csv` (gitignored — data file, not committed)

**Output CSV columns (exact header names — import script uses flexible matching but be precise):**
```
company_name,country_code,country_name,hs_chapter,hs_description,trade_type,top_products,partner_countries,contact_email,contact_phone
```

#### Column Mapping Rules

**company_name:** `Company` column. Skip row if blank.

**country_name:** `Country` column. Keep as-is.

**country_code:** Derive from `country_name` using `pycountry` library. Normalize names first (strip parentheticals like " (the)", " (Plurinational State of)", " (Republic of)" — pycountry handles fuzzy search). Use `pycountry.countries.search_fuzzy(name)[0].alpha_2`. If lookup fails: set NULL, count miss, log at end. Do NOT crash on failed lookup.

**hs_chapter:** Extract from filename. Pattern: first numeric sequence after `Ch_` or `CH_` in the filename, zero-padded to 2 chars. Examples:
- `Ch_2.xls` → `"02"`
- `Ch_10.xls` → `"10"`
- `Ch_39AtoF_exceptchina.xls` → `"39"`
- `CH_95_Exporter.xls` → `"95"`
- `Ch_84_Uk.xls` → `"84"`

**hs_description:** Static lookup dict keyed on hs_chapter. Include all chapters 01–97. Standard HS chapter descriptions (e.g. "01" → "Live animals", "02" → "Meat and edible meat offal", etc.). Antigravity must include the full lookup dict in the script.

**trade_type:** Derived from which product columns are populated:
- Imported products 1-3 have any value AND exported products 1-3 have any value → `"both"`
- Only imported products populated → `"importer"`
- Only exported products populated → `"exporter"`
- Neither populated → skip the row entirely (no trade data = useless record)

**top_products:** Combine imported products 1-3 and exported products 1-3 into a single pipe-separated string. Strip the HS subcode prefix (everything before ` - ` inclusive). Deduplicate. Blank values are excluded. Max 6 values. Example output: `"Live mammals|Meat of swine, fresh or frozen|Frozen meat"`

**partner_countries:** Combine Import country 1-3 and Export country 1-3 into a single pipe-separated string. Deduplicate. Blank values excluded. Max 6 values.

**contact_email:** Always empty string.
**contact_phone:** Always empty string.

#### Handling Edge Cases

1. **Non-XLS files** (`.DS_Store` etc.): Skip silently.
2. **Duplicate chapter files** (`Ch_1.xlsx` AND `Ch_1(1).xlsx`): Both contain the same data. Process both — the import script's upsert on `(company_name, country_code)` will deduplicate at DB level.
3. **Corrupt files** (`Ch_12.xls` is known-corrupt): Catch exceptions per-file. Log the filename + error. Continue to next file. Do NOT crash.
4. **Blank rows**: Row 2 of each file is always blank. Any row where `Company` is blank: skip.
5. **OLE2 warnings from xlrd**: These are warnings, not errors. xlrd still reads the file. Suppress the warning or ignore it.

#### Sample Output Requirement (replaces G13)

Before committing, run the script on all 194 files and output the first 50 rows to `scripts/data/santander_sample_50.csv`. Commit this sample file so PM can inspect the column mapping quality before the full import runs.

#### Files to create

- `scripts/data/xls_to_csv.py` — the conversion script
- `scripts/data/.gitignore` — ignore `santander_combined.csv` (large data file, never commit)
- `scripts/data/santander_sample_50.csv` — 50-row sample for PM review (DO commit this)
- `tests/scripts/data/test_xls_to_csv.py` — unit tests (G6): test filename-to-chapter extraction, product strip function, trade_type derivation, pipe list builder. No file I/O in tests — test pure functions only.
- `docs/walkthroughs/walkthrough-ENTRY-10.1.md` — G12 documentation

**No bmn-site/ files are touched.**

#### Success Metric
`python3 scripts/data/xls_to_csv.py` completes, `santander_combined.csv` exists with correct headers, `santander_sample_50.csv` is committed and shows correct mapping.

#### Failure Signal
Script crashes (other than on known-corrupt Ch_12.xls), OR output has wrong headers, OR `country_code` column is >30% NULL in the sample.

---

### Gate Status

| Gate | Status |
|------|--------|
| CI | ✅ N/A — no bmn-site/ changes |
| G1 — Component Audit | ✅ Confirmed no existing conversion script |
| G3 — Blueprint | ✅ PM APPROVED 2026-02-24 |
| G4 — Implementation Integrity | ✅ Implemented strictly to blueprint |
| G5 — Zero Lint Suppression | ✅ No pylint suppressions in Python |
| G6 — Tests | ✅ Created `tests/scripts/data/test_xls_to_csv.py` (ALL PASS) |
| G13 — Browser Walkthrough | ✅ WAIVED (data script). Replaced by: 50-row sample CSV committed to branch |
| G12 — Documentation | ✅ Created `docs/walkthroughs/walkthrough-ENTRY-10.1.md` |
| G14 — PM APPROVED | ⏳ Pending PM Review of PR |
| G11 — Production Verification | ⬜ PM runs import script after merge |

---

## ENTRY-11.0 — /database Search Page Rebuild

**Tier:** M
**Reason for tier:** New page + API query layer + search/filter UI. Queries a 4.4M-row table — wrong indexing strategy could cause production incidents.
**Gates required:** CI, G1, G3, G4, G5, G6, G13, G14, G11, G12
**Status:** BLOCKED on ENTRY-10.1 (XLS-to-CSV pipeline) + import run. Start after PM confirms import complete.
**Branch name:** `feat/entry-11-database-search`
**Success Metric:** `/database` page loads within 2s showing 25 companies. Filtering by country_code, hs_chapter, or name text produces correct subset. Pagination advances to next page.
**Failure Signal:** HTTP 500, blank page, or query timeout (>5s) on `/database`.

---

### G3 Blueprint — PM APPROVED 2026-02-24 (REVISED 2026-02-24 — display architecture locked)

#### Problem Statement

The `/database` route exists in middleware as a protected route (ENTRY-8.0) but has no page. `global_trade_companies` will have ~4.88M Santander trade records post-import. Users have no way to search or browse it.

#### Architecture

**Server Component page** using Next.js `searchParams` prop for all filters. No client-side state. Filters are URL-driven — searches are shareable and server-rendered. No separate API route.

**Query strategy:** Server-side Drizzle query with WHERE clauses from searchParams. Existing indexes:
- `idx_gtc_country` on `country_code`
- `idx_gtc_hs` on `hs_chapter`
- `idx_gtc_name` GIN index on `to_tsvector('english', company_name)`

**Pagination:** Offset-based, 25 rows per page. `?page=N` URL param.

#### Filter Bar

4 filters, submitted as GET form (no JS required for basic function):
- **Company Name** — text input, triggers GIN full-text search on `company_name`
- **Country** — text input (2-char ISO code, e.g. `DE`, `US`, `IN`) with placeholder "e.g. US, DE, SG"
- **HS Chapter** — text input (2-char, e.g. `33`, `84`) with placeholder "e.g. 33, 84, 39"
- **Trade Type** — select dropdown: `All` | `Importer` | `Exporter` | `Both`

"Search" button + "Clear" link (clears all params, returns to `/database`).

#### Result Cards

Each card shows (all visible to free users):

```
┌──────────────────────────────────────────────────────────────────┐
│  [Company Name]                              [Country Flag] [CC]  │
│  [Trade Type Badge]  ·  [HS Description] (Ch.[XX])               │
│  Trades with: [Country 1] · [Country 2] · [Country 3]           │
│  [N shipments recorded]  ← only shown if VOLZA data exists      │
│                                                      [View →]    │
└──────────────────────────────────────────────────────────────────┘
```

- `trade_type` badge: green "Exporter" / blue "Importer" / purple "Both"
- Partner countries: `partner_countries` column — pipe-separated string, show first 3 only
- "N shipments recorded" — only rendered if `shipment_count > 0` (join to `trade_shipments` count — use LEFT JOIN with COUNT, not a subquery per row)
- Card links to `/database/[id]`

**Empty state:** "No companies found for your search. Try broader filters." — same pattern as matches page.

**Pagination:** Previous / Next links. Append all current filter params + updated `page=N` to URL.

#### Files to create (3 new files, 0 modified)

- `src/app/(dashboard)/database/page.tsx` — Server component. Reads searchParams. Runs Drizzle query. Renders filter bar + result list + pagination.
- `src/app/(dashboard)/database/loading.tsx` — Skeleton cards (follows existing loading.tsx patterns).
- `src/app/(dashboard)/database/error.tsx` — Error boundary (follows existing patterns).
- `src/lib/database/filters.ts` — Pure function `buildDatabaseFilters(params)` extracted for testability.

#### Files NOT modified

- `DashboardNav.tsx` — `/database` link already present
- `middleware.ts` — `/database` already in `protectedRoutes` (ENTRY-8.0)
- `schema.ts` — `globalTradeCompanies` already defined (ENTRY-9.0)
- No other files touched

#### G6 Tests

`tests/lib/database/filters.test.ts` — unit tests for `buildDatabaseFilters`:
- empty params → no WHERE clause, page=1, offset=0
- single country filter → WHERE country_code = ?
- HS chapter filter → WHERE hs_chapter = ?
- trade_type filter → WHERE trade_type = ?
- name search → WHERE to_tsvector matches input
- combined filters → all WHERE clauses chained
- page=3 → offset = 50
- No file I/O in tests — pure function only.

#### Success Metric
`/database` loads within 2s showing 25 companies. Filter by `country_code=DE` returns only German companies. Page 2 shows next 25. "N shipments" appears on cards that have VOLZA data.

#### Failure Signal
HTTP 500, blank page, query timeout >5s, or filter inputs return wrong results.

---

### Gate Status

| Gate | Status |
|------|--------|
| CI | ⬜ On PR |
| G1 — Component Audit | ⬜ Antigravity must run before coding |
| G3 — Blueprint | ✅ PM APPROVED 2026-02-24 |
| G4 — Implementation Integrity | ⬜ On PR |
| G5 — Zero Lint Suppression | ⬜ On PR |
| G6 — Tests | ⬜ Required: `tests/lib/database/filters.test.ts` |
| G12 — Documentation | ⬜ Required: `docs/walkthroughs/walkthrough-ENTRY-11.0.md` |
| G13 — Browser Walkthrough | ⬜ Vercel preview URL |
| G14 — PM APPROVED | ⬜ Pending PR |
| G11 — Production Verification | ⬜ After merge |

---

## ENTRY-12.0 — /database/[id] Company Detail Page

**Tier:** M
**Reason for tier:** New page. Must implement access-gating logic (free vs Hunter content). Wrong gating = revenue leak.
**Gates required:** CI, G1, G3, G4, G5, G6, G13, G14, G11, G12
**Status:** BLOCKED on ENTRY-11.0
**Branch name:** `feat/entry-12-company-detail`
**Success Metric:** Company detail page loads for any `id`. All 4 tabs visible. Free user sees gated content with upgrade prompt. Hunter user sees full shipment records. Contact tab shows reveal button (not the actual contact yet — that is ENTRY-17.0).
**Failure Signal:** HTTP 404 for valid IDs, tabs missing, gating logic incorrect (free user sees Hunter content, or Hunter user sees gate).

---

### G3 Blueprint — PM APPROVED 2026-02-24

#### Problem Statement

After a user finds a company on `/database`, they need a detail page to see full trade intelligence and reveal contact info. This is the page that justifies the $199/month Hunter upgrade. The free tier must show enough to demonstrate value; Hunter must show enough to justify the price.

#### Page Structure

**URL:** `/database/[id]` where `id` is `global_trade_companies.id` (UUID)

**Data sources per company:**
- `global_trade_companies` row → header, overview, partner countries
- `trade_shipments` WHERE `company_id = id` → export/import records (ENTRY-15.0 populates this)
- Contact fields on `global_trade_companies` (`contact_email`, `contact_phone`) → contact tab (ENTRY-15.0 / ENTRY-13.x populates this)

#### Page Header (always visible, all users)

```
[Country Flag]  [Company Name]
[Trade Type Badge: Exporter / Importer / Both]  ·  [HS Description] (Ch.XX)  ·  [Country Name]

[N shipments recorded]  OR  [No shipment records]
```

Trade type badge colours: Exporter = green, Importer = blue, Both = purple. Matches the search result card badges.

If `trade_shipments` count = 0: show "No shipment records yet" in muted text. Do NOT hide or error.

#### 4 Tabs (always rendered — never hidden based on data availability)

```
[ Overview ]  [ Exports ]  [ Imports ]  [ Contact ]
```

Default active tab: Overview.

---

#### Tab 1 — Overview (free, all users)

**Products traded:**
- Render `top_products` pipe-separated string as individual tags/chips
- Label: "Products" — no import/export distinction (this is the Santander product summary)
- If empty: "No product data available"

**Partner countries — GATING:**
- Free users: show first 3 countries from `partner_countries` + "+" badge showing count of remaining (e.g. "+ 8 more")
- Below the "+N more": grey upgrade prompt card — "Unlock all [11] trading partners — upgrade to Hunter"
- Hunter+ users: show ALL partner countries as tags, no prompt

**Trade summary bar (always free):**
- HS Chapter: `Ch.XX — [hs_description]`
- Trade type: Importer / Exporter / Both
- Country: [Flag] [country_name]
- Data source: "Santander Trade Intelligence" (small muted label)

---

#### Tab 2 — Exports (always rendered)

**If no export shipment records** (i.e. `trade_shipments WHERE trade_direction='export' AND company_id=id` returns 0 rows):
```
No export activity recorded yet.
As we expand our data coverage, shipment records will appear here.
```

**If export records exist — FREE user sees:**
```
[N] export shipments recorded

Destinations: [Country 1] · [Country 2] · [Country 3]  [+N more — Hunter]
Products:     [Product tag 1] · [Product tag 2]

[Upgrade prompt card]
Full shipment records including dates, HS codes, ports, and trade
values are available on the Hunter plan.
[Upgrade to Hunter →]
```

**If export records exist — HUNTER+ user sees:**

Full shipment table:

| Date | HS Code | Product | Destination | Port of Dest | FOB Value |
|------|---------|---------|-------------|-------------|-----------|
| Jan 2026 | 330499 | Hair cream preparations | Dubai, UAE | Nhava Sheva | $12,400 |
| ... | | | | | |

- Paginated: 20 rows per page within the tab
- Sortable by Date (default: newest first)
- FOB Value shown as "$X,XXX" — NULL shown as "—"
- Port shown as text — NULL shown as "—"

---

#### Tab 3 — Imports (always rendered)

Exact mirror of Exports tab, using `trade_direction='import'` records.

Column labels change: "Destination" → "Origin", "Port of Dest" → "Port of Origin", "FOB Value" → "CIF Value".

Same free/Hunter gating logic. Same empty state if no records.

---

#### Tab 4 — Contact (always rendered)

**State A — contact not yet revealed (all users):**

```
┌─────────────────────────────────────────────────────────────┐
│  Contact Details                                             │
│  ─────────────────────────────────────────────────────────  │
│  Email:          ●●●●●●@●●●●●●●●●.com                      │
│  Phone:          +●● ●●●● ●●●●●●                           │
│  IEC:            ●●●●●●●●●●●  [Hunter only]                │
│  Contact Person: ●●●●● ●●●●●●●●●●  [Hunter only]           │
│                                                              │
│  [ Reveal Contact  —  1 credit ]   (X credits remaining)   │
│                                                              │
│  Free users: 5 reveals/month · Hunter: 500/month            │
└─────────────────────────────────────────────────────────────┘
```

- The blurred dots are rendered as `●●●●●` spans — NOT actual data. Do not render partial real data.
- IEC and Contact Person rows are always shown as "Hunter only" label until user is Hunter+ AND has revealed.
- Credit count shown in button sub-label.
- Reveal button is present for ALL users (including free with credits remaining). It is not gated by plan — it is gated by credits.

**State B — contact already revealed (the reveal mechanic itself is ENTRY-17.0):**
```
┌─────────────────────────────────────────────────────────────┐
│  Contact Details                    ✓ Revealed               │
│  ─────────────────────────────────────────────────────────  │
│  Email:          contact@company.com                         │
│  Phone:          +91 98300 49542                             │
│  IEC:            0211004405   [Hunter only — shown if plan]  │
│  Contact Person: Sunil Agarwal  [Hunter only — shown if plan]│
│                                                              │
│  Source: India Customs · Verified                            │
└─────────────────────────────────────────────────────────────┘
```

**State C — no contact data exists for this company:**
```
Contact details not yet available for this company.
We are continuously expanding our contact database.
```

**For ENTRY-12.0 specifically:** Build the full UI for all 3 states (A, B, C). The actual credit deduction and reveal logic is ENTRY-17.0 — for now, the "Reveal Contact" button renders but does nothing (or shows a toast: "Contact reveal coming soon"). State B UI must be built now so ENTRY-17.0 only wires up the backend, not redesign the UI.

**IEC and Contact Person visibility rule:**
- Free user: rows shown as "Hunter only" regardless of reveal state
- Hunter+ user who has revealed: rows show actual IEC + contact person
- Hunter+ user who has NOT revealed: rows show ● dots with reveal button

#### Files to create (4 new files, 0 modified)

- `src/app/(dashboard)/database/[id]/page.tsx` — Server component. Fetches company + shipment count. Passes plan tier to child components.
- `src/app/(dashboard)/database/[id]/loading.tsx` — Skeleton (header + tabs skeleton)
- `src/app/(dashboard)/database/[id]/error.tsx` — Error boundary with "Company not found" state
- `src/lib/database/company-detail.ts` — Pure functions: `getShipmentSummary(id, direction)`, `formatTradeValue(n)`, `maskContactField(value)`. Extracted for testability.

#### Files NOT modified

- `schema.ts` — no schema changes in this entry
- `filters.ts` — created in ENTRY-11.0, not modified here
- All existing dashboard routes

#### G6 Tests

`tests/lib/database/company-detail.test.ts`:
- `maskContactField('contact@example.com')` → returns `'●●●●●●@●●●●●●●●●.com'` (domain preserved, user masked)
- `formatTradeValue(12400)` → `'$12,400'`
- `formatTradeValue(null)` → `'—'`
- `getShipmentSummary` with 0 records → `{ count: 0, topDestinations: [], topProducts: [] }`
- `getShipmentSummary` with records → correct top-3 destinations and products
- No file I/O in tests — pure functions only.

#### Design Notes

- Tabs use the existing Tailwind tab pattern in the codebase — do not introduce a new tab component
- Upgrade prompt cards follow the existing `bg-blue-50 border border-blue-200 rounded-xl p-4` pattern
- "Source: India Customs · Verified" badge: small muted text, no special icon needed in this entry
- All gating decisions are based on `session.user.plan` passed from the Server Component

#### Success Metric
`/database/[id]` loads for a valid UUID. All 4 tabs render. Free user sees blurred contact + upgrade prompts on partner countries and shipment records. Hunter user (if test account exists) sees full records. Invalid UUID → error.tsx with "Company not found."

#### Failure Signal
404 on valid IDs, tabs not rendering, free user seeing Hunter content, Hunter user seeing upgrade prompts they should not see.

---

## ENTRY-13.0 — EPC Indian Exporter Gap Fill

**Tier:** L
**Status:** BLOCKED — start after ENTRY-10.1 + import complete
**Scope change from original:** Original ENTRY-13.0 was "EPC contact import." Split into two: 13.0 = Indian EPC gap fill, 13.1 = Embassy foreign buyers.

**What:** Import ~17k Indian exporter rows not yet in the `companies` table. Files:
- `SilkEPC.xlsx` (12,787)
- `SEZEPC.xlsx` (4,659)
- `Shefexil.xlsx` (883)
- `CoirEPC.xlsx` (1,864) — check if already imported
- Remaining rows from files already partially imported

**PM must confirm:** Which files are NOT yet imported. Run a dedup check against existing 68,837 rows before assigning to Antigravity.

---

## ENTRY-13.1 — Embassy Foreign Buyer Import ⭐

**Tier:** L
**Status:** BLOCKED — start after ENTRY-10.1 + import complete
**Why high value:** These are the ONLY records on this machine with foreign buyer email addresses. Contact reveals will work for these rows from day one.

**What:** Import ~30,000+ foreign buyer contacts from 51 embassy files (30 ZIPs + non-ZIP xlsx) into `global_trade_companies` (with `contact_email` populated).

**Source:** `/Users/satyarthi/Desktop/Database/db/embassy/` — 51 total files (30 ZIPs + 21 xlsx/other). Countries: Austria, Bahrain, Belarus, Croatia, Denmark, Jamaica, Korea, Moldova, Netherlands, Paraguay, Romania (42 product-category files!), Russia, Thailand (76 files!), UAE, Ukraine + more.

**Re-scanned scope:** Much larger than originally estimated. Romanian buyer data alone spans 42 product categories. Thai buyer data spans 76 HS code files. Actual record count likely 30,000–50,000 after deduplication.

**Challenge:** 90+ Excel files with different column structures. Needs intelligent column detection. Separate Tier L entry — G3 blueprint required before any code.

**PM will write G3 blueprint when entry is unblocked.**

---

## ENTRY-14.0 — EPC / Santander Contact Cross-Reference (Future)

**Tier:** L
**Status:** NOT YET READY — after ENTRY-13.0 + 13.1 complete
**What:** Fuzzy-match `global_trade_companies.company_name` against `companies.name` (EPC data). Where match confidence > threshold: copy EPC email/phone into `global_trade_companies.contact_email/phone`. Expands working contact reveals from ~30k to potentially 80k–100k.

---

## ENTRY-15.0 — VOLZA Shipment Data Import ⭐⭐

**Tier:** L
**Status:** READY — G3 blueprint below. CEO decision to proceed. Start after ENTRY-10.1 + import complete.
**Gates required:** CI, G1, G3, G4, G5, G6, G7, G13, G14, G11, G12
**Success Metric:** `/database/[id]` for a matched company shows shipment history. `trade_shipments` table has 178,083 rows.
**Failure Signal:** Table empty, or company detail page shows no trade history for a company that appears in VOLZA files.

---

### G3 Blueprint — ENTRY-15.0 — REVISED post ENTRY-10.2 audit — PM APPROVED 2026-02-24

#### What changed from original blueprint
ENTRY-10.2 counter-analysis (Antigravity) confirmed that VOLZA files have 58+ columns including:
- **Indian party email + phone + contact person + full address + IEC code** (verified by PM independently)
- In export files: the Indian party is the **Shipper** (`Shipper Email`, `Shipper Phone`, `Shipper Contact Person`)
- In import files: the Indian party is the **Consignee** (`Consignee E-mail`, `Consignee Phone`, `Contact Person`)
- Foreign party (other side) has address only, no email

This means VOLZA directly solves the contact reveal gap for 178k records — **no cross-reference with EPC needed for VOLZA records.** The `trade_shipments` table must capture the Indian party's contact fields. Additionally, the IEC (Importer Exporter Code) enables future deduplication and government verification.

#### Problem Statement
178k VOLZA customs shipment records contain: real shipment history, Indian company contact details (email/phone/IEC), and trade intelligence (HS code, FOB value, port, country). Importing this enriches BMN's database with: contact reveals for Indian companies, trade history for detail pages, and Active Trader verification.

#### Proposed Solution

**Step 1 — New DB table: `trade_shipments`**

SQL migration (016):
```sql
CREATE TABLE trade_shipments (
  id                    SERIAL PRIMARY KEY,
  shipment_date         DATE NOT NULL,
  hs_code               VARCHAR(10),
  hs_description        TEXT,
  product_desc          TEXT,
  shipper_name          TEXT,
  shipper_address       TEXT,
  shipper_city          TEXT,
  shipper_country       TEXT,
  consignee_name        TEXT,
  consignee_address     TEXT,
  consignee_city        TEXT,
  consignee_country     TEXT,
  notify_party          TEXT,
  india_party_name      TEXT,    -- the Indian company (shipper on export, consignee on import)
  india_party_email     TEXT,    -- critical: from Shipper Email or Consignee E-mail
  india_party_phone     TEXT,
  india_party_contact   TEXT,    -- contact person name
  india_iec             TEXT,    -- Importer Exporter Code (govt ID)
  quantity              NUMERIC,
  quantity_unit         VARCHAR(30),
  fob_value_usd         NUMERIC,
  cif_value_usd         NUMERIC,
  port_origin           TEXT,
  port_dest             TEXT,
  shipment_mode         TEXT,
  trade_direction       VARCHAR(10),  -- 'export' | 'import'
  source_file           TEXT,
  company_id            INTEGER REFERENCES global_trade_companies(id),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trade_shipments_india_name  ON trade_shipments(india_party_name);
CREATE INDEX idx_trade_shipments_india_email ON trade_shipments(india_party_email);
CREATE INDEX idx_trade_shipments_iec         ON trade_shipments(india_iec);
CREATE INDEX idx_trade_shipments_hs          ON trade_shipments(hs_code);
CREATE INDEX idx_trade_shipments_company     ON trade_shipments(company_id);
CREATE INDEX idx_trade_shipments_date        ON trade_shipments(shipment_date);
```

**Step 2 — Python import script: `scripts/data/import_volza.py`**

Column mapping logic (file-type dependent):
- Detect direction from filename: "Ex" / "Export" → `trade_direction = 'export'`; "Im" / "Import" → `trade_direction = 'import'`
- If `trade_direction = 'export'`: `india_party_name` = Shipper Name, `india_party_email` = Shipper Email, `india_party_phone` = Shipper Phone, `india_party_contact` = Shipper Contact Person, `india_iec` = IEC
- If `trade_direction = 'import'`: `india_party_name` = Consignee Name, `india_party_email` = Consignee E-mail, `india_party_phone` = Consignee Phone, `india_party_contact` = Contact Person, `india_iec` = IEC
- Skip row 1 (title/period header), row 2 = column headers, data starts row 3
- Batch upsert 1000 rows (idempotent on `india_party_name + shipment_date + hs_code + port_dest`)
- Log progress: `[3304_Ex_Ind.xlsx] 1000/32768 rows...`

**Step 3 — Contact enrichment backfill: `scripts/data/enrich_from_volza.py`**

After import, run:
- Query `global_trade_companies` where `contact_email IS NULL`
- For each: search `trade_shipments` where `india_party_name` fuzzy matches `company_name` (trigram similarity > 0.7)
- Where match found AND `india_party_email IS NOT NULL`: update `global_trade_companies.contact_email` + `contact_phone`
- Log: total matched, total emails populated, match rate %

This directly populates `contact_email` in the main companies table — contact reveals start working immediately for matched VOLZA companies.

**Step 4 — Company cross-reference for `company_id` link**

Same fuzzy match → set `trade_shipments.company_id` for display on detail pages.

**Step 5 — Drizzle schema update**

Add `tradeShipments` table to `bmn-site/src/lib/db/schema.ts`

**Step 6 — No UI changes in this entry.** UI for trade history on `/database/[id]` is ENTRY-12.1 (separate entry, after this one).

#### Files to create/change
- `scripts/data/import_volza.py` — NEW
- `scripts/data/enrich_from_volza.py` — NEW (replaces link_volza_companies.py)
- `bmn-site/src/lib/db/schema.ts` — add tradeShipments table
- `bmn-site/src/lib/db/migrations/016_trade_shipments.sql` — NEW migration

#### Files NOT changed
- All existing app routes — no UI in this entry
- `global_trade_companies` schema — contact_email field already exists, just being populated

#### Design Reference
No UI changes in this entry.

#### Success Metric
`SELECT COUNT(*) FROM trade_shipments` = 178,083 rows.

#### Failure Signal
Import script exits with error, or COUNT < 178,000 (data loss during import).

#### Status: APPROVED — PM (Claude) — 2026-02-24

---

## ENTRY-16.0 — VOLZA Full Coverage Expansion (Future)

**Tier:** L
**Status:** FUTURE — after ENTRY-15.0 complete
**What:** Systematic download of VOLZA data for all remaining HS chapters and country corridors. Strategy: prioritize HS chapters with highest Indian export volume. Download India↔Top 20 partner countries.

**PM to plan when ENTRY-15.0 is shipped.**

---

## 📊 DATA ASSET INVENTORY

Full analysis: `.agent/DATA_ASSET_INVENTORY.md` — **Updated 2026-02-24 post ENTRY-10.2 counter-audit.**

### PM response to ENTRY-10.2 (Antigravity counter-analysis)

**Accepted findings (verified by PM independently):**

| # | Finding | Impact | Action |
|---|---------|--------|--------|
| FLAG-1 | VOLZA has 58+ columns including Indian party email, phone, contact, IEC — PM missed entirely | **CRITICAL** — VOLZA is a direct contact enrichment source | ENTRY-15.0 schema revised. `enrich_from_volza.py` added. |
| FLAG-2 | SilkEPC: 11,044 rows not 12,787 (-1,743) | Minor — gap fill estimate slightly overstated | ENTRY-13.0 scope note updated |
| FLAG-3 | VOLZA total is 153,994 actual (PM off by 9 — off-by-one in row skip) | Negligible | Inventory corrected |
| FLAG-4 | Santander ~4.6M rows, not ~2M (15-file sample avg 23,614/file) | Storage + import time ~2.3× larger than planned | ENTRY-10.1 must handle ~4.6M rows. Import script performance matters. |
| FLAG-6 | Embassy has 15 non-ZIP files (PM described 6). 3 additional files have email. Extrapolated ~85k total records (PM said ~30k) | ENTRY-13.1 larger than planned | Inventory updated to ~85k |
| FLAG-7 | Zaubacorp Dir 1 schema inconsistent — first file header = "Email ID", not CIN/company_name | Investigate before any Dir 1 use | Do not use Dir 1 until schema is mapped |
| spiceboard correction | spiceboard.csv HAS email column — PM said "no email" | More contact reveals available immediately | Inventory corrected |
| 3 malformed EPC files | Shefexil.xlsx, Cashew.xlsx, Tobacoepcsheet.xlsx have email/phone as column headers | These 3 files cannot be imported without manual fix | ENTRY-13.0 must skip these 3 or fix schema before import |
| Ch_1 duplicate | Ch_1.xlsx and Ch_1(1).xlsx appear identical | Deduplication required | ENTRY-10.1 import script must deduplicate on company_name + country |

**Partially rejected:**
- Antigravity's FLAG-1 headline says "Shipper Email" — technically the export files have `Shipper Email` and import files have `Consignee E-mail`. The contact is always the **Indian party**, not both parties. PM independently verified this distinction. The strategic impact is the same — 178k Indian company contacts.

**Core finding revised:** VOLZA's 178k records contain Indian party email + phone for every shipment. ENTRY-15.0 now directly populates `global_trade_companies.contact_email` via fuzzy match — this is the fastest path to working contact reveals, faster than ENTRY-14.0 cross-reference.

---

## ENTRY-QA-1 — PM Diagnosis (2026-02-26)

### Root Cause: All Playwright CI Failures

**Status: Not a code bug. Test configuration failures.**

After reading all 7 onboarding step components, all UI components (`FeatureIcon`, `SelectableCard`, `MobileStickyNav`, `ProfilePicUpload`, `HSCodeSearch`, `StepProgress`), and the `storage.ts` module — **zero code-level bugs found in OnboardingWizard**. The component code is clean.

#### The "OnboardingWizard crash" was misdiagnosed:
- **Actual cause:** `page.route()` in Playwright only intercepts browser-initiated requests. The `/onboarding` page uses Next.js server-side Supabase auth (`next/headers`) which runs on the server and bypasses Playwright browser mocks entirely → server redirects to `/login` → test sees login page, not wizard → error boundary triggered NOT by a crash but by missing auth.
- **SSR fix** (commit `0b73ae9`) was legitimate and correct: Drizzle Date objects were not JSON-serializable. `JSON.parse(JSON.stringify(profile))` correctly fixes this.
- After SSR fix, wizard would render correctly for authenticated users. The "crash persists" was a Playwright test configuration issue, not a second code bug.

#### Individual failure root causes:

| Test | Root Cause | Fix |
|------|-----------|-----|
| golden-path | `page.route()` doesn't intercept server-side auth → redirects to `/login` | Restructured to use real login (done) |
| J1 signup | `locator('input[type="password"]')` strict mode violation — 2 password inputs on signup page | Fixed: `.first()` added (done) |
| J2 login | `TEST_USER_EMAIL` is Google OAuth account with no password → `invalid login credentials` | CEO action: create email+password test user |
| J4 database | Blocked by J2 auth failure | CEO action |
| J7 profile | Blocked by J2 auth failure | CEO action |
| J8 mobile | Blocked by J2 auth failure | CEO action |
| onboarding-persistence | Hardcoded local paths + goes to `/onboarding` without auth | Deleted (stale spec) |
| production-smoke | Hardcoded production URL + fake credentials + local paths | Deleted (stale spec) |
| verify-fixes | Checks for Tawk.to widget (not installed) | Deleted (stale spec) |
| verification-remediation | Hardcoded local paths → crash on screenshot write in CI | Deleted (stale spec) |

**J3 PASSING ✓** — No auth required, error banner test works correctly.

### PM Fixes Applied (this session):
1. `j1-signup.spec.ts` — fixed `locator('input[type="password"]').first()` (strict mode fix)
2. `golden-path.spec.ts` — removed broken server-side mocks, restructured to use real login
3. Deleted 4 stale spec files: `production-smoke`, `verify-fixes`, `verification-remediation`, `onboarding-persistence`

### CEO Action Required (blocking J2, J4, J7, J8, golden-path):

**You must do this once in Supabase dashboard:**

1. Go to Supabase → Authentication → Users → "Add user" → "Create new user"
2. Email: `test@businessmarket.network` (or similar dedicated address), Password: (set a strong password)
3. In Supabase Table Editor → `profiles` table → find that user's `id` → set `onboarding_completed = true`, `onboarding_step = 7`
4. Go to GitHub → Settings → Secrets → Actions → Update:
   - `TEST_USER_EMAIL` → the email you set
   - `TEST_USER_PASSWORD` → the password you set
5. Also update `PLAYWRIGHT_BASE_URL` to the Vercel preview URL for PR #26

**Why `onboarding_completed = true`?** J2 tests "returning user → dashboard" flow. A returning user who has already done onboarding goes to dashboard, not /onboarding. This is correct test data setup, not bypassing any issue.

### After CEO action:
Tests that should pass: J1, J2, J3, J4, J7, J8, golden-path (7/7 J-series + golden path)

---
