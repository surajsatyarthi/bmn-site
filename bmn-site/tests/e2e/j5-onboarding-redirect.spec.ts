import { test, expect } from '@playwright/test';

test('J5 — fully onboarded user is redirected away from /onboarding back to /matches', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // App routes to /matches
  await page.waitForURL(/\/(onboarding|matches)/, { timeout: 20000 });
  
  // Navigate explicitly to /onboarding
  await page.goto('/onboarding');
  await page.waitForLoadState('load');

  // Should automatically be redirected back to /matches because the test user is already onboarded
  await expect(page).toHaveURL(/\/matches/);
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();
});
