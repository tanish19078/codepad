/**
 * Lightweight Java code editor.
 * Transparent <textarea> layered over a syntax-highlighted <pre>,
 * with a line-number gutter. No dependencies.
 */
(function () {
  'use strict';

  const KEYWORDS = [
    'abstract','assert','boolean','break','byte','case','catch','char','class','const',
    'continue','default','do','double','else','enum','extends','final','finally','float',
    'for','goto','if','implements','import','instanceof','int','interface','long','native',
    'new','package','private','protected','public','return','short','static','strictfp',
    'super','switch','synchronized','this','throw','throws','transient','try','void',
    'volatile','while','var','record','true','false','null',
  ];

  const TOKEN_RE = new RegExp(
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' +                 // 1 comments
    '|("(?:\\\\.|[^"\\\\\\n])*")' +                            // 2 strings
        "|('(?:\\\\.|[^'\\\\\\n])*')" +                        // 3 chars
    '|(@[A-Za-z_]\\w*)' +                                      // 4 annotations
    '|\\b(' + KEYWORDS.join('|') + ')\\b' +                    // 5 keywords
    '|\\b(0[xX][0-9a-fA-F_]+[lL]?|\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?[fFdDlL]?)\\b' + // 6 numbers
    '|\\b([A-Z][A-Za-z0-9_]*)\\b',                             // 7 types
    'g'
  );

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightJava(src) {
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

  class CodeEditor {
    /**
     * @param {HTMLElement} container
     * @param {{onChange?: Function, onRunShortcut?: Function}} handlers
     */
    constructor(container, handlers = {}) {
      this.container = container;
      this.handlers = handlers;

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

    onKeydown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (this.handlers.onRunShortcut) this.handlers.onRunShortcut();
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
        const opensBlock = /\{\s*$/.test(beforeCursor);
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
      this.codeEl.innerHTML = highlightJava(value) + '\n';
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
