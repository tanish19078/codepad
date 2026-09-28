const { runCode, judgeSubmission, detectToolchains, normalizeOutput } = require('./local-runner');

/**
 * Backwards-compatible wrapper around local-runner for Java execution.
 */
function runJava({ code, stdin = '', timeoutMs }) {
  return runCode({ code, stdin, language: 'java', timeoutMs });
}

module.exports = {
  runJava,
  runCode,
  judgeSubmission,
  detectToolchains,
  normalizeOutput,
};
