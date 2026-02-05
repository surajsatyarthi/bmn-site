import { chromium } from '@playwright/test';

async function verifySentry() {
  console.log('🚀 Starting Sentry Verification (Headless)...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('📍 Navigating to /sentry-debug...');
    await page.goto('http://localhost:3000/sentry-debug', { waitUntil: 'domcontentloaded', timeout: 120000 });
    
    console.log('👆 Clicking "Throw Test Error" button...');
    await page.click('button:has-text("Throw Test Error")');
    
    // Sentry errors crash the component/page, so we expect an error or visual change
    // We just need to trigger it.
    console.log('✅ Triggered Test Error.');
    
    console.log('\nPlease check your Sentry Dashboard for the new issue.');
    console.log('Verified: Localhost is accessible and interaction worked.');
    
  } catch (error) {
    console.error('❌ Verification Failed:', error);
  } finally {
    await browser.close();
  }
}

verifySentry();
