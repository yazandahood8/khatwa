import { Router } from 'express';
import { linkStudent, listStudents } from '../controllers/parent.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '@khatwa/shared';

const router = Router();

// كل المسارات تتطلب ولي أمر مسجّل الدخول — all routes require an authenticated parent
router.use(requireAuth, requireRole(UserRole.PARENT));

router.post('/link-student', linkStudent);
router.get('/students', listStudents);

export default router;
