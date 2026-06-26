const express = require('express');
const multer = require('multer');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.get('/login', (req, res) => {
  res.send('amaenai1_');
});

app.post('/zipper', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  zlib.gzip(req.file.buffer, (err, compressed) => {
    if (err) return res.status(500).send(err.message);
    res.set('Content-Type', 'application/gzip');
    res.send(compressed);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
