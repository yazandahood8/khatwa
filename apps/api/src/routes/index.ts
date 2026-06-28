import { Router } from 'express';
import authRoute from './auth.route';
import usersRoute from './users.route';
import parentRoute from './parent.route';
import contentRoute from './content.route';
import progressRoute from './progress.route';

/**
 * مُجمِّع مسارات /api — API router aggregator.
 * ملاحظة: /health يُركَّب على الجذر مباشرة في app.ts.
 */
const router = Router();

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/parent', parentRoute);
router.use('/', contentRoute);
router.use('/', progressRoute);

export default router;
