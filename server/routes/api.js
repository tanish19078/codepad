const questions = require('../../public/questions.json');
const { runJava } = require('../services/java-runner');

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body.replace(/^\uFEFF/, '')) : {});
      } catch (err) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

/** Normalize program output for comparison: unify EOL, strip trailing spaces, drop trailing blank lines */
function normalize(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

async function handleApi(req, res) {
  if (req.method === 'GET' && req.url === '/api/health') {
    sendJson(res, 200, { status: 'ok', runner: 'local-jdk' });
    return;
  }

  if (req.method === 'GET' && req.url === '/api/questions') {
    sendJson(res, 200, questions);
    return;
  }

  if (req.method === 'POST' && req.url === '/api/run') {
    const body = await readJsonBody(req);
    if (typeof body.code !== 'string' || !body.code.trim()) {
      sendJson(res, 400, { error: 'Missing code' });
      return;
    }
    const result = await runJava({ code: body.code, stdin: body.stdin || '' });
    sendJson(res, 200, result);
    return;
  }

  if (req.method === 'POST' && req.url === '/api/submit') {
    const body = await readJsonBody(req);
    const question = questions.find(q => q.id === Number(body.questionId));
    if (!question) {
      sendJson(res, 404, { error: 'Unknown questionId' });
      return;
    }
    if (typeof body.code !== 'string' || !body.code.trim()) {
      sendJson(res, 400, { error: 'Missing code' });
      return;
    }

    const testcases = Array.isArray(question.testcases) && question.testcases.length
      ? question.testcases
      : [{ input: question.sampleInput, expected: question.sampleOutput }];

    const results = [];
    for (const tc of testcases) {
      const r = await runJava({ code: body.code, stdin: tc.input });
      const passed = r.stage === 'ok' && normalize(r.stdout) === normalize(tc.expected);
      results.push({
        passed,
        input: tc.input,
        expected: tc.expected,
        actual: r.stdout,
        stage: r.stage,
        stderr: r.stderr,
        compileOutput: r.compileOutput,
        timeMs: r.timeMs,
      });
    }

    const allPassed = results.every(r => r.passed);
    sendJson(res, 200, { verdict: allPassed ? 'ACCEPTED' : 'WRONG_ANSWER', results });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

module.exports = { handleApi };
