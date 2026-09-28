const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

const COMPILE_TIMEOUT_MS = 20000;
const DEFAULT_RUN_TIMEOUT_MS = 4000;
const MAX_OUTPUT_BYTES = 512 * 1024;

let cachedToolchains = null;

/**
 * Probe available local compilers/runtimes once and cache results.
 */
function detectToolchains() {
  if (cachedToolchains) return cachedToolchains;
  const probe = (cmd, args) => {
    try {
      const out = execFileSync(cmd, args, {
        encoding: 'utf8',
        timeout: 3000,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      });
      const firstLine = (out || '').trim().split(/\r?\n/)[0];
      return { available: true, version: firstLine || 'detected' };
    } catch (err) {
      if (err && (err.stdout || err.stderr)) {
        const combined = ((err.stdout || '') + '\n' + (err.stderr || '')).trim();
        if (combined) {
          return { available: true, version: combined.split(/\r?\n/)[0] };
        }
      }
      return { available: false, version: null };
    }
  };

  cachedToolchains = {
    java: probe('javac', ['-version']),
    cpp: probe('g++', ['--version']),
    python: probe('python', ['--version']),
    javascript: probe('node', ['-v']),
  };
  return cachedToolchains;
}

/**
 * Normalize program output for comparison: unify EOL, strip trailing spaces per line, drop trailing blank lines
 */
function normalizeOutput(text) {
  return String(text || '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

function execFileWithInput(cmd, args, input, timeoutMs, cwd) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const child = spawn(cmd, args, { cwd, windowsHide: true });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;

    const timer = setTimeout(() => {
      timedOut = true;
      try { child.kill('SIGKILL'); } catch (_) { child.kill(); }
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
      resolve({
        code: timedOut ? 124 : (exitCode ?? 0),
        stdout,
        stderr,
        timedOut,
        timeMs: Date.now() - started,
      });
    });

    if (input) {
      try { child.stdin.write(input); } catch (_) {}
    }
    try { child.stdin.end(); } catch (_) {}
  });
}

/**
 * Prepare & compile source code once in an isolated temporary directory.
 */
async function prepareWorkspace({ code, language = 'java' }) {
  const lang = String(language || 'java').toLowerCase();
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forgejudge-run-'));
  const cleanup = () => {
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch (_) {}
  };

  try {
    if (lang === 'java') {
      const srcFile = path.join(workDir, 'Main.java');
      fs.writeFileSync(srcFile, code, 'utf8');
      const compileRes = await execFileWithInput('javac', ['-encoding', 'UTF-8', srcFile], '', COMPILE_TIMEOUT_MS, workDir);
      if (compileRes.code !== 0) {
        cleanup();
        return {
          ok: false,
          compileOutput: (compileRes.stdout + '\n' + compileRes.stderr).trim() || 'Java compilation failed',
          compileTimeMs: compileRes.timeMs,
        };
      }
      return {
        ok: true,
        workDir,
        cleanup,
        compileTimeMs: compileRes.timeMs,
        runCmd: 'java',
        runArgs: ['-Xmx256M', '-cp', workDir, 'Main'],
      };
    }

    if (lang === 'cpp' || lang === 'c++') {
      const srcFile = path.join(workDir, 'solution.cpp');
      const binName = process.platform === 'win32' ? 'solution.exe' : 'solution';
      const binFile = path.join(workDir, binName);
      fs.writeFileSync(srcFile, code, 'utf8');
      const compileRes = await execFileWithInput(
        'g++',
        ['-O2', '-std=c++17', srcFile, '-o', binFile],
        '',
        COMPILE_TIMEOUT_MS,
        workDir
      );
      if (compileRes.code !== 0) {
        cleanup();
        return {
          ok: false,
          compileOutput: (compileRes.stdout + '\n' + compileRes.stderr).trim() || 'C++ compilation failed',
          compileTimeMs: compileRes.timeMs,
        };
      }
      return {
        ok: true,
        workDir,
        cleanup,
        compileTimeMs: compileRes.timeMs,
        runCmd: binFile,
        runArgs: [],
      };
    }

    if (lang === 'python' || lang === 'py') {
      const srcFile = path.join(workDir, 'solution.py');
      fs.writeFileSync(srcFile, code, 'utf8');
      return {
        ok: true,
        workDir,
        cleanup,
        compileTimeMs: 0,
        runCmd: 'python',
        runArgs: ['-u', srcFile],
      };
    }

    if (lang === 'javascript' || lang === 'js' || lang === 'node') {
      const srcFile = path.join(workDir, 'solution.js');
      fs.writeFileSync(srcFile, code, 'utf8');
      return {
        ok: true,
        workDir,
        cleanup,
        compileTimeMs: 0,
        runCmd: 'node',
        runArgs: [srcFile],
      };
    }

    cleanup();
    return {
      ok: false,
      compileOutput: `Unsupported language: ${language}`,
      compileTimeMs: 0,
    };
  } catch (err) {
    cleanup();
    return {
      ok: false,
      compileOutput: `Compiler invocation error: ${err.message || err}`,
      compileTimeMs: 0,
    };
  }
}

