/**
 * Ralph Protocol Enforcer - Evidence Validator
 * Runs BEFORE PM audit to verify evidence completeness
 * BLOCKS audit if any requirement fails
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

// NO EXCUSES (Standing Orders 3B)
const FORBIDDEN_PHRASES = [
  'server offline',
  'server is offline', 
  'static analysis',
  'static code analysis',
  'build passed so it works',
  'build passes',
  'will fix later',
  'TODO',
  'FIXME',
  'pending',
  'in progress',
  'partially complete'
];

// Required evidence files per DoD v2.0
const REQUIRED_FILES = {
  base: [
    'gates.txt',
    'pre-submission-gate.txt',
    'self-audit.txt',
  ],
  ifUIChanges: [
    'mobile-*.png', // At least one mobile screenshot
  ]
};

function validateBlock(blockId: string): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: []
  };

  const evidenceDir = path.join(process.cwd(), 'docs', 'evidence', blockId);

  // 1. Check evidence directory exists
  if (!fs.existsSync(evidenceDir)) {
    result.errors.push(`Evidence directory missing: ${evidenceDir}`);
    result.passed = false;
    return result;
  }

  // 2. Check required files
  const files = fs.readdirSync(evidenceDir);
  
  for (const file of REQUIRED_FILES.base) {
    if (!files.includes(file)) {
      result.errors.push(`Missing required file: ${file}`);
      result.passed = false;
    }
  }

  // 3. Validate gates.txt
  const gatesFile = path.join(evidenceDir, 'gates.txt');
  if (fs.existsSync(gatesFile)) {
    const content = fs.readFileSync(gatesFile, 'utf-8');
    
    // Check for 4 gate sections
    const gates = [
      'npm run build',
      'npm run lint', 
      'npm run ralph:scan',
      'npm test'
    ];
    
    for (const gate of gates) {
      if (!content.includes(gate)) {
        result.errors.push(`gates.txt missing section: ${gate}`);
        result.passed = false;
      }
    }

    // Check for PASS indicators
    const passIndicators = ['PASSED', 'COMPLETE', '✓', '✅'];
    const hasPassIndicator = passIndicators.some(indicator => 
      content.includes(indicator)
    );
    
    if (!hasPassIndicator) {
      result.errors.push('gates.txt has no PASS indicators (PASSED, COMPLETE, ✓, ✅)');
      result.passed = false;
    }
  }

  // 4. Validate pre-submission-gate.txt
  const preGateFile = path.join(evidenceDir, 'pre-submission-gate.txt');
  if (fs.existsSync(preGateFile)) {
    const content = fs.readFileSync(preGateFile, 'utf-8');
    
    // Count checkboxes
    const totalBoxes = (content.match(/\[\s*\]/g) || []).length + 
                       (content.match(/\[x\]/gi) || []).length;
    const checkedBoxes = (content.match(/\[x\]/gi) || []).length;
    
    if (totalBoxes === 0) {
      result.errors.push('pre-submission-gate.txt has no checkboxes');
      result.passed = false;
    } else if (checkedBoxes < totalBoxes) {
      result.errors.push(
        `pre-submission-gate.txt incomplete: ${checkedBoxes}/${totalBoxes} boxes checked`
      );
      result.passed = false;
    }

    // Check for NO EXCUSES phrases
    const lowerContent = content.toLowerCase();
    for (const phrase of FORBIDDEN_PHRASES) {
      if (lowerContent.includes(phrase.toLowerCase())) {
        result.errors.push(
          `FORBIDDEN PHRASE in pre-submission-gate.txt: "${phrase}"`
        );
        result.passed = false;
      }
    }
  }

  // 5. Validate self-audit.txt
  const auditFile = path.join(evidenceDir, 'self-audit.txt');
  if (fs.existsSync(auditFile)) {
    const content = fs.readFileSync(auditFile, 'utf-8');
    
    const requiredSections = [
      'Task Spec Alignment',
      'Ralph Protocol Compliance',
      'Verification Results',
      'Evidence Collected'
    ];
    
    for (const section of requiredSections) {
      if (!content.includes(section)) {
        result.errors.push(`self-audit.txt missing section: ${section}`);
        result.passed = false;
      }
    }

    // Check for NO EXCUSES phrases
    const lowerContent = content.toLowerCase();
    for (const phrase of FORBIDDEN_PHRASES) {
      if (lowerContent.includes(phrase.toLowerCase())) {
        result.errors.push(
          `FORBIDDEN PHRASE in self-audit.txt: "${phrase}"`
        );
        result.passed = false;
      }
    }
  }

  // 6. Check for mobile screenshots (if UI changes)
  const hasMobileScreenshot = files.some(f => 
    f.startsWith('mobile-') && f.endsWith('.png')
  );
  
  if (!hasMobileScreenshot) {
    result.warnings.push('No mobile screenshots found (mobile-*.png)');
  }

  return result;
}

// CLI execution
const blockId = process.argv[2];

if (!blockId) {
  console.error('❌ Usage: npx tsx scripts/validate-evidence.ts <block-id>');
  console.error('   Example: npx tsx scripts/validate-evidence.ts block-4.0');
  process.exit(1);
}

console.log(`\n🔍 RALPH ENFORCER - Evidence Validator`);
console.log(`📂 Block: ${blockId}\n`);

const result = validateBlock(blockId);

if (result.errors.length > 0) {
  console.log('❌ VALIDATION FAILED\n');
  console.log('Errors:');
  result.errors.forEach(err => console.log(`  - ${err}`));
}

if (result.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  result.warnings.forEach(warn => console.log(`  - ${warn}`));
}

if (result.passed) {
  console.log('✅ VALIDATION PASSED - Evidence complete\n');
  process.exit(0);
} else {
  console.log('\n❌ DO NOT SUBMIT - Fix errors and re-validate\n');
  process.exit(1);
}
