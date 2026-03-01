import { test, expect } from '@playwright/test';

/**
 * J8 — Mobile UX: hamburger drawer + overflow + scroll
 * Runs on ALL projects. Mobile-specific assertions gated on isMobile.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(onboarding|dashboard|matches)/, { timeout: 20000 });
});

test('J8a — no horizontal overflow on key pages at mobile viewport', async ({ page, isMobile }) => {
  if (!isMobile) test.skip();

  const paths = ['/dashboard', '/matches', '/database'];
  for (const path of paths) {
    await page.goto(path);
    await page.waitForLoadState('load');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = page.viewportSize()!.width;
    expect(scrollWidth, `${path} has horizontal overflow`).toBeLessThanOrEqual(viewportWidth + 1);
    await expect(page.locator('text=Something went wrong')).not.toBeVisible();
  }
});

test('J8b — hamburger drawer opens and closes on mobile', async ({ page, isMobile }) => {
  if (!isMobile) test.skip();

  await page.goto('/dashboard');
  await page.waitForLoadState('load');

  // Hamburger button visible on mobile
  const hamburger = page.locator('[data-testid="mobile-menu-button"]');
  await expect(hamburger).toBeVisible();

  // Tap hamburger — drawer opens
  await hamburger.tap();
  const drawer = page.locator('[data-testid="mobile-nav-drawer"]');
  await expect(drawer).toBeVisible({ timeout: 3000 });

  // Tap Matches link inside drawer
  await page.locator('[data-testid="mobile-nav-drawer"] a[href="/matches"]').tap();

  // Drawer closes after navigation
  await page.waitForURL('/matches', { timeout: 10000 });
  await expect(drawer).not.toBeVisible({ timeout: 3000 });
});

test('J8c — desktop nav shows links, no hamburger', async ({ page, isMobile }) => {
  if (isMobile) test.skip();

  await page.goto('/dashboard');
  await page.waitForLoadState('load');

  // Desktop nav visible
  await expect(page.locator('nav a[href="/matches"]').first()).toBeVisible();

  // Hamburger not visible on desktop
  const hamburger = page.locator('[data-testid="mobile-menu-button"]');
  await expect(hamburger).not.toBeVisible();
});
