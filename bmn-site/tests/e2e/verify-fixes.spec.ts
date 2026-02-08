import { test, expect } from '@playwright/test';

test.describe('Block 4.1 Fix Verification', () => {
    test.use({ baseURL: 'http://localhost:3000' });

    test('Tawk.to Widget Injection', async ({ page }) => {
        // Go to homepage
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        
        // Wait for Tawk.to script to load
        // It might take a moment as it's lazy loaded
        await page.waitForTimeout(5000); 

        // Check if the script is in the DOM
        const tawkScript = await page.$('script[src*="embed.tawk.to"]');
        expect(tawkScript).toBeTruthy();

        // Check if the widget wrapper exists (Tawk usually creates a div with class or id)
        // Note: Tawk API might put things in an iframe.
        // Let's check for the presence of the Tawk_API global or the iframe.
        // Retry logic for frame detection
        await expect.poll(async () => {
             const frames = page.frames().filter(frame => frame.url().includes('tawk.to'));
             return frames.length;
        }, {
            message: 'Tawk.to iframe not found',
            timeout: 10000,
        }).toBeGreaterThan(0);
        
        const tawkFrames = page.frames().filter(frame => frame.url().includes('tawk.to'));
        console.log(`Found ${tawkFrames.length} Tawk.to frames`);
        
        // Take a screenshot for evidence
        await page.screenshot({ path: 'docs/evidence/block-4.0/verification-tawk.png' });
    });

    test('Confirm Password Independent Toggle', async ({ page }) => {
        await page.goto('/signup', { waitUntil: 'domcontentloaded' });

        const passwordInput = page.locator('#password');
        const confirmInput = page.locator('#confirmPassword');
        
        // Fill passwords
        await passwordInput.fill('Secret123!');
        await confirmInput.fill('Secret123!');

        // Check initial state (both password)
        await expect(passwordInput).toHaveAttribute('type', 'password');
        await expect(confirmInput).toHaveAttribute('type', 'password');

        // Locate the toggle button for confirm password
        // It's the button inside the relative div containing the confirm input
        const confirmToggle = confirmInput.locator('..').locator('button');
        
        // Click toggle
        await confirmToggle.click();

        // Verify INDEPENDENT behavior
        // Confirm should be 'text', Password should STAY 'password'
        await expect(confirmInput).toHaveAttribute('type', 'text');
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Take screenshot
        await page.screenshot({ path: 'docs/evidence/block-4.0/verification-password-toggle.png' });
    });

    test('Footer Gradient Verification', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        
        // Scroll to bottom to see footer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000); // Wait for scroll/render

        // Verify footer has gradient class or style
        // We look for the footer element
        const footer = page.locator('footer');
        await expect(footer).toHaveClass(/bg-gradient-primary/);

        // Take screenshot of the footer area
        // We can element screenshot
        await footer.screenshot({ path: 'docs/evidence/block-4.0/verification-footer-gradient.png' });
    });
});
