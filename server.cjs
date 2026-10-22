const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIST = path.join(__dirname, 'dist');
const reloadClients = new Set();
let reloadTimer;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function notifyReload(changedPath) {
  const event = `event: reload\ndata: ${JSON.stringify({ path: changedPath })}\n\n`;
  for (const client of reloadClients) client.write(event);
}

function sendHtml(res, statusCode, html) {
  const client = '<script src="/__livereload-client.js" defer></script>';
  const body = html.replace(/<\/body>/i, `${client}</body>`);
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
}

function watchForChanges(directory) {
  try {
    fs.watch(directory, (_event, filename) => {
      const changedPath = filename ? filename.toString() : directory;
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(() => notifyReload(changedPath), 120);
    });
  } catch (error) {
    console.warn(`Live reload could not watch ${directory}: ${error.message}`);
  }
}

const server = http.createServer((req, res) => {
  // Always disable browser caching completely so edits are immediately visible
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURIComponent(reqUrl.pathname);

  if (reqPath === '/__livereload-client.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
    res.end("const liveReload = new EventSource('/__livereload'); liveReload.addEventListener('reload', () => location.reload());");
    return;
  }

  if (reqPath === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    });
    res.write(': connected\n\n');
    reloadClients.add(res);
    const heartbeat = setInterval(() => res.write(': ping\n\n'), 25000);
    res.on('close', () => {
      clearInterval(heartbeat);
      reloadClients.delete(res);
    });
    return;
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(DIST, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFoundPath = path.join(DIST, '404.html');
      fs.readFile(notFoundPath, (err404, data404) => {
        if (!err404) {
          sendHtml(res, 404, data404.toString('utf8'));
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (ext === '.html') {
      fs.readFile(filePath, (readError, data) => {
        if (readError) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Unable to read page');
          return;
        }
        sendHtml(res, 200, data.toString('utf8'));
      });
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

watchForChanges(DIST);
watchForChanges(path.join(DIST, 'assets'));

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Node server live on http://localhost:${PORT}`);
});
