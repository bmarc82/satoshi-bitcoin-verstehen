// Tiny static dev server with SPA fallback (mirrors nginx try_files).
// Serves /public/ vom Repo-Root aus — entspricht dem Document-Root in
// Produktion. Run: `node scripts/dev-server.js` vom Repo-Root.
// Nicht deployt — nur lokales Testing.
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// /public ist Document-Root, unabhängig vom CWD
const ROOT = path.resolve(__dirname, '..', 'public');
const PORT = 8765;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.xml':  'application/xml',
  '.txt':  'text/plain; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

http.createServer((req, res) => {
  const parsed = url.parse(req.url);
  let filePath = path.join(ROOT, decodeURIComponent(parsed.pathname));

  // Block path traversal
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // SPA fallback: any non-asset path falls through to index.html
        const isAsset = /\.[a-z0-9]{2,5}$/i.test(parsed.pathname);
        if (!isAsset) {
          fs.readFile(path.join(ROOT, 'index.html'), (e2, d2) => {
            if (e2) { res.writeHead(404); res.end('Not found'); return; }
            res.writeHead(200, { 'Content-Type': MIME['.html'] });
            res.end(d2);
          });
          return;
        }
        res.writeHead(404); res.end('Not found'); return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log('Dev server with SPA fallback on http://127.0.0.1:' + PORT);
});
