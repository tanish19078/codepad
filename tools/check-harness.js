// Sanity-check: extract HARNESS_SOURCE from app.js and compile it with javac.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const src = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'app.js'), 'utf8');
const m = src.match(/const HARNESS_SOURCE = \[([\s\S]*?)\]\.join\('\\n'\);/);
if (!m) { console.error('HARNESS_SOURCE not found'); process.exit(1); }

const arrSrc = '[' + m[1] + ']';
const lines = eval(arrSrc);
const java = lines.join('\n');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-chk-'));
fs.writeFileSync(path.join(dir, 'Harness.java'), java);
try {
  execFileSync('javac', ['--release', '8', path.join(dir, 'Harness.java')], { stdio: 'pipe' });
  console.log('HARNESS_SOURCE compiles OK (' + java.split('\n').length + ' lines)');
} catch (e) {
  console.error('COMPILE FAILED:\n' + e.stderr.toString());
  process.exit(1);
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
