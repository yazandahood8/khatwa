'use client';

import { useEffect, useState } from 'react';
import { Network, List, ChevronDown, BookOpen } from 'lucide-react';
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
  getSubjectProgress,
  type SubjectProgress,
} from '@/lib/content-api';
import { getCurrentSubscription } from '@/lib/subscription-api';
import { AppShell } from '@/components/app-shell';
import { studentNav } from '@/components/nav-items';
import {
  Row,
  Branch,
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
import { HighSchoolTracks } from '@/components/courses/high-school-tracks';
import { MenuView } from '@/components/courses/menu-view';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { lessonScope } from '@/lib/lesson-scope';
import { CapIcon, BookIcon, RulerArt, HeaderArt } from '@/components/courses/art';

type ViewMode = 'tree' | 'menu';

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plan, setPlan] = useState('free');
  const [progress, setProgress] = useState<ProgressMap>({});
  const [subjectStats, setSubjectStats] = useState<Record<string, SubjectProgress>>({});
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
    getSubjectProgress()
      .then((rows) => setSubjectStats(Object.fromEntries(rows.map((r) => [r.subjectId, r]))))
      .catch(() => {});
    getMyProgress()
      .then((rows) => setProgress(Object.fromEntries(rows.map((r) => [r.lessonId, r]))))
      .catch(() => {});
  }, []);

  const ctx: Ctx = { plan, progress };

  return (
    <AppShell nav={studentNav} title="الدروس">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="relative flex flex-wrap items-center gap-x-4 gap-y-3 overflow-hidden rounded-3xl bg-gradient-to-l from-tint-lavender via-primary-light to-tint-lavender p-4 sm:min-h-[150px] sm:p-6">
          <div className="relative flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-card text-violet-600 shadow-card">
              <BookOpen className="h-7 w-7" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">الدروس</h1>
              <p className="text-xs text-muted-foreground sm:text-sm">رحلتك التعليمية نحو مستقبل أفضل</p>
            </div>
          </div>
          <div className="relative flex flex-wrap items-center gap-2 sm:ms-4">
            {view === 'tree' && (
              <button
                onClick={bus.allExpanded ? collapseAll : expandAll}
                aria-pressed={bus.allExpanded}
                className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold shadow-subtle transition-all duration-150 hover:-translate-y-0.5 hover:text-primary hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {bus.allExpanded ? 'طيّ الكل' : 'توسيع الكل'}
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', bus.allExpanded && 'rotate-180')} />
              </button>
            )}
            <ViewToggle view={view} onChange={setView} />
          </div>
          <HeaderArt className="pointer-events-none absolute inset-y-0 end-0 hidden h-full w-auto xl:block" />
        </div>
        {view === 'menu' ? (
          <MenuView ctx={ctx} />
        ) : (
          <div className="space-y-2 rounded-3xl border border-border/70 bg-card p-2 shadow-card sm:p-3">
            {loading ? (
              <Loading />
            ) : subjects.length === 0 ? (
              <Empty text="لا توجد مواد متاحة بعد." />
            ) : (
              <ExpandBusProvider value={bus}>
                {subjects.map((s) => (
                  <SubjectNode key={s.id} subject={s} ctx={ctx} stats={subjectStats[s.id]} />
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
  const options: { id: ViewMode; label: string; icon: typeof Network }[] = [
    { id: 'menu', label: 'قائمة', icon: List },
    { id: 'tree', label: 'شجرة', icon: Network },
  ];
  return (
    <>
      {options.map((o) => {
        const Icon = o.icon;
        const active = view === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={cn(
              'flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              active
                ? 'bg-primary text-primary-foreground shadow-glow-primary'
                : 'bg-card shadow-subtle hover:-translate-y-0.5 hover:text-primary hover:shadow-card',
            )}
          >
            <Icon className="h-4 w-4" />
            {o.label}
          </button>
        );
      })}
    </>
  );
}

/* ---------------- nodes ---------------- */

function SubjectNode({ subject, ctx, stats }: { subject: Subject; ctx: Ctx; stats?: SubjectProgress }) {
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
  const { user } = useAuth();
  const scope = lessonScope(user);
  const middleGrades = items?.filter((g) => g.gradeNumber <= 9 && scope.gradeVisible(g.gradeNumber));
  return (
    <div>
      <Row
        depth={0}
        kind="subject"
        progress={stats}
        expandable
        expanded={open}
        onClick={toggle}
        icon={subject.icon === '📐' ? <RulerArt className="h-12 w-12 drop-shadow" /> : <span className="text-3xl leading-none">{subject.icon ?? '📘'}</span>}
        label={subject.nameAr}
        subtitle={middleGrades ? `${middleGrades.length} صفوف` : undefined}
        onToggleSubtree={toggleSubtree}
        subtreeExpanded={sub.subtreeExpanded}
      />
      {open &&
        (busy ? (
          <Loading />
        ) : (
          <Branch>
            <ExpandBusProvider value={sub.bus}>
              {middleGrades?.map((g) => <GradeNode key={g.id} grade={g} ctx={ctx} />)}
              {scope.tracksVisible && (
                <HighSchoolTracks subjectId={subject.id} ctx={ctx} trackFilter={scope.trackVisible} />
              )}
            </ExpandBusProvider>
          </Branch>
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
        kind="grade"
        expandable
        expanded={open}
        onClick={toggle}
        icon={<CapIcon className="h-10 w-10 drop-shadow" />}
        label={`صف ${grade.gradeNumber}`}
        subtitle={items ? `${items.length} كتاب` : undefined}
        onToggleSubtree={toggleSubtree}
        subtreeExpanded={sub.subtreeExpanded}
      />
      {open &&
        (busy ? (
          <Loading />
        ) : items?.length === 0 ? (
          <Empty text="لا مستويات." />
        ) : (
          <Branch>
            <ExpandBusProvider value={sub.bus}>
              {items?.map((l) => <LevelNode key={l.id} level={l} ctx={ctx} />)}
            </ExpandBusProvider>
          </Branch>
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
        kind="book"
        expandable
        expanded={open}
        onClick={toggle}
        icon={<BookIcon className="h-10 w-10 drop-shadow" />}
        label={level.name}
        subtitle={items ? `${items.length} فصول` : undefined}
        onToggleSubtree={toggleSubtree}
        subtreeExpanded={sub.subtreeExpanded}
      />
      {open &&
        (busy ? (
          <Loading />
        ) : items?.length === 0 ? (
          <Empty text="لا مواضيع." />
        ) : (
          <Branch>
            <ExpandBusProvider value={sub.bus}>
              {items?.map((t, i) => <TopicNode key={t.id} topic={t} ctx={ctx} index={i} />)}
            </ExpandBusProvider>
          </Branch>
        ))}
    </div>
  );
}
