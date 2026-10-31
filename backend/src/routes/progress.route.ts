import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  saveProgress,
  myProgress,
  studentDashboard,
  fullProgress,
} from '../controllers/progress.controller';

const router = Router();

router.post('/lessons/:id/progress', requireAuth, saveProgress);
router.get('/me/progress', requireAuth, myProgress);
router.get('/me/dashboard', requireAuth, studentDashboard);
router.get('/progress/me', requireAuth, fullProgress);

export default router;
