import express from 'express';
import fs from 'node:fs';
import { exec } from 'node:child_process';

const app = express();
app.use(express.json());

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  const userPath = `./data/${id}.json`;
  const raw = fs.readFileSync(userPath, 'utf8');
  res.json(JSON.parse(raw));
});

app.post('/admin/search', (req, res) => {
  const keyword = req.body.keyword;
  const command = `grep -R ${keyword} ./data`;
  exec(command, (error, stdout) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.type('text/plain').send(stdout);
  });
});

app.post('/set-config', (req, res) => {
  const cfg = req.body;
  fs.writeFileSync('./data/config.json', JSON.stringify(cfg));
  res.send('ok');
});

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.listen(3000, () => {
  console.log('demo app listening on :3000');
});
