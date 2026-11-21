import { spawnSync } from 'node:child_process';

const result = spawnSync('npx modern-web-guidance legacy-scan src --json', {
  encoding: 'utf-8',
  shell: true,
});

const stdout = result.stdout || '';
const stderr = result.stderr || '';

if (stdout) {
  process.stdout.write(stdout);
}
if (stderr) {
  process.stderr.write(stderr);
}

try {
  const data = JSON.parse(stdout);
  if (typeof data.totalFindings === 'number' && data.totalFindings > 0) {
    console.error(`\n❌ modern-web-guidance verification failed: ${data.totalFindings} legacy pattern finding(s) detected.\n`);
    process.exit(1);
  }
} catch {
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

if (result.status !== 0) {
  process.exit(result.status);
}
