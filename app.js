const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/login', (req, res) => {
  res.send('amaenai1_');
});

app.get('/login/', (req, res) => {
  res.send('amaenai1_');
});

app.get('/promise/', (req, res) => {
  res.type('text/plain');
  res.send('function task(x){ return new Promise((res, rej) => { if (x < 18) { res("yes"); } else { rej("no"); } }); }');
});

app.get('/fetch/', (req, res) => {
  res.type('text/html; charset=UTF-8');
  res.send(`<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Fetch page</title>
</head>
<body>
<input id="inp">
<button id="bt">Fetch</button>
<script>
document.getElementById('bt').addEventListener('click', () => {
  const url = document.getElementById('inp').value;
  fetch(url)
    .then(response => response.text())
    .then(data => { document.getElementById('inp').value = data; })
    .catch(err => { document.getElementById('inp').value = err.message; });
});
</script>
</body>
</html>`);
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
