import { Router } from 'express';
import { UserRole } from '@khatwa/shared';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import * as p from '../controllers/problems.controller';

const router = Router();
const admin = [requireAuth, requireRole(UserRole.ADMIN)] as const;

// قراءة — reads (any authed user; students solve in Sprint 6)
router.get('/problems', requireAuth, p.listProblems);
router.get('/problems/:id', requireAuth, p.getProblem);

// تعديلات الأدمن — admin mutations
router.post('/problems', ...admin, p.createProblem);
router.put('/problems/:id', ...admin, p.updateProblem);
router.delete('/problems/:id', ...admin, p.deleteProblem);

export default router;
