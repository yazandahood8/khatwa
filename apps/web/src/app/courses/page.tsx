'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronLeft,
  Lock,
  CheckCircle2,
  CirclePlay,
  Calculator,
  Loader2,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

type ProgressMap = Record<string, ProgressRow>;
interface Ctx {
  plan: string;
  progress: ProgressMap;
}

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

/* ---------------- generic expandable row ---------------- */

function Row({
  depth,
  expandable,
  expanded,
  onClick,
  icon,
  label,
  meta,
  locked,
  accent,
}: {
  depth: number;
  expandable?: boolean;
  expanded?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  meta?: string;
  locked?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{ paddingInlineStart: depth * 18 + 10 }}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg py-2.5 pe-3 text-start transition-colors hover:bg-accent',
        accent && 'text-primary',
      )}
    >
      {expandable ? (
        expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
        )
      ) : (
        <span className="w-4 shrink-0" />
      )}
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 truncate font-medium">{label}</span>
      {locked && <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
      {meta && <span className="shrink-0 text-xs text-muted-foreground">{meta}</span>}
    </button>
  );
}

function Loading() {
  return (
    <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> جارٍ التحميل…
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="px-3 py-6 text-center text-sm text-muted-foreground">{text}</p>;
}

/** hook: lazy-load children once on first expand */
function useLazy<T>(loader: () => Promise<T[]>) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[] | null>(null);
  const [busy, setBusy] = useState(false);
  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && items === null) {
      setBusy(true);
      loader()
        .then(setItems)
        .catch(() => setItems([]))
        .finally(() => setBusy(false));
    }
  }
  return { open, items, busy, toggle };
}

/* ---------------- nodes ---------------- */

function SubjectNode({ subject, ctx }: { subject: Subject; ctx: Ctx }) {
  const { open, items, busy, toggle } = useLazy<Grade>(() => getGrades(subject.id));
  return (
    <div>
      <Row
        depth={0}
        expandable
        expanded={open}
        onClick={toggle}
        icon={<span className="text-lg">{subject.icon ?? '📘'}</span>}
        label={subject.nameAr}
        meta={subject._count ? `${subject._count.grades} صفوف` : undefined}
      />
      {open && (busy ? <Loading /> : items?.length === 0 ? <Empty text="لا صفوف." /> : items?.map((g) => <GradeNode key={g.id} grade={g} ctx={ctx} />))}
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

function TopicNode({ topic, ctx }: { topic: Topic; ctx: Ctx }) {
  const router = useRouter();
  const lessons = useLazy<Lesson>(() => getPublishedLessons(topic.id));
  const [problems, setProblems] = useState<ProblemListItem[] | null>(null);

  function toggle() {
    lessons.toggle();
    if (problems === null) getProblems(topic.id).then(setProblems).catch(() => setProblems([]));
  }

  return (
    <div>
      <Row
        depth={3}
        expandable
        expanded={lessons.open}
        onClick={toggle}
        icon={<span className="h-4 w-1 rounded-full bg-primary" />}
        label={topic.nameAr}
        meta={topic._count ? `${topic._count.lessons} دروس` : undefined}
      />
      {lessons.open && (
        <>
          {lessons.busy ? (
            <Loading />
          ) : (
            <>
              {lessons.items?.length === 0 && <Empty text="لا دروس منشورة بعد." />}
              {lessons.items?.map((le, idx) => {
                const locked = ctx.plan === 'free' && idx > 0;
                const done = !!ctx.progress[le.id]?.completedAt;
                const started = !done && !!ctx.progress[le.id];
                return (
                  <Row
                    key={le.id}
                    depth={4}
                    onClick={() => router.push(locked ? '/pricing' : `/lessons/${le.id}`)}
                    locked={locked}
                    icon={
                      done ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : started ? (
                        <CirclePlay className="h-4 w-4 text-primary" />
                      ) : (
                        <CirclePlay className="h-4 w-4 text-muted-foreground" />
                      )
                    }
                    label={le.title}
                    meta={locked ? 'مدفوع' : le.durationMinutes ? `${le.durationMinutes} د` : undefined}
                  />
                );
              })}
              {problems && problems.length > 0 && (
                <Row
                  depth={4}
                  accent
                  onClick={() => router.push(`/problems/${problems[0].id}/solve`)}
                  icon={<Calculator className="h-4 w-4" />}
                  label={`المسائل (${problems.length}) — ابدأ التمرين`}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
