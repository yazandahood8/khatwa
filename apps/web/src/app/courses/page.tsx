'use client';

import { useEffect, useState } from 'react';
import { ListTree, LayoutGrid } from 'lucide-react';
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
import { MenuView } from '@/components/courses/menu-view';
import { cn } from '@/lib/utils';

type ViewMode = 'tree' | 'menu';

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plan, setPlan] = useState('free');
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('tree');

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
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold">الدروس</h1>
          <ViewToggle view={view} onChange={setView} />
        </div>
        {view === 'menu' ? (
          <MenuView ctx={ctx} />
        ) : (
          <div className="rounded-2xl border border-border bg-card p-2 shadow-card">
            {loading ? (
              <Loading />
            ) : subjects.length === 0 ? (
              <Empty text="لا توجد مواد متاحة بعد." />
            ) : (
              subjects.map((s) => <SubjectNode key={s.id} subject={s} ctx={ctx} />)
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ---------------- view toggle ---------------- */

function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  const options: { id: ViewMode; label: string; icon: typeof ListTree }[] = [
    { id: 'tree', label: 'شجرة', icon: ListTree },
    { id: 'menu', label: 'قائمة', icon: LayoutGrid },
  ];
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-card p-1">
      {options.map((o) => {
        const Icon = o.icon;
        const active = view === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {o.label}
          </button>
        );
      })}
    </div>
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
            <HighSchoolTracks subjectId={subject.id} ctx={ctx} />
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
