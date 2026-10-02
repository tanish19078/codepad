/**
 * Build & verify the complete ForgeJudge Problem Bank (40 Java OOPS + 53 CSES Problem Set = 93 Problems).
 * Uses the local JDK execution engine to run every problem's reference solutionCode
 * against multiple test inputs, generating verified multi-testcase suites.
 */
const fs = require('fs');
const path = require('path');
const { judgeSubmission, normalizeOutput } = require('../server/services/local-runner');

const BASE_OOPS_PATH = path.join(__dirname, 'oops-40-base.json');
const PUBLIC_QUESTIONS_PATH = path.join(__dirname, '..', 'public', 'questions.json');

const introductory = require('./cses/introductory');
const sortingSearching = require('./cses/sorting-searching');
const dynamicProgramming = require('./cses/dynamic-programming');
const graphsTrees = require('./cses/graphs-trees');
const rangeQueriesMath = require('./cses/range-queries-math');
const stringGeometry = require('./cses/string-geometry');

/**
 * Generate additional varied inputs for OOPS problems based on their sampleInput format
 */
function generateOopsExtraInputs(q) {
  const s = (q.sampleInput || '').trim();
  if (!s) return [''];
  const lines = s.split(/\r?\n/);

  // Single integer input (e.g. "5", "25")
  if (lines.length === 1 && /^\d+$/.test(lines[0].trim())) {
    const v = Number(lines[0].trim());
    return [s, String(Math.max(1, v + 2)), String(Math.max(1, v * 2))];
  }

  // First line is count N followed by N names/lines
  if (lines.length > 1 && /^\d+$/.test(lines[0].trim())) {
    const n = Number(lines[0].trim());
    if (lines.length === n + 1 && lines.slice(1).every(l => /^[A-Za-z]+$/.test(l.trim()))) {
      return [
        s,
        '2\nZara\nLiam',
        '5\nAlpha\nBravo\nCharlie\nDelta\nEcho',
      ];
    }
  }

  // Single string input
  if (lines.length === 1 && /^[A-Za-z]+$/.test(lines[0].trim())) {
    return [s, 'level', 'ForgeJudge'];
  }

  return [s];
}

function defaultLanguageTemplates(q) {
  return {
    java: q.predefinedCode,
    cpp: `#include <bits/stdc++.h>
using namespace std;

// Problem: ${q.title} (${q.track || 'ForgeJudge'})
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    // Write your C++17 solution here
    
    return 0;
}`,
    python: `import sys

# Problem: ${q.title} (${q.track || 'ForgeJudge'})
def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    # Write your Python 3 solution here

if __name__ == '__main__':
    solve()
`,
    javascript: `const fs = require('fs');

// Problem: ${q.title} (${q.track || 'ForgeJudge'})
function solve() {
    const input = fs.readFileSync(0, 'utf8').trim();
    // Write your Node.js solution here
}

solve();
`,
  };
}

async function main() {
  // 1. Ensure base 40 OOPS problems backup exists
  if (!fs.existsSync(BASE_OOPS_PATH)) {
    const current = JSON.parse(fs.readFileSync(PUBLIC_QUESTIONS_PATH, 'utf8'));
    const oopsOnly = current.filter(q => q.id <= 40);
    fs.writeFileSync(BASE_OOPS_PATH, JSON.stringify(oopsOnly, null, 2), 'utf8');
    console.log(`[build-bank] Saved ${oopsOnly.length} base OOPS questions to tools/oops-40-base.json`);
  }

  const oopsQuestions = JSON.parse(fs.readFileSync(BASE_OOPS_PATH, 'utf8')).map(q => ({
    ...q,
    track: 'Java OOPS 40',
    testInputs: generateOopsExtraInputs(q),
  }));

  const csesQuestions = [
    ...introductory,
    ...sortingSearching,
    ...dynamicProgramming,
    ...graphsTrees,
    ...rangeQueriesMath,
    ...stringGeometry,
  ];

  const allQuestions = [...oopsQuestions, ...csesQuestions];
  console.log(`[build-bank] Compiling & generating verified testcases for ${allQuestions.length} problems...`);

  let verifiedCount = 0;
  for (const q of allQuestions) {
    const inputs = Array.isArray(q.testInputs) && q.testInputs.length > 0
      ? q.testInputs
      : [q.sampleInput];

    // Ensure sampleInput is always Test #1
    const uniqueInputs = [q.sampleInput, ...inputs.filter(inp => inp !== q.sampleInput)];
    const dummyCases = uniqueInputs.map((inp, idx) => ({
      label: idx === 0 ? 'Sample Case' : `Hidden Case #${idx + 1}`,
      input: inp,
      expected: '',
    }));

    const runRes = await judgeSubmission({
      code: q.solutionCode,
      language: 'java',
      testcases: dummyCases,
    });

    if (runRes.verdict === 'COMPILE_ERROR') {
      throw new Error(`Reference solution failed to compile for Q${q.id} (${q.title}):\n${runRes.results[0].compileOutput}`);
    }

    const sampleActual = normalizeOutput(runRes.results[0].actual);
    const sampleExpected = normalizeOutput(q.sampleOutput);
    if (sampleActual !== sampleExpected) {
      throw new Error(
        `Sample output mismatch on Q${q.id} (${q.title}):\nExpected:\n${sampleExpected}\nActual:\n${sampleActual}`
      );
    }

    q.testcases = runRes.results.map((r, idx) => ({
      label: idx === 0 ? 'Sample Case 1' : `Test Case ${idx + 1}`,
      input: r.input,
      expected: normalizeOutput(r.actual),
      ...(q.checker ? { checker: q.checker } : {})
    }));

    q.templates = defaultLanguageTemplates(q);
    delete q.testInputs;

    verifiedCount++;
    if (verifiedCount % 15 === 0 || verifiedCount === allQuestions.length) {
      console.log(`  ✓ Verified ${verifiedCount} / ${allQuestions.length} problems`);
    }
  }

  fs.writeFileSync(PUBLIC_QUESTIONS_PATH, JSON.stringify(allQuestions, null, 2), 'utf8');
  console.log(`\n[build-bank] Successfully wrote ${allQuestions.length} verified problems to public/questions.json!`);
}

main().catch(err => {
  console.error('[build-bank] ERROR:', err);
  process.exit(1);
});
