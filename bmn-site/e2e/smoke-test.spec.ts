
import { test } from '@playwright/test';

test.describe('E2E Smoke Test - Full Evidence Capture', () => {
  
  test('Capture 12 Screenshots Journey', async ({ page }) => {
    test.setTimeout(240000);

    // Hide Tawk.to widget to prevent it from intercepting clicks
    const hideTawkWidget = async () => {
      await page.evaluate(() => {
        const tawkWidget = document.querySelector('[id*="tawk"]');
        if (tawkWidget) {
          (tawkWidget as HTMLElement).style.display = 'none';
        }
        // Also try to minimize via Tawk API
        const tawkAPI = (window as unknown as { Tawk_API?: { minimize: () => void } }).Tawk_API;
        if (tawkAPI?.minimize) {
          tawkAPI.minimize();
        }
      });
    };

    // 1 & 2: Public pages
    console.log('📸 Capturing Login & Signup...');
    await page.goto('/login');
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/1-login.png' });
    await page.goto('/signup');
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/2-signup.png' });

    // 3: Verify email page (just capture the design, use bypass for this)
    console.log('📸 Capturing Verify Email...');
    await page.route('**/*', async route => {
      const req = route.request();
      if (req.url().includes('localhost:3000')) {
        await route.continue({ headers: { ...req.headers(), 'x-test-unconfirmed': 'true' } });
      } else {
        await route.continue();
      }
    });
    await page.goto('/verify-email');
    await page.waitForSelector('h2:has-text("Check your email")');
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/3-verify-email.png' });

    // Clear route overrides for real login
    await page.unrouteAll();

    // Login with real test user for onboarding
    console.log('📸 Logging in with test user...');
    await page.goto('/login');
    await hideTawkWidget();
    await page.fill('input[type="email"]', 'full_1770555937379@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]', { force: true });
    
    // Wait for navigation to complete - could go to onboarding or dashboard
    await page.waitForTimeout(3000); // Allow redirect to happen
    const currentUrl = page.url();
    console.log('📍 Redirected to:', currentUrl);
    
    // If we're not on onboarding, navigate there manually
    if (!currentUrl.includes('/onboarding')) {
      await page.goto('/onboarding');
    }

    // 4-9: Onboarding Flow
    console.log('📸 Capturing Onboarding Flow...');
    
    // Step 1: Trade Role
    await page.waitForSelector('h2:has-text("What do you do?")');
    await hideTawkWidget();
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/4-onboarding-step1.png' });
    await page.click('h3:has-text("I Export Goods")');
    await page.click('button:has-text("Next Step")', { force: true });

    // Step 2: Products
    await page.waitForSelector('h2:has-text("What products do you handle?")');
    await hideTawkWidget();
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/5-onboarding-step2.png' });
    await page.fill('input[placeholder*="Search by product name"]', '01');
    await page.waitForTimeout(2000); 
    await page.click('button:has-text("Chapter 01")', { force: true });
    await page.waitForTimeout(1000);
    await page.click('button.btn-primary:has-text("Next Step")', { force: true });

    // Step 3: Trade Interests
    await page.waitForSelector('h2:has-text("Where do you want to trade?")');
    await hideTawkWidget();
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/6-onboarding-step3.png' });
    await page.click('text=United States', { force: true });
    await page.click('button:has-text("Next Step")', { force: true });

    // Step 4: Business Details
    await page.waitForSelector('h2:has-text("Business Details")');
    await hideTawkWidget();
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/7-onboarding-step4.png' });
    await page.fill('input[name="companyName"]', 'Smoke Test Corp');
    await page.click('button:has-text("Next Step")', { force: true });

    // Step 5: Certifications
    await page.waitForSelector('h2:has-text("Certifications")');
    await hideTawkWidget();
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/8-onboarding-step5.png' });
    await page.click('text=ISO 9001', { force: true });
    await page.click('button:has-text("Next Step")', { force: true });

    // Step 6: Review
    await page.waitForSelector('h2:has-text("Almost Done!")');
    await hideTawkWidget();
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/9-onboarding-step6.png' });
    await page.click('button:has-text("Finish Setup")', { force: true });

    // 10-12: Dashboard & Beyond
    console.log('📸 Capturing Post-Onboarding...');
    await page.waitForSelector('h1:has-text("Dashboard")');
    await hideTawkWidget();
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/10-dashboard.png' });
    
    await page.goto('/matches');
    await page.waitForTimeout(2000);
    await hideTawkWidget();
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/11-matches.png' });

    await page.goto('/profile');
    await page.waitForTimeout(2000);
    await hideTawkWidget();
    await page.screenshot({ path: 'docs/evidence/block-4.0/e2e-flow-screenshots/12-profile.png' });

    console.log('🏁 Full 12-shot capture complete.');
  });
});
