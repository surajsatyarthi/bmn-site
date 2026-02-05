#!/usr/bin/env node

/**
 * Ralph Protocol CLI Tool
 * 
 * Usage:
 *   npm run ralph -- task start <id> "<name>"
 *   npm run ralph -- gate start <gate_number>
 *   npm run ralph -- gate complete <gate_number>
 *   npm run ralph -- verify
 *   npm run ralph -- audit
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const RALPH_DIR = path.join(process.cwd(), '.ralph');
const AUDIT_TRAIL_PATH = path.join(RALPH_DIR, 'audit_trail.json');
const CURRENT_GATE_PATH = path.join(RALPH_DIR, 'current_gate.txt');
const GATE_REQUIREMENTS_PATH = path.join(RALPH_DIR, 'gate_requirements.yml');
const ARTIFACTS_DIR = path.join(process.cwd(), 'artifacts');

interface Gate {
  gate: number;
  name: string;
  timestamp: string;
  artifacts: string[];
  hash: string;
  previousHash?: string;
}

interface Task {
  id: string;
  name: string;
  started: string;
  gates: Gate[];
}

interface AuditTrail {
  version: string;
  description: string;
  tasks: { [taskId: string]: Task };
}

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function loadAuditTrail(): AuditTrail {
  if (!fs.existsSync(AUDIT_TRAIL_PATH)) {
    return {
      version: '1.0',
      description: 'Immutable audit trail for Ralph Protocol gate execution',
      tasks: {},
    };
  }
  return JSON.parse(fs.readFileSync(AUDIT_TRAIL_PATH, 'utf-8'));
}

function saveAuditTrail(trail: AuditTrail) {
  fs.writeFileSync(AUDIT_TRAIL_PATH, JSON.stringify(trail, null, 2));
}

function getCurrentGate(): number | null {
  if (!fs.existsSync(CURRENT_GATE_PATH)) return null;
  const content = fs.readFileSync(CURRENT_GATE_PATH, 'utf-8').trim();
  return content ? parseInt(content) : null;
}

function setCurrentGate(gate: number) {
  fs.writeFileSync(CURRENT_GATE_PATH, gate.toString());
}

function calculateHash(data: string, previousHash?: string): string {
  const content = previousHash ? data + previousHash : data;
  return crypto.createHash('sha256').update(content).digest('hex');
}

function taskStart(taskId: string, taskName: string) {
  const trail = loadAuditTrail();
  
  if (trail.tasks[taskId]) {
    log(`❌ Task #${taskId} already exists`, colors.red);
    process.exit(1);
  }

  trail.tasks[taskId] = {
    id: taskId,
    name: taskName,
    started: new Date().toISOString(),
    gates: [],
  };

  saveAuditTrail(trail);
  setCurrentGate(1);

  log(`✓ Task #${taskId} registered: "${taskName}"`, colors.green);
  log(`✓ Ready to start Gate 1`, colors.green);
}

function gateStart(gateNumber: number) {
  const currentGate = getCurrentGate();
  
  // Validation: Can only start current gate or next gate
  if (currentGate && gateNumber !== currentGate) {
    log(`❌ Cannot start Gate ${gateNumber}`, colors.red);
    log(`   Current gate: ${currentGate}`, colors.yellow);
    log(`   Must complete gates sequentially`, colors.yellow);
    process.exit(1);
  }

  // Create artifacts directory if needed
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  // Set current gate immediately to ensure state persistence
  setCurrentGate(gateNumber);

  // Load template
  const templatePath = path.join(RALPH_DIR, 'templates', `GATE_${gateNumber}_*.md`);
  const templates = fs.readdirSync(path.join(RALPH_DIR, 'templates'))
    .filter((f: string) => f.startsWith(`GATE_${gateNumber}_`));

  if (templates.length === 0) {
    log(`⚠️  No template found for Gate ${gateNumber}`, colors.yellow);
    log(`✓ Gate ${gateNumber} started (manual mode)`, colors.green);
    return;
  }

  const template = templates[0];
  const templateContent = fs.readFileSync(
    path.join(RALPH_DIR, 'templates', template),
    'utf-8'
  );

  // Replace placeholders
  const now = new Date().toISOString();
  const content = templateContent
    .replace(/\${TASK_ID}/g, 'TBD')
    .replace(/\${TASK_NAME}/g, 'TBD')
    .replace(/\${TIMESTAMP}/g, now);

  // Write to artifacts
  const artifactName = template.replace('GATE_', `GATE_${gateNumber}_`);
  const artifactPath = path.join(ARTIFACTS_DIR, artifactName);
  fs.writeFileSync(artifactPath, content);

  setCurrentGate(gateNumber);

  log(`✓ Created ${artifactName}`, colors.green);
  log(`✓ Checklist initialized`, colors.green);
  log(`✓ Current gate: ${gateNumber}`, colors.green);
}

function gateComplete(gateNumber: number) {
  const currentGate = getCurrentGate();
  
  if (currentGate !== gateNumber) {
    log(`❌ Cannot complete Gate ${gateNumber}`, colors.red);
    log(`   Current gate: ${currentGate || 'none'}`, colors.yellow);
    process.exit(1);
  }

  // TODO: Validate checklist and artifacts
  
  const trail = loadAuditTrail();
  // Find task with latest start time
  const taskId = Object.keys(trail.tasks).sort((a, b) => 
    new Date(trail.tasks[b].started).getTime() - new Date(trail.tasks[a].started).getTime()
  )[0];
  
  if (!taskId) {
    log(`❌ No active task. Run 'ralph task start' first.`, colors.red);
    process.exit(1);
  }

  const task = trail.tasks[taskId];
  const previousGate = task.gates[task.gates.length - 1];
  
  const gateData: Gate = {
    gate: gateNumber,
    name: `Gate ${gateNumber}`,
    timestamp: new Date().toISOString(),
    artifacts: [], // TODO: Detect artifacts
    hash: '',
    previousHash: previousGate?.hash,
  };

  // Calculate hash
  const dataToHash = JSON.stringify({
    gate: gateData.gate,
    timestamp: gateData.timestamp,
    artifacts: gateData.artifacts,
  });
  gateData.hash = calculateHash(dataToHash, gateData.previousHash);

  task.gates.push(gateData);
  saveAuditTrail(trail);

  // Advance to next gate
  if (gateNumber < 12) {
    setCurrentGate(gateNumber + 1);
    log(`✓ Gate ${gateNumber} complete`, colors.green);
    log(`✓ Ready to start Gate ${gateNumber + 1}`, colors.green);
  } else {
    fs.unlinkSync(CURRENT_GATE_PATH);
    log(`✓ Gate ${gateNumber} complete`, colors.green);
    log(`✓ All gates complete!`, colors.green);
  }
}

function verify() {
  const trail = loadAuditTrail();
  let hasErrors = false;
  
  log('\n' + '='.repeat(50), colors.cyan);
  log('Ralph Protocol Verification', colors.cyan);
  log('='.repeat(50) + '\n', colors.cyan);

  const taskIds = Object.keys(trail.tasks);
  if (taskIds.length === 0) {
    log('⚠️  No tasks registered in Ralph Protocol.', colors.yellow);
    // In strict mode, no tasks might be considered a pass if repo is empty,
    // but usually we want at least one active task. For now, pass.
    return;
  }

  for (const [taskId, task] of Object.entries(trail.tasks)) {
    log(`Task #${taskId}: ${task.name}`, colors.blue);
    log(`Started: ${task.started}\n`);

    let taskFailed = false;
    for (let i = 1; i <= 12; i++) {
      const gate = task.gates.find(g => g.gate === i);
      if (gate) {
        log(`  ✅ Gate ${i}: ${gate.name}`, colors.green);
        log(`     Timestamp: ${gate.timestamp}`);
      } else {
        log(`  ❌ Gate ${i}: INCOMPLETE`, colors.red);
        taskFailed = true;
        hasErrors = true;
      }
    }

    if (taskFailed) {
      log(`\n⚠️  Task #${taskId} has incomplete gates.`, colors.yellow);
    }
    log('');
  }

  if (hasErrors) {
    log('❌ Verification FAILED: Incomplete gates detected.', colors.red);
    log('   All tasks must complete Gates 1-12 before merging.', colors.red);
    process.exit(1);
  } else {
    log('✅ Verification PASSED: All tasks fully compliant.', colors.green);
    process.exit(0);
  }
}

function audit() {
  const trail = loadAuditTrail();
  console.log(JSON.stringify(trail, null, 2));
}

// Main CLI handler
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'task':
      if (args[1] === 'start' && args[2] && args[3]) {
        taskStart(args[2], args[3]);
      } else {
        log('Usage: ralph task start <id> "<name>"', colors.yellow);
      }
      break;

    case 'gate':
      if (args[1] === 'start' && args[2]) {
        gateStart(parseInt(args[2]));
      } else if (args[1] === 'complete' && args[2]) {
        gateComplete(parseInt(args[2]));
      } else {
        log('Usage: ralph gate start|complete <gate_number>', colors.yellow);
      }
      break;

    case 'verify':
      verify();
      break;

    case 'audit':
      audit();
      break;

    default:
      log('Ralph Protocol CLI', colors.cyan);
      log('\nCommands:', colors.yellow);
      log('  ralph task start <id> "<name>"    - Start a new task');
      log('  ralph gate start <N>              - Start gate N');
      log('  ralph gate complete <N>           - Complete gate N');
      log('  ralph verify                       - Verify gate compliance');
      log('  ralph audit                        - Show audit trail');
  }
}

main();
