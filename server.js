import express from 'express';
import 'dotenv/config';

const app = express();

const jokes = [
  { id: 1, content: 'what a funny way to say your own name' },
  { id: 2, content: 'Not a good thing that is' },
  { id: 3, content: 'one day you will fall/ rise' },
  { id: 4, content: "dont' be lame" },
  { id: 5, content: 'be lame' },
];

app.get('/api/jokes', (req, res) => {
  res.json(jokes);
});

app.listen(process.env.PORT, () => {
  console.log('running server on', process.env.PORT);
});
