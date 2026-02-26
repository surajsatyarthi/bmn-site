import { test, expect } from '@playwright/test';

/**
 * J2 — Login → App (no pre-configured state)
 *
 * The test user is created with email+password in Supabase but NO DB fields
 * are pre-set. The app decides where to send the user after login (onboarding
 * or dashboard) based on their real state — same as any actual user.
 *
 * If user has not completed onboarding: app redirects to /onboarding — verified.
 * If user has completed onboarding: app redirects to /dashboard — verified.
 * Either state = PASS. The test asserts the page does not crash, not the URL.
 */
test('J2 — login with valid credentials enters app without crash', async ({ page }) => {
  await page.goto('/login');

  // Login page renders
  await expect(page.locator('h1')).toHaveText('Welcome Back');

  // Google OAuth button is present (ENTRY-RESTORE-OAUTH — CEO decision 2026-02-26)
  await expect(page.locator('text=Sign in with Google')).toBeVisible();

  // Fill credentials and submit
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // App redirects to onboarding or dashboard — both are valid
  await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 20000 });

  // Page does NOT crash — no error boundary triggered
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();

  // Header is visible regardless of where we landed
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('header >> text=BMN')).toBeVisible();
});
