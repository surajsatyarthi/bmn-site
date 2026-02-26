import { test, expect } from '@playwright/test';

/**
 * Golden Path — Returning User: Login → Dashboard
 *
 * WHY the previous page.route() mocks were removed:
 * page.route() only intercepts browser requests. The /onboarding page uses
 * server-side Supabase auth (next/headers) which runs on the Next.js server —
 * completely bypassing browser mocks → page redirects to /login → test fails.
 *
 * This test uses real TEST_USER credentials (email+password test account).
 *
 * CEO PREREQUISITE (one-time setup):
 *   1. Create email+password account in Supabase Auth (NOT Google OAuth)
 *   2. Complete onboarding manually OR set profile.onboarding_completed = true in DB
 *   3. Set GitHub secrets: TEST_USER_EMAIL, TEST_USER_PASSWORD
 */
test('Golden Path: Login → Dashboard renders without crash', async ({ page }) => {
  // 1. Visit homepage
  console.log('Visiting Homepage...');
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Get Started Free' })).toBeVisible();

  // 2. Navigate to login
  console.log('Navigating to Login...');
  await page.goto('/login');
  await expect(page.locator('h1')).toBeVisible();

  // 3. Fill credentials and submit
  console.log('Logging in with test credentials...');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // 4. Wait for redirect to dashboard (test user has onboarding_completed = true)
  console.log('Waiting for dashboard redirect...');
  await page.waitForURL('**/dashboard', { timeout: 20000 });

  // 5. Dashboard does NOT crash
  console.log('Verifying dashboard renders without crash...');
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();

  // 6. Dashboard header is visible
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('header >> text=BMN')).toBeVisible();

  // 7. Credit counter is visible
  await expect(page.locator('[data-testid="credit-counter"]')).toBeVisible();

  console.log('Golden Path Verified Successfully!');
});
