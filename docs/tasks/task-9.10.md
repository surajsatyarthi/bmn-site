# Task 9.10 — Landing Page: Interactive Stakeholder Network Visualization

**Block:** 9.10
**Status:** TODO
**Prerequisites:** Block 9.1 COMPLETE (schema with 7 stakeholder types)
**PRD Reference:** Section 17 Phase 9, Task 9.10

---

## Objective

Create a visually striking, animated network visualization for the homepage that showcases BMN as the central hub connecting all 7 stakeholder types in the export-import ecosystem. This visual element communicates the platform's unique value proposition: a comprehensive trade services marketplace, not just a buyer-seller directory.

**Why this matters:**
- Differentiation: Shows BMN is more than Alibaba/IndiaMART (which only connect buyers/sellers)
- Network effects: Visualizes the ecosystem value (more stakeholders = more connections)
- Modern aesthetic: High-tech animation signals AI-powered platform sophistication
- Conversion: Helps visitors immediately understand the multi-stakeholder advantage

---

## Deliverable 1: Network Visualization Component

### Create: `src/components/landing/StakeholderNetwork.tsx`

**Client Component** (`'use client'`) — requires animation state and interactions.

### Visual Design Specifications

**Layout:**
```
        Chamber of Commerce
               /    \
    Insurance       Customs Broker
         \           /
          \         /
    Exporter ---- BMN ---- Importer
                / | \
               /  |  \
   Freight Forwarder  |
                     Both
```

**Center Node (BMN):**
- Larger pulsing circle/hexagon
- Blue gradient (`#2046f5` → `#4b6ff7`)
- BMN logo or "BMN" text
- Subtle glow effect

**Stakeholder Nodes (7 surrounding):**
- Smaller circles/hexagons arranged radially around BMN
- Each node labeled with stakeholder type:
  1. Exporter
  2. Importer
  3. Both (Exporter & Importer)
  4. Chamber of Commerce
  5. Insurance Provider
  6. Customs Broker
  7. Freight Forwarder
- Color-coded by category:
  - Core roles (Exporter, Importer, Both): Blue shades
  - Service providers (remaining 4): Gold/orange accent (`#FF8C00`)

**Connection Lines:**
- Animated lines connecting BMN to each stakeholder
- Particle effects flowing along lines (BMN → stakeholders and reverse)
- Subtle pulse/glow on connections
- Lines appear sequentially on load (stagger animation)

### Animation Requirements

**On Load:**
1. BMN center node fades in (0.3s)
2. Stakeholder nodes appear one-by-one in circular sequence (0.5s stagger)
3. Connection lines draw outward from BMN (0.8s each, sequential)
4. Particle flow begins (continuous loop)

**Continuous (Loop):**
- BMN center pulses gently (1.5s cycle)
- Particles flow along connections (2s travel time per particle)
- Subtle rotation of entire network (60s full rotation, barely perceptible)
- Node glow intensity oscillates (3s cycle)

**On Hover (Node):**
- Hovered node scales up 1.2x
- Connection to BMN brightens/thickens
- Tooltip appears with stakeholder description
- Other connections dim slightly (focus effect)

**Performance:**
- Use CSS transforms and `will-change` for GPU acceleration
- RequestAnimationFrame for smooth particle animation
- Pause animations when component not in viewport (Intersection Observer)
- Fallback to static image on low-end devices (`prefers-reduced-motion`)

### Technology Stack

**Recommended Approach:**

**Option A: Canvas-based (Recommended)**
- Use HTML5 Canvas for particle effects
- CSS for node positioning and basic animations
- Lightweight, performant on mobile
- Libraries: None required (vanilla Canvas API)

**Option B: SVG-based**
- SVG for nodes and connections
- GSAP or Framer Motion for animations
- More declarative, easier debugging
- May be heavier on mobile

**Option C: WebGL (Advanced)**
- Three.js or PixiJS for 3D-style network
- Most impressive visually
- Only if performance budget allows (avoid on mobile)

**Constraint:** No new heavy dependencies. If using library, max bundle impact: 10KB gzipped.

---

## Deliverable 2: Landing Page Integration

### Update: `src/app/page.tsx`

Add the network visualization to the landing page in one of two locations:

**Option A: Hero Section (Below Headline)**
```tsx
<section className="hero">
  <h1>We Find Your Buyers. You Ship.</h1>
  <p>AI-powered trade lead generation...</p>
  
  {/* Network Visualization */}
  <div className="my-12">
    <StakeholderNetwork />
  </div>
  
  <div className="cta-buttons">
    <Button>Get Started</Button>
  </div>
</section>
```

**Option B: "How It Works" Section (Recommended)**
```tsx
<section className="how-it-works">
  <h2>The BMN Ecosystem</h2>
  <p>More than a marketplace — a complete trade services platform</p>
  
  {/* Network Visualization */}
  <StakeholderNetwork />
  
  <p>BMN connects you to every stakeholder in your export journey:</p>
  <ul>
    <li>Buyers & Sellers</li>
    <li>Trade Certifications</li>
    <li>Logistics & Insurance</li>
    <li>Compliance & Customs</li>
  </ul>
</section>
```

**Placement decision:** User preference. Option B recommended for better storytelling flow.

---

## Deliverable 3: Responsive Design

### Breakpoints

**Desktop (≥1024px):**
- Full network: 600x600px
- All 7 stakeholder nodes visible
- Smooth animations

**Tablet (768px - 1023px):**
- Scaled network: 450x450px
- All nodes visible
- Reduced particle count (50% fewer)

