const express = require('express');
const cors = require('cors');
const busboy = require('busboy');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/login', (req, res) => {
  res.send('amaenai1_');
});

app.post('/zipper', (req, res) => {
  if (!req.headers['content-type']) {
    return res.status(400).send('No file uploaded');
  }
  const bb = busboy({ headers: req.headers });
  let buffer = Buffer.alloc(0);
  bb.on('file', (name, file) => {
    file.on('data', chunk => { buffer = Buffer.concat([buffer, chunk]); });
  });
  bb.on('field', (name, value) => {
    buffer = Buffer.from(value);
  });
  bb.on('close', () => {
    const result = zlib.gzipSync(buffer);
    res.setHeader('Content-Type', 'application/gzip');
    res.end(result);
  });
  req.pipe(bb);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
