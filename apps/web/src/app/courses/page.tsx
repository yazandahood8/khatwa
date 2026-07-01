'use client';

import { useEffect, useState } from 'react';
import {
  type Subject,
  type Grade,
  type Level,
  type Topic,
  type ProgressRow,
  getSubjects,
  getGrades,
  getLevels,
  getTopics,
  getMyProgress,
} from '@/lib/content-api';
import { getCurrentSubscription } from '@/lib/subscription-api';
import { AppShell } from '@/components/app-shell';
import { studentNav } from '@/components/nav-items';
import {
  Row,
  Loading,
  Empty,
  useLazy,
  TopicNode,
  type Ctx,
  type ProgressMap,
} from '@/components/courses/tree';
import { HighSchoolTracks } from '@/components/courses/high-school-tracks';

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plan, setPlan] = useState('free');
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubjects()
      .then(setSubjects)
      .catch(() => {})
      .finally(() => setLoading(false));
    getCurrentSubscription().then((s) => setPlan(s.plan)).catch(() => {});
    getMyProgress()
      .then((rows) => setProgress(Object.fromEntries(rows.map((r) => [r.lessonId, r]))))
      .catch(() => {});
  }, []);

  const ctx: Ctx = { plan, progress };

  return (
    <AppShell nav={studentNav} title="الدروس">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-2xl font-bold">الدروس</h1>
        <div className="rounded-2xl border border-border bg-card p-2 shadow-card">
          {loading ? (
            <Loading />
          ) : subjects.length === 0 ? (
            <Empty text="لا توجد مواد متاحة بعد." />
          ) : (
            subjects.map((s) => <SubjectNode key={s.id} subject={s} ctx={ctx} />)
          )}
        </div>
      </div>
    </AppShell>
  );
}

/* ---------------- nodes ---------------- */

function SubjectNode({ subject, ctx }: { subject: Subject; ctx: Ctx }) {
  const { open, items, busy, toggle } = useLazy<Grade>(() => getGrades(subject.id));
  // 7-9 فقط في الشجرة؛ المرحلة الثانوية (10-12) تُعرض حسب مسارات الوحدات.
  const middleGrades = items?.filter((g) => g.gradeNumber <= 9);
  return (
    <div>
      <Row
        depth={0}
        expandable
        expanded={open}
        onClick={toggle}
        icon={<span className="text-lg">{subject.icon ?? '📘'}</span>}
        label={subject.nameAr}
      />
      {open &&
        (busy ? (
          <Loading />
        ) : (
          <>
            {middleGrades?.map((g) => <GradeNode key={g.id} grade={g} ctx={ctx} />)}
            <HighSchoolTracks subjectId={subject.id} />
          </>
        ))}
    </div>
  );
}

function GradeNode({ grade, ctx }: { grade: Grade; ctx: Ctx }) {
  const { open, items, busy, toggle } = useLazy<Level>(() => getLevels(grade.id));
  return (
    <div>
      <Row depth={1} expandable expanded={open} onClick={toggle} icon="🎓" label={`صف ${grade.gradeNumber}`} />
      {open && (busy ? <Loading /> : items?.length === 0 ? <Empty text="لا مستويات." /> : items?.map((l) => <LevelNode key={l.id} level={l} ctx={ctx} />))}
    </div>
  );
}

function LevelNode({ level, ctx }: { level: Level; ctx: Ctx }) {
  const { open, items, busy, toggle } = useLazy<Topic>(() => getTopics(level.id));
  return (
    <div>
      <Row depth={2} expandable expanded={open} onClick={toggle} icon="📗" label={level.name} />
      {open && (busy ? <Loading /> : items?.length === 0 ? <Empty text="لا مواضيع." /> : items?.map((t) => <TopicNode key={t.id} topic={t} ctx={ctx} />))}
    </div>
  );
}
