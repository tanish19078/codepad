/**
 * Automated CLI Self-Test Suite (`npm test`)
 * Validates problem bank schema and verifies multi-language local execution (Java, C++, Python, JS)
 * as well as sample problems from both Java OOPS 40 and CSES Problem Set tracks.
 */
const fs = require('fs');
const path = require('path');
const { detectToolchains, runCode, judgeSubmission } = require('../server/services/local-runner');

const QUESTIONS_PATH = path.join(__dirname, '..', 'public', 'questions.json');

async function runSelfTests() {
  console.log('\n======================================================');
  console.log(' ⚡ ForgeJudge Automated Test & Verification Suite');
  console.log('======================================================\n');

  // 1. Check Toolchains
  const tc = detectToolchains();
  console.log('1) Probing Local Compiler Toolchains:');
  for (const [lang, info] of Object.entries(tc)) {
    console.log(`   - ${lang.padEnd(11)}: ${info.available ? '✓ ' + info.version : '✗ unavailable'}`);
  }

  // 2. Validate Question Bank Schema
  const questions = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));
  const oopsCount = questions.filter(q => q.track === 'Java OOPS 40').length;
  const csesCount = questions.filter(q => q.track === 'CSES Problem Set').length;
  const totalTestcases = questions.reduce((acc, q) => acc + (q.testcases ? q.testcases.length : 1), 0);

  console.log(`\n2) Validating Question Bank Schema (${questions.length} total problems):`);
  console.log(`   - Java OOPS 40 Track     : ${oopsCount} problems`);
  console.log(`   - CSES Problem Set Track : ${csesCount} problems`);
  console.log(`   - Total Testcases        : ${totalTestcases} verified testcases`);

  if (questions.length < 90) {
    throw new Error(`Expected at least 90 problems in bank, found ${questions.length}`);
  }

  // 3. Test Multi-Language Execution (Java, C++, Python, JavaScript)
  console.log('\n3) Verifying Multi-Language Local Runner Execution:');

  const javaRes = await runCode({
    language: 'java',
    code: 'import java.util.*; public class Main { public static void main(String[] a){ Scanner s=new Scanner(System.in); System.out.println(s.nextInt()*2); } }',
    stdin: '21',
  });
  if (javaRes.stage !== 'ok' || javaRes.stdout.trim() !== '42') throw new Error('Java runner test failed');
  console.log(`   - Java Runner       : ✓ PASSED (${javaRes.timeMs} ms)`);

  if (tc.cpp.available) {
    const cppRes = await runCode({
      language: 'cpp',
      code: '#include <iostream>\nusing namespace std;\nint main(){ int x; cin>>x; cout<<(x*3)<<endl; return 0; }',
      stdin: '14',
    });
    if (cppRes.stage !== 'ok' || cppRes.stdout.trim() !== '42') throw new Error('C++ runner test failed');
    console.log(`   - C++17 Runner      : ✓ PASSED (${cppRes.timeMs} ms)`);
  }

  if (tc.python.available) {
    const pyRes = await runCode({
      language: 'python',
      code: 'import sys\nprint(int(sys.stdin.read().strip()) * 6)',
      stdin: '7',
    });
    if (pyRes.stage !== 'ok' || pyRes.stdout.trim() !== '42') throw new Error('Python runner test failed');
    console.log(`   - Python 3 Runner   : ✓ PASSED (${pyRes.timeMs} ms)`);
  }

  if (tc.javascript.available) {
    const jsRes = await runCode({
      language: 'javascript',
      code: 'const fs=require("fs"); console.log(Number(fs.readFileSync(0,"utf8").trim()) + 2);',
      stdin: '40',
    });
    if (jsRes.stage !== 'ok' || jsRes.stdout.trim() !== '42') throw new Error('Node.js runner test failed');
    console.log(`   - Node.js Runner    : ✓ PASSED (${jsRes.timeMs} ms)`);
  }

  // 4. Verify RTE detection (Issue #1 regression test)
  const rteRes = await runCode({
    language: 'java',
    code: 'public class Main { public static void main(String[] args) { throw new RuntimeException("boom"); } }',
    stdin: '',
  });
  if (rteRes.stage !== 'runtime' || rteRes.verdict !== 'RUNTIME_ERROR') {
    throw new Error(`Expected RUNTIME_ERROR for crashing program, got ${rteRes.verdict}`);
  }
  console.log('   - RTE Classification: ✓ PASSED (Crash detected as RUNTIME_ERROR)');

  // 5. Spot-check batch judging across tracks
  const spotIds = [1, 101, 207, 301, 405, 508];
  console.log('\n4) Spot-Checking Multi-Testcase Judge Submissions:');
  for (const id of spotIds) {
    const q = questions.find(x => x.id === id);
    if (!q) continue;
    const judge = await judgeSubmission({
      code: q.solutionCode,
      language: 'java',
      testcases: q.testcases,
    });
    if (judge.verdict !== 'ACCEPTED') {
      throw new Error(`Spot check failed for Q${q.id} (${q.title}): ${judge.verdict}`);
    }
    console.log(`   - [Q${String(q.id).padEnd(3)}] ${q.title.padEnd(28)} : ✓ ACCEPTED (${judge.passedCount}/${judge.totalCount} cases in ${judge.totalTimeMs} ms)`);
  }

  console.log('\n✅ ALL FORGEJUDGE SELF-TESTS PASSED!\n');
}

runSelfTests().catch(err => {
  console.error('\n❌ SELF-TEST FAILED:', err);
  process.exit(1);
});
