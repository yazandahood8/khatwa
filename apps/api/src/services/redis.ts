import Redis from 'ioredis';
import { env } from '../utils/env';
import { logger } from '../utils/logger';

/**
 * عميل Redis — Redis client (Rate Limiting + Caching).
 * يُهيّأ فقط إذا وُجد REDIS_URL، وإلا يبقى null حتى يُضبط في Sprint 7.
 */
let redis: Redis | null = null;

if (env.REDIS_URL) {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  redis.on('error', (err) => logger.error('Redis error', err.message));
  redis.on('connect', () => logger.info('✅ Redis connected'));

  redis.connect().catch((err) => logger.warn('Redis connection failed', err.message));
} else {
  logger.warn('REDIS_URL غير مضبوط — Redis disabled (set it before Sprint 7)');
}

export { redis };
