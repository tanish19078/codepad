// Sanity-check: RunnerHarness must compile against the bundled JDK8 tools.jar
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'runner-chk-'));
try {
  execFileSync('javac', [
    '-nowarn', '--release', '8',
    '-cp', path.join(__dirname, '..', 'public', 'cheerpj', 'tools.jar'),
    '-d', path.join(dir, 'out'),
    path.join(__dirname, '..', 'tools', 'RunnerHarness.java'),
  ], { stdio: 'pipe' });
  console.log('RunnerHarness compiles OK (Java 8 target)');
} catch (e) {
  console.error('COMPILE FAILED:\n' + e.stderr.toString());
  process.exit(1);
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
