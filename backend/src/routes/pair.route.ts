import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { createPair, uploadPairPhoto, getPair } from '../controllers/pair.controller';

/** ربط الكمبيوتر بالجوال لتصوير الورقة — cross-device photo handoff. */
const router = Router();

router.post('/pair', requireAuth, createPair); // الكمبيوتر: إنشاء جلسة ربط
router.post('/pair/:pairId/photo', requireAuth, uploadPairPhoto); // الجوال: رفع الصورة
router.get('/pair/:pairId', requireAuth, getPair); // الكمبيوتر: استعلام (polling)

export default router;
