# Task S0.2 — Infrastructure: CI/CD + Quality Automation

**Block:** S0.2
**Status:** TODO
**Prerequisites:** Block S0.1 PASSED (test framework must exist for CI to run tests)
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Automate all quality gates so they're enforced by tooling, not trust. After this block, no broken code can be committed (pre-commit hook), no unbuilt code can be pushed (pre-push hook), and no failing PR can be merged (GitHub Actions CI).

---

## Deliverable 1: GitHub Actions CI Workflow

### Create: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Unit Tests
        run: npm run test

      - name: Security Scan
        run: npm run ralph:scan
```

**Notes:**
- Steps run sequentially: lint → build → test → ralph
- If any step fails, the entire workflow fails and blocks the PR
- Build needs Supabase env vars as GitHub secrets (build may reference them)
- E2E tests (`test:e2e`) are NOT in CI yet — they require a running dev server + DB. Add in a future block when staging infra exists.

---

## Deliverable 2: Husky + lint-staged

### Install (dev dependencies):
- `husky`
- `lint-staged`

### Setup Husky:

Add to `package.json`:
```json
"scripts": {
  "prepare": "husky"
}
```

### Create: `.husky/pre-commit`

```bash
npx lint-staged
```

### Add lint-staged config to `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --max-warnings=0"
  ]
}
```

### Create: `.husky/pre-push`

```bash
npm run build && npm run ralph:scan
```

**What this enforces:**
- **On commit:** ESLint runs on staged `.ts`/`.tsx` files. If any lint error → commit blocked.
- **On push:** Full build + Ralph security scan. If either fails → push blocked.

---

## Deliverable 3: PR Template

### Create: `.github/pull_request_template.md`

```markdown
## Summary

<!-- What does this PR do? Keep it brief. -->

## Block

<!-- Which task block? e.g., S0.2, 5.1 -->

## Checklist (DoD v2.0)

### Gates
- [ ] `npm run build` — 0 errors
- [ ] `npm run lint` — 0 errors, 0 warnings on new/modified files
- [ ] `npm run ralph:scan` — no P0 issues
- [ ] `npm run test` — all tests pass

### Quality
- [ ] error.tsx for any new route group
- [ ] loading.tsx for any new page
- [ ] aria-label on new interactive elements
- [ ] metadata export on new page.tsx files
- [ ] Unit tests for new logic
- [ ] Mobile verified at 375px (if UI changes)

### Evidence
- [ ] `docs/evidence/block-{id}/gates.txt`
- [ ] `docs/evidence/block-{id}/test-output.txt`
- [ ] `docs/evidence/block-{id}/self-audit.txt`
- [ ] Screenshots saved (if UI changes)
- [ ] Mobile screenshots saved (if UI changes)

### Ledger
- [ ] `docs/governance/project_ledger.md` updated as SUBMITTED
```

---

## Deliverable 4: Git Repository Setup

### If git is not initialized:

```bash
git init
```

### Verify `.gitignore` includes:

```
node_modules/
.next/
.env
.env.local
.env*.local
coverage/
test-results/
playwright-report/
*.tsbuildinfo
```

If any of these are missing from the existing `.gitignore`, add them.

**Do NOT commit `.env.local`** — verify it's listed in `.gitignore`.

---

## Constraints

- **Authorized new dependencies (dev only):** husky, lint-staged
- **No production dependencies**
- **Do not modify any source code in `src/`** — this block only adds CI/CD tooling
- **Do not push to any remote** — just set up the local git + hooks + workflow file
- **GitHub Actions workflow must be valid YAML** — test with `yamllint` or equivalent
- **Pre-push hook must not take more than 3 minutes** on a cold build

---

## Evidence Required

Save all to `docs/evidence/block-S0.2/`:

| Evidence | File |
|----------|------|
| Gate output (build + lint + ralph + test) | `gates.txt` |
| `npm run test` output | `test-output.txt` |
| Pre-commit hook test: commit a file with lint error → blocked | `precommit-test.txt` |
| Pre-push hook test: push runs build + ralph | `prepush-test.txt` |
| `.github/workflows/ci.yml` content | `ci-workflow.txt` |
| `git status` showing clean working tree | `git-status.txt` |

**No evidence, no PASS.**

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # New/modified files: 0 errors, 0 warnings
npm run ralph:scan     # Must pass
npm run test           # All unit tests pass (from S0.1)
```

All four gates must pass. Update `docs/governance/project_ledger.md` under Block S0.2. Mark as **`SUBMITTED`**.
