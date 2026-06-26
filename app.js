const express = require('express');
const multer = require('multer');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.get('/login', (req, res) => {
  res.send('amaenai1_');
});

app.post('/zipper', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  const originalName = req.file.originalname || 'file';
  const gzName = originalName.replace(/\.[^.]+$/, '') + '.gz';
  zlib.gzip(req.file.buffer, (err, compressed) => {
    if (err) return res.status(500).send(err.message);
    res.set('Content-Disposition', `attachment; filename="${gzName}"`);
    res.set('Content-Type', 'application/gzip');
    res.send(compressed);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
