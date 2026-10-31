import { describe, it, expect } from 'vitest';
import { UserRole } from '@khatwa/shared';
import { prisma } from '../../backend/src/services/prisma';
import { api, auth, seedUser, seedContentTree, flushCache } from './helpers';

/**
 * اكتشاف المحتوى — content discovery (public reads) + admin CRUD guards.
 * الكتالوج مُخزَّن مؤقتاً (60ث)؛ نزرع أولاً ثم نقرأ، والتفريغ بين الاختبارات يعزلها.
 */

describe('public content reads', () => {
  it('GET /api/subjects returns seeded subjects ordered by orderIndex', async () => {
    await prisma.subject.create({ data: { nameAr: 'فيزياء', orderIndex: 2 } });
    await prisma.subject.create({ data: { nameAr: 'رياضيات', orderIndex: 1 } });

    const res = await api().get('/api/subjects');
    expect(res.status).toBe(200);
    expect(res.body.data.map((s: { nameAr: string }) => s.nameAr)).toEqual(['رياضيات', 'فيزياء']);
  });

  it('GET /api/grades?subjectId= filters to that subject', async () => {
    const a = await seedContentTree();
    const b = await seedContentTree();

    const res = await api().get('/api/grades').query({ subjectId: a.subject.id });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(a.grade.id);
    expect(res.body.data.some((g: { id: string }) => g.id === b.grade.id)).toBe(false);
  });

  it('GET /api/levels?gradeId= and /api/topics?levelId= navigate the tree', async () => {
    const { grade, level, topic } = await seedContentTree();

    const levels = await api().get('/api/levels').query({ gradeId: grade.id });
    expect(levels.body.data.map((l: { id: string }) => l.id)).toContain(level.id);

    const topics = await api().get('/api/topics').query({ levelId: level.id });
    expect(topics.body.data.map((t: { id: string }) => t.id)).toContain(topic.id);
  });

  it('GET /api/lessons/:id returns the lesson; unknown id → 404', async () => {
    const { lesson } = await seedContentTree();

    const found = await api().get(`/api/lessons/${lesson.id}`);
    expect(found.status).toBe(200);
    expect(found.body.data).toMatchObject({ id: lesson.id, title: lesson.title });

    const missing = await api().get('/api/lessons/does-not-exist');
    expect(missing.status).toBe(404);
    expect(missing.body.error.code).toBe('NOT_FOUND');
  });
});

describe('lesson publish filter', () => {
  it('?published=true hides unpublished lessons; default shows all', async () => {
    const { topic } = await seedContentTree({ lesson: { title: 'منشور', isPublished: true } });
    await prisma.lesson.create({
      data: { title: 'مسودة', topicId: topic.id, isPublished: false },
    });

    const all = await api().get('/api/lessons').query({ topicId: topic.id });
    expect(all.body.data).toHaveLength(2);

    const published = await api().get('/api/lessons').query({ topicId: topic.id, published: 'true' });
    expect(published.body.data).toHaveLength(1);
    expect(published.body.data[0].title).toBe('منشور');
  });
});

describe('admin content CRUD', () => {
  it('an admin can create then delete a subject; the create is reflected in reads', async () => {
    const admin = await seedUser({ role: UserRole.ADMIN });

    const created = await api()
      .post('/api/subjects')
      .set(auth(admin.token))
      .send({ nameAr: 'كيمياء', orderIndex: 0 });
    expect(created.status).toBe(201);
    const id = created.body.data.id;

    await flushCache(); // الكتالوج مُخزَّن — امسحه لنرى الكتابة داخل نفس الاختبار.
    const afterCreate = await api().get('/api/subjects');
    expect(afterCreate.body.data.some((s: { id: string }) => s.id === id)).toBe(true);

    const del = await api().delete(`/api/subjects/${id}`).set(auth(admin.token));
    expect(del.status).toBe(200);

    await flushCache();
    const afterDelete = await api().get('/api/subjects');
    expect(afterDelete.body.data.some((s: { id: string }) => s.id === id)).toBe(false);
  });

  it('rejects an unauthenticated create with 401', async () => {
    const res = await api().post('/api/subjects').send({ nameAr: 'أحياء' });
    expect(res.status).toBe(401);
  });
});

describe('search (authed)', () => {
  it('requires authentication', async () => {
    const res = await api().get('/api/search').query({ q: 'معادلات' });
    expect(res.status).toBe(401);
  });

  it('finds published lessons and topics by query', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const { topic } = await seedContentTree({ lesson: { title: 'مقدمة في المعادلات', isPublished: true } });

    const res = await api().get('/api/search').query({ q: 'المعادلات' }).set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data.topics.some((t: { id: string }) => t.id === topic.id)).toBe(true);
  });

  it('returns empty for very short queries', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api().get('/api/search').query({ q: 'x' }).set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ lessons: [], topics: [] });
  });
});
