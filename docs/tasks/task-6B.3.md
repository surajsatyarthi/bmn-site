# Task 6B.3 — Homepage News Preview + Industries Section (Phase 6B)

**Block:** 6B.3
**Status:** TODO
**Prerequisites:** Block 6B.1 PASSED (News backend with data)
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Add two new sections to the homepage (landing page):
1. **Trade News Preview** — Show 5 latest news items with signup gate (lead generation)
2. **Industries We Support** — Icon grid showcasing preferred products/industries

**Why:** Homepage currently has no fresh content. News preview drives signups (content gate), and industries section improves SEO + clarifies value proposition.

---

## Deliverable 1: Trade News Preview Section

### Location: `/` (homepage, `src/app/page.tsx`)

**Placement:** Between "How It Works" and "Pricing" sections

**Design:**
```
┌───────────────────────────────────────────────┐
│     📰 Latest Trade News & Insights           │ ← Section heading
│     Stay ahead with daily updates             │ ← Subheading
│                                                │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ News Card 1  │  │ News Card 2  │  ...     │ ← 5 cards
│  │ Title        │  │ Title        │          │
│  │ Source • 2h  │  │ Source • 5h  │          │
│  └──────────────┘  └──────────────┘          │
│                                                │
│  ────── Sign up to read full articles ──────  │ ← Content gate
│  [Sign Up Free →]                             │ ← CTA button
└───────────────────────────────────────────────┘
```

**Implementation:**

**Fetch News:**
```typescript
// Server Component - fetch 5 latest news
const latestNews = await db
  .select()
  .from(tradeNews)
  .orderBy(desc(tradeNews.publishedAt))
  .limit(5)
```

**News Preview Card:**
- Shows: Title (1 line truncate), Source name, Relative time ("2h ago")
- No summary (teaser only)
- No click action (cards are decorative, drive signup)
- Blur effect on cards (CSS: `filter: blur(2px)`) to indicate locked content

**Signup CTA:**
- Button: "Sign Up Free to Read Full Articles"
- Links to `/signup`
- Prominent gradient styling (use `btn-primary` class)

**Acceptance:**
- Section shows 5 news cards
- Cards are blurred (locked content effect)
- Signup button is prominent and clickable
- Mobile responsive (cards stack vertically at 375px)

---

## Deliverable 2: Industries We Support Section

### Location: `/` (homepage, after "Global Reach" section)

**Design:**
```
┌───────────────────────────────────────────────┐
│    Industries We Support                      │ ← Section heading
│    Connecting businesses across key sectors   │ ← Subheading
│                                                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ 🌾  │ │ 🏗️  │ │ 💊  │ │ 👕  │ │ ⚙️  │    │ ← Icons
│  │Agri │ │Const│ │Pharm│ │Text │ │Mach │    │ ← Labels
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘    │
│                                                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ 🔌  │ │ 🍎  │ │ 🧪  │ │ 🚗  │ │ 💎  │    │
│  │Elec │ │Food │ │Chem │ │Auto │ │Gems │    │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘    │
└───────────────────────────────────────────────┘
```

**Industries List (based on preferred products):**

Use the preferred products list shared by user. Map to these categories:

| Industry | Icon | HS Code Range | Example Products |
|----------|------|---------------|------------------|
| Agriculture & Food | 🌾 | 01-24 | Grains, produce, meat, dairy |
| Textiles & Apparel | 👕 | 50-63 | Fabrics, garments, footwear |
| Chemicals & Plastics | 🧪 | 28-40 | Industrial chemicals, plastics |
| Pharmaceuticals | 💊 | 30 | Medicines, medical devices |
| Electronics | 🔌 | 85 | Consumer electronics, components |
| Machinery | ⚙️ | 84 | Industrial machinery, equipment |
| Automotive | 🚗 | 87 | Vehicles, auto parts |
| Construction Materials | 🏗️ | 68-69, 76 | Cement, steel, aluminum |
| Gems & Jewelry | 💎 | 71 | Diamonds, gold, jewelry |
| Energy & Resources | ⚡ | 27 | Coal, oil, renewable energy |

**Implementation:**

**Data Structure:**
```typescript
const INDUSTRIES = [
  { name: 'Agriculture & Food', icon: '🌾', hsCodes: ['01', '02', '04', '07', '08'] },
  { name: 'Textiles & Apparel', icon: '👕', hsCodes: ['50', '61', '62'] },
  // ... rest
]
```

**Component:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-5 gap-6">
  {INDUSTRIES.map(industry => (
    <div key={industry.name} className="text-center">
      <div className="text-5xl mb-2">{industry.icon}</div>
      <p className="text-sm font-semibold">{industry.name}</p>
    </div>
  ))}
</div>
```

**Acceptance:**
- Grid shows 10+ industries with icons
- Icons are large and clear (48px+)
- Responsive: 2 columns on mobile, 5 on desktop
- Matches BMN brand styling

---

## Deliverable 3: SEO Optimization

### Update: Homepage metadata

```typescript
export const metadata: Metadata = {
  title: "BMN - AI Finds Your Buyers. You Ship.",
  description: "Connect with verified global buyers and sellers across agriculture, textiles, electronics, pharma, and more. Get matched, grow your export business.",
  keywords: [
    "export business",
    "import platform",
    "trade matching",
    "agriculture export",
    "textile export",
    "electronics import",
    "pharma trade",
    ...INDUSTRIES.map(i => i.name)
  ]
}
```

**Acceptance:**
- Keywords include all industry names
- Description mentions key industries
- OpenGraph tags present (optional but recommended)

---

## Deliverable 4: Content Gate Analytics (Optional)

### Track: Signup conversions from news preview

Add event tracking to signup button:
```typescript
onClick={() => {
  // Track with Plausible/Google Analytics
  window.plausible?.('News Preview Signup Click')
  router.push('/signup')
}}
```

**Acceptance:**
- Signup button click is tracked
- Can measure conversion rate (news preview → signups)

---

## Deliverable 5: Mobile Optimization

### Requirements:
- News preview cards stack vertically on mobile
- Industries grid shows 2 columns on mobile (375px)
- All text is readable without zoom
- No horizontal scroll

**Acceptance:**
- Test at 375px viewport
- Lighthouse Performance ≥90
- All interactions work on touch

---

## Deliverable 6: Empty State Handling

### Scenario: No news available yet

**Fallback UI:**
```
┌───────────────────────────────────────────────┐
│     📰 Latest Trade News & Insights           │
│     Stay ahead with daily updates             │
│                                                │
│  News feed is loading fresh content...        │
│  Check back soon or sign up for updates.      │
│                                                │
│  [Sign Up Free →]                             │
└───────────────────────────────────────────────┘
```

**Acceptance:**
- Section still renders when no news
- CTA remains visible
- No broken UI

---

## Constraints

- **No user interaction required** — news cards are display-only (no click to read)
- **Performance** — Fetch news server-side, no client API calls
- **Accessibility** — Icons have alt text, semantic HTML
- **Industries list** — Use provided preferred products list from user

---

## Evidence Required

Save all to `docs/evidence/block-6B.3/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Homepage screenshot (news preview) | `homepage-news-preview.png` |
| Homepage screenshot (industries section) | `homepage-industries.png` |
| Mobile screenshots (375px, both sections) | `mobile-homepage-*.png` |
| Lighthouse report | `lighthouse.json` |
| Empty state screenshot | `empty-state-news.png` |
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

Update ledger under Block 6B.3. Mark as **`SUBMITTED`**.
