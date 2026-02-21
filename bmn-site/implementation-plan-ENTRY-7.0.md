# Implementation Plan - ENTRY-7.0

## [Goal Description]
To build the **User Dashboard (Block 7.0)**, the central hub for our MVP launch. This dashboard will allow users to view their AI-generated matches, track their active campaigns, and update their profiles within a cohesive, modern B2B SaaS layout.

## Proposed Changes

### Dashboard Layout Shell
- A responsive `Sidebar` component (`src/components/dashboard/Sidebar.tsx`) utilizing `lucide-react` icons and a clean, vertical navigation structure.
- A `TopNav` component (`src/components/dashboard/TopNav.tsx`) featuring a breadcrumb trail and a User Profile dropdown menu using Radix UI for access to settings and logout.
- Updating `src/app/(dashboard)/layout.tsx` to handle the grid layout separating the Sidebar and the main `<main>` content area.

### Dashboard Home (Overview)
- **File:** `src/app/(dashboard)/page.tsx`
- **Component:** `MetricCards` to display High-level stats: "Total Matches", "Active Campaigns", and "Profile Completion Score".
- **Component:** `RecentMatchesPreview` a small table/list showing the 3 most recently generated matches.
- **Data Fetching:** All components on this page will fetch data natively on the server using Server Components and Drizzle ORM to ensure zero-latency initial paints and zero-layout shift.

### Alternatives Considered (Mandatory Gate 3)
1. **Horizontal Top Navigation vs Vertical Sidebar:** We considered a horizontal top-nav only layout. However, modern SaaS (Stripe, Vercel) prefer Vertical Sidebars as they scale better when adding sub-menus (like Campaigns > Active, Campaigns > Drafts).
2. **Client-side Fetching (React Query) vs Server Components:** We considered fetching dashboard data on the client to show a skeleton loader immediately. We opted for Server Components with Next.js `loading.tsx` to achieve a faster Time-to-Interactive with smaller JS bundles, reserving client components solely for interactive UI states (like expanding a match row).

## Verification Plan

### Automated Tests
- Security Scan output via `npm run ralph:scan --full`.
- Linter and TypeScript compiler zero-error policy.

### User Review Required
> [!IMPORTANT]
> The Ralph Protocol requires formal approval before any code is written. If you agree with this plan, simply say "Approved" or add "APPROVED" to this document so the pre-commit hooks allow me to proceed.

**APPROVED**
