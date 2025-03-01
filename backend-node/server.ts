import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import env from './env.js';
import openRouterRouter from '@/routes/openRouter/router.js';
import { prisma } from './db/index.js';
import { cors } from 'hono/cors';
import OpenRouterRevisionService from './services/revisions/OpenRouterRevisionService.js';
import OllamaRevisionService from './services/revisions/OllamaRevisionService.js';
import ModelNotFoundError from './errors/ModelNotFoundError.js';
import ollamaRouter from './routes/ollamaRouter/router.js';

export type AppRouter = typeof app;

prisma.$connect();

const app = new Hono()
  .onError((err, c) => {
    if (err instanceof ModelNotFoundError) {
      return c.json(
        {
          message: 'Model not found',
          timestamp: Date.now(),
        },
        400
      );
    }

    console.error(err);

    return c.json(
      {
        message: 'Internal server error',
        timestamp: Date.now(),
      },
      500
    );
  })
  .use(cors())
  .get('/models', c =>
    c.json({
      openRouter: OpenRouterRevisionService.getModels(),
      ollama: OllamaRevisionService.getModels(),
    })
  )
  .route('/openRouter', openRouterRouter)
  .route('/ollama', ollamaRouter);

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`app listening on port ${env.PORT}`);
