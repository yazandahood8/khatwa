import { Router } from 'express';
import { UserRole } from '@khatwa/shared';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import * as c from '../controllers/content.controller';
import * as review from '../controllers/adminReview.controller';
import { adminAnalytics } from '../controllers/analytics.controller';
import { lessonChat } from '../controllers/ai.controller';

const router = Router();
const admin = [requireAuth, requireRole(UserRole.ADMIN)] as const;

// ---- قراءات عامة — public reads (used by students in Sprint 4) ----
router.get('/subjects', c.listSubjects);
router.get('/grades', c.listGrades);
router.get('/levels', c.listLevels);
router.get('/questionnaires', c.listQuestionnaires);
router.get('/topics', c.listTopics);
router.get('/lessons', c.listLessons);
router.get('/lessons/:id', c.getLesson);

// ---- بحث — search (any authed user) ----
router.get('/search', requireAuth, c.searchContent);

// ---- إحصائيات الأدمن — admin stats ----
router.get('/admin/stats', ...admin, c.adminStats);
router.get('/admin/analytics', ...admin, adminAnalytics);

// ---- مراجعة الطرق الجديدة (الطبقة الثانية) — new-method review ----
router.get('/admin/new-methods', ...admin, review.listNewMethods);
router.post('/admin/new-methods/:id/approve', ...admin, review.approveNewMethod);
router.post('/admin/new-methods/:id/reject', ...admin, review.rejectNewMethod);
router.get('/admin/notifications/count', ...admin, review.notificationCount);

// ---- تعديلات الأدمن — admin mutations ----
router.post('/subjects', ...admin, c.createSubject);
router.put('/subjects/:id', ...admin, c.updateSubject);
router.delete('/subjects/:id', ...admin, c.deleteSubject);

router.post('/grades', ...admin, c.createGrade);
router.delete('/grades/:id', ...admin, c.deleteGrade);

router.post('/levels', ...admin, c.createLevel);
router.delete('/levels/:id', ...admin, c.deleteLevel);

router.post('/questionnaires', ...admin, c.createQuestionnaire);
router.put('/questionnaires/:id', ...admin, c.updateQuestionnaire);
router.delete('/questionnaires/:id', ...admin, c.deleteQuestionnaire);

router.post('/topics', ...admin, c.createTopic);
router.put('/topics/:id', ...admin, c.updateTopic);
router.delete('/topics/:id', ...admin, c.deleteTopic);

router.post('/lessons', ...admin, c.createLesson);
router.put('/lessons/:id', ...admin, c.updateLesson);
router.delete('/lessons/:id', ...admin, c.deleteLesson);
router.post('/lessons/:id/publish', ...admin, c.setLessonPublish);

// رفع/مشاهدة الفيديو — video upload (admin) + playback (any authed user)
router.post('/lessons/:id/upload-url', ...admin, c.getLessonUploadUrl);
router.post('/lessons/:id/attach-video', ...admin, c.attachLessonVideo);
router.get('/lessons/:id/playback', requireAuth, c.getLessonPlayback);

// دردشة معلّم الدرس — lesson teacher chat (any authed user, quota-limited)
router.post('/lessons/:id/ai', requireAuth, lessonChat);

export default router;
