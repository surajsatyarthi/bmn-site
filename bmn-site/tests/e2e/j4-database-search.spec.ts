import { test, expect } from '@playwright/test';

/**
 * J4 — Database Search
 * Written by PM (Claude). Antigravity must NOT modify assertions.
 * Antigravity must add:
 *   data-testid="search-name" to the name search input in database/page.tsx
 *   data-testid="company-card" to each company result row/card
 *   data-testid="company-detail-heading" to the h1 on database/[id]/page.tsx
 */
test('J4 — database search returns results and detail page loads', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 20000 });

  // Navigate to /database
  await page.goto('/database');
  await page.waitForLoadState('networkidle');

  // Page loads without crash
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();

  // Search for a term guaranteed to return results
  await page.fill('[data-testid="search-name"]', 'export');
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');

  // At least one company result appears
  const firstCard = page.locator('[data-testid="company-card"]').first();
  await expect(firstCard).toBeVisible({ timeout: 10000 });

  // Click first result → detail page loads
  await firstCard.click();
  await page.waitForLoadState('networkidle');

  // Detail page renders (no crash)
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();
  await expect(page.locator('[data-testid="company-detail-heading"]')).toBeVisible();
});
