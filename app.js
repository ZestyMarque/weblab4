const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/login', (req, res) => {
  res.send('amaenai1_');
});

app.get('/id/:n', (req, res) => {
  const { n } = req.params;
  const url = new URL(`https://nd.kodaktor.ru/users/${n}`);

  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'GET',
  };

  https.request(options, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        res.send(parsed.login);
      } catch {
        res.status(500).send('Error parsing response');
      }
    });
  }).on('error', (err) => {
    res.status(500).send(err.message);
  }).end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