**Mobile (≤767px):**
- Compact network: 320x320px
- Show only 4 key nodes (Exporter, Importer, Chamber, Freight Forwarder) + BMN center
- Simplified animations (no particles, only pulse)
- Static fallback option if performance poor

### Accessibility

- **Reduced Motion:** Respect `prefers-reduced-motion` media query
  - Static diagram with no animations
  - Show all connections at once
- **Screen Readers:** Provide descriptive alt text or `aria-label`
  - "BMN connects exporters, importers, chambers of commerce, insurance providers, customs brokers, and freight forwarders in a unified trade ecosystem"
- **Keyboard Navigation:** Stakeholder nodes focusable with Tab key, show tooltips on focus
- **Color Contrast:** Ensure text labels meet WCAG AA (4.5:1 contrast)

---

## Deliverable 4: Stakeholder Tooltips

### Tooltip Content (On Node Hover/Focus)

Format: **Role Name** — Brief description

| Node | Tooltip |
|------|---------|
| **Exporter** | "Sell your products to international buyers" |
| **Importer** | "Source quality goods from global suppliers" |
| **Both** | "Trade in both directions with one platform" |
| **Chamber of Commerce** | "Get trade certifications and verified credentials" |
| **Insurance Provider** | "Protect your cargo with vetted insurers" |
| **Customs Broker** | "Navigate compliance with expert brokers" |
| **Freight Forwarder** | "Ship globally with trusted logistics partners" |

**Tooltip UI:**
- Small card with rounded corners
- BMN blue background (`#2046f5`)
- White text, 14px font
- Appears above/below node based on position
- Fade in/out transition (200ms)

---

## Evidence Required (submit with delivery)

Save all to `docs/evidence/block-9.10/`:

| Evidence | File |
|----------|------|
| Gate output (build + lint + ralph + test) | `gates.txt` |
| Pre-submission checklist | `pre-submission-gate.txt` |
| Self-audit checklist | `self-audit.txt` |
| Desktop screenshot (full network, 1920x1080) | `screenshot-network-desktop.png` |
| Tablet screenshot (768px) | `screenshot-network-tablet.png` |
| Mobile screenshot (375px) | `screenshot-network-mobile.png` |
| Animation GIF/video (5s loop) | `animation-demo.gif` or `.mp4` |
| Reduced motion screenshot (static fallback) | `screenshot-network-static.png` |
| Lighthouse performance score (landing page) | `lighthouse-performance.txt` |

**Performance Requirement:** Landing page Lighthouse Performance score must remain ≥90 with network visualization active.

---

## Constraints

- **Bundle Size:** Network visualization component < 15KB gzipped (including animations)
- **No Heavy Dependencies:** If using animation library, must be tree-shakeable or < 10KB
- **Mobile Performance:** 60fps on iPhone 12 / Pixel 5 equivalent
- **Load Time:** Network should not delay page interactive time > 100ms
- **Fallback Required:** Static diagram for `prefers-reduced-motion` or slow devices
- **Accessibility:** WCAG 2.1 AA compliant (keyboard navigation, screen reader support)

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # 0 errors, 0 warnings on new files
npm run ralph:scan     # Must pass
npm run test           # All tests pass
```

**Additional Checks:**
- [ ] Network animates smoothly on load (no jank)
- [ ] All 7 stakeholder nodes visible and labeled (desktop)
- [ ] Tooltips appear on hover with correct descriptions
- [ ] Reduced motion fallback works (set in browser dev tools)
- [ ] Mobile version shows simplified network (≤4 nodes)
- [ ] Lighthouse Performance ≥90 on landing page
- [ ] Network component renders within 100ms of page load

---

## Design Inspiration & References

**Visual Style:**
- Modern, clean tech aesthetic (not cluttered)
- Inspired by: Stripe homepage animations, Linear's landing page, Vercel's network diagrams
- Color palette: BMN blue + gold accents (existing brand)

**Animation Style:**
- Subtle and professional (not flashy/gimmicky)
- Conveys "intelligent platform" not "busy infographic"
- Particles suggest data flow and connections

**Reference Examples:**
- [Stripe Connect illustration](https://stripe.com/connect) — multi-party ecosystem
- [Plaid network visualization](https://plaid.com) — connections between services
- Three.js globe examples — but MUCH simpler (no WebGL unless justified)

**Key Principle:** Form follows function. Every animation should reinforce the message: "BMN connects all stakeholders in one ecosystem."

---

## Notes for Antigravity

**Context:** This is a marketing/conversion optimization task, not core platform functionality. The goal is to communicate value proposition visually to first-time visitors.

**Implementation Guidance:**
1. **Start simple:** Begin with static positioned nodes + connections, then add animations incrementally
2. **Test performance early:** Measure bundle size and frame rate on mobile after each animation added
3. **Fallbacks matter:** 20-30% of users have reduced motion enabled — don't neglect this
4. **Copy matters:** Work with design system fonts/colors, but tooltip copy is fixed (see table above)

**Optional Enhancements (Out of Scope for 9.10):**
- Interactive mode where clicking a node shows case study/testimonial (Phase 10 feature)
- Real-time connection count badges (e.g., "1,234 exporters connected") — requires backend data
- 3D perspective effect on hover — cool but not necessary for MVP

**Priority:** P2 (nice-to-have). This enhances landing page conversion but is not blocking Phase 9 core functionality (schema, matching, APIs).

---

**Status:** TODO — Awaiting Block 9.1-9.9 completion  
**Assigned to:** Antigravity  
**Estimated effort:** 1 block (component build + landing page integration + responsive + a11y)

Update `docs/governance/project_ledger.md` under Block 9.10. Mark as **`SUBMITTED`** when ready for audit.
