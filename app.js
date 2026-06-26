const express = require('express');
const cors = require('cors');
const multer = require('multer');
const zlib = require('zlib');

const app = express();
const storage = multer.memoryStorage();
const collector = multer({ storage });

app.use(cors());

app.get('/login', (_, response) => {
  response.type('text/plain').send('amaenai1_');
});

app.post('/zipper', (request, response, next) => {
  const header = request.headers['content-type'] || '';

  if (header.includes('multipart')) {
    return collector.any()(request, response, () => {
      const item = request.files?.[0] || request.body?.[Object.keys(request.body)[0]];
      if (!item) return response.status(400).send('No file uploaded');
      const source = item.buffer || Buffer.from(item);
      response.set('Content-Type', 'application/gzip');
      response.send(zlib.gzipSync(source));
    });
  }

  const rawStack = express.raw({ type: () => true, limit: '10mb' });
  rawStack(request, response, () => {
    const source = request.body;
    if (!Buffer.isBuffer(source) || source.length === 0) {
      return response.status(400).send('No file uploaded');
    }
    response.set('Content-Type', 'application/gzip');
    response.send(zlib.gzipSync(source));
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
