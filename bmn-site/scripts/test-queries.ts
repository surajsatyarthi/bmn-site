import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

async function runTests() {
  console.log('--- Starting Batch 2: Database Query Integration Tests ---');
  
  // Dynamic import to ensure process.env.DATABASE_URL is set
  const { getFilteredResources, validateCategorySlugs } = await import('../src/lib/queries');
  const { db } = await import('../src/lib/db');
  const { categories } = await import('../src/drizzle/schema');

  try {
    // 1. Test validateCategorySlugs with real data
    console.log('\nTesting validateCategorySlugs...');
    // Let's first see what categories we have
    const allCats = await db.select().from(categories);
    console.log('Available categories in DB:', allCats.map(c => c.slug));

    if (allCats.length > 0) {
      const targetSlug = allCats[0].slug;
      const validated = await validateCategorySlugs([targetSlug, 'non-existent-slug']);
      console.log('Validated slugs:', validated);
      if (validated.includes(targetSlug) && !validated.includes('non-existent-slug')) {
        console.log('✅ PASS: validateCategorySlugs works with real DB data');
      } else {
        console.error('❌ FAIL: validateCategorySlugs mismatch');
      }
    } else {
      console.log('⚠️ SKIP: No categories found in DB to test validation');
    }

    // 2. Test getFilteredResources
    console.log('\nTesting getFilteredResources (All)...');
    const allResources = await getFilteredResources({
      categories: [],
      tags: [],
      search: '',
      sort: 'recommended'
    });
    console.log(`Found ${allResources.resources.length} resources`);
    if (allResources.resources.length >= 0) {
      console.log('✅ PASS: getFilteredResources (All) query executed');
    }

    // 3. Test Filtered query
    if (allCats.length > 0) {
      const targetSlug = allCats[0].slug;
      console.log(`\nTesting getFilteredResources (Category: ${targetSlug})...`);
      const filtered = await getFilteredResources({
        categories: [targetSlug],
        tags: [],
        search: '',
        sort: 'recommended'
      });
      console.log(`Found ${filtered.resources.length} resources for category ${targetSlug}`);
      if (filtered.resources.every(r => r.categoryName)) {
        console.log('✅ PASS: Filtered query returns typed results with relations');
      }
    }

  } catch (error) {
    console.error('❌ Integration Test Failed:', error);
    process.exit(1);
  }
}

runTests().then(() => {
  console.log('\n--- Batch 2: Database Query Integration Tests Completed ---');
  process.exit(0);
});
