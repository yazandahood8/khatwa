import { Router } from 'express';
import authRoute from './auth.route';
import usersRoute from './users.route';
import parentRoute from './parent.route';
import contentRoute from './content.route';
import progressRoute from './progress.route';
import problemsRoute from './problems.route';
import pairRoute from './pair.route';
import subscriptionRoute from './subscription.route';
import ttsRoute from './tts.route';
import { maintenanceOn } from '../utils/maintenance';

/**
 * مُجمِّع مسارات /api — API router aggregator.
 * ملاحظة: /health يُركَّب على الجذر مباشرة في app.ts.
 */
const router = Router();

// حالة الصيانة — عام بلا مصادقة، تستعمله الواجهة لإخفاء المحتوى وإظهار الدخول فقط
router.get('/maintenance', (_req, res) => {
  res.json({ success: true, data: { maintenance: maintenanceOn() } });
});

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/parent', parentRoute);
router.use('/', contentRoute);
router.use('/', progressRoute);
router.use('/', problemsRoute);
router.use('/', pairRoute);
router.use('/', subscriptionRoute);
router.use('/', ttsRoute);

export default router;
