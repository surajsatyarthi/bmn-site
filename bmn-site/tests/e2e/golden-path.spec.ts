import { test, expect } from '@playwright/test';

/**
 * Golden Path — Real user journey: Homepage → Login → App
 *
 * No mocks. No pre-configured DB state. The test user is a real Supabase
 * email+password account with no manually set fields. The app decides where
 * to route the user after login — same as any real user.
 *
 * CEO PREREQUISITE (one-time):
 *   1. Create email+password account in Supabase Auth (NOT Google OAuth)
 *   2. Set GitHub secrets: TEST_USER_EMAIL, TEST_USER_PASSWORD
 *   3. Set PLAYWRIGHT_BASE_URL to the PR #26 Vercel preview URL
 */
test('Golden Path: Homepage → Login → App without crash', async ({ page }) => {
  // 1. Visit homepage
  console.log('Visiting Homepage...');
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Get Started Free' })).toBeVisible();

  // 2. Navigate to login
  console.log('Navigating to Login...');
  await page.goto('/login');
  await expect(page.locator('h1')).toBeVisible();

  // 3. Login with real credentials — no state pre-set in DB
  console.log('Logging in...');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // 4. App routes to /onboarding (new user) or /dashboard (returning user) — both valid
  console.log('Waiting for app redirect...');
  await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 20000 });

  // 5. No crash — error boundary must NOT be visible
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();

  // 6. Header renders
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('header >> text=BMN')).toBeVisible();

  const landedUrl = page.url();
  console.log('Golden Path complete. Landed on:', landedUrl);
});
