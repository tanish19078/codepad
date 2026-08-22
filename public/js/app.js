/* CodePad app: question bank rendering, editor wiring, run/submit flow */
(function () {
  'use strict';

  const LS_SOLVED = 'codepad.solved.v1';
  const LS_CODE = qid => `codepad.code.q${qid}`;
  const LS_LAST = 'codepad.last.v1';

  const state = {
    questions: [],
    currentId: null,
    solved: new Set(JSON.parse(localStorage.getItem(LS_SOLVED) || '[]')),
    busy: false,
    serverMode: false,
  };

  // ---------- helpers ----------
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const difficultyClass = d => `diff-${d}`;

  function currentQuestion() {
    return state.questions.find(q => q.id === state.currentId);
  }

  function loadCode(q) {
    return localStorage.getItem(LS_CODE(q.id)) || q.predefinedCode;
  }

  function saveCode(q, code) {
    localStorage.setItem(LS_CODE(q.id), code);
  }

  function markSolved(qid) {
    if (state.solved.has(qid)) return;
    state.solved.add(qid);
    localStorage.setItem(LS_SOLVED, JSON.stringify([...state.solved]));
    renderSidebar();
    renderProgress();
    if (qid === state.currentId) {
      const row = document.querySelector('.badge-row');
      if (row && !row.querySelector('.solved-badge')) {
        const badge = document.createElement('span');
        badge.className = 'badge solved-badge';
        badge.innerHTML = '&#10003; Completed';
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

  // ---------- sidebar ----------
  function renderSidebar(filter = '') {
    const list = $('#questionList');
    const f = filter.trim().toLowerCase();
    const groups = new Map();

    for (const q of state.questions) {
      if (f && !`${q.id} ${q.title} ${q.concept}`.toLowerCase().includes(f)) continue;
      const key = q.section.name;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(q);
    }

    list.innerHTML = '';
    for (const [sectionName, qs] of groups) {
      const label = document.createElement('div');
      label.className = 'section-label';
      label.textContent = `${sectionName} · ${qs[0].section.title}`;
      list.appendChild(label);

      for (const q of qs) {
        const item = document.createElement('div');
        item.className = 'q-item' + (q.id === state.currentId ? ' active' : '') + (state.solved.has(q.id) ? ' solved' : '');
        item.dataset.qid = q.id;
        item.innerHTML =
          `<span class="q-num">${q.id}</span>` +
          `<span class="diff-dot ${difficultyClass(q.difficulty)}" title="${q.difficulty}"></span>` +
          `<span class="q-title">${esc(q.title)}</span>` +
          `<span class="q-check">&#10003;</span>`;
        item.addEventListener('click', () => selectQuestion(q.id));
        list.appendChild(item);
      }
    }
  }

  function renderProgress() {
    $('#progressText').textContent = `${state.solved.size} / ${state.questions.length} solved`;
    $('#progressFill').style.width = `${(state.solved.size / Math.max(state.questions.length, 1)) * 100}%`;
  }

  // ---------- question pane ----------
  function renderQuestionPane(q) {
    const pane = $('#questionPane');

    const constraints = q.constraints.split('\n').filter(Boolean).map(c => `<li>${esc(c)}</li>`).join('');

    pane.innerHTML = `
      <div class="q-header">
        <h1>Q${q.id}. ${esc(q.title)}</h1>
        <div class="badge-row">
          ${state.solved.has(q.id) ? '<span class="badge solved-badge">&#10003; Completed</span>' : ''}
          <span class="badge diff ${difficultyClass(q.difficulty)}">${q.difficulty}</span>
          <span class="concept-badge">${esc(q.concept)}</span>
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
        <h2>Sample Input & Output</h2>
        <div class="io-grid">
          <div class="io-block in"><h3>Input</h3><pre>${esc(q.sampleInput)}</pre></div>
          <div class="io-block out"><h3>Output</h3><pre>${esc(q.sampleOutput)}</pre></div>
        </div>
      </div>

      <div class="q-section">
        <h2>Explanation</h2>
        <p>${esc(q.explanation)}</p>
      </div>

      <details class="solution">
        <summary>Spoiler! Complete Solution & Analysis</summary>
        <div class="solution-body">
          <div class="complexity-row">
            <span class="chip">Time: <b>${esc(q.timeComplexity)}</b></span>
            <span class="chip">Space: <b>${esc(q.spaceComplexity)}</b></span>
          </div>
          <pre style="margin-top:12px;font-family:var(--mono);font-size:12.5px;background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;padding:12px;overflow-x:auto;">${esc(q.solutionCode)}</pre>
          <div class="explanation-note">Try to solve it yourself first. Only peek if you're stuck!</div>
        </div>
      </details>
    `;
  }

  // ---------- selection ----------
  function selectQuestion(id) {
    state.currentId = id;
    localStorage.setItem(LS_LAST, String(id));
    const q = currentQuestion();
    renderQuestionPane(q);
    renderSidebar($('#searchBox').value);
    editor.setValue(loadCode(q));
    $('#fileName').textContent = 'Main.java · Q' + q.id;
    resetConsole();
    $('#stdinBox').value = q.sampleInput;
    document.body.classList.add('pane-open');
    if (window.innerWidth <= 900) {
      $('#sidebar').classList.add('collapsed');
    }
    $('#questionPane').scrollTop = 0;
    location.hash = `q${id}`;
  }

  // ---------- console ----------
  function resetConsole() {
    $('#consoleTitle').textContent = 'Console';
    $('#consoleMeta').textContent = '';
    $('#consoleBody').innerHTML =
      '<div class="console-hint">Press Run to execute, or Submit to evaluate against the sample tests.</div>';
  }

  function showBusy(button) {
    button.disabled = true;
    return () => { button.disabled = false; };
  }

  function renderRunResult(r) {
    $('#consoleTitle').textContent = 'Output';
    const meta = r.stage === 'ok' && r.timeMs != null ? `${r.timeMs} ms` : '';
    $('#consoleMeta').textContent = meta;
    const body = $('#consoleBody');

    let html = '';
    if (r.stage === 'compile') {
      html += `<div class="verdict COMPILE_ERROR">Compilation Error</div>`;
      html += `<span class="console-label">Compiler output</span><pre class="console-pre warn">${esc(r.compileOutput)}</pre>`;
    } else {
      html += `<span class="console-label">stdout</span><pre class="console-pre">${esc(r.stdout) || '(no output)'}</pre>`;
      if (r.stderr) html += `<span class="console-label">stderr</span><pre class="console-pre err">${esc(r.stderr)}</pre>`;
      const timing = r.timeMs != null ? `process finished in ${r.timeMs} ms` : 'process finished';
      html += `<span class="console-label">exit</span><pre class="console-pre">${timing}</pre>`;
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
    return html || '<span style="color:var(--text-dim)">outputs differ only in whitespace</span>';
  }

  function renderSubmitResult(data, q) {
    $('#consoleTitle').textContent = 'Submission';
    const firstFail = data.results.find(r => !r.passed);
    const metaBits = [];
    if (firstFail && firstFail.stage === 'compile') metaBits.push('compile error');
    else if (firstFail && firstFail.stage !== 'ok') metaBits.push(firstFail.stage);
    else metaBits.push(`${data.results.filter(r => r.passed).length}/${data.results.length} tests passed`);
    $('#consoleMeta').textContent = metaBits.join(' · ');

    const body = $('#consoleBody');
    let verdictClass = data.verdict === 'ACCEPTED' ? 'ACCEPTED'
      : (firstFail && firstFail.stage === 'compile') ? 'COMPILE_ERROR' : 'WRONG_ANSWER';

    let verdictMsg = data.verdict === 'ACCEPTED'
      ? `&#10003; Accepted — nice work! (${firstFail ? '' : data.results.length} test${data.results.length > 1 ? 's' : ''} passed)`
      : '&#10007; Wrong Answer — check the diff below.';
    if (verdictClass === 'COMPILE_ERROR') verdictMsg = '&#9888; Compilation Error on submission';

    let html = `<div class="verdict ${verdictClass}">${verdictMsg}</div>`;

    if (data.verdict === 'ACCEPTED') {
      body.innerHTML = html;
      return;
    }

    for (let i = 0; i < data.results.length; i++) {
      const r = data.results[i];
      const status = r.passed
        ? '<span>&#10003; passed</span>'
        : `<span>&#10007; failed${r.timeMs ? ` · ${r.timeMs} ms` : ''}</span>`;
      let inner = '';

      if (r.stage === 'compile') {
        inner += `<pre class="console-pre warn">${esc(r.compileOutput)}</pre>`;
      } else {
        const expectedNorm = r.expected.replace(/\s+$/, '');
        const actualNorm = r.actual.replace(/\s+$/, '').replace(/\n+$/, '');
        inner += `
          <div class="tc-io">
            <div class="tc-block expected"><span class="console-label">Expected</span><pre>${esc(expectedNorm)}</pre></div>
            <div class="tc-block actual"><span class="console-label">Your output</span><pre>${esc(actualNorm) || '(empty)'}</pre></div>
          </div>`;
        if (!r.passed) inner += `<div class="line-diff"><span class="console-label">Diff</span>${lineDiff(expectedNorm, actualNorm)}</div>`;
        if (r.stderr) inner += `<span class="console-label">stderr</span><pre class="console-pre err">${esc(r.stderr)}</pre>`;
      }

      html += `
        <div class="testcase ${r.passed ? 'pass' : 'fail'}">
          <div class="tc-head ${r.passed ? 'pass' : 'fail'}"><span>Test case ${i + 1}</span>${status}</div>
          <div class="tc-body">${inner}</div>
        </div>`;
    }
    body.innerHTML = html;

    if (data.verdict === 'ACCEPTED') markSolved(q.id);
  }

  // ---------- persistence indicator ----------
  let savedTimer = null;
  function flashSaved() {
    const el = $('#saveIndicator');
    if (!el) return;
    el.textContent = 'Saved';
    el.classList.add('show');
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => el.classList.remove('show'), 1200);
  }

  // ---------- execution (local runner or Piston fallback) ----------
  // Vercel/static hosting has no Java backend, so we execute through the
  // public Piston API (https://emkc.org) when /api/health is unavailable.
  let pistonVersion = null;

  async function getPistonVersion() {
    if (pistonVersion) return pistonVersion;
    const res = await fetch('https://emkc.org/api/v2/piston/runtimes');
    if (!res.ok) throw new Error('Piston runtimes HTTP ' + res.status);
    const list = await res.json();
    const java = list.find(r => r.language === 'java' || (r.aliases || []).includes('java'));
    pistonVersion = java ? java.version : '15.0.2';
    return pistonVersion;
  }

  async function pistonRun(code, stdin = '') {
    const version = await getPistonVersion();
    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'java',
        version,
        files: [{ name: 'Main.java', content: code }],
        stdin,
        compile_timeout: 20000,
        run_timeout: 10000,
      }),
    });
    if (!res.ok) throw new Error('Piston HTTP ' + res.status);
    const data = await res.json();
    const compileFailed = data.compile && data.compile.code !== 0;
    return {
      stage: compileFailed ? 'compile' : 'ok',
      stdout: (data.run && data.run.stdout) || '',
      stderr: (data.run && data.run.stderr) || '',
      compileOutput: compileFailed
        ? ((data.compile.stdout || '') + (data.compile.stderr || '')).trim()
        : '',
      timeMs: data.run && typeof data.run.signal === 'undefined' ? null : null,
    };
  }

  async function execute(code, stdin) {
    if (state.serverMode) return api('/api/run', { code, stdin });
    return pistonRun(code, stdin);
  }

  // ---------- actions ----------
  async function handleRun() {
    const q = currentQuestion();
    if (!q || state.busy) return;
    state.busy = true;
    const done = showBusy($('#runBtn'));
    $('#runBtn').innerHTML = '&#9203; Running';
    try {
      saveCode(q, editor.getValue());
      const result = await execute(editor.getValue(), $('#stdinBox').value);
      renderRunResult(result);
    } catch (err) {
      $('#consoleBody').innerHTML = `<pre class="console-pre err">Request failed: ${esc(err.message)}</pre>`;
    } finally {
      state.busy = false;
      done();
      $('#runBtn').innerHTML = '&#9654; Run';
    }
  }

  /** Client-side judging for static hosting: run each testcase through Piston */
  async function judgeLocally(q, code) {
    const testcases = [{ input: q.sampleInput, expected: q.sampleOutput }];
    const norm = t => t
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map(l => l.replace(/[ \t]+$/, ''))
      .join('\n')
      .replace(/\n+$/, '');

    const results = [];
    for (const tc of testcases) {
      let r;
      try {
        r = await pistonRun(code, tc.input);
      } catch (err) {
        return { verdict: 'RUN_ERROR', error: err.message, results: [] };
      }
      results.push({
        passed: r.stage === 'ok' && norm(r.stdout) === norm(tc.expected),
        input: tc.input,
        expected: tc.expected,
        actual: r.stdout,
        stage: r.stage,
        stderr: r.stderr,
        compileOutput: r.compileOutput,
        timeMs: r.timeMs || null,
      });
    }
    return { verdict: results.every(r => r.passed) ? 'ACCEPTED' : 'WRONG_ANSWER', results };
  }

  async function handleSubmit() {
    const q = currentQuestion();
    if (!q || state.busy) return;
    state.busy = true;
    const done = showBusy($('#submitBtn'));
    $('#submitBtn').innerHTML = '&#9203; Judging';
    try {
      saveCode(q, editor.getValue());
      const result = state.serverMode
        ? await api('/api/submit', { questionId: q.id, code: editor.getValue() })
        : await judgeLocally(q, editor.getValue());
      renderSubmitResult(result, q);
    } catch (err) {
      $('#consoleBody').innerHTML = `<pre class="console-pre err">Request failed: ${esc(err.message)}</pre>`;
    } finally {
      state.busy = false;
      done();
      $('#submitBtn').innerHTML = 'Submit &#10003;';
    }
  }

  // ---------- init ----------
  let editor;

  async function init() {
    // detect whether we're served by the local Node backend or static hosting
    try {
      const h = await fetch('/api/health');
      state.serverMode = h.ok;
    } catch (_) {
      state.serverMode = false;
    }

    let loaded = null;
    try {
      loaded = await api('/api/questions');
    } catch (_) {
      // static hosting without the rewrite -> load the bank directly
      const res = await fetch('/questions.json');
      if (!res.ok) throw new Error('could not load question bank');
      loaded = await res.json();
    }
    state.questions = loaded;

    try {
    editor = new CodeEditor($('#editor'), {
      onChange: code => {
        const q = currentQuestion();
        if (q) {
          saveCode(q, code);
          flashSaved();
        }
      },
      onRunShortcut: handleRun,
    });

    // initial question: from hash (#q7), last opened, first unsolved, or Q1
    const hashMatch = (location.hash.match(/^#q(\d+)$/) || [])[1];
    const hashQ = hashMatch && state.questions.find(x => x.id === Number(hashMatch));
    const lastQ = state.questions.find(x => x.id === Number(localStorage.getItem(LS_LAST)));
    const firstUnsolved = state.questions.find(x => !state.solved.has(x.id));
    selectQuestion(hashQ ? hashQ.id : (lastQ || firstUnsolved || state.questions[0]).id);
    if (!hashQ) history.replaceState(null, '', '');

    renderProgress();

    // toolbar
    $('#runBtn').addEventListener('click', handleRun);
    $('#submitBtn').addEventListener('click', handleSubmit);
    $('#resetBtn').addEventListener('click', () => {
      const q = currentQuestion();
      if (!q) return;
      if (confirm(`Reset your code for Q${q.id} back to the predefined template?`)) {
        editor.setValue(q.predefinedCode);
        localStorage.removeItem(LS_CODE(q.id));
      }
    });

    $('#sidebarToggle').addEventListener('click', () => $('#sidebar').classList.toggle('collapsed'));
    $('#searchBox').addEventListener('input', e => renderSidebar(e.target.value));
    $('#stdinHeader').addEventListener('click', () => $('.stdin-wrap').classList.toggle('collapsed'));

    window.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') e.preventDefault();
    });
    } catch (err) {
      console.error('init failed:', err);
      const pane = $('#questionPane');
      if (pane) {
        pane.innerHTML = `<div class="pane-empty" style="color:#f85149">App failed to start: ${esc(err.message)}</div>`;
      }
    }
  }

  init().catch(err => console.error('unhandled init error:', err));
})();
