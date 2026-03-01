const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    extraHTTPHeaders: {
      'x-test-auth-bypass': 'true'
    }
  });

  const page = await context.newPage();
  const url = 'https://bmn-site-git-feat-entry-11-databa-5e71fc-bmns-projects-cf9c12cf.vercel.app/database';
  
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });

  console.log('Taking screenshot...');
  const outPath = path.join(__dirname, '..', 'docs', 'reports', 'media', 'entry-11-search.png');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, fullPage: true });
  
  console.log(`Saved screenshot to ${outPath}`);

  await browser.close();
})();
