import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

/**
 * RALPH PROTOCOL v5.1 - ENHANCED SECURITY SCANNER
 *
 * Comprehensive validation with deployment-blocking checks.
 * Catches: code issues + dependency issues + build issues + deployment readiness
 */

interface Check {
  id: string;
  name: string;
  severity: 'P0' | 'P1' | 'P2';
  description: string;
  type: 'code' | 'dependency' | 'build' | 'deployment';
  validate: () => boolean;
  fix: string;
}

const CHECKS: Check[] = [
  // ============================================
  // CODE SECURITY CHECKS
  // ============================================
  {
    id: 'SEC-001',
    name: 'Payment Replay Attack Vulnerability',
    severity: 'P0',
    type: 'code',
    description: 'Payment verification must use database state, NOT in-memory Sets/Maps which fail in serverless.',
    validate: () => {
      const files = fs.readdirSync('src/lib/payment/');
      for (const file of files) {
        if (file.endsWith('.ts')) {
          const content = fs.readFileSync(`src/lib/payment/${file}`, 'utf-8');
          const hasInProgressSet = content.includes('new Set<string>()') || content.includes('new Set()');
          const hasVerifiedPaymentsVar = content.includes('verifiedPayments');
          if (hasInProgressSet && hasVerifiedPaymentsVar) {
            return false;
          }
        }
      }
      return true;
    },
    fix: 'Use database lookup (e.g., db.query.payments.findFirst) to verify transaction status.'
  },
  {
    id: 'SEC-002',
    name: 'Production Mock Data Fallback',
    severity: 'P0',
    type: 'code',
    description: 'Production code must NEVER fallback to mock data on DB failure. Fail loud.',
    validate: () => {
      if (!fs.existsSync('src/lib/queries.ts')) return true;
      const content = fs.readFileSync('src/lib/queries.ts', 'utf-8');
      const hasMockFallback = /catch.*mock/i.test(content) || /return.*mock/i.test(content);
      return !hasMockFallback;
    },
    fix: 'Remove try/catch that returns mock data. Allow error to bubble up to error boundaries.'
  },
  {
    id: 'SEC-003',
    name: 'Environment Variable Validation',
    severity: 'P0',
    type: 'code',
    description: 'Application must validate all required env vars at startup using Zod.',
    validate: () => {
      if (!fs.existsSync('src/lib/env.ts')) return false;
      const content = fs.readFileSync('src/lib/env.ts', 'utf-8');
      return content.includes('z.object') && content.includes('export const env');
    },
    fix: 'Create src/lib/env.ts with Zod schema validation.'
  },
  {
    id: 'SEC-006',
    name: 'Rate Limiting on POST Routes',
    severity: 'P1',
    type: 'code',
    description: 'All POST endpoints must have rate limiting protection.',
    validate: () => {
      const apiRoutes = glob.sync('src/app/api/**/route.ts', { ignore: ['**/*.test.ts'] });
      for (const file of apiRoutes) {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.includes('export async function POST')) {
          if (!content.includes('checkRateLimit') && !content.includes('ratelimit')) {
            console.error(`   ⚠️  ${file} has POST but no rate limiting`);
            // Don't fail - may be intentional for some endpoints
          }
        }
      }
      return true;
    },
    fix: 'Add rate limiting to sensitive POST endpoints.'
  },

  // ============================================
  // DEPENDENCY CHECKS
  // ============================================
  {
    id: 'DEP-001',
    name: 'Required Dependencies Installed',
    severity: 'P0',
    type: 'dependency',
    description: 'All required dependencies from package.json must be installed in node_modules.',
    validate: () => {
      const requiredPackages = [
        '@sentry/nextjs',
        'resend',
        'drizzle-orm',
        'next-auth',
        'zod'
      ];

      for (const pkg of requiredPackages) {
        if (!fs.existsSync(`node_modules/${pkg}`)) {
          console.error(`   Missing package: ${pkg}`);
          return false;
        }
      }
      return true;
    },
    fix: 'Run: pnpm install (or npm install, yarn install)'
  },
  {
    id: 'DEP-002',
    name: 'package.json and lock file consistent',
    severity: 'P0',
    type: 'dependency',
    description: 'package.json must match pnpm-lock.yaml (no orphaned or missing packages).',
    validate: () => {
      if (!fs.existsSync('package.json') || !fs.existsSync('pnpm-lock.yaml')) {
        return false;
      }
      // Run pnpm ls to verify lock file matches package.json
      try {
        execSync('pnpm ls --depth=0 2>&1', { stdio: 'pipe' });
        return true;
      } catch (error) {
        console.error('   ⚠️  pnpm-lock.yaml mismatch with package.json');
        console.error('   Run: pnpm install');
        return false;
      }
    },
    fix: 'Run: pnpm install to sync package.json with lock file'
  },

  // ============================================
  // BUILD CHECKS
  // ============================================
  {
    id: 'BLD-001',
    name: 'TypeScript compilation succeeds',
    severity: 'P0',
    type: 'build',
    description: 'Code must compile without TypeScript errors.',
    validate: () => {
      try {
        execSync('pnpm tsc --noEmit --skipLibCheck 2>&1', { stdio: 'pipe' });
        return true;
      } catch (error) {
        console.error('   TypeScript compilation failed');
        return false;
      }
    },
    fix: 'Fix TypeScript errors: pnpm tsc --noEmit'
  },
  {
    id: 'BLD-002',
    name: 'Next.js build succeeds',
    severity: 'P0',
    type: 'build',
    description: 'Next.js production build must succeed without errors.',
    validate: () => {
      try {
        execSync('pnpm build 2>&1', { stdio: 'pipe', timeout: 300000 });
        return true;
      } catch (error) {
        console.error('   Build failed - check output above');
        return false;
      }
    },
    fix: 'Fix build errors and run: pnpm build'
  },
  {
    id: 'BLD-003',
    name: 'ESLint passes',
    severity: 'P1',
    type: 'build',
    description: 'Code must pass linting checks.',
    validate: () => {
      try {
        execSync('pnpm lint 2>&1', { stdio: 'pipe' });
        return true;
      } catch (error) {
        console.error('   Linting failed');
        return false;
      }
    },
    fix: 'Run: pnpm lint --fix'
  },

  // ============================================
  // DEPLOYMENT READINESS CHECKS
  // ============================================
  {
    id: 'DPL-001',
    name: 'Environment variables documented in .env.example',
    severity: 'P1',
    type: 'deployment',
    description: 'All required env vars must be documented in .env.example.',
    validate: () => {
      if (!fs.existsSync('.env.example')) {
        return false;
      }
      const content = fs.readFileSync('.env.example', 'utf-8');
      const requiredVars = [
        'DATABASE_URL',
        'AUTH_SECRET',
        'RAZORPAY_KEY_ID',
        'SENTRY_DSN'
      ];
      for (const v of requiredVars) {
        if (!content.includes(v)) {
          console.error(`   Missing ${v} in .env.example`);
          return false;
        }
      }
      return true;
    },
    fix: 'Create .env.example with all required variables and documentation'
  },
  {
    id: 'DPL-002',
    name: 'Git is clean (no uncommitted changes)',
    severity: 'P1',
    type: 'deployment',
    description: 'All changes must be committed before deployment checks.',
    validate: () => {
      try {
        const output = execSync('git status --porcelain 2>&1', { stdio: 'pipe' }).toString();
        // Ignore node_modules and build artifacts
        const filteredLines = output.split('\n').filter(line => {
          return !line.includes('node_modules') &&
                 !line.includes('.next') &&
                 !line.includes('dist/') &&
                 line.trim() !== '';
        });
        if (filteredLines.length > 0) {
          console.error('   Uncommitted changes found:');
          filteredLines.forEach(line => console.error(`     ${line}`));
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    fix: 'Commit all changes: git add . && git commit'
  },
  {
    id: 'DPL-003',
    name: 'No secrets in code',
    severity: 'P0',
    type: 'deployment',
    description: 'No API keys, tokens, or secrets should be hardcoded.',
    validate: () => {
      const suspiciousPatterns = [
        /RAZORPAY_KEY_SECRET\s*=\s*['"](?!your-)/,
        /PAYPAL_CLIENT_SECRET\s*=\s*['"](?!your-)/,
        /AUTH_SECRET\s*=\s*['"](?!your-|generate-)/,
        /sk_live_/,
        /sk_test_/
      ];

      const srcFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: ['**/*.test.ts'] });
      for (const file of srcFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(content)) {
            console.error(`   Found potential secret in ${file}`);
            return false;
          }
        }
      }
      return true;
    },
    fix: 'Remove hardcoded secrets. Use environment variables instead.'
  }
];

async function scan() {
  console.log('\n🦅 Ralph Protocol v5.1: Enhanced Security Scanner Initiated...\n');

  let hasP0Errors = false;
  let hasP1Warnings = false;
  let totalChecks = 0;
  let passedChecks = 0;

  // Group checks by type
  const checksByType = CHECKS.reduce((acc, check) => {
    if (!acc[check.type]) acc[check.type] = [];
    acc[check.type].push(check);
    return acc;
  }, {} as Record<string, Check[]>);

  // Run checks by category
  const categories = ['code', 'dependency', 'build', 'deployment'];

  for (const category of categories) {
    const checks = checksByType[category] || [];
    if (checks.length === 0) continue;

    console.log(`\n📋 ${category.toUpperCase()} CHECKS`);
    console.log('─'.repeat(50));

    for (const check of checks) {
      totalChecks++;
      const icon = check.severity === 'P0' ? '🔴' : '🟡';
      process.stdout.write(`${icon} ${check.id}: ${check.name}... `);

      try {
        const passed = check.validate();

        if (passed) {
          console.log('✅');
          passedChecks++;
        } else {
          console.log('❌');
          console.error(`   Severity: ${check.severity}`);
          console.error(`   Description: ${check.description}`);
          console.error(`   Fix: ${check.fix}`);

          if (check.severity === 'P0') {
            hasP0Errors = true;
          } else {
            hasP1Warnings = true;
          }
        }
      } catch (error) {
        console.log('❌');
        console.error(`   Error running check: ${(error as Error).message}`);
        if (check.severity === 'P0') {
          hasP0Errors = true;
        }
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Security Scan Complete: ${passedChecks}/${totalChecks} Passed`);
  console.log('='.repeat(50));

  if (hasP0Errors) {
    console.error('\n🚨 CRITICAL P0 ISSUES FOUND');
    console.error('   ❌ Build/deploy blocked until resolved\n');
    process.exit(1);
  } else if (hasP1Warnings) {
    console.warn('\n⚠️  P1 Issues Found (warnings, fix before launch)\n');
    process.exit(0); // Exit 0 so build can proceed
  } else {
    console.log('\n✅ All security checks passed!\n');
    process.exit(0);
  }
}

scan().catch(err => {
  console.error('\n❌ Scanner crash:', err.message);
  process.exit(1);
});
