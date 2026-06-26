const express = require('express');
const cors = require('cors');
const multer = require('multer');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.get('/login', (req, res) => {
  res.send('amaenai1_');
});

app.post('/zipper', (req, res) => {
  const isMultipart = (req.headers['content-type'] || '').includes('multipart/form-data');
  if (isMultipart) {
    upload.single('file')(req, res, (err) => {
      if (err) return res.status(400).send(err.message);
      if (!req.file) return res.status(400).send('No file uploaded');
      zlib.gzip(req.file.buffer, (e, c) => {
        if (e) return res.status(500).send(e.message);
        res.set('Content-Type', 'application/gzip');
        res.send(c);
      });
    });
  } else {
    let chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      if (buffer.length === 0) return res.status(400).send('No file uploaded');
      zlib.gzip(buffer, (e, c) => {
        if (e) return res.status(500).send(e.message);
        res.set('Content-Type', 'application/gzip');
        res.send(c);
      });
    });
    req.on('error', e => res.status(500).send(e.message));
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
