import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { synthesizeTts, ttsStatus } from '../controllers/tts.controller';

/**
 * مسارات تحويل النص إلى كلام — Arabic text-to-speech (Azure Neural).
 * محميّة بالمصادقة لمنع استنزاف حصة Azure.
 */
const router = Router();

router.get('/tts/status', requireAuth, ttsStatus);
router.post('/tts', requireAuth, synthesizeTts);

export default router;
