# Task 4.2 — Landing Page Polish & Footer

**Block:** 4.2
**Status:** TODO
**Prerequisites:** Block 4.1 PASSED
**PRD Reference:** Section 4.6 (Landing Page), Phase 3 tasks 3.7-3.9, Founder requirements (2026-02-06)

---

## Objective

Transform the landing page from a 4-section skeleton into a full marketing page with trust signals, social proof, pricing, FAQ, and a proper footer with legal links. Also create 4 static legal/info pages.

**Current landing page** (`src/app/page.tsx`) has:
1. Hero
2. How It Works (4 steps)
3. Why BMN (3 cards)
4. CTA Banner
5. Basic footer (Login, Sign Up, Privacy Policy placeholder)

**Target landing page** adds 7 new sections and replaces the footer.

---

## Deliverable 1: Trusted By Logo Bar

Add **below the Hero, above How It Works**.

Display a horizontal row of partner/client logos with the heading "Trusted By Leading Enterprises".

**Logos (6):** Maersk, Walmart, Toyota, Hapag-Lloyd, Samsung, Adani

Since we don't have actual logo image files, render each logo as a styled text pill:

```
<div className="flex flex-wrap justify-center items-center gap-8">
  {logos.map(name => (
    <span className="text-lg font-semibold text-gray-400">{name}</span>
  ))}
</div>
```

Style: `py-12 bg-white border-b border-bmn-border`. Muted gray text to look like a logo bar. Center-aligned.

Keep it simple — these will be replaced with actual SVG logos later.

---

## Deliverable 2: Impact Numbers Bar

Add **below How It Works, above Why BMN**.

A full-width colored bar with 3 stats:

| Stat | Value | Label |
|---|---|---|
| 1 | 200+ | Companies Onboarded |
| 2 | 200+ | Countries Covered |
| 3 | 1M+ | Trade Records in Database |

Style: `py-16 bg-bmn-navy text-white`. Grid of 3 columns. Large bold numbers (`text-4xl font-bold`) with smaller labels below (`text-sm text-blue-200`).

---

## Deliverable 3: Stats Bar

Add **below Why BMN, above the "Perfect For" section**.

3 inline stats in a row:

| Stat | Value |
|---|---|
| $2.5M+ | Deals Facilitated |
| 70% | Faster Buyer Discovery |
| 50% | Faster Approval Process |

Style: `py-12 bg-bmn-light-bg`. Light background, same grid-of-3 layout as Impact Numbers but with `text-text-primary` colors.

---

## Deliverable 4: "Perfect For" Section

Add **below Stats Bar, above Pricing**.

Heading: "Perfect For"
Subheading: "Built for businesses ready to scale internationally"

**3 audience cards:**

| Card | Title | Description |
|---|---|---|
| 1 | Exporters | "Indian manufacturers and traders looking to find verified international buyers for their products." |
| 2 | Manufacturers | "Production houses with export-ready goods seeking direct buyer relationships without middlemen." |
| 3 | Trade Brokers | "Trade intermediaries looking to expand their portfolio with data-backed buyer-seller connections." |

Card style: Same as existing `ValueCard` pattern — icon + title + description. Use icons from lucide-react: `Ship`, `Factory`, `Briefcase`.

---

## Deliverable 5: Pricing Section

Add **below "Perfect For", above Testimonials**.

Heading: "Simple, Transparent Pricing"
Subheading: "Start free. Upgrade when you're ready."

**2 pricing cards side by side:**

**Free Plan:**
- Price: `$0/month`
- Badge: "Current Plan" or no badge
- Features (bullet list):
  - Unlimited match browsing
  - 3 business detail reveals per month
  - Basic campaign tracking
  - Email support
- CTA button: "Get Started" → `/signup`

**Pro Plan:**
- Price: "Coming Soon"
- Badge: none
- Features (bullet list):
  - Unlimited match reveals
  - Priority outreach campaigns
  - Dedicated account manager
  - Advanced analytics
- CTA button: "Contact Us" → `/contact`

Card style: `bg-white rounded-xl border border-bmn-border p-8 shadow-sm`. Pro card gets a `border-bmn-blue border-2` highlight. Grid of 2 columns.

---

## Deliverable 6: Testimonials Section

Add **below Pricing, above Countries Grid**.

Heading: "What Our Clients Say"

**3 testimonial cards:**

