'use client';

import { useEffect, useState } from 'react';
import { ListTree, LayoutGrid, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
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
  ExpandBusProvider,
  useSubtreeBus,
  type Ctx,
  type ExpandBus,
  type ProgressMap,
} from '@/components/courses/tree';
import { Ring, DotGrid } from '@/components/decor';
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
  const [bus, setBus] = useState<ExpandBus>({ allExpanded: false, expandTick: 0, collapseTick: 0 });

  const expandAll = () =>
    setBus((b) => ({ allExpanded: true, expandTick: b.expandTick + 1, collapseTick: b.collapseTick }));
  const collapseAll = () =>
    setBus((b) => ({ allExpanded: false, expandTick: b.expandTick, collapseTick: b.collapseTick + 1 }));

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
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-3xl bg-tint-lavender p-5 sm:p-6">
          <Ring className="-end-8 -top-10 h-32 w-32" />
          <DotGrid className="bottom-3 end-24 hidden h-12 w-20 sm:block" />
          <h1 className="relative font-display text-3xl font-extrabold">الدروس</h1>
          <div className="relative flex flex-wrap items-center gap-2">
            {view === 'tree' && (
              <button
                onClick={bus.allExpanded ? collapseAll : expandAll}
                className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-card px-4 py-1.5 text-sm font-bold text-muted-foreground shadow-subtle transition-all hover:-translate-y-0.5 hover:text-primary"
              >
                {bus.allExpanded ? (
                  <ChevronsDownUp className="h-4 w-4" />
                ) : (
                  <ChevronsUpDown className="h-4 w-4" />
                )}
                {bus.allExpanded ? 'طيّ الكل' : 'توسيع الكل'}
              </button>
            )}
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
        {view === 'menu' ? (
          <MenuView ctx={ctx} />
        ) : (
          <div className="rounded-3xl border border-border/70 bg-card p-3 shadow-card">
            {loading ? (
              <Loading />
            ) : subjects.length === 0 ? (
              <Empty text="لا توجد مواد متاحة بعد." />
            ) : (
              <ExpandBusProvider value={bus}>
                {subjects.map((s) => (
                  <SubjectNode key={s.id} subject={s} ctx={ctx} />
                ))}
              </ExpandBusProvider>
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
    <div className="flex shrink-0 items-center gap-1 rounded-full bg-card p-1 shadow-subtle">
      {options.map((o) => {
        const Icon = o.icon;
        const active = view === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={cn(
              'flex min-h-9 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-glow-primary'
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
  const { open, items, busy, toggle, expand, collapse } = useLazy<Grade>(() => getGrades(subject.id));
  const sub = useSubtreeBus();
  const toggleSubtree = () => {
    if (sub.subtreeExpanded) {
      collapse();
      sub.collapseSubtree();
    } else {
      expand();
      sub.expandSubtree();
    }
  };
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
        onToggleSubtree={toggleSubtree}
        subtreeExpanded={sub.subtreeExpanded}
      />
      {open &&
        (busy ? (
          <Loading />
        ) : (
          <ExpandBusProvider value={sub.bus}>
            {middleGrades?.map((g) => <GradeNode key={g.id} grade={g} ctx={ctx} />)}
            <HighSchoolTracks subjectId={subject.id} ctx={ctx} />
          </ExpandBusProvider>
        ))}
    </div>
  );
}

function GradeNode({ grade, ctx }: { grade: Grade; ctx: Ctx }) {
  const { open, items, busy, toggle, expand, collapse } = useLazy<Level>(() => getLevels(grade.id));
  const sub = useSubtreeBus();
  const toggleSubtree = () => {
    if (sub.subtreeExpanded) {
      collapse();
      sub.collapseSubtree();
    } else {
      expand();
      sub.expandSubtree();
    }
  };
  return (
    <div>
      <Row
        depth={1}
        expandable
        expanded={open}
        onClick={toggle}
        icon="🎓"
        label={`صف ${grade.gradeNumber}`}
        onToggleSubtree={toggleSubtree}
        subtreeExpanded={sub.subtreeExpanded}
      />
      {open &&
        (busy ? (
          <Loading />
        ) : items?.length === 0 ? (
          <Empty text="لا مستويات." />
        ) : (
          <ExpandBusProvider value={sub.bus}>
            {items?.map((l) => <LevelNode key={l.id} level={l} ctx={ctx} />)}
          </ExpandBusProvider>
        ))}
    </div>
  );
}

function LevelNode({ level, ctx }: { level: Level; ctx: Ctx }) {
  const { open, items, busy, toggle, expand, collapse } = useLazy<Topic>(() => getTopics(level.id));
  const sub = useSubtreeBus();
  const toggleSubtree = () => {
    if (sub.subtreeExpanded) {
      collapse();
      sub.collapseSubtree();
    } else {
      expand();
      sub.expandSubtree();
    }
  };
  return (
    <div>
      <Row
        depth={2}
        expandable
        expanded={open}
        onClick={toggle}
        icon="📗"
        label={level.name}
        onToggleSubtree={toggleSubtree}
        subtreeExpanded={sub.subtreeExpanded}
      />
      {open &&
        (busy ? (
          <Loading />
        ) : items?.length === 0 ? (
          <Empty text="لا مواضيع." />
        ) : (
          <ExpandBusProvider value={sub.bus}>
            {items?.map((t) => <TopicNode key={t.id} topic={t} ctx={ctx} />)}
          </ExpandBusProvider>
        ))}
    </div>
  );
}
