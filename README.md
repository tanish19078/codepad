# CodePad

A local Java practice platform for the **40-question OOPS set** — question on the left,
live Java editor on the right, with **Run** and **Submit** judging against official sample tests.

![stack](https://img.shields.io/badge/stack-node.js%20%2B%20vanilla%20js-blue) ![deps](https://img.shields.io/badge/dependencies-zero-brightgreen)

## Features

- **Question bank UI** — all 40 problems grouped into 4 sections (statics, OOP, strings, 2D arrays) with difficulty badges, search, and solved-checkmarks
- **Java editor** — syntax highlighting, line numbers, auto-indent, Tab/Shift+Tab, `Ctrl+Enter` to run
- **Predefined templates** — every question opens pre-filled with its official `Main.java` stub
- **Run** — compiles (`javac`) and executes your code with custom stdin
- **Submit** — judges against the sample tests with expected-vs-actual diff view; accepted submissions update progress
- **Progress tracking** — solved state + per-question saved code persist in `localStorage`
- **Solution reveal** — complete solution + time/space complexity behind a spoiler

## Requirements

| Tool | Purpose |
|------|---------|
| JDK 8+ | `javac` / `java` must be on PATH |
| Node.js 18+ | server runtime |

## Run it

```bash
npm start          # -> http://localhost:3000
```

## Architecture

```
codepad/
├── package.json
├── server/
│   ├── index.js                 # http server + static assets
│   ├── routes/api.js            # GET /api/questions · POST /api/run · POST /api/submit
│   └── services/java-runner.js  # sandboxed temp-dir compile+run with timeouts
├── public/
│   ├── index.html               # shell: sidebar | question pane | editor workspace
│   ├── css/style.css
│   ├── js/editor.js             # dependency-free java editor component
│   ├── js/app.js                # app state, rendering, run/submit flow
│   └── data/questions.json      # generated question bank
└── tools/
    ├── parse.js                 # docx -> questions.json converter (+ data overrides)
    └── docx_text.txt            # extracted docx text (gitignored)
```

### API

| Endpoint | Method | Body | Returns |
|----------|--------|------|---------|
| `/api/questions` | GET | – | id/title/difficulty/concept/section list |
| `/api/run` | POST | `{code, stdin}` | `{stage, stdout, stderr, compileOutput, timeMs}` |
| `/api/submit` | POST | `{questionId, code}` | `{verdict, results[]}` per-test pass/fail + diff |

Execution is isolated: each run gets a fresh temp directory, a 10s runtime limit
(20s compile), and output capped at 512 KB.

### Regenerating the question bank

```bash
npm run parse      # tools/docx_text.txt -> public/questions.json
```

The source docx contains two self-contradictions which are fixed by documented
overrides in `tools/parse.js` (Q6 class-loading order, Q11 double precision).

## Deployment notes

**Local mode** (`npm start`) always executes Java with your installed JDK —
no configuration needed.

**Static hosting (Vercel)** has no Java runtime, and the public Piston API now
requires authorization (not issued for personal projects since Feb 2026). On a
static deployment CodePad therefore uses [JDoodle's](https://www.jdoodle.com/compiler-api/)
free tier: sign up, click the gear icon in the toolbar, paste your
clientId/clientSecret — stored only in your browser's localStorage.

Progress, saved code per question, completion state, and the last-open question
all persist in localStorage regardless of hosting mode.

## Notes

- Judging compares normalized text (CRLF-insensitive, trailing whitespace ignored)
- Code autosaves per question as you type; Reset restores the template
