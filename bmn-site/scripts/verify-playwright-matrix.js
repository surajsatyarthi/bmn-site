#!/usr/bin/env node
/**
 * G16 — Browser Matrix Gate
 * Validates playwright.config.ts has required mobile + desktop projects.
 * Runs in CI on any PR touching playwright.config.ts or tests/e2e/
 */
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'playwright.config.ts');
const content = fs.readFileSync(configPath, 'utf8');

const errors = [];

if (!content.includes("devices['Desktop Chrome']") && !content.includes('devices["Desktop Chrome"]')) {
  errors.push('Missing Desktop Chrome project');
}
if (!content.includes("devices['Pixel 7']") && !content.includes("devices['Galaxy S9+']") && !content.includes('devices["Pixel 7"]')) {
  errors.push('Missing mobile Chrome project (add Pixel 7 or Galaxy S9+)');
}
if (!content.includes("devices['iPhone 14']") && !content.includes("devices['iPhone 13']") && !content.includes('devices["iPhone 14"]')) {
  errors.push('Missing mobile Safari project (add iPhone 14 or iPhone 13)');
}

if (errors.length > 0) {
  console.error('❌ G16 Browser Matrix Gate FAILED:');
  errors.forEach(e => console.error(`  - ${e}`));
  console.error('\nplaywright.config.ts must include Desktop Chrome + mobile Chrome + mobile Safari.');
  process.exit(1);
}

console.log('✅ G16 Browser Matrix Gate PASSED: Desktop Chrome + Pixel 7 + iPhone 14 present.');
process.exit(0);
