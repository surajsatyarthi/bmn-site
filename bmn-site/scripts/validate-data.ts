import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { logger } from './logger';

const PENDING_FILE = resolve(process.cwd(), 'scripts/pending-resources.json');

interface PendingResource {
  title?: string;
  description?: string;
  url?: string;
  category?: string;
  source?: string;
}

export function validateData() {
  logger.info('🔍 Validating pending resources data...');

  if (!existsSync(PENDING_FILE)) {
    logger.error(`❌ File not found: ${PENDING_FILE}`);
    process.exit(1);
    return;
  }

  let resources: any[] = [];
  try {
    const content = readFileSync(PENDING_FILE, 'utf-8');
    resources = JSON.parse(content);
  } catch (err: any) {
    logger.error(`❌ Failed to parse JSON: ${err.message}`);
    process.exit(1);
    return;
  }

  if (!Array.isArray(resources)) {
    logger.error('❌ Root element is not an array');
    process.exit(1);
    return;
  }

  logger.info(`📋 Checking ${resources.length} resources...`);

  let errorCount = 0;
  const urlMap = new Set<string>();
  const issues: string[] = [];

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const location = `Item #${i + 1} (${resource.title || 'Untitled'})`;

    // 1. Required Fields (Issue 3)
    if (!resource.title || resource.title.trim() === '') {
      issues.push(`${location}: Missing 'title'`);
      errorCount++;
    }
    if (!resource.url || resource.url.trim() === '') {
      issues.push(`${location}: Missing 'url'`);
      errorCount++;
    }
    if (!resource.description || resource.description.trim() === '') {
      issues.push(`${location}: Missing 'description'`);
      errorCount++;
    }
    if (!resource.category || resource.category.trim() === '') {
      issues.push(`${location}: Missing 'category'`);
      errorCount++;
    }

    // 2. URL Validation & Duplicates (Issue 3)
    if (resource.url) {
      try {
        new URL(resource.url);
        
        if (urlMap.has(resource.url)) {
          issues.push(`${location}: Duplicate URL "${resource.url}"`);
          errorCount++;
        } else {
          urlMap.add(resource.url);
        }
      } catch (e) {
        issues.push(`${location}: Invalid URL "${resource.url}"`);
        errorCount++;
      }
    }
  }

  if (errorCount > 0) {
    logger.error(`❌ Validation failed with ${errorCount} errors:`);
    issues.forEach(issue => logger.error(`  - ${issue}`));
    process.exit(1);
  } else {
    logger.info('✅ Validation PASSED: No data issues found.');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  validateData();
}
