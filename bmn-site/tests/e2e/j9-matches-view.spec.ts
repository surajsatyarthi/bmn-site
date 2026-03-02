import { test, expect } from '@playwright/test';

test('J9 — matches page renders correctly', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 20000 });
  await page.goto('/matches');
  await page.waitForLoadState('load');

  // Page renders correctly without crash
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();
  await expect(page.locator('h1', { hasText: 'Your Matches' })).toBeVisible();

  // Validate Tier stats are present
  await expect(page.locator('text=Best Matches')).toBeVisible();
  await expect(page.locator('text=Great Matches')).toBeVisible();
  await expect(page.locator('text=Good Matches')).toBeVisible();
});
