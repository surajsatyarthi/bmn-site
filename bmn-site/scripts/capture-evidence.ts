import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';

async function captureEvidence() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const mobileDevice = devices['iPhone 12'];
  const mobileContext = await browser.newContext({ ...mobileDevice });
  const mobilePage = await mobileContext.newPage();

  const evidenceDir = path.resolve(__dirname, '../../docs/evidence/phase-1-stabilization');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  const baseUrl = 'http://localhost:3001'; // Using port 3001 as per previous output

  try {
    // 1. Desktop Screenshots
    console.log('Capturing Desktop: Onboarding...');
    await page.goto(`${baseUrl}/onboarding?mock=true`); // Using mock to ensure wizard loads
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(evidenceDir, 'screenshot-onboarding.png'), fullPage: true });

    console.log('Capturing Desktop: Homepage...');
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(evidenceDir, 'screenshot-header.png'), fullPage: true });

    console.log('Capturing Desktop: Dashboard (Login Redirect)...');
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(evidenceDir, 'screenshot-sidebar-footer.png'), fullPage: true });

    // 2. Mobile Screenshots (375px)
    console.log('Capturing Mobile: Onboarding...');
    await mobilePage.goto(`${baseUrl}/onboarding?mock=true`);
    await mobilePage.waitForLoadState('networkidle');
    await mobilePage.screenshot({ path: path.join(evidenceDir, 'mobile-onboarding-375px.png'), fullPage: true });

    console.log('Capturing Mobile: Homepage...');
    await mobilePage.goto(`${baseUrl}/`);
    await mobilePage.waitForLoadState('networkidle');
    await mobilePage.screenshot({ path: path.join(evidenceDir, 'mobile-homepage-375px.png'), fullPage: true });

    console.log('Capturing Mobile: Dashboard...');
    await mobilePage.goto(`${baseUrl}/dashboard`);
    await mobilePage.waitForLoadState('networkidle');
    await mobilePage.screenshot({ path: path.join(evidenceDir, 'mobile-dashboard-375px.png'), fullPage: true });

    console.log('Success: All screenshots captured.');
  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

captureEvidence();
