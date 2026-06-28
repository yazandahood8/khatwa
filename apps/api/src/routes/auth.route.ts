import { Router } from 'express';
import { register, login, me, logout } from '../controllers/auth.controller';
import { forgotPassword, resetPassword } from '../controllers/passwordReset.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// نقاط حساسة محمية بتحديد المعدل — rate-limited sensitive endpoints
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);

router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
