import { 
  validateFilterParams, 
  validatePaginationParams, 
  containsSQLInjection 
} from '../src/lib/validation';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

async function runTests() {
  console.log('--- Starting Batch 2: Validation Logic Tests ---');

  // 1. Slug Sanitization
  const slugParams = new URLSearchParams('categories=Prompts,MCP-Servers,invalid_slug!@#');
  const slugResult = validateFilterParams(slugParams);
  assert(slugResult.categories.includes('prompts'), 'Should lowercase slugs');
  assert(slugResult.categories.includes('mcp-servers'), 'Should keep hyphens in slugs');
  assert(slugResult.categories.includes('invalidslug'), 'Should strip special characters from slugs');
  assert(!slugResult.categories.includes('invalid_slug!@#'), 'Should not include raw invalid slug');

  // 2. Search Query Sanitization
  const xssQuery = '<script>alert("xss")</script>  hello  ';
  const xssParams = new URLSearchParams(`q=${xssQuery}`);
  const xssResult = validateFilterParams(xssParams);
  assert(xssResult.search === 'alert("xss")  hello', 'Should strip HTML tags and trim search query');

  const longQuery = 'a'.repeat(300);
  const longParams = new URLSearchParams(`q=${longQuery}`);
  const longResult = validateFilterParams(longParams);
  assert(longResult.search.length === 200, 'Should truncate long search queries');

  // 3. Sort Option Validation
  const validSortParams = new URLSearchParams('sort=views');
  const validSortResult = validateFilterParams(validSortParams);
  assert(validSortResult.sort === 'views', 'Should accept valid sort option');

  const invalidSortParams = new URLSearchParams('sort=invalid_sort');
  const invalidSortResult = validateFilterParams(invalidSortParams);
  assert(invalidSortResult.sort === 'recommended', 'Should fallback to default on invalid sort');

  // 4. Pagination Validation
  const pagParams = new URLSearchParams('page=2&limit=50');
  const pagResult = validatePaginationParams(pagParams);
  assert(pagResult.page === 2, 'Should parse page');
  assert(pagResult.limit === 50, 'Should parse limit');
  assert(pagResult.offset === 50, 'Should calculate correct offset');

  const crazyPagParams = new URLSearchParams('page=9999&limit=500');
  const crazyPagResult = validatePaginationParams(crazyPagParams);
  assert(crazyPagResult.page === 1000, 'Should cap page');
  assert(crazyPagResult.limit === 100, 'Should cap limit');

  // 5. SQL Injection Detection
  assert(containsSQLInjection('SELECT * FROM users'), 'Should detect SELECT injection');
  assert(containsSQLInjection('DROP TABLE resources; --'), 'Should detect DROP/comment injection');
  assert(containsSQLInjection("' OR '1'='1"), 'Should detect tautology injection');
  assert(!containsSQLInjection('Normal search query'), 'Should NOT flag normal queries');

  console.log('\n--- Batch 2: Validation Logic Tests Completed Successfully ---');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
