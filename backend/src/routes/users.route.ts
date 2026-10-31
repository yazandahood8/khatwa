import { Router } from 'express';
import { updateProfile, changePassword } from '../controllers/users.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.put('/profile', requireAuth, updateProfile);
router.put('/password', requireAuth, changePassword);

export default router;
