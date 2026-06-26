const express = require('express');
const cors = require('cors');
const multer = require('multer');
const zlib = require('zlib');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.get('/login', (_, res) => {
  res.send('amaenai1_');
});

app.post('/zipper', (req, res, next) => {
  const ct = (req.headers['content-type'] || '').startsWith('multipart/')
    ? 'multipart'
    : 'raw';

  if (ct === 'multipart') {
    upload.single('file')(req, res, err => {
      if (err || !req.file) {
        return res.status(400).send('No file uploaded');
      }
      res.type('application/gzip').send(zlib.gzipSync(req.file.buffer));
    });
    return;
  }

  express.raw({ type: () => true, limit: '10mb' })(req, res, () => {
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).send('No file uploaded');
    }
    res.type('application/gzip').send(zlib.gzipSync(req.body));
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
