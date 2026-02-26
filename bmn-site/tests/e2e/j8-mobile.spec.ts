import { test, expect } from '@playwright/test';

/**
 * J8 — Mobile at 375px viewport
 * Written by PM (Claude). Antigravity must NOT modify assertions.
 */
test('J8 — dashboard renders correctly at 375px mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  // Login
  await page.goto('/login');

  // Login page has no horizontal overflow
  const loginScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(loginScrollWidth).toBeLessThanOrEqual(375);

  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 20000 });

  // Dashboard has no horizontal overflow at 375px
  const dashScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(dashScrollWidth).toBeLessThanOrEqual(375);

  // Dashboard does not crash on mobile
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();

  // Header is visible on mobile
  await expect(page.locator('header')).toBeVisible();
});
