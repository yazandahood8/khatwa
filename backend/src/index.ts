import { createApp } from './app';
import { env } from './utils/env';
import { logger } from './utils/logger';

/**
 * نقطة دخول الخادم — Server entry point.
 */
const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Khatwa API يعمل على — running on http://localhost:${env.PORT}`);
  logger.info(`   Health: http://localhost:${env.PORT}/health`);
  logger.info(`   Env: ${env.NODE_ENV}`);
});

// إغلاق نظيف — Graceful shutdown
const shutdown = (signal: string) => {
  logger.info(`${signal} received — shutting down`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