| # | Quote | Name | Title | Company |
|---|---|---|---|---|
| 1 | "BMN found us 3 qualified buyers in the UAE within the first week. We've already shipped our first container." | Rajesh Patel | Director | Patel Exports, Gujarat |
| 2 | "We spent years at trade shows with no results. BMN matched us with a German buyer in 48 hours." | Priya Sharma | CEO | Sharma Textiles, Mumbai |
| 3 | "The done-for-you approach is exactly what Indian exporters need. No more chasing fake leads." | Anil Mehta | Founder | Mehta Spices, Kerala |

Card style: `bg-white rounded-xl border border-bmn-border p-6 shadow-sm`. Quote in `italic text-text-secondary`, name in `font-semibold`, title/company in `text-sm text-text-secondary`. Grid of 3.

Section style: `py-24 bg-bmn-light-bg`.

---

## Deliverable 7: Countries Grid

Add **below Testimonials, above CTA Banner**.

Heading: "Global Reach"
Subheading: "Connecting Indian businesses with buyers in 60+ countries"

Display a grid of country names (no flag images — text only with country code emoji flags via Unicode).

**Countries (show 24, representative sample):**

```
🇦🇪 UAE, 🇺🇸 USA, 🇩🇪 Germany, 🇬🇧 UK, 🇯🇵 Japan, 🇸🇬 Singapore,
🇳🇱 Netherlands, 🇧🇷 Brazil, 🇸🇦 Saudi Arabia, 🇦🇺 Australia,
🇨🇦 Canada, 🇫🇷 France, 🇮🇹 Italy, 🇰🇷 South Korea, 🇹🇷 Turkey,
🇲🇾 Malaysia, 🇹🇭 Thailand, 🇰🇪 Kenya, 🇳🇬 Nigeria, 🇿🇦 South Africa,
🇲🇽 Mexico, 🇪🇬 Egypt, 🇮🇩 Indonesia, 🇻🇳 Vietnam
```

Grid: `grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4`. Each item: flag emoji + country name, centered, `text-sm`.

Below the grid: `<p className="text-center text-text-secondary mt-6">...and 40+ more</p>`

Section style: `py-24 bg-white border-y border-bmn-border`.

---

## Deliverable 8: FAQ Section

Add **below CTA Banner, above Footer**.

Heading: "Frequently Asked Questions"

**12 questions with answers** (use a simple disclosure/accordion pattern — each Q is a clickable div that toggles the answer):

| # | Question | Answer |
|---|---|---|
| 1 | What is BMN? | BMN is an export done-for-you service that connects Indian exporters with verified international buyers using AI-powered matching and outreach. |
| 2 | How does BMN find buyers? | We use AI to analyze global trade data, customs records, and buyer databases to find companies actively importing products similar to yours. |
| 3 | Is BMN free to use? | Yes. You can sign up for free and browse all your matches. Business detail reveals are limited to 3 per month on the free plan. |
| 4 | What is a "reveal"? | When you find a match you're interested in, you can "reveal" their full business details — contact info, trade history, and address. Free users get 3 reveals per month. |
| 5 | How are matches scored? | We rank matches as "Best", "Great", or "Good" based on product alignment, trade history, volume compatibility, and geographic fit. |
| 6 | What happens after I express interest? | Our team creates a targeted email outreach campaign to introduce your company to the buyer. You can track the campaign status from your dashboard. |
| 7 | Do I need an IEC number? | An IEC (Import Export Code) is recommended but not required to sign up. It helps us verify your export readiness and improves match quality. |
| 8 | Which countries do you cover? | We currently cover 60+ countries with active trade flows to and from India, including UAE, USA, Germany, UK, Japan, Singapore, and more. |
| 9 | How long does it take to get matches? | Most users see their first matches within 24-48 hours of completing their trade profile. |
| 10 | Is my data safe? | Absolutely. We use enterprise-grade encryption and never share your data with third parties without your explicit consent. |
| 11 | Can importers use BMN? | Yes. While our primary focus is helping Indian exporters find buyers, importers can also sign up to find verified suppliers. |
| 12 | How do I upgrade to Pro? | The Pro plan is coming soon. Contact us to join the waitlist for unlimited reveals, priority campaigns, and dedicated support. |

Implementation: Create a `'use client'` component `FAQAccordion` in `src/components/landing/FAQAccordion.tsx`. Use local `useState` to toggle open/closed state per item. No external dependencies.

Section style: `py-24 bg-bmn-light-bg`.

---

## Deliverable 9: Footer Overhaul

Replace the existing footer in `src/app/page.tsx` with a proper multi-column footer.

**Layout (3 columns on desktop, stacked on mobile):**

**Column 1 — Brand:**
- "BMN" logo text (bold, bmn-blue)
- "Export Done-For-You" tagline
- "A product of Invictus International Consulting Services"

