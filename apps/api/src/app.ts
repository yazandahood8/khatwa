import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isProduction } from './utils/env';
import apiRouter from './routes';
import healthRoute from './routes/health.route';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';

/**
 * تطبيق Express — builds the Express app (separated from server start for testing).
 */
export function createApp() {
  const app = express();

  // الأمان والوسائط الأساسية — Security & core middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  // المسارات — Routes
  app.use('/health', healthRoute); // GET /health → { status: "ok" }
  app.use('/api', apiRouter);

  // معالجة الأخطاء — Error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
