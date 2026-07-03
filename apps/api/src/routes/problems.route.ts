import { Router } from 'express';
import { UserRole } from '@khatwa/shared';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import * as p from '../controllers/problems.controller';
import { checkAnswer, runCode, getAttempt, getTopicProgress } from '../controllers/attempts.controller';
import { askTutor, aiQuota, judgeCode } from '../controllers/ai.controller';

const router = Router();
const admin = [requireAuth, requireRole(UserRole.ADMIN)] as const;

// المساعد الذكي — AI tutor (streaming) + daily quota
router.post('/problems/:id/ai', requireAuth, askTutor);
router.post('/problems/:id/judge', requireAuth, judgeCode); // مصحّح كود علوم الحاسوب
router.get('/ai/quota', requireAuth, aiQuota);

// قراءة — reads (any authed user)
router.get('/problems', requireAuth, p.listProblems);
router.get('/problems/by-code/:code', requireAuth, p.getProblemByCode); // مسح الباركود: كود → id
router.get('/problems/:id', requireAuth, p.getProblem);

// حل المسائل — solving (students)
router.post('/problems/:id/check', requireAuth, checkAnswer);
router.post('/problems/:id/run', requireAuth, runCode); // تشغيل C# ومقارنة الناتج
router.get('/problems/:id/attempt', requireAuth, getAttempt);
router.get('/topics/:topicId/progress', requireAuth, getTopicProgress);

// تعديلات الأدمن — admin mutations
router.post('/problems', ...admin, p.createProblem);
router.put('/problems/:id', ...admin, p.updateProblem);
router.delete('/problems/:id', ...admin, p.deleteProblem);

export default router;
