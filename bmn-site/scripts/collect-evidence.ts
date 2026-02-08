/**
 * Ralph Protocol Enforcer - Evidence Auto-Collector
 * Automates evidence collection for blocks
 * Reduces manual work, ensures consistency
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function collectEvidence(blockId: string) {
  console.log(`\n🤖 RALPH ENFORCER - Evidence Auto-Collector`);
  console.log(`📂 Block: ${blockId}\n`);

  const evidenceDir = path.join(process.cwd(), 'docs', 'evidence', blockId);
  
  // Create evidence directory
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
    console.log(`✅ Created evidence directory: ${evidenceDir}`);
  }

  const gatesFile = path.join(evidenceDir, 'gates.txt');
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  let output = `=== VERIFICATION GATES: ${timestamp} ===\n\n`;

  // Run 4 gates
  const gates = [
    { name: 'npm run build', command: 'npm run build' },
    { name: 'npm run lint', command: 'npm run lint' },
    { name: 'npm run ralph:scan', command: 'npm run ralph:scan' },
    { name: 'npm test', command: 'npm test' }
  ];

  for (const gate of gates) {
    console.log(`Running: ${gate.name}...`);
    output += `=== ${gate.name} ===\n\n`;
    
    try {
      const result = execSync(gate.command, { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      output += result;
      output += `\n${gate.name.toUpperCase().replace(/ /g, '_')} COMPLETE\n\n`;
      console.log(`✅ ${gate.name} - PASSED`);
    } catch (error: any) {
      output += error.stdout || error.stderr || 'Command failed';
      output += `\n${gate.name.toUpperCase().replace(/ /g, '_')} FAILED\n\n`;
      console.log(`❌ ${gate.name} - FAILED`);
    }
  }

  // Save gates.txt
  fs.writeFileSync(gatesFile, output);
  console.log(`\n✅ Saved: gates.txt`);

  // Generate pre-submission-gate template
  const preGateFile = path.join(evidenceDir, 'pre-submission-gate.txt');
  if (!fs.existsSync(preGateFile)) {
    const template = `PRD PHASE X: [PHASE NAME] PRE-SUBMISSION GATE
===================================================================

PROJECT: BMN v2
BLOCK: ${blockId}
DATE: ${timestamp}

QUALITY GATES:
[ ] 1. npm run build — PASSED
[ ] 2. npm run lint — PASSED  
[ ] 3. npm run ralph:scan — PASSED
[ ] 4. npm run test — PASSED

SPEC COMPLIANCE:
[ ] 5. Read the full spec at docs/tasks/task-X.Y.md
[ ] 6. Verified EVERY deliverable is implemented
[ ] 7. All UI sections in spec are rendered
[ ] 8. All API routes return correct status codes

CODE QUALITY:
[ ] 9. Grepped new files for \`any\` types — 0 found
[ ] 10. Grepped new files for unused imports — 0 found
[ ] 11. No dead/placeholder comments (// TODO, // ...)
[ ] 12. Security: auth checks on every protected route

DOD v2.0 QUALITY:
[ ] 13. error.tsx exists for any new route group
[ ] 14. loading.tsx exists for any new page
[ ] 15. aria-label on new interactive elements
[ ] 16. metadata export on new page.tsx files
[ ] 17. Unit tests written for new utility functions / API routes
[ ] 18. ApiError class used in new/modified API routes
[ ] 19. Mobile verified at 375px (screenshot saved)
[ ] 20. Retrofit: any modified existing page brought up to DoD v2.0

EVIDENCE:
[ ] 21. Evidence artifacts saved to docs/evidence/${blockId}/
[ ] 22. gates.txt saved with fresh output
[ ] 23. mobile-*.png saved (if UI changes)
[ ] 24. Ledger status: SUBMITTED
`;
    
    fs.writeFileSync(preGateFile, template);
    console.log(`✅ Generated: pre-submission-gate.txt (FILL THIS OUT)`);
  }

  // Generate self-audit template
  const auditFile = path.join(evidenceDir, 'self-audit.txt');
  if (!fs.existsSync(auditFile)) {
    const template = `# SELF-AUDIT REPORT: ${blockId}

## 1. Task Spec Alignment
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## 2. Ralph Protocol Compliance
- [ ] Standardized error handling
- [ ] DoD v2.0 followed for all new/modified pages
- [ ] No explicit \`any\` types in new files
- [ ] No unused imports

## 3. Verification Results
- \`npm run build\`: 
- \`npm run lint\`: 
- \`npm run ralph:scan\`: 
- \`npm run test\`: 

## 4. Evidence Collected
- [ ] gates.txt
- [ ] pre-submission-gate.txt
- [ ] Screenshots (if applicable)
`;
    
    fs.writeFileSync(auditFile, template);
    console.log(`✅ Generated: self-audit.txt (FILL THIS OUT)`);
  }

  console.log(`\n📸 MANUAL STEPS REQUIRED:`);
  console.log(`  1. Fill out pre-submission-gate.txt (mark all checkboxes)`);
  console.log(`  2. Fill out self-audit.txt`);
  console.log(`  3. Take mobile screenshots (if UI changes)`);
  console.log(`  4. Run: npx tsx scripts/validate-evidence.ts ${blockId}`);
  console.log(`  5. If validation passes → Submit to PM\n`);
}

// CLI execution
const blockId = process.argv[2];

if (!blockId) {
  console.error('❌ Usage: npx tsx scripts/collect-evidence.ts <block-id>');
  console.error('   Example: npx tsx scripts/collect-evidence.ts block-4.0');
  process.exit(1);
}

collectEvidence(blockId);
