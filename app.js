const express = require('express');
const cors = require('cors');
const multer = require('multer');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

app.get('/login', (req, res) => {
  res.send('amaenai1_');
});

app.post('/zipper', upload.single('file'), (req, res) => {
  let buffer;
  if (req.file) {
    buffer = req.file.buffer;
  } else if (Buffer.isBuffer(req.body) && req.body.length > 0) {
    buffer = req.body;
  }
  if (!buffer) return res.status(400).send('No file uploaded');
  zlib.gzip(buffer, (err, compressed) => {
    if (err) return res.status(500).send(err.message);
    res.set('Content-Type', 'application/gzip');
    res.send(compressed);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
