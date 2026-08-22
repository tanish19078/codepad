const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const COMPILE_TIMEOUT_MS = 20000;
const RUN_TIMEOUT_MS = 10000;
const MAX_OUTPUT_BYTES = 512 * 1024;

/**
 * Compile & execute a single-file Java program.
 * @param {{code: string, stdin?: string}} params
 * @returns {Promise<{stage:'compile'|'run'|'ok', stdout:string, stderr:string, compileOutput:string, timeMs:number}>}
 */
function runJava({ code, stdin = '' }) {
  return new Promise(resolve => {
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codepad-run-'));
    const srcFile = path.join(workDir, 'Main.java');

    const cleanup = () => {
      try { fs.rmSync(workDir, { recursive: true, force: true }); } catch (_) {}
    };

    try {
      fs.writeFileSync(srcFile, code, 'utf8');
    } catch (err) {
      cleanup();
      resolve({ stage: 'compile', stdout: '', stderr: '', compileOutput: 'Failed to write source file: ' + err.message, timeMs: 0 });
      return;
    }

    const startedAt = Date.now();

    execFileWithInput('javac', [srcFile], '', COMPILE_TIMEOUT_MS)
      .then(compileRes => {
        if (compileRes.code !== 0) {
          cleanup();
          resolve({
            stage: 'compile',
            stdout: '',
            stderr: '',
            compileOutput: (compileRes.stdout + compileRes.stderr).trim(),
            timeMs: Date.now() - startedAt,
          });
          return;
        }
        return execFileWithInput('java', ['-cp', workDir, 'Main'], stdin, RUN_TIMEOUT_MS)
          .then(runRes => {
            cleanup();
            resolve({
              stage: 'ok',
              stdout: runRes.stdout,
              stderr: runRes.stderr || (runRes.timedOut ? `Time Limit Exceeded (${RUN_TIMEOUT_MS / 1000}s)` : ''),
              compileOutput: '',
              timeMs: Date.now() - startedAt,
            });
          });
      })
      .catch(err => {
        cleanup();
        resolve({ stage: 'compile', stdout: '', stderr: '', compileOutput: String(err.message || err), timeMs: Date.now() - startedAt });
      });
  });
}

function execFileWithInput(cmd, args, input, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { windowsHide: true });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);

    child.stdout.on('data', d => {
      if (stdout.length < MAX_OUTPUT_BYTES) stdout += d.toString();
    });
    child.stderr.on('data', d => {
      if (stderr.length < MAX_OUTPUT_BYTES) stderr += d.toString();
    });
    child.on('error', err => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', exitCode => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code: timedOut ? 124 : exitCode, stdout, stderr, timedOut });
    });

    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}

module.exports = { runJava };
