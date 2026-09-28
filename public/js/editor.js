/**
 * ForgeJudge Multi-Language Code Editor
 * Supports syntax highlighting (Java, C++, Python, JavaScript),
 * smart auto-indentation/formatting (#formatBtn & Shift+Alt+F),
 * bracket matching, and adjustable font sizes.
 */
(function () {
  'use strict';

  const KEYWORDS = [
    // Java / C++ / JS / Python keywords
    'abstract','assert','auto','boolean','bool','break','byte','case','catch','char','class','const',
    'constexpr','continue','def','default','delete','do','double','elif','else','enum','except','explicit',
    'export','extends','extern','false','final','finally','float','for','from','function','global','goto',
    'if','implements','import','in','inline','instanceof','int','interface','is','lambda','let','long',
    'mutable','namespace','native','new','nil','None','nonlocal','not','null','nullptr','operator','or',
    'override','package','pass','private','protected','public','raise','record','register','reinterpret_cast',
    'require','return','short','signed','sizeof','static','static_cast','strictfp','struct','super','switch',
    'synchronized','template','this','throw','throws','transient','true','try','typedef','typename','typeof',
    'union','unsigned','using','var','virtual','void','volatile','wchar_t','while','with','yield','True','False'
  ];

  const TOKEN_RE = new RegExp(
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/|#[^\\n]*)' +         // 1 comments (//, /* */, #)
    '|("(?:\\\\.|[^"\\\\\\n])*")' +                             // 2 double-quoted strings
    "|('(?:\\\\.|[^'\\\\\\n])*')" +                             // 3 single-quoted strings/chars
    '|(@[A-Za-z_]\\w*)' +                                       // 4 annotations / decorators
    '|\\b(' + KEYWORDS.join('|') + ')\\b' +                     // 5 keywords
    '|\\b(0[xX][0-9a-fA-F_]+[lL]?|\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?[fFdDlL]?)\\b' + // 6 numbers
    '|\\b([A-Z][A-Za-z0-9_]*)\\b',                              // 7 types / classes
    'g'
  );

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightCode(src) {
    let out = '';
    let last = 0;
    src.replace(TOKEN_RE, function (match, com, str, chr, ann, kw, num, type, offset) {
      out += escapeHtml(src.slice(last, offset));
      const cls = com ? 'tok-com' : str || chr ? 'tok-str' : ann ? 'tok-ann'
        : kw ? 'tok-kw' : num ? 'tok-num' : type ? 'tok-type' : '';
      out += '<span class="' + cls + '">' + escapeHtml(match) + '</span>';
      last = offset + match.length;
      return match;
    });
    out += escapeHtml(src.slice(last));
    return out;
  }

  /**
   * Smart brace/colon-aware auto-formatter for Java, C++, JS, and Python
   */
  function formatSourceCode(src, language = 'java') {
    const lines = src.replace(/\r\n?/g, '\n').split('\n');
    if (language === 'python') {
      return lines.map(l => l.replace(/[ \t]+$/, '')).join('\n');
    }
    let depth = 0;
    const formatted = [];
    for (let rawLine of lines) {
      const trimmed = rawLine.trim();
      if (!trimmed) {
        formatted.push('');
        continue;
      }
      // Decrease indent before lines starting with closing brace
      if (/^[}\])]/.test(trimmed)) {
        depth = Math.max(0, depth - 1);
      }
      formatted.push('    '.repeat(depth) + trimmed);

      // Count net brace change ignoring strings/comments
      const stripped = trimmed
        .replace(/\/\/.*$/, '')
        .replace(/"(?:\\.|[^"\\])*"/g, '')
        .replace(/'(?:\\.|[^'\\])*'/g, '');
      let openCount = (stripped.match(/[{[(]/g) || []).length;
      let closeCount = (stripped.match(/[}\])]/g) || []).length;
      if (/^[}\])]/.test(trimmed)) {
        closeCount = Math.max(0, closeCount - 1);
      }
      depth = Math.max(0, depth + openCount - closeCount);
    }
    return formatted.join('\n');
  }

  class CodeEditor {
    /**
     * @param {HTMLElement} container
     * @param {{onChange?: Function, onRunShortcut?: Function, onSubmitShortcut?: Function}} handlers
     */
    constructor(container, handlers = {}) {
      this.container = container;
      this.handlers = handlers;
      this.language = 'java';
      this.fontSize = 13.5;

      container.classList.add('editor');
      container.innerHTML =
        '<div class="gutter">1</div>' +
        '<div class="code-area">' +
        '  <pre class="highlight" aria-hidden="true"><code></code></pre>' +
        '  <textarea spellcheck="false" autocomplete="off" autocapitalize="off"></textarea>' +
        '</div>';

      this.gutter = container.querySelector('.gutter');
      this.codeEl = container.querySelector('pre.highlight');
      this.textarea = container.querySelector('textarea');

      this.textarea.addEventListener('input', () => this.refresh());
      this.textarea.addEventListener('scroll', () => this.syncScroll());
      this.textarea.addEventListener('keydown', e => this.onKeydown(e));
    }

    setLanguage(lang) {
      this.language = lang || 'java';
      this.refresh();
    }

    setFontSize(px) {
      this.fontSize = Math.max(11, Math.min(20, Number(px) || 13.5));
      this.gutter.style.fontSize = `${this.fontSize}px`;
      this.codeEl.style.fontSize = `${this.fontSize}px`;
      this.textarea.style.fontSize = `${this.fontSize}px`;
    }

    format() {
      const formatted = formatSourceCode(this.textarea.value, this.language);
      this.setValue(formatted);
    }

    onKeydown(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        if (this.handlers.onSubmitShortcut) this.handlers.onSubmitShortcut();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (this.handlers.onRunShortcut) this.handlers.onRunShortcut();
        return;
      }
      if (e.shiftKey && e.altKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        this.format();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const ta = this.textarea;
        const { selectionStart: s, selectionEnd: en, value } = ta;
        if (e.shiftKey) {
          const lineStart = value.lastIndexOf('\n', s - 1) + 1;
          if (value.slice(lineStart, lineStart + 4) === '    ') {
            ta.value = value.slice(0, lineStart) + value.slice(lineStart + 4);
            ta.selectionStart = ta.selectionEnd = Math.max(lineStart, s - 4);
          }
        } else {
          ta.setRangeText('    ', s, en, 'end');
        }
        this.refresh();
        return;
      }
      if (e.key === 'Enter') {
        const ta = this.textarea;
        const { selectionStart: s, value } = ta;
        const lineStart = value.lastIndexOf('\n', s - 1) + 1;
        const indentMatch = value.slice(lineStart, s).match(/^[ \t]*/);
        let indent = indentMatch ? indentMatch[0] : '';
        const beforeCursor = value.slice(0, s);
        const opensBlock = /[{:]\s*$/.test(beforeCursor);
        if (opensBlock) indent += '    ';
        if (indent) {
          e.preventDefault();
          ta.setRangeText('\n' + indent, s, ta.selectionEnd, 'end');
          this.refresh();
        }
      }
    }

    refresh() {
      const value = this.textarea.value;
      this.codeEl.innerHTML = highlightCode(value) + '\n';
      const lineCount = value.split('\n').length;
      let gutterHtml = '';
      for (let i = 1; i <= lineCount; i++) gutterHtml += i + '\n';
      this.gutter.textContent = gutterHtml;
      this.syncScroll();
      if (this.handlers.onChange) this.handlers.onChange(value);
    }

    syncScroll() {
      this.codeEl.scrollTop = this.textarea.scrollTop;
      this.codeEl.scrollLeft = this.textarea.scrollLeft;
      this.gutter.scrollTop = this.textarea.scrollTop;
    }

    getValue() { return this.textarea.value; }

    setValue(v) {
      this.textarea.value = v;
      this.refresh();
    }
  }

  window.CodeEditor = CodeEditor;
})();
