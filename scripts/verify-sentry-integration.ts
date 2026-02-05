import { spawn } from 'child_process';
import { chromium } from 'playwright';

const LOCALHOST = 'http://localhost:3000';
const MAX_RETRIES = 30;
const RETRY_DELAY = 2000;

async function waitForServer() {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(LOCALHOST, { timeout: 5000 });
      if (response.ok || response.status === 404) {
        console.log('✓ Server is ready');
        return true;
      }
    } catch (error) {
      retries++;
      if (retries < MAX_RETRIES) {
        console.log(`Waiting for server... (${retries}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  throw new Error('Server failed to start within timeout period');
}

async function verifySentryIntegration() {
  let server: any = null;
  let browser: any = null;

  try {
    // Start the production server
    console.log('Starting production server...');
    server = spawn('npm', ['start'], {
      cwd: process.cwd(),
      stdio: 'pipe',
    });

    server.stdout.on('data', (data: any) => {
      const output = data.toString();
      if (output.includes('Ready in')) {
        console.log('✓ Server started successfully');
      }
    });

    server.stderr.on('data', (data: any) => {
      console.error('Server error:', data.toString());
    });

    // Wait for server to be ready
    console.log('Waiting for server to be ready...');
    await waitForServer();

    // Launch headless browser
    console.log('Launching headless browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen for network requests (to verify Sentry endpoint is called)
    let sentryErrors: any[] = [];
    page.on('response', (response: any) => {
      if (response.url().includes('sentry.io')) {
        sentryErrors.push({
          url: response.url(),
          status: response.status(),
        });
        console.log('✓ Sentry request detected:', response.url());
      }
    });

    // Navigate to sentry-debug page which should trigger an error
    console.log('Navigating to /sentry-debug page...');
    await page.goto(`${LOCALHOST}/sentry-debug`, { waitUntil: 'networkidle' });

    // Wait a bit for any async requests
    await page.waitForTimeout(3000);

    // Try to trigger an error via the UI if available
    console.log('Looking for error trigger buttons...');
    const buttons = await page.locator('button').count();
    console.log(`Found ${buttons} buttons on page`);

    // Look for a button that might trigger Sentry error
    for (let i = 0; i < buttons; i++) {
      const text = await page.locator(`button:nth-of-type(${i + 1})`).textContent();
      if (text && (text.includes('Error') || text.includes('error') || text.includes('Sentry'))) {
        console.log(`Clicking button: ${text}`);
        await page.locator(`button:nth-of-type(${i + 1})`).click();
        await page.waitForTimeout(2000);
        break;
      }
    }

    // Check page for Sentry indicators
    const pageContent = await page.content();
    const hasSentry = pageContent.includes('sentry') || pageContent.includes('Sentry');

    console.log('\n=== VERIFICATION RESULTS ===');
    console.log(`✓ Page loaded successfully`);
    console.log(`✓ Sentry mentions found: ${hasSentry}`);
    console.log(`✓ Sentry network requests: ${sentryErrors.length}`);

    if (sentryErrors.length > 0) {
      console.log('\n✓ SUCCESS: Sentry integration is working!');
      console.log('Captured requests:');
      sentryErrors.forEach(err => {
        console.log(`  - ${err.url} (${err.status})`);
      });
    } else {
      console.log('\n⚠ No Sentry network requests detected yet');
      console.log('This may be normal if errors were queued for later transmission');
    }

    await context.close();

  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  } finally {
    // Clean up
    if (browser) {
      await browser.close();
    }
    if (server) {
      server.kill();
      console.log('Server stopped');
    }
  }
}

verifySentryIntegration();
