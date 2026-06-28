'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  type Subject,
  type Grade,
  type Level,
  type Topic,
  type Lesson,
  type ProgressRow,
  getSubjects,
  getGrades,
  getLevels,
  getTopics,
  getPublishedLessons,
  getMyProgress,
} from '@/lib/content-api';
import { DashboardHeader } from '@/components/dashboard-header';
import { Card, CardContent } from '@/components/ui/card';

export default function CoursesPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});

  const [subject, setSubject] = useState<Subject | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);

  const loadProgress = useCallback(() => {
    getMyProgress()
      .then((rows) => setProgress(Object.fromEntries(rows.map((r) => [r.lessonId, r]))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    getSubjects().then(setSubjects).catch(() => {});
    loadProgress();
  }, [loadProgress]);
  useEffect(() => void (subject && getGrades(subject.id).then(setGrades)), [subject]);
  useEffect(() => void (grade && getLevels(grade.id).then(setLevels)), [grade]);
  useEffect(() => void (level && getTopics(level.id).then(setTopics)), [level]);
  useEffect(() => void (topic && getPublishedLessons(topic.id).then(setLessons)), [topic]);

  const crumb = (label: string, onClick?: () => void) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={onClick ? 'text-primary hover:underline' : 'font-medium'}
    >
      {label}
    </button>
  );

  function statusBadge(lessonId: string) {
    const p = progress[lessonId];
    if (!p) return '';
    return p.completedAt ? '✅' : '🔄';
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">الدروس</h1>

        {/* breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {crumb(
            'المواد',
            subject
              ? () => {
                  setSubject(null);
                  setGrade(null);
                  setLevel(null);
                  setTopic(null);
                }
              : undefined,
          )}
          {subject && <span>›</span>}
          {subject &&
            crumb(
              `${subject.icon ?? ''} ${subject.nameAr}`,
              grade
                ? () => {
                    setGrade(null);
                    setLevel(null);
                    setTopic(null);
                  }
                : undefined,
            )}
          {grade && <span>›</span>}
          {grade &&
            crumb(
              `صف ${grade.gradeNumber}`,
              level
                ? () => {
                    setLevel(null);
                    setTopic(null);
                  }
                : undefined,
            )}
          {level && <span>›</span>}
          {level && crumb(level.name, topic ? () => setTopic(null) : undefined)}
          {topic && <span>›</span>}
          {topic && crumb(topic.nameAr)}
        </div>

        {/* Subjects */}
        {!subject && (
          <Grid
            items={subjects.map((s) => ({
              key: s.id,
              label: `${s.icon ?? '📘'} ${s.nameAr}`,
              onClick: () => setSubject(s),
            }))}
            empty="لا توجد مواد متاحة بعد."
          />
        )}

        {/* Grades */}
        {subject && !grade && (
          <Grid
            items={grades.map((g) => ({
              key: g.id,
              label: `صف ${g.gradeNumber}`,
              onClick: () => setGrade(g),
            }))}
            empty="لا توجد صفوف بعد."
          />
        )}

        {/* Levels */}
        {grade && !level && (
          <Grid
            items={levels.map((l) => ({
              key: l.id,
              label: l.name,
              onClick: () => setLevel(l),
            }))}
            empty="لا توجد مستويات بعد."
          />
        )}

        {/* Topics */}
        {level && !topic && (
          <List
            items={topics.map((t) => ({
              key: t.id,
              label: t.nameAr,
              meta: `${t._count?.lessons ?? 0} دروس`,
              onClick: () => setTopic(t),
            }))}
            empty="لا توجد مواضيع بعد."
          />
        )}

        {/* Lessons */}
        {topic && (
          <List
            items={lessons.map((le) => ({
              key: le.id,
              label: `${statusBadge(le.id)} ${le.title}`.trim(),
              meta: le.durationMinutes ? `${le.durationMinutes} دقيقة` : undefined,
              onClick: () => router.push(`/lessons/${le.id}`),
            }))}
            empty="لا توجد دروس منشورة في هذا الموضوع بعد."
          />
        )}
      </main>
    </div>
  );
}

function Grid({
  items,
  empty,
}: {
  items: { key: string; label: string; onClick: () => void }[];
  empty: string;
}) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <button key={it.key} onClick={it.onClick}>
          <Card className="transition-colors hover:bg-accent">
            <CardContent className="flex h-24 items-center justify-center p-4 text-center text-lg font-medium">
              {it.label}
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}

function List({
  items,
  empty,
}: {
  items: { key: string; label: string; meta?: string; onClick: () => void }[];
  empty: string;
}) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="grid gap-2">
      {items.map((it) => (
        <button key={it.key} onClick={it.onClick} className="text-start">
          <Card className="transition-colors hover:bg-accent">
            <CardContent className="flex items-center justify-between p-4">
              <span className="font-medium">{it.label}</span>
              {it.meta && <span className="text-xs text-muted-foreground">{it.meta}</span>}
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}
