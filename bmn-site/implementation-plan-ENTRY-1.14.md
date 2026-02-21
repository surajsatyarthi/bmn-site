# Implementation Plan — ENTRY-1.14
Date: 2026-02-21
Task: Fix feat/block-1.14-profile-edit to unblock merge to main

## Problem Statement
1. profile/edit/page.tsx is 'use client' — metadata.ts is dead code,
   SEO is broken, Next.js App Router architecture is violated.
2. All 4 Ralph gate artifacts are missing — CI ralph:scan rejects branch.
3. error.issues accessed on unknown type in route.ts:117 — potential lint fail.
4. PATCH /api/profile/update has zero test coverage.

## Proposed Solution
Fix 1: Extract form to EditProfileForm.tsx (Client Component).
        Rewrite page.tsx as Server Component with metadata export.
        Delete dead metadata.ts.
Fix 2: Create all missing Ralph gate artifacts.
Fix 3: Narrow unknown error type before accessing .issues in route.ts.
Fix 4: Add unit tests for PATCH /api/profile/update.

## Alternatives Considered
- Keep 'use client' page with route-level metadata → REJECTED: not supported
- Full server-render with server actions → REJECTED: too much scope
- Skip metadata, fix only CI → REJECTED: metadata is the stated goal

## Approval
APPROVED — CEO/PM Sign-off: 2026-02-21
Status: APPROVED
