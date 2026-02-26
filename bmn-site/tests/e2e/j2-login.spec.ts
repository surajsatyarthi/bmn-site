import { test, expect } from '@playwright/test';

/**
 * J2 — Returning User: Login → Dashboard
 * Written by PM (Claude). Antigravity must NOT modify assertions.
 * Antigravity must add data-testid attributes as specified below.
 */
test('J2 — login with valid credentials lands on dashboard without crash', async ({ page }) => {
  await page.goto('/login');

  // Login page renders
  await expect(page.locator('h1')).toHaveText('Welcome Back');

  // Google OAuth button is present (ENTRY-RESTORE-OAUTH — CEO decision 2026-02-26)
  await expect(page.locator('text=Sign in with Google')).toBeVisible();

  // Fill credentials
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // Lands on /dashboard (via /onboarding redirect for completed users)
  await page.waitForURL('**/dashboard', { timeout: 20000 });

  // Dashboard does NOT crash
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();

  // Dashboard header is visible
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('header >> text=BMN')).toBeVisible();

  // Credit counter badge is visible in header
  // Antigravity: add data-testid="credit-counter" to CreditCounter component
  await expect(page.locator('[data-testid="credit-counter"]')).toBeVisible();
});
