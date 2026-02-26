import { test, expect } from '@playwright/test';

/**
 * J7 — Profile Page
 * Written by PM (Claude). Antigravity must NOT modify assertions.
 * Antigravity must add:
 *   data-testid="plan-badge" to the plan display element in profile/page.tsx
 *   data-testid="credit-balance" to the credit count display in profile/page.tsx
 */
test('J7 — profile page shows plan badge and credit balance', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 20000 });

  // Navigate to /profile
  await page.goto('/profile');
  await page.waitForLoadState('networkidle');

  // Page loads without crash
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();

  // Plan badge is visible (Free / Hunter / Partner)
  // Antigravity: add data-testid="plan-badge" to the plan display element
  await expect(page.locator('[data-testid="plan-badge"]')).toBeVisible();

  // Credit balance is visible
  // Antigravity: add data-testid="credit-balance" to the credit count display
  await expect(page.locator('[data-testid="credit-balance"]')).toBeVisible();
});
