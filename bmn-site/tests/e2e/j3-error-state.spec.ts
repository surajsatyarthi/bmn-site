import { test, expect } from '@playwright/test';

/**
 * J3 — Error State: Login with expired verification link
 * Written by PM (Claude). Antigravity must NOT modify assertions.
 * Antigravity must add data-testid="callback-error-banner" to the
 * callbackError div in login/PageContent.tsx
 */
test('J3 — login page shows error banner when ?error= is in URL', async ({ page }) => {
  await page.goto('/login?error=access_denied');

  // Error banner is visible
  // Antigravity: add data-testid="callback-error-banner" to the callbackError JSX block
  await expect(page.locator('[data-testid="callback-error-banner"]')).toBeVisible();

  // Login form is still usable (not broken by the error)
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
});