/**
 * Compile and run code on a single custom input.
 */
async function runCode({ code, stdin = '', language = 'java', timeoutMs = DEFAULT_RUN_TIMEOUT_MS }) {
  const prep = await prepareWorkspace({ code, language });
  if (!prep.ok) {
    return {
      stage: 'compile',
      verdict: 'COMPILE_ERROR',
      stdout: '',
      stderr: '',
      compileOutput: prep.compileOutput,
      timeMs: prep.compileTimeMs,
      exitCode: 1,
    };
  }

  try {
    const runRes = await execFileWithInput(prep.runCmd, prep.runArgs, stdin, timeoutMs, prep.workDir);
    prep.cleanup();

    if (runRes.timedOut) {
      return {
        stage: 'tle',
        verdict: 'TIME_LIMIT_EXCEEDED',
        stdout: runRes.stdout,
        stderr: (runRes.stderr ? runRes.stderr + '\n' : '') + `Time Limit Exceeded (${timeoutMs} ms)`,
        compileOutput: '',
        timeMs: runRes.timeMs,
        exitCode: 124,
      };
    }

    if (runRes.code !== 0) {
      return {
        stage: 'runtime',
        verdict: 'RUNTIME_ERROR',
        stdout: runRes.stdout,
        stderr: runRes.stderr || `Process exited with non-zero status (${runRes.code})`,
        compileOutput: '',
        timeMs: runRes.timeMs,
        exitCode: runRes.code,
      };
    }

    return {
      stage: 'ok',
      verdict: 'OK',
      stdout: runRes.stdout,
      stderr: runRes.stderr,
      compileOutput: '',
      timeMs: runRes.timeMs,
      exitCode: 0,
    };
  } catch (err) {
    prep.cleanup();
    return {
      stage: 'runtime',
      verdict: 'RUNTIME_ERROR',
      stdout: '',
      stderr: String(err.message || err),
      compileOutput: '',
      timeMs: 0,
      exitCode: -1,
    };
  }
}

/**
 * Compile ONCE and execute against multiple testcases (for /api/submit and batch test runner).
 */
async function judgeSubmission({ code, language = 'java', testcases = [], timeoutMs = DEFAULT_RUN_TIMEOUT_MS }) {
  const prep = await prepareWorkspace({ code, language });
  if (!prep.ok) {
    return {
      verdict: 'COMPILE_ERROR',
      compileTimeMs: prep.compileTimeMs,
      totalTimeMs: prep.compileTimeMs,
      maxTimeMs: 0,
      passedCount: 0,
      totalCount: testcases.length,
      results: testcases.map((tc, idx) => ({
        index: idx + 1,
        label: tc.label || `Test #${idx + 1}`,
        passed: false,
        verdict: 'COMPILE_ERROR',
        stage: 'compile',
        input: tc.input,
        expected: tc.expected,
        actual: '',
        stderr: '',
        compileOutput: prep.compileOutput,
        timeMs: 0,
      })),
    };
  }

  const results = [];
  let totalTimeMs = 0;
  let maxTimeMs = 0;

  try {
    for (let i = 0; i < testcases.length; i++) {
      const tc = testcases[i];
      const runRes = await execFileWithInput(prep.runCmd, prep.runArgs, tc.input || '', timeoutMs, prep.workDir);
      totalTimeMs += runRes.timeMs;
      if (runRes.timeMs > maxTimeMs) maxTimeMs = runRes.timeMs;

      let stage = 'ok';
      let tcVerdict = 'ACCEPTED';
      let passed = false;

      if (runRes.timedOut) {
        stage = 'tle';
        tcVerdict = 'TIME_LIMIT_EXCEEDED';
      } else if (runRes.code !== 0) {
        stage = 'runtime';
        tcVerdict = 'RUNTIME_ERROR';
      } else {
        passed = normalizeOutput(runRes.stdout) === normalizeOutput(tc.expected);
        tcVerdict = passed ? 'ACCEPTED' : 'WRONG_ANSWER';
      }

      results.push({
        index: i + 1,
        label: tc.label || `Test #${i + 1}`,
        passed,
        verdict: tcVerdict,
        stage,
        input: tc.input,
        expected: tc.expected,
        actual: runRes.stdout,
        stderr: runRes.timedOut
          ? (runRes.stderr ? runRes.stderr + '\n' : '') + `Time Limit Exceeded (${timeoutMs} ms)`
          : runRes.stderr,
        compileOutput: '',
        timeMs: runRes.timeMs,
      });
    }
  } finally {
    prep.cleanup();
  }

  const passedCount = results.filter(r => r.passed).length;
  const firstFailed = results.find(r => !r.passed);
  const overallVerdict = !firstFailed ? 'ACCEPTED' : firstFailed.verdict;

  return {
    verdict: overallVerdict,
    compileTimeMs: prep.compileTimeMs,
    totalTimeMs,
    maxTimeMs,
    passedCount,
    totalCount: results.length,
    results,
  };
}

module.exports = {
  detectToolchains,
  normalizeOutput,
  runCode,
  judgeSubmission,
};
