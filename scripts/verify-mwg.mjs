import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function verifyMwgOutput(stdout = '', _stderr = '', exitStatus = 0) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch (err) {
    return {
      success: false,
      error: `failed to parse JSON output from scanner: ${err instanceof Error ? err.message : String(err)}`
    };
  }

  if (typeof parsed.totalFindings !== 'number') {
    return {
      success: false,
      error: 'output did not contain a valid totalFindings count.'
    };
  }

  if (parsed.totalFindings > 0) {
    return {
      success: false,
      totalFindings: parsed.totalFindings,
      error: `${parsed.totalFindings} legacy pattern finding(s) detected.`
    };
  }

  if (exitStatus !== 0) {
    return {
      success: false,
      error: `scanner process exited with non-zero status ${exitStatus}.`
    };
  }

  return {
    success: true,
    totalFindings: 0
  };
}

export function runMwgVerification(targetDir = 'src', runner = spawnSync) {
  const result = runner(`npx modern-web-guidance legacy-scan ${targetDir} --json`, {
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

  const verification = verifyMwgOutput(stdout, stderr, result.status ?? 0);
  if (!verification.success) {
    console.error(`\n❌ modern-web-guidance verification failed: ${verification.error}\n`);
    process.exit(1);
  }

  return verification;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runMwgVerification();
}
