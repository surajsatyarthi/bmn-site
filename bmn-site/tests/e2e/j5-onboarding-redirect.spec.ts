import { test, expect } from '@playwright/test';

test('J5 — fully onboarded user is redirected away from /onboarding back to /dashboard', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // App routes to /dashboard
  await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 20000 });
  
  // Navigate explicitly to /onboarding
  await page.goto('/onboarding');
  await page.waitForLoadState('networkidle');

  // Should automatically be redirected back to /dashboard because the test user is already onboarded
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();
});
