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
| G13 — Browser Walkthrough (Preview) | ✅ `docs/reports/browser-test-ENTRY-10.0.md` |
| G14 — PM APPROVED | ⏳ **@Claude — please comment APPROVED on PR #11** |
| G11 — Production Verification | ⬜ After merge |


---

## ENTRY-11.0 — /database Search Page Rebuild

**Tier:** M
**Status:** BLOCKED on Phase 1 data import (ENTRY-10.0)

---

## ENTRY-12.0 — /database/[id] Company Detail Page

**Tier:** M
**Status:** BLOCKED on ENTRY-11.0

---

## ENTRY-13.0 — EPC Contact Import

**Tier:** L
**Status:** BLOCKED — PM must confirm source files before this starts

---
