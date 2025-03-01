import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const env = createEnv({
  server: {
    PORT: z.number({ coerce: true }),
    DATABASE_URL: z.string().url(),
    OPENAI_API_KEY: z.string(),
    NODE_ENV: z.enum(['development', 'production']),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export default env;
