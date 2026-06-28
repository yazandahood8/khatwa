import { Router } from 'express';
import { UserRole } from '@khatwa/shared';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import * as c from '../controllers/content.controller';

const router = Router();
const admin = [requireAuth, requireRole(UserRole.ADMIN)] as const;

// ---- قراءات عامة — public reads (used by students in Sprint 4) ----
router.get('/subjects', c.listSubjects);
router.get('/grades', c.listGrades);
router.get('/levels', c.listLevels);
router.get('/topics', c.listTopics);
router.get('/lessons', c.listLessons);
router.get('/lessons/:id', c.getLesson);

// ---- إحصائيات الأدمن — admin stats ----
router.get('/admin/stats', ...admin, c.adminStats);

// ---- تعديلات الأدمن — admin mutations ----
router.post('/subjects', ...admin, c.createSubject);
router.put('/subjects/:id', ...admin, c.updateSubject);
router.delete('/subjects/:id', ...admin, c.deleteSubject);

router.post('/grades', ...admin, c.createGrade);
router.delete('/grades/:id', ...admin, c.deleteGrade);

router.post('/levels', ...admin, c.createLevel);
router.delete('/levels/:id', ...admin, c.deleteLevel);

router.post('/topics', ...admin, c.createTopic);
router.put('/topics/:id', ...admin, c.updateTopic);
router.delete('/topics/:id', ...admin, c.deleteTopic);

router.post('/lessons', ...admin, c.createLesson);
router.put('/lessons/:id', ...admin, c.updateLesson);
router.delete('/lessons/:id', ...admin, c.deleteLesson);
router.post('/lessons/:id/publish', ...admin, c.setLessonPublish);

export default router;
