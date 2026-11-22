import { spawnSync } from 'node:child_process';

try {
  const result = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], {
    stdio: 'ignore',
  });
  if (result.status === 0) {
    console.log('✅ Git hooks path successfully set to .githooks');
  }
} catch {
  // Gracefully continue if git is not available in the current environment
}
