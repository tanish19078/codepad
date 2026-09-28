const fs = require('fs');
const path = require('path');
const { runCode, judgeSubmission, detectToolchains } = require('../services/local-runner');

const QUESTIONS_PATH = path.join(__dirname, '..', '..', 'public', 'questions.json');

function getQuestions() {
  try {
    const raw = fs.readFileSync(QUESTIONS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[api] failed to load questions.json:', err.message);
    return [];
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
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

async function handleApi(req, res) {
  const urlPath = req.url.split('?')[0];

  if (req.method === 'GET' && urlPath === '/api/health') {
    const questions = getQuestions();
    const toolchains = detectToolchains();
    sendJson(res, 200, {
      status: 'ok',
      engine: 'ForgeJudge Local Execution Engine v2.0',
      runner: 'local-jdk',
      toolchains,
      problemCount: questions.length,
    });
    return;
  }

  if (req.method === 'GET' && urlPath === '/api/questions') {
    sendJson(res, 200, getQuestions());
    return;
  }

  if (req.method === 'POST' && urlPath === '/api/run') {
    const body = await readJsonBody(req);
    if (typeof body.code !== 'string' || !body.code.trim()) {
      sendJson(res, 400, { error: 'Missing code' });
      return;
    }
    const language = body.language || 'java';

    // Support running a batch of custom testcases in one compile
    if (Array.isArray(body.testcases) && body.testcases.length > 0) {
      const batchResult = await judgeSubmission({
        code: body.code,
        language,
        testcases: body.testcases,
      });
      sendJson(res, 200, batchResult);
      return;
    }

    const result = await runCode({
      code: body.code,
      stdin: body.stdin || '',
      language,
    });
    sendJson(res, 200, result);
    return;
  }

  if (req.method === 'POST' && urlPath === '/api/submit') {
    const body = await readJsonBody(req);
    const questions = getQuestions();
    const question = questions.find(q => q.id === Number(body.questionId));
    if (!question) {
      sendJson(res, 404, { error: 'Unknown questionId' });
      return;
    }
    if (typeof body.code !== 'string' || !body.code.trim()) {
      sendJson(res, 400, { error: 'Missing code' });
      return;
    }

    const language = body.language || 'java';
    const testcases = Array.isArray(question.testcases) && question.testcases.length
      ? question.testcases
      : [{ label: 'Sample Case 1', input: question.sampleInput, expected: question.sampleOutput }];

    const summary = await judgeSubmission({
      code: body.code,
      language,
      testcases,
    });

    sendJson(res, 200, summary);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

module.exports = { handleApi };
