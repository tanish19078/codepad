const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleApi } = require('./routes/api');
const { detectToolchains } = require('./services/local-runner');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }

  if (req.url.startsWith('/api/')) {
    handleApi(req, res).catch(err => {
      console.error('[api] unhandled error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ error: String(err.message || err) }));
    });
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  const tc = detectToolchains();
  console.log(`\n  ⚡ ForgeJudge Local Execution Engine -> http://localhost:${PORT}`);
  console.log(`  ├─ Java:       ${tc.java.available ? tc.java.version : 'Not found'}`);
  console.log(`  ├─ C++ (g++):  ${tc.cpp.available ? tc.cpp.version : 'Not found'}`);
  console.log(`  ├─ Python:     ${tc.python.available ? tc.python.version : 'Not found'}`);
  console.log(`  └─ JavaScript: ${tc.javascript.available ? tc.javascript.version : 'Not found'}\n`);
});
