import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Single shared PrismaClient instance.
 * In dev we stash it on globalThis so hot-reload (tsx watch) doesn't
 * spawn a new connection pool on every reload.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isProd ? ['error'] : ['warn', 'error'],
  });

if (!env.isProd) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
