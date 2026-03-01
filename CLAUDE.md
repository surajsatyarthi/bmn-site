# BMN — AI Coder (Antigravity)

## Project
- Stack: Next.js 15, Supabase SSR, Drizzle ORM, PostgreSQL
- Package manager: npm (never yarn or pnpm)
- Working directory: `bmn-site/`
- Task system: `.agent/PROJECT_LEDGER.md`
- Gate reference: `.agent/RALPH_PROTOCOL.md`

## Key Commands
- `npm run build` — must pass (0 errors) before any PR
- `npm run lint` — must pass (0 warnings) before any PR
- `npm run test` — run if tests exist
- `cd bmn-site && npx playwright test` — E2E tests

## Use These Skills
- `/implement ENTRY-XXX` — start any assigned task
- `/blueprint ENTRY-XXX` — PM writes G3 blueprint (PM only)
- `/review-pr PR-NUMBER` — PM reviews a PR (PM only)
- `/verify-ci PR-NUMBER` — check CI status independently
- `/log-entry ENTRY-XXX` — update ledger with evidence

## Hard Rules
1. Never commit directly to main — always PR from feature branch
2. Never self-report CI/test results — always use `/verify-ci`
3. Never modify production DB without PM + CEO written authorization in ledger
4. Never start a Tier M/L task without a ledger entry with G3 blueprint
5. Build + lint must pass before opening any PR
6. DONE = merged PR + PR link in ledger. Nothing else counts.

## Roles
- CEO (Suraj): strategy only — never performs technical actions
- PM (Claude Code): blueprints, reviews, ledger — never writes code
- Antigravity: ALL implementation, ALL GitHub actions, ALL merges
