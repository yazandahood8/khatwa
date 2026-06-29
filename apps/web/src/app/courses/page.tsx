'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock, CheckCircle2, CirclePlay, Clock, Calculator, Rocket } from 'lucide-react';
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
import { getProblems, type ProblemListItem } from '@/lib/problems-api';
import { getCurrentSubscription } from '@/lib/subscription-api';
import { AppShell } from '@/components/app-shell';
import { studentNav } from '@/components/nav-items';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CoursesPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topicProblems, setTopicProblems] = useState<ProblemListItem[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [plan, setPlan] = useState<string>('free');

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
    getCurrentSubscription().then((s) => setPlan(s.plan)).catch(() => {});
    loadProgress();
  }, [loadProgress]);
  useEffect(() => void (subject && getGrades(subject.id).then(setGrades)), [subject]);
  useEffect(() => void (grade && getLevels(grade.id).then(setLevels)), [grade]);
  useEffect(() => void (level && getTopics(level.id).then(setTopics)), [level]);
  useEffect(() => {
    if (!topic) return;
    getPublishedLessons(topic.id).then(setLessons).catch(() => {});
    getProblems(topic.id).then(setTopicProblems).catch(() => setTopicProblems([]));
  }, [topic]);

  const crumb = (label: string, onClick?: () => void) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={onClick ? 'text-primary transition-colors hover:underline' : 'font-semibold text-foreground'}
    >
      {label}
    </button>
  );

  return (
    <AppShell nav={studentNav} title="الدروس">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="font-display text-2xl font-bold">الدروس</h1>

        {/* مسار التنقّل — breadcrumb */}
        <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
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
          {subject && <ChevronLeft className="h-4 w-4" />}
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
          {grade && <ChevronLeft className="h-4 w-4" />}
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
          {level && <ChevronLeft className="h-4 w-4" />}
          {level && crumb(level.name, topic ? () => setTopic(null) : undefined)}
          {topic && <ChevronLeft className="h-4 w-4" />}
          {topic && crumb(topic.nameAr)}
        </div>

        {/* Subjects */}
        {!subject && (
          <TileGrid
            items={subjects.map((s) => ({
              key: s.id,
              icon: s.icon ?? '📘',
              label: s.nameAr,
              meta: s._count ? `${s._count.grades} صفوف` : undefined,
              onClick: () => setSubject(s),
            }))}
            empty="لا توجد مواد متاحة بعد."
          />
        )}

        {/* Grades */}
        {subject && !grade && (
          <TileGrid
            items={grades.map((g) => ({ key: g.id, icon: '🎓', label: `صف ${g.gradeNumber}`, onClick: () => setGrade(g) }))}
            empty="لا توجد صفوف بعد."
          />
        )}

        {/* Levels */}
        {grade && !level && (
          <TileGrid
            items={levels.map((l) => ({ key: l.id, icon: '📗', label: l.name, onClick: () => setLevel(l) }))}
            empty="لا توجد مستويات بعد."
          />
        )}

        {/* Topics */}
        {level && !topic && (
          <div className="grid gap-3">
            {topics.length === 0 && <Empty text="لا توجد مواضيع بعد." />}
            {topics.map((t) => (
              <Card key={t.id} interactive onClick={() => setTopic(t)}>
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-1 rounded-full bg-primary" />
                    <span className="font-display font-semibold">{t.nameAr}</span>
                  </div>
                  <Badge variant="secondary" size="sm">{t._count?.lessons ?? 0} دروس</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Solve problems entry */}
        {topic && topicProblems.length > 0 && (
          <Card className="border-primary/30 bg-primary-light/50">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
                  <Calculator className="h-5 w-5" />
                </span>
                <span className="font-display font-semibold">{topicProblems.length} مسألة للتمرّن</span>
              </div>
              <Button variant="gradient" onClick={() => router.push(`/problems/${topicProblems[0].id}/solve`)}>
                <Rocket /> ابدأ التمارين
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lessons */}
        {topic && (
          <div className="grid gap-2.5">
            {lessons.length === 0 && <Empty text="لا توجد دروس منشورة في هذا الموضوع بعد." />}
            {lessons.map((le, idx) => {
              const locked = plan === 'free' && idx > 0;
              const p = progress[le.id];
              const done = !!p?.completedAt;
              return (
                <Card
                  key={le.id}
                  interactive
                  onClick={() => router.push(locked ? '/pricing' : `/lessons/${le.id}`)}
                  className={locked ? 'opacity-70' : ''}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        locked
                          ? 'bg-muted text-muted-foreground'
                          : done
                            ? 'bg-success/10 text-success'
                            : 'bg-primary-light text-primary'
                      }`}
                    >
                      {locked ? <Lock className="h-5 w-5" /> : done ? <CheckCircle2 className="h-5 w-5" /> : <CirclePlay className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{le.title}</p>
                      {le.durationMinutes && !locked && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {le.durationMinutes} دقيقة
                        </p>
                      )}
                    </div>
                    {locked ? (
                      <Badge variant="achievement" size="sm">مدفوع</Badge>
                    ) : done ? (
                      <Badge variant="success" size="sm">مكتمل</Badge>
                    ) : p ? (
                      <Badge variant="default" size="sm">قيد المتابعة</Badge>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function TileGrid({
  items,
  empty,
}: {
  items: { key: string; icon: string; label: string; meta?: string; onClick: () => void }[];
  empty: string;
}) {
  if (items.length === 0) return <Empty text={empty} />;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <Card key={it.key} interactive onClick={it.onClick} className="group">
          <CardContent className="flex h-32 flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="text-3xl transition-transform group-hover:scale-110">{it.icon}</span>
            <span className="font-display font-semibold">{it.label}</span>
            {it.meta && <span className="text-xs text-muted-foreground">{it.meta}</span>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
