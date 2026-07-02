import 'express-async-errors'; // يحوّل أخطاء async إلى error handler — must be first
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

  // خلف بروكسي Railway/Vercel — trust first proxy (correct client IP for rate limiting)
  app.set('trust proxy', 1);

  // الأمان والوسائط الأساسية — Security & core middleware
  app.use(helmet());
  // أصول CORS المسموحة: الواجهة الرسمية (WEB_ORIGIN) + التطوير المحلي + نشرات Vercel المؤقتة للمشروع.
  const allowedOrigins = new Set(
    [...env.WEB_ORIGIN.split(','), 'http://localhost:3000'].map((o) => o.trim()).filter(Boolean),
  );
  const vercelPreview = /^https:\/\/khatwa-web[a-z0-9-]*\.vercel\.app$/;
  app.use(
    cors({
      origin(origin, cb) {
        // بلا أصل (نفس المصدر أو أدوات مثل curl)، أو ضمن القائمة، أو نشرة Vercel للمشروع
        if (!origin || allowedOrigins.has(origin) || vercelPreview.test(origin)) {
          return cb(null, true);
        }
        return cb(null, false); // لا نضيف ترويسة ACAO — المتصفح يحجب دون خطأ 500
      },
      credentials: true,
      exposedHeaders: ['X-AI-Remaining'], // ليقرأها المتصفح من ردّ الـ AI
    }),
  );
  app.use(express.json({ limit: '3mb' })); // يتّسع لصورة المسودة (base64)
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  // المسارات — Routes
  app.get('/', (_req, res) => {
    res.json({ name: 'Khatwa API', status: 'running', docs: '/health' });
  });
  app.use('/health', healthRoute); // GET /health → { status: "ok" }
  app.use('/api', apiRouter);

  // معالجة الأخطاء — Error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
