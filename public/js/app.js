/* ForgeJudge IDE: CSES & OOPS Problem Set Explorer, Multi-Language Runner & Judge */
(function () {
  'use strict';

  const LS_SOLVED = 'codepad.solved.v1';
  const LS_CODE = (qid, lang) => lang === 'java' ? `codepad.code.q${qid}` : `codepad.code.q${qid}.${lang}`;
  const LS_LAST = 'codepad.last.v1';
  const LS_LANG = 'forgejudge.lang.v1';
  const LS_JDOODLE = 'codepad.jdoodle.v1';

  const FILE_NAMES = {
    java: 'Main.java',
    cpp: 'solution.cpp',
    python: 'solution.py',
    javascript: 'solution.js',
  };

  const state = {
    questions: [],
    currentId: null,
    activeTrack: 'ALL',
    activeDiff: 'ALL',
    language: localStorage.getItem(LS_LANG) || 'java',
    activeCaseIndex: 0,
    solved: new Set(JSON.parse(localStorage.getItem(LS_SOLVED) || '[]')),
    busy: false,
    serverMode: false,
    toolchains: null,
    timerSeconds: 0,
    timerInterval: null,
  };

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const difficultyClass = d => `diff-${d}`;

  function currentQuestion() {
    return state.questions.find(q => q.id === state.currentId);
  }

  function getTemplateForLang(q, lang) {
    if (q.templates && q.templates[lang]) return q.templates[lang];
    return q.predefinedCode || '';
  }

  function loadCode(q, lang = state.language) {
    return localStorage.getItem(LS_CODE(q.id, lang)) || getTemplateForLang(q, lang);
  }

  function saveCode(q, code, lang = state.language) {
    localStorage.setItem(LS_CODE(q.id, lang), code);
  }

  function markSolved(qid) {
    if (state.solved.has(qid)) return;
    state.solved.add(qid);
    localStorage.setItem(LS_SOLVED, JSON.stringify([...state.solved]));
    renderSidebar($('#searchBox').value);
    renderProgress();
    if (qid === state.currentId) {
      const row = document.querySelector('.badge-row');
      if (row && !row.querySelector('.solved-badge')) {
        const badge = document.createElement('span');
        badge.className = 'badge solved-badge';
        badge.innerHTML = '&#10003; Solved';
        row.prepend(badge);
      }
    }
  }

  async function api(path, body) {
    const res = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      let msg = `${res.status}`;
      try { msg = (await res.json()).error || msg; } catch (_) {}
      throw new Error(msg);
    }
    return res.json();
  }

  // ---------- Workbench Tab Switching ----------
  function switchWorkbenchTab(paneId) {
    $$('.wb-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.pane === paneId));
    $$('.wb-pane').forEach(p => p.classList.toggle('active', p.id === paneId));
    $('.workbench-wrap').classList.remove('collapsed');
  }

  // ---------- Sidebar & Filtering ----------
  function matchesFilters(q, searchFilter) {
    if (state.activeTrack !== 'ALL' && q.track !== state.activeTrack) return false;
    if (state.activeDiff === 'UNSOLVED' && state.solved.has(q.id)) return false;
    if (state.activeDiff === 'EASY' && q.difficulty !== 'EASY') return false;
    if (state.activeDiff === 'MEDIUM' && q.difficulty !== 'MEDIUM') return false;
    if (state.activeDiff === 'HARD' && q.difficulty !== 'HARD' && q.difficulty !== 'MEDIUM-HARD') return false;
    if (searchFilter) {
      const hay = `${q.id} ${q.csesId || ''} ${q.title} ${q.concept} ${q.section.name} ${q.section.title}`.toLowerCase();
      if (!hay.includes(searchFilter)) return false;
    }
    return true;
  }

  function renderSidebar(filter = '') {
    const list = $('#questionList');
    const f = filter.trim().toLowerCase();
    const groups = new Map();

    for (const q of state.questions) {
      if (!matchesFilters(q, f)) continue;
      const key = q.section.name;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(q);
    }

    list.innerHTML = '';
    if (groups.size === 0) {
      list.innerHTML = '<div class="pane-empty" style="margin-top:36px;font-size:12.5px;">No matching problems found</div>';
      return;
    }

    for (const [sectionName, qs] of groups) {
      const solvedInSec = qs.filter(x => state.solved.has(x.id)).length;
      const label = document.createElement('div');
      label.className = 'section-label';
      label.innerHTML = `<span>${esc(sectionName)} · ${esc(qs[0].section.title)}</span><span>${solvedInSec}/${qs.length}</span>`;
      list.appendChild(label);

      for (const q of qs) {
        const item = document.createElement('div');
        item.className = 'q-item' + (q.id === state.currentId ? ' active' : '') + (state.solved.has(q.id) ? ' solved' : '');
        item.dataset.qid = q.id;
        item.innerHTML =
          `<span class="q-num">#${q.id}</span>` +
          `<span class="diff-dot ${difficultyClass(q.difficulty)}" title="${q.difficulty}"></span>` +
          `<span class="q-title">${esc(q.title)}</span>` +
          `<span class="q-check">&#10003;</span>`;
        item.addEventListener('click', () => selectQuestion(q.id));
        list.appendChild(item);
      }
    }
  }

  function renderProgress() {
    const total = state.questions.length;
    const csesQs = state.questions.filter(q => q.track === 'CSES Problem Set');
    const oopsQs = state.questions.filter(q => q.track === 'Java OOPS 40');
    const csesSolved = csesQs.filter(q => state.solved.has(q.id)).length;
    const oopsSolved = oopsQs.filter(q => state.solved.has(q.id)).length;

    $('#progressText').textContent = `${state.solved.size} / ${total} solved`;
    $('#trackBreakdown').textContent = `CSES ${csesSolved}/${csesQs.length} · OOPS ${oopsSolved}/${oopsQs.length}`;
    $('#progressFill').style.width = `${(state.solved.size / Math.max(total, 1)) * 100}%`;

    if ($('#countAll')) $('#countAll').textContent = total;
    if ($('#countCses')) $('#countCses').textContent = csesQs.length;
    if ($('#countOops')) $('#countOops').textContent = oopsQs.length;
  }

  // ---------- Question Detail Pane ----------
  function renderQuestionPane(q) {
    const pane = $('#questionPane');
    const constraints = (q.constraints || '').split('\n').filter(Boolean).map(c => `<li>${esc(c)}</li>`).join('');
    const tcCount = Array.isArray(q.testcases) ? q.testcases.length : 1;
    const csesBadge = q.csesId
      ? `<a class="cses-link" href="https://cses.fi/problemset/task/${q.csesId}" target="_blank" rel="noopener">CSES #${q.csesId} &#8599;</a>`
      : '';

    pane.innerHTML = `
      <div class="q-header">
        <h1>#${q.id}. ${esc(q.title)}</h1>
        <div class="badge-row">
          ${state.solved.has(q.id) ? '<span class="badge solved-badge">&#10003; Solved</span>' : ''}
          <span class="track-badge">${esc(q.track || 'Java OOPS 40')}</span>
          ${csesBadge}
          <span class="badge diff ${difficultyClass(q.difficulty)}">${q.difficulty}</span>
          <span class="concept-badge">${esc(q.concept)}</span>
          <span class="suite-badge">${tcCount} Verified Tests</span>
        </div>
      </div>

      <div class="q-section">
        <h2>Problem Statement</h2>
        <p>${esc(q.statement)}</p>
      </div>

      <div class="q-section">
        <h2>Constraints</h2>
        <ul class="constraints-list">${constraints}</ul>
      </div>

      <div class="q-section">
        <h2>Sample Input &amp; Output</h2>
        <div class="io-grid">
          <div class="io-block in">
            <h3><span>Sample Input</span><button id="copyInputBtn" class="copy-btn">Copy</button></h3>
            <pre>${esc(q.sampleInput)}</pre>
          </div>
          <div class="io-block out">
            <h3><span>Sample Output</span></h3>
            <pre>${esc(q.sampleOutput)}</pre>
          </div>
        </div>
      </div>

      <div class="q-section">
        <h2>Algorithmic Approach &amp; Notes</h2>
        <p>${esc(q.explanation)}</p>
      </div>

      <details class="solution">
        <summary>Reference Solution &amp; Complexity Analysis</summary>
        <div class="solution-body">
          <div class="complexity-row">
            <span class="chip">Time: <b>${esc(q.timeComplexity)}</b></span>
            <span class="chip">Space: <b>${esc(q.spaceComplexity)}</b></span>
            <button id="loadSolutionBtn" class="btn btn-submit small" style="margin-left:auto;">Load Reference into Editor</button>
          </div>
          <pre style="margin-top:12px;font-family:var(--mono);font-size:12px;background:#070a0f;border:1px solid var(--border);border-radius:8px;padding:12px;overflow-x:auto;">${esc(q.solutionCode)}</pre>
          <div class="explanation-note">Reference implementation is verified against all ${tcCount} testcases on the local execution engine.</div>
        </div>
      </details>
    `;

    const copyBtn = $('#copyInputBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(q.sampleInput || '');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
      });
    }

    const loadSolBtn = $('#loadSolutionBtn');
    if (loadSolBtn) {
      loadSolBtn.addEventListener('click', () => {
        state.language = 'java';
        $('#langSelect').value = 'java';
        editor.setLanguage('java');
        editor.setValue(q.solutionCode);
        saveCode(q, q.solutionCode, 'java');
        updateFileLabel(q);
      });
    }
  }

  function renderCaseTabs(q) {
    const container = $('#caseTabs');
    if (!container) return;
    const cases = Array.isArray(q.testcases) && q.testcases.length
      ? q.testcases
      : [{ label: 'Sample Case 1', input: q.sampleInput }];

    container.innerHTML = '';
    cases.forEach((tc, idx) => {
      const btn = document.createElement('button');
      btn.className = 'case-tab' + (idx === state.activeCaseIndex ? ' active' : '');
      btn.textContent = tc.label || `Case ${idx + 1}`;
      btn.addEventListener('click', () => {
        state.activeCaseIndex = idx;
        $('#stdinBox').value = tc.input;
        renderCaseTabs(q);
      });
      container.appendChild(btn);
    });
  }

  function updateFileLabel(q) {
    $('#fileName').textContent = `${FILE_NAMES[state.language] || 'Main.java'} · #${q.id}`;
  }

  // ---------- Question Selection ----------
  function selectQuestion(id) {
    state.currentId = id;
    state.activeCaseIndex = 0;
    localStorage.setItem(LS_LAST, String(id));
    const q = currentQuestion();
    if (!q) return;

    renderQuestionPane(q);
    renderSidebar($('#searchBox').value);
    editor.setLanguage(state.language);
    editor.setValue(loadCode(q, state.language));
    updateFileLabel(q);
    renderCaseTabs(q);

    const firstInput = (Array.isArray(q.testcases) && q.testcases[0]) ? q.testcases[0].input : q.sampleInput;
    $('#stdinBox').value = firstInput;
    renderConsoleIdle();

    document.body.classList.add('pane-open');
    if (window.innerWidth <= 900) {
      $('#sidebar').classList.add('collapsed');
    }
    $('#questionPane').scrollTop = 0;
    location.hash = `q${id}`;
  }

  // ---------- Console & Verdict Rendering ----------
  function showBusy(button) {
    button.disabled = true;
    return () => { button.disabled = false; };
  }

  function renderRunResult(r) {
    switchWorkbenchTab('consolePane');
    const meta = r.timeMs != null ? `${r.timeMs} ms · ${state.language.toUpperCase()}` : state.language.toUpperCase();
    $('#consoleMeta').textContent = meta;
    $('#consoleBadge').textContent = r.stage === 'ok' ? 'OK' : 'ERR';
    const body = $('#consoleBody');

    let html = '';
    if (r.stage === 'compile') {
      html += `<div class="verdict COMPILE_ERROR"><span>&#9888; Compilation Error</span><span>${r.timeMs || 0} ms</span></div>`;
      html += `<span class="console-label">Compiler Diagnostics</span><pre class="console-pre warn">${esc(r.compileOutput)}</pre>`;
    } else if (r.stage === 'tle') {
      html += `<div class="verdict TIME_LIMIT_EXCEEDED"><span>&#9201; Time Limit Exceeded</span><span>${r.timeMs || 0} ms</span></div>`;
      if (r.stdout) html += `<span class="console-label">Partial stdout</span><pre class="console-pre">${esc(r.stdout)}</pre>`;
      if (r.stderr) html += `<span class="console-label">stderr</span><pre class="console-pre err">${esc(r.stderr)}</pre>`;
    } else if (r.stage === 'runtime') {
      html += `<div class="verdict RUNTIME_ERROR"><span>&#10060; Runtime Error (Exit ${r.exitCode ?? 1})</span><span>${r.timeMs || 0} ms</span></div>`;
      if (r.stdout) html += `<span class="console-label">stdout</span><pre class="console-pre">${esc(r.stdout)}</pre>`;
      if (r.stderr) html += `<span class="console-label">Stack Trace / stderr</span><pre class="console-pre err">${esc(r.stderr)}</pre>`;
    } else {
      html += `<div class="verdict ACCEPTED"><span>&#9654; Execution Finished</span><span>${r.timeMs || 0} ms</span></div>`;
      html += `<span class="console-label">Standard Output (stdout)</span><pre class="console-pre">${esc(r.stdout) || '(empty output)'}</pre>`;
      if (r.stderr) html += `<span class="console-label">Standard Error (stderr)</span><pre class="console-pre err">${esc(r.stderr)}</pre>`;
    }
    body.innerHTML = html;
  }

  function lineDiff(expected, actual) {
    const expLines = expected.split('\n');
    const actLines = actual.split('\n');
    let html = '';
    const max = Math.max(expLines.length, actLines.length);
    for (let i = 0; i < max; i++) {
      const e = expLines[i];
      const a = actLines[i];
      if (e === a) continue;
      if (e !== undefined) html += `<span class="del">- ${esc(e)}</span>`;
      if (a !== undefined) html += `<span class="add">+ ${esc(a)}</span>`;
    }
    return html || '<span style="color:var(--text-dim)">outputs differ only in trailing whitespace</span>';
  }

  function renderSubmitResult(data, q) {
    switchWorkbenchTab('consolePane');
    const passedCount = data.results.filter(r => r.passed).length;
    const totalCount = data.results.length;
    $('#consoleBadge').textContent = `${passedCount}/${totalCount}`;
    $('#consoleMeta').textContent = `${passedCount}/${totalCount} passed · ${data.totalTimeMs || 0} ms total`;

    const body = $('#consoleBody');
    const v = data.verdict || 'WRONG_ANSWER';

    const labels = {
      ACCEPTED: `&#10003; ACCEPTED — All ${totalCount} Verified Testcases Passed!`,
      WRONG_ANSWER: `&#10007; WRONG ANSWER — Passed ${passedCount} of ${totalCount} testcases`,
      TIME_LIMIT_EXCEEDED: `&#9201; TIME LIMIT EXCEEDED`,
      RUNTIME_ERROR: `&#10060; RUNTIME ERROR during testcase execution`,
      COMPILE_ERROR: `&#9888; COMPILATION ERROR`,
    };

    let html = `<div class="verdict ${v}"><span>${labels[v] || v}</span><span>${data.totalTimeMs || 0} ms</span></div>`;

    for (let i = 0; i < data.results.length; i++) {
      const r = data.results[i];
      const status = r.passed
        ? `<span>&#10003; PASSED (${r.timeMs || 0} ms)</span>`
        : `<span>&#10007; ${r.verdict || 'FAILED'} (${r.timeMs || 0} ms)</span>`;
      let inner = '';

      if (r.stage === 'compile') {
        inner += `<pre class="console-pre warn">${esc(r.compileOutput)}</pre>`;
      } else {
        const expectedNorm = (r.expected || '').replace(/\s+$/, '');
        const actualNorm = (r.actual || '').replace(/\s+$/, '').replace(/\n+$/, '');
        inner += `
          <div class="tc-io">
            <div class="tc-block expected"><span class="console-label">Expected Output</span><pre>${esc(expectedNorm)}</pre></div>
            <div class="tc-block actual"><span class="console-label">Your Output</span><pre>${esc(actualNorm) || '(empty)'}</pre></div>
          </div>`;
        if (!r.passed && r.stage === 'ok') {
          inner += `<div class="line-diff"><span class="console-label">Diff</span>${lineDiff(expectedNorm, actualNorm)}</div>`;
        }
        if (r.stderr) inner += `<span class="console-label">stderr</span><pre class="console-pre err">${esc(r.stderr)}</pre>`;
      }

      html += `
        <div class="testcase ${r.passed ? 'pass' : 'fail'}">
          <div class="tc-head ${r.passed ? 'pass' : 'fail'}"><span>${esc(r.label || `Test Case #${i + 1}`)}</span>${status}</div>
          <div class="tc-body">${inner}</div>
        </div>`;
    }
    body.innerHTML = html;

    if (data.verdict === 'ACCEPTED') markSolved(q.id);
  }

  // ---------- Persistence Flash ----------
  let savedTimer = null;
  function flashSaved() {
    const el = $('#saveIndicator');
    if (!el) return;
    el.textContent = '✓ Saved';
    el.classList.add('show');
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => el.classList.remove('show'), 1200);
  }

  // ---------- Execution Providers ----------
  const CHEERPJ_LOADER = 'https://cjrtnc.leaningtech.com/4.3/loader.js';
  let cjReadyPromise = null;

  async function readVFile(path, tries = 10) {
    for (let i = 0; i < tries; i++) {
      try {
        const blob = await window.cjFileBlob(path);
        const text = await blob.text();
        if (text) return text;
      } catch (_) {}
      await new Promise(r => setTimeout(r, 150));
    }
    return '';
  }

  function ensureCheerpJ() {
    if (!cjReadyPromise) {
      cjReadyPromise = (async () => {
        const consoleEl = document.createElement('div');
        consoleEl.id = 'cheerpj-display';
        consoleEl.style.cssText = 'position:absolute;left:-9999px;top:0;width:800px;height:600px;overflow:hidden;';
        document.body.appendChild(consoleEl);

        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = CHEERPJ_LOADER;
          s.onload = resolve;
          s.onerror = () => reject(new Error('Could not download the in-browser Java runtime'));
          document.head.appendChild(s);
        });

        await window.cheerpjInit({ status: 'none' });
        window.cheerpjCreateDisplay(consoleEl);
      })();
      cjReadyPromise.catch(() => { cjReadyPromise = null; });
    }
    return cjReadyPromise;
  }

  async function cheerpjExecute(code, stdin = '') {
    const startedAt = performance.now();
    await ensureCheerpJ();
    window.cheerpOSAddStringFile('/str/Main.java', code);
    window.cheerpOSAddStringFile('/str/input.txt', stdin || '');
    await window.cheerpjRunMain('RunnerHarness', '/app/cheerpj/runner.jar:/app/cheerpj/tools.jar');
    let raw = await readVFile('/files/work/result.txt');
    if (!raw) {
      await new Promise(r => setTimeout(r, 400));
      raw = await readVFile('/files/work/result.txt', 3);
    }
    if (!raw) {
      return { stage: 'runtime', stdout: '', stderr: 'In-browser JVM returned no output.', compileOutput: '', timeMs: Math.round(performance.now() - startedAt) };
    }
    const lines = raw.split('\n');
    const cStatus = Number((lines.find(l => l.startsWith('CSTATUS:')) || 'CSTATUS:1').slice(8).trim());
    const clog = (lines.find(l => l.startsWith('CLOG:')) || 'CLOG:').slice(5).replace(/\u0001/g, '\n').trim();
    const eStatus = Number((lines.find(l => l.startsWith('ESTATUS:')) || 'ESTATUS:0').slice(8).trim());
    const stdout = raw.slice(raw.indexOf('\n', raw.indexOf('ESTATUS:') + 1) + 1);

    if (cStatus !== 0) {
      return { stage: 'compile', stdout: '', stderr: '', compileOutput: clog || 'Compilation failed', timeMs: Math.round(performance.now() - startedAt) };
    }
    return {
      stage: eStatus !== 0 ? 'runtime' : 'ok',
      stdout,
      stderr: eStatus !== 0 ? 'Runtime exception occurred.' : '',
      compileOutput: '',
      timeMs: Math.round(performance.now() - startedAt),
    };
  }

  async function execute(code, stdin) {
    if (state.serverMode) return api('/api/run', { code, stdin, language: state.language });
    return cheerpjExecute(code, stdin);
  }

  async function judgeLocally(q, code) {
    const testcases = Array.isArray(q.testcases) && q.testcases.length
      ? q.testcases
      : [{ label: 'Sample Case 1', input: q.sampleInput, expected: q.sampleOutput }];
    const norm = t => String(t || '').replace(/\r\n?/g, '\n').split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n').replace(/\n+$/, '');
    const results = [];
    for (const tc of testcases) {
      const r = await execute(code, tc.input);
      results.push({
        label: tc.label,
        passed: r.stage === 'ok' && norm(r.stdout) === norm(tc.expected),
        verdict: r.stage === 'ok' ? (norm(r.stdout) === norm(tc.expected) ? 'ACCEPTED' : 'WRONG_ANSWER') : 'RUNTIME_ERROR',
        input: tc.input,
        expected: tc.expected,
        actual: r.stdout,
        stage: r.stage,
        stderr: r.stderr,
        compileOutput: r.compileOutput,
        timeMs: r.timeMs || 0,
      });
    }
    return { verdict: results.every(r => r.passed) ? 'ACCEPTED' : 'WRONG_ANSWER', results };
  }

  function showEngineDiagnostics() {
    if (state.toolchains) {
      const lines = Object.entries(state.toolchains).map(([k, v]) =>
        `• ${k.toUpperCase()}: ${v.available ? '✓ ' + v.version : '✗ Not installed'}`
      ).join('\n');
      alert(`⚡ ForgeJudge Local Execution Engine\n\nDetected Compilers & Runtimes:\n${lines}\n\nTotal Verified Problems: ${state.questions.length}`);
    } else {
      alert('Running in Browser WebAssembly JVM mode. Run `npm start` locally to enable native Java, C++17, Python 3, and Node.js execution.');
    }
  }

  function renderConsoleIdle() {
    $('#consoleMeta').textContent = state.serverMode ? `Local Engine (${state.language.toUpperCase()})` : 'In-Browser JVM';
    $('#consoleBadge').textContent = '';
    const body = $('#consoleBody');
    if (state.serverMode) {
      body.innerHTML = `<div class="console-hint">&#9889; <b>ForgeJudge Local Runner Active</b> &nbsp;·&nbsp; Language: <b>${state.language.toUpperCase()}</b> &nbsp;·&nbsp; Press <b>Run (Ctrl+Enter)</b> for custom input or <b>Submit Judge (Ctrl+Shift+Enter)</b> to run all verified testcases in a single compile.</div>`;
    } else {
      body.innerHTML = `<div class="console-hint">Runner: In-Browser JVM (WebAssembly). Run <code>npm start</code> locally for native Java, C++17, Python 3, and Node.js execution.</div>`;
    }
  }

  // ---------- Run & Submit Handlers ----------
  async function handleRun() {
    const q = currentQuestion();
    if (!q || state.busy) return;
    state.busy = true;
    const done = showBusy($('#runBtn'));
    $('#runBtn').innerHTML = '&#9203; Running...';
    try {
      saveCode(q, editor.getValue(), state.language);
      const result = await execute(editor.getValue(), $('#stdinBox').value);
      renderRunResult(result);
    } catch (err) {
      switchWorkbenchTab('consolePane');
      $('#consoleBody').innerHTML = `<pre class="console-pre err">Execution error: ${esc(err.message)}</pre>`;
    } finally {
      state.busy = false;
      done();
      $('#runBtn').innerHTML = '&#9654; Run';
    }
  }

  async function handleSubmit() {
    const q = currentQuestion();
    if (!q || state.busy) return;
    state.busy = true;
    const done = showBusy($('#submitBtn'));
    $('#submitBtn').innerHTML = '&#9203; Judging...';
    try {
      saveCode(q, editor.getValue(), state.language);
      const result = state.serverMode
        ? await api('/api/submit', { questionId: q.id, code: editor.getValue(), language: state.language })
        : await judgeLocally(q, editor.getValue());
      renderSubmitResult(result, q);
    } catch (err) {
      switchWorkbenchTab('consolePane');
      $('#consoleBody').innerHTML = `<pre class="console-pre err">Judge request failed: ${esc(err.message)}</pre>`;
    } finally {
      state.busy = false;
      done();
      $('#submitBtn').innerHTML = '&#9889; Submit Judge';
    }
  }

  // ---------- Stopwatch Timer ----------
  function updateTimerDisplay() {
    const m = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
    const s = String(state.timerSeconds % 60).padStart(2, '0');
    $('#timerDisplay').textContent = `${m}:${s}`;
  }

  function toggleTimer() {
    const btn = $('#timerToggleBtn');
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
      btn.innerHTML = '&#9654;';
    } else {
      state.timerInterval = setInterval(() => {
        state.timerSeconds++;
        updateTimerDisplay();
      }, 1000);
      btn.innerHTML = '&#9208;';
    }
  }

  function resetTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
      $('#timerToggleBtn').innerHTML = '&#9654;';
    }
    state.timerSeconds = 0;
    updateTimerDisplay();
  }

  // ---------- Init ----------
  let editor;

  async function init() {
    try {
      const hRes = await fetch('/api/health');
      if (hRes.ok) {
        const h = await hRes.json();
        state.serverMode = true;
        state.toolchains = h.toolchains || null;
        const pill = $('#engineStatusPill');
        const text = $('#engineStatusText');
        if (pill && text) {
          pill.classList.add('online');
          const count = h.toolchains ? Object.values(h.toolchains).filter(x => x.available).length : 1;
          text.textContent = `Local Engine Ready (${count} Compilers)`;
        }
      }
    } catch (_) {
      state.serverMode = false;
    }

    let loaded = null;
    try {
      loaded = await api('/api/questions');
    } catch (_) {
      const res = await fetch('/questions.json');
      loaded = await res.json();
    }
    state.questions = loaded;

    $('#langSelect').value = state.language;

    editor = new CodeEditor($('#editor'), {
      onChange: code => {
        const q = currentQuestion();
        if (q) {
          saveCode(q, code, state.language);
          flashSaved();
        }
      },
      onRunShortcut: handleRun,
      onSubmitShortcut: handleSubmit,
    });

    const hashMatch = (location.hash.match(/^#q(\d+)$/) || [])[1];
    const hashQ = hashMatch && state.questions.find(x => x.id === Number(hashMatch));
    const lastQ = state.questions.find(x => x.id === Number(localStorage.getItem(LS_LAST)));
    const firstUnsolved = state.questions.find(x => !state.solved.has(x.id));
    selectQuestion(hashQ ? hashQ.id : (lastQ || firstUnsolved || state.questions[0]).id);

    renderProgress();

    // Event Wiring
    $('#runBtn').addEventListener('click', handleRun);
    $('#submitBtn').addEventListener('click', handleSubmit);
    $('#formatBtn').addEventListener('click', () => {
      editor.format();
      flashSaved();
    });
    $('#fontDownBtn').addEventListener('click', () => editor.setFontSize(editor.fontSize - 1));
    $('#fontUpBtn').addEventListener('click', () => editor.setFontSize(editor.fontSize + 1));

    $('#resetBtn').addEventListener('click', () => {
      const q = currentQuestion();
      if (!q) return;
      if (confirm(`Reset your ${state.language.toUpperCase()} code for #${q.id} (${q.title}) back to the starter template?`)) {
        const tmpl = getTemplateForLang(q, state.language);
        editor.setValue(tmpl);
        localStorage.removeItem(LS_CODE(q.id, state.language));
      }
    });

    $('#langSelect').addEventListener('change', e => {
      const q = currentQuestion();
      state.language = e.target.value;
      localStorage.setItem(LS_LANG, state.language);
      editor.setLanguage(state.language);
      if (q) {
        editor.setValue(loadCode(q, state.language));
        updateFileLabel(q);
        renderConsoleIdle();
      }
    });

    // Track Tabs
    $$('#trackTabs .track-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#trackTabs .track-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTrack = btn.dataset.track;
        renderSidebar($('#searchBox').value);
      });
    });

    // Difficulty Pills
    $$('#diffFilters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#diffFilters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeDiff = btn.dataset.diff;
        renderSidebar($('#searchBox').value);
      });
    });

    // Workbench Tabs
    $$('.wb-tab').forEach(btn => {
      btn.addEventListener('click', () => switchWorkbenchTab(btn.dataset.pane));
    });

    // Random Unsolved Button
    $('#randomBtn').addEventListener('click', () => {
      const pool = state.questions.filter(q =>
        (state.activeTrack === 'ALL' || q.track === state.activeTrack) && !state.solved.has(q.id)
      );
      const list = pool.length ? pool : state.questions;
      const pick = list[Math.floor(Math.random() * list.length)];
      if (pick) selectQuestion(pick.id);
    });

    // Timer controls
    $('#timerToggleBtn').addEventListener('click', toggleTimer);
    $('#timerResetBtn').addEventListener('click', resetTimer);

    $('#sidebarToggle').addEventListener('click', () => $('#sidebar').classList.toggle('collapsed'));
    $('#searchBox').addEventListener('input', e => renderSidebar(e.target.value));
    $('#stdinHeader').addEventListener('click', () => $('.workbench-wrap').classList.toggle('collapsed'));
    $('#runnerBtn').addEventListener('click', showEngineDiagnostics);
    $('#engineStatusPill').addEventListener('click', showEngineDiagnostics);

    window.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== $('#searchBox') && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        $('#searchBox').focus();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        $('#sidebar').classList.toggle('collapsed');
      }
    });
  }

  init().catch(err => console.error('ForgeJudge init error:', err));
})();
