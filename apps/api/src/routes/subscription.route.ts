import { Router } from 'express';
import { UserRole } from '@khatwa/shared';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import * as s from '../controllers/subscription.controller';

const router = Router();
const admin = [requireAuth, requireRole(UserRole.ADMIN)] as const;

// الطالب — student
router.get('/subscriptions/current', requireAuth, s.getCurrent);
router.post('/subscriptions/upgrade', requireAuth, s.upgrade);
router.post('/subscriptions/cancel', requireAuth, s.cancel);

// الأدمن — admin
router.get('/admin/subscriptions', ...admin, s.adminList);
router.put('/admin/subscriptions/:studentId', ...admin, s.adminSetPlan);

export default router;
