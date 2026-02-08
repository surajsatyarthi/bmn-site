
import { test, expect } from '@playwright/test';

test.describe('Production Smoke Test', () => {
    const timestamp = Date.now();
    const BASE_URL = 'https://businessmarket.network';

    test('Desktop Critical Path', async ({ page }) => {
        // 1. Landing Page
        await page.goto(BASE_URL);
        await expect(page).toHaveTitle(/Default page|BMN/);
        await page.screenshot({ path: 'docs/evidence/block-4.0/production-screenshots/1-landing-page.png' });
        
        console.log('Skipping SIGNUP step due to production email limits. Using pre-created verified user.');
        const bypassEmail = 'smoke_test_bypass@example.com';
        const bypassPassword = 'Password123!';

        // 4. Login / Continue
        await page.goto(`${BASE_URL}/login`);
        await page.getByLabel('Email', { exact: true }).fill(bypassEmail);
        await page.getByLabel('Password', { exact: true }).fill(bypassPassword);
        await page.getByRole('button', { name: /sign in/i }).click();
        
        try {
            await expect(page).toHaveURL(/onboarding|dashboard/, { timeout: 10000 });
        } catch (e) {
            console.log('Login failed to redirect. Current URL:', page.url());
            const errorMsg = await page.textContent('.text-red-800, .error-message, [role="alert"]').catch(() => 'No error message found');
            console.log('Login Error Message:', errorMsg);
            await page.screenshot({ path: 'docs/evidence/block-4.0/production-screenshots/debug-login-failed.png' });
            throw e;
        }
        console.log('Logged in successfully, URL:', page.url());
        
        await page.screenshot({ path: 'docs/evidence/block-4.0/production-screenshots/4-login-success.png' });

        if (!page.url().includes('dashboard')) {
             await expect(page).toHaveURL(/onboarding/);
             await page.screenshot({ path: 'docs/evidence/block-4.0/production-screenshots/4-onboarding-start.png' });
        }

        // 5. Onboarding Steps
        await page.getByText('Exporter').click(); 
        await page.getByRole('button', { name: /continue/i }).click();
        await page.waitForTimeout(500); 
        await page.screenshot({ path: 'docs/evidence/block-4.0/production-screenshots/5-onboarding-step1.png' });

        await page.getByLabel('Company Name').fill(`Smoke Test Co ${timestamp}`);
        await page.getByLabel('Website').fill('https://example.com');
        await page.getByLabel('Description').fill('Test company');
        await page.getByRole('button', { name: /continue/i }).click();
        await page.screenshot({ path: 'docs/evidence/block-4.0/production-screenshots/6-onboarding-step2.png' });
    });

    test('Mobile Audit (iPhone SE)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(BASE_URL);
        await expect(page).toHaveTitle(/Default page|BMN/);
        await page.screenshot({ path: 'docs/evidence/block-4.0/mobile-screenshots/landing-mobile.png' });
        
        await page.goto(`${BASE_URL}/login`);
        await page.screenshot({ path: 'docs/evidence/block-4.0/mobile-screenshots/login-mobile.png' });
        
        await page.goto(`${BASE_URL}/signup`);
        await page.screenshot({ path: 'docs/evidence/block-4.0/mobile-screenshots/signup-mobile.png' });
    });
});
