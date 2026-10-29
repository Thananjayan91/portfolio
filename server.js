/**
 * Local Development Server with Direct Disk Persistence
 * Runs locally on http://localhost:3000
 * 
 * Features:
 * - Zero external npm dependencies (uses native Node.js http, fs, path)
 * - Automatically writes newly indexed CV directly to /data/cv_index.json on your disk!
 * - Serves all static portfolio files & executes /api/chat and /api/index-cv
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Read .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [k, ...v] = line.trim().split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  // 1. API: /api/index-cv (Generates embeddings AND directly writes to data/cv_index.json!)
  if (req.url === '/api/index-cv' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const apiKey = payload.apiKey || process.env.OPENAI_API_KEY;

        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'OpenAI API Key is required' }));
        }

        const chunks = payload.chunks || [];
        if (!chunks.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Chunks array cannot be empty' }));
        }

        // Call OpenAI embeddings API
        const texts = chunks.map(c => `${c.title || ''}: ${c.text}`);
        const embedRes = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: texts
          })
        });

        if (!embedRes.ok) {
          const errData = await embedRes.json().catch(() => ({}));
          res.writeHead(embedRes.status, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: errData.error?.message || 'OpenAI API error' }));
        }

        const embedData = await embedRes.json();
        const indexedChunks = chunks.map((chunk, i) => ({
          ...chunk,
          embedding: embedData.data[i].embedding
        }));

        const resultIndex = {
          lastIndexed: new Date().toISOString(),
          documentTitle: payload.documentTitle || 'Thananjayan_CV.pdf',
          embeddingModel: 'text-embedding-3-small',
          totalChunks: indexedChunks.length,
          chunks: indexedChunks
        };

        // DIRECT DISK PERSISTENCE: Overwrite data/cv_index.json on your computer!
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        const filePath = path.join(dataDir, 'cv_index.json');
        fs.writeFileSync(filePath, JSON.stringify(resultIndex, null, 2), 'utf-8');

        console.log(`[RAG Local Server] Successfully saved ${indexedChunks.length} chunks with vectors to data/cv_index.json`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: true,
          savedToDisk: true,
          message: `Saved directly to ${filePath}! You can now git commit and push to Vercel.`,
          index: resultIndex
        }));

      } catch (err) {
        console.error('Server error on /api/index-cv:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 2. API: /api/chat
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { default: handler } = await import('./api/chat.js');
        // Fake req & res for serverless handler compatibility
        const fakeReq = { method: 'POST', body: payload, headers: req.headers };
        const fakeRes = {
          setHeader: (k, v) => res.setHeader(k, v),
          status: (code) => {
            res.statusCode = code;
            return fakeRes;
          },
          json: (data) => {
            res.writeHead(res.statusCode || 200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          },
          end: () => res.end()
        };
        await handler(fakeReq, fakeRes);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 3. Serve Static Files
  let cleanUrl = req.url.split('?')[0];
  if (cleanUrl === '/') cleanUrl = '/index.html';
  const localPath = path.join(__dirname, cleanUrl);

  fs.stat(localPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File Not Found');
    }

    const ext = path.extname(localPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(localPath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ Thananjayan.ai Local Server is running!`);
  console.log(`👉 Open: http://localhost:${PORT}`);
  console.log(`📂 Indexing updates will directly write to data/cv_index.json`);
  console.log(`======================================================\n`);
});

