import { Router } from 'express';

/**
 * مُجمِّع مسارات /api — API router aggregator.
 * تُضاف المسارات الجديدة هنا (auth, users, lessons, ...) في السبرينتات القادمة.
 * ملاحظة: /health يُركَّب على الجذر مباشرة في app.ts.
 */
const router = Router();

// Sprint 2+ : router.use('/auth', authRoute);
// Sprint 3+ : router.use('/subjects', subjectsRoute);

export default router;
