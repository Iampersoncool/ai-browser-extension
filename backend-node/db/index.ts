import env from '@/env.js';
import { PrismaClient } from '@prisma/client';

const isProduction = env.NODE_ENV === 'production';

export const prisma = new PrismaClient({
  log: isProduction
    ? ['info', 'warn', 'error']
    : ['query', 'info', 'warn', 'error'],
});
