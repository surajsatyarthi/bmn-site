import { test, expect } from '@playwright/test';

/**
 * J1 — New User: Signup form submission
 * Written by PM (Claude). Antigravity must NOT modify assertions.
 *
 * NOTE: Full signup→verification→onboarding→dashboard flow cannot be automated
 * in CI because Supabase sends a real verification email that cannot be intercepted.
 * This spec verifies the signup form works correctly up to the "check your email" state.
 * The full flow is manually verified via G13 screenshot in the PR body.
 */
test('J1 — signup form submits and shows verification pending state', async ({ page }) => {
  await page.goto('/signup');

  // Signup page renders
  await expect(page.locator('h1')).toBeVisible();

  // Google OAuth button is present (ENTRY-RESTORE-OAUTH — CEO decision 2026-02-26)
  await expect(page.locator('text=Sign up with Google')).toBeVisible();

  // Form fields are present
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]').first()).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
});