**Column 2 — Quick Links:**
- Login → `/login`
- Sign Up → `/signup`
- Pricing → `#pricing` (anchor to pricing section)
- FAQ → `#faq` (anchor to FAQ section)

**Column 3 — Legal:**
- Contact Us → `/contact`
- Terms and Conditions → `/terms`
- Privacy Policy → `/privacy`
- Refund Policy → `/refund`

**Bottom bar (full-width):**
- `© 2026 Business Market Network. All rights reserved.`

Style: `bg-gray-900 text-white py-16`. Links in `text-gray-400 hover:text-white`. Bottom bar: `border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm`.

---

## Deliverable 10: Legal Pages (4 static pages)

Create 4 static pages. These are simple informational pages with no database queries. Server Components, no auth required.

### 10a. Contact Us — `src/app/(legal)/contact/page.tsx`
- Heading: "Contact Us"
- Company name: Invictus International Consulting Services
- Email: info@businessmarket.network
- Address: (leave as "Mumbai, India" placeholder)
- "For support, email us at info@businessmarket.network"
- Back to home link

### 10b. Terms and Conditions — `src/app/(legal)/terms/page.tsx`
- Heading: "Terms and Conditions"
- Standard SaaS terms placeholder text (5-6 sections):
  1. Acceptance of Terms
  2. Description of Service
  3. User Obligations
  4. Intellectual Property
  5. Limitation of Liability
  6. Governing Law (India)
- Each section: heading + 2-3 sentences of placeholder prose
- "Last updated: February 2026"

### 10c. Privacy Policy — `src/app/(legal)/privacy/page.tsx`
- Heading: "Privacy Policy"
- Standard privacy policy sections:
  1. Information We Collect
  2. How We Use Your Information
  3. Data Sharing
  4. Data Security
  5. Your Rights
  6. Contact
- Placeholder prose per section
- "Last updated: February 2026"

### 10d. Refund Policy — `src/app/(legal)/refund/page.tsx`
- Heading: "Refund Policy"
- Short page (free tier = no refund needed; Pro = refund terms TBD)
- Key points: Free tier has no charges, Pro plan refund terms will be published when Pro launches
- "Last updated: February 2026"

**Legal page layout:** Create a shared layout `src/app/(legal)/layout.tsx` with:
- Header (reuse existing `Header` component)
- Content area: `max-w-3xl mx-auto px-4 py-16`
- Footer (minimal — just copyright line and back-to-home link)

Style: Clean, readable. `prose` class if available from Tailwind typography plugin, otherwise standard `text-text-secondary leading-relaxed` with `text-2xl font-bold` headings.

---

## Deliverable 11: Header Navigation Update

Update `src/components/layout/Header.tsx`:

- Change "Features" link → `#how-it-works` (anchor on landing page)
- Change "Pricing" link → `#pricing` (anchor on landing page)
- Change "About" link → `/contact`

These are in-page anchors when on the landing page, standard links when on other pages.

---

## Section Order (Final Landing Page)

1. Header (exists)
2. Hero (exists)
3. **Trusted By** (NEW — Deliverable 1)
4. How It Works (exists)
5. **Impact Numbers** (NEW — Deliverable 2)
6. Why BMN (exists)
7. **Stats Bar** (NEW — Deliverable 3)
8. **Perfect For** (NEW — Deliverable 4)
9. **Pricing** (NEW — Deliverable 5) — add `id="pricing"`
10. **Testimonials** (NEW — Deliverable 6)
11. **Countries Grid** (NEW — Deliverable 7)
12. CTA Banner (exists)
13. **FAQ** (NEW — Deliverable 8) — add `id="faq"`
14. **Footer** (REPLACE — Deliverable 9)

---

## Constraints

- No new npm dependencies (no Tailwind typography plugin, no accordion libraries)
- All sections go in `src/app/page.tsx` — extract components to `src/components/landing/` as needed to keep the file manageable
- Icons from `lucide-react` only
- No images — use text, emojis, and styled divs for logos/flags
- All legal pages are placeholder copy — will be replaced with real legal text later
- Server Components for everything except `FAQAccordion` (needs `useState`)
- Mobile responsive on all new sections (use Tailwind responsive prefixes)
- Follow existing design system (card styles, colors, typography)

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # New/modified files: 0 errors, 0 warnings
npm run ralph:scan     # Must pass
```

All three gates must pass. Zero errors, zero warnings on all new/modified files.

Update `docs/governance/project_ledger.md` under Block 4.2. Mark as **`SUBMITTED`**.
