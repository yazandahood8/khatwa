import { PrismaClient } from '@prisma/client';
import { isProduction } from '../utils/env';

/**
 * عميل Prisma وحيد (Singleton) — single shared Prisma client.
 * يمنع إنشاء اتصالات متعددة أثناء التطوير (hot reload).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProduction ? ['error'] : ['query', 'warn', 'error'],
  });

if (!isProduction) globalForPrisma.prisma = prisma;
