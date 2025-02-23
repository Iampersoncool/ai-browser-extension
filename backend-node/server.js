import e from 'express';
import cors from 'cors';
import { runMigrations } from './db/migrations.js';

import openAiRouter from './routes/openai/index.js';
import deepseekRouter from './routes/deepseek/index.js';

await runMigrations();
console.log('done running migrations.');

const PORT = process.env.PORT ?? 6969;

const app = e();
app.use(cors());
app.use(e.json());

app.get('/', (req, res) => {
  res.send('ok');
});

app.use('/openai', openAiRouter);
app.use('/deepseek', deepseekRouter);

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
