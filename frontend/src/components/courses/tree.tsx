'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ArrowLeft,
  BookOpen,
  Clock,
  ChevronsUpDown,
  ChevronsDownUp,
  Lock,
  CheckCircle2,
  CirclePlay,
  Calculator,
  Loader2,
} from 'lucide-react';
import { type Topic, type Lesson, type ProgressRow, getPublishedLessons } from '@/lib/content-api';
import { getProblems, type ProblemListItem } from '@/lib/problems-api';
import { cn } from '@/lib/utils';

export type ProgressMap = Record<string, ProgressRow>;
export interface Ctx {
  plan: string;
  progress: ProgressMap;
}

/* ---------------- expand-all bus ---------------- */

export interface ExpandBus {
  /** النودات التي تُركّب أثناء "توسيع الكل" تبدأ مفتوحة. */
  allExpanded: boolean;
  /** يزداد عند كل طلب "توسيع الكل" لإعادة فتح ما طواه المستخدم يدويًا. */
  expandTick: number;
  /** يزداد عند كل طلب "طيّ الكل". */
  collapseTick: number;
}

const ExpandBusContext = createContext<ExpandBus>({
  allExpanded: false,
  expandTick: 0,
  collapseTick: 0,
});

export function ExpandBusProvider({
  value,
  children,
}: {
  value: ExpandBus;
  children: React.ReactNode;
}) {
  return <ExpandBusContext.Provider value={value}>{children}</ExpandBusContext.Provider>;
}

/* ---------------- generic expandable row ---------------- */

export type RowKind = 'subject' | 'grade' | 'book' | 'chapter' | 'lesson' | 'cta';
export type LessonState = 'done' | 'started' | 'locked' | 'soon';

/** حاوية الأبناء: خط ربط خفيف + ظهور سلس (يحترم reduced-motion عبر globals.css). */
export function Branch({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="group"
      className="ms-6 space-y-1 border-s-2 border-primary/15 py-1 ps-2 duration-200 animate-in fade-in slide-in-from-top-1 sm:ps-3"
    >
      {children}
    </div>
  );
}

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card';

export function Row({
  depth,
  kind,
  expandable,
  expanded,
  onClick,
  icon,
  label,
  meta,
  state,
  onToggleSubtree,
  subtreeExpanded,
}: {
  depth: number;
  /** نوع الصف؛ إن غاب يُستنتج من العمق/القابلية للتوسيع. */
  kind?: RowKind;
  expandable?: boolean;
  expanded?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  meta?: string;
  /** حالة الدرس (للصفوف من نوع lesson). */
  state?: LessonState;
  /** يظهر زر توسيع/طيّ الفرع كامل عند هذه النودة. */
  onToggleSubtree?: () => void;
  subtreeExpanded?: boolean;
}) {
  const k: RowKind =
    kind ??
    (!expandable ? 'lesson' : depth === 0 ? 'subject' : depth === 1 ? 'grade' : depth === 2 ? 'book' : 'chapter');

  const subtreeBtn = onToggleSubtree && (
    <button
      type="button"
      onClick={onToggleSubtree}
      aria-label={subtreeExpanded ? 'طيّ الفرع' : 'توسيع الفرع'}
      title={subtreeExpanded ? 'طيّ الفرع' : 'توسيع الفرع'}
      className={cn(
        'me-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground/70 transition-colors duration-150 hover:bg-card hover:text-primary',
        FOCUS,
      )}
    >
      {subtreeExpanded ? <ChevronsDownUp className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}
    </button>
  );

  /* ---- exercises CTA ---- */
  if (k === 'cta') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative mt-2 flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-l from-primary/15 via-primary-light to-primary-light p-3 text-start transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0 sm:gap-4 sm:p-4',
          FOCUS,
        )}
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-card text-primary shadow-subtle sm:h-14 sm:w-14">
          <Calculator className="h-6 w-6 sm:h-7 sm:w-7" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-extrabold leading-snug sm:text-lg">{label}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">اختبر فهمك بعد إنهاء الدروس</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-bold text-primary-foreground shadow-glow-primary transition-transform duration-150 group-active:translate-y-0.5 sm:px-4">
          ابدأ التمرين
          <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
        </span>
      </button>
    );
  }

  /* ---- lesson ---- */
  if (k === 'lesson') {
    const locked = state === 'locked';
    const done = state === 'done';
    const LeadIcon = done ? CheckCircle2 : CirclePlay;
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-start transition-colors duration-150 hover:bg-primary-light active:bg-primary/10',
          FOCUS,
        )}
      >
        <span
          className={cn(
            'grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-150 group-hover:scale-105',
            done && 'bg-success/10 text-success',
            state === 'started' && 'bg-primary/10 text-primary',
            locked && 'bg-gold-light text-gold-text',
            (!state || state === 'soon') &&
              'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
          )}
        >
          <LeadIcon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug sm:text-base">{label}</span>
        {done && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
            <CheckCircle2 className="h-3 w-3" /> مكتمل
          </span>
        )}
        {state === 'started' && (
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            قيد المتابعة
          </span>
        )}
        {locked && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold-light px-2.5 py-1 text-xs font-bold text-gold-text">
            <Lock className="h-3 w-3" /> {meta}
          </span>
        )}
        {!locked && meta && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {meta}
          </span>
        )}
      </button>
    );
  }

  /* ---- expandable: subject / grade / book / chapter ---- */
  const size = {
    subject: { row: 'py-2.5 ps-2.5', tile: 'h-11 w-11 rounded-2xl text-xl', text: 'font-display text-lg font-extrabold' },
    grade: { row: 'py-2 ps-2.5', tile: 'h-9 w-9 rounded-xl text-base', text: 'font-display text-base font-bold' },
    book: { row: 'py-2 ps-2.5', tile: 'h-9 w-9 rounded-xl text-base', text: 'text-base font-bold' },
    chapter: { row: 'py-2.5 ps-2.5', tile: 'h-9 w-9 rounded-xl', text: 'text-base font-bold' },
  }[k];

  return (
    <div
      className={cn(
        'flex items-center rounded-2xl transition-colors duration-150',
        expanded
          ? k === 'chapter'
            ? 'border border-primary/40 bg-primary-light/60 shadow-subtle'
            : 'bg-tint-lavender/60'
          : 'hover:bg-primary-light',
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={!!expanded}
        className={cn('flex min-w-0 flex-1 items-center gap-3 rounded-2xl pe-1 text-start', size.row, FOCUS)}
      >
        <span
          className={cn(
            'grid shrink-0 place-items-center',
            size.tile,
            k === 'chapter' ? 'bg-primary text-primary-foreground' : 'bg-card shadow-subtle',
          )}
        >
          {icon}
        </span>
        <span className={cn('min-w-0 flex-1 leading-snug', size.text)}>{label}</span>
        {meta && (
          <span className="shrink-0 rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground shadow-subtle">
            {meta}
          </span>
        )}
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            !expanded && 'rotate-90',
          )}
          aria-hidden
        />
      </button>
      {subtreeBtn}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> جارٍ التحميل…
    </div>
  );
}
export function Empty({ text }: { text: string }) {
  return <p className="px-3 py-6 text-center text-sm text-muted-foreground">{text}</p>;
}

/** مدة الدرس للعرض: mm:ss من الثواني، وإلا "X د" من الدقائق، وإلا null. */
function formatDuration(seconds?: number | null, minutes?: number | null): string | null {
  if (seconds != null) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  if (minutes != null) return `${minutes} د`;
  return null;
}

/** hook: lazy-load children once on first expand; obeys the expand-all/collapse-all bus */
export function useLazy<T>(loader: () => Promise<T[]>) {
  const bus = useContext(ExpandBusContext);
  // نودة رُكّبت بينما "توسيع الكل" مفعّل تبدأ مفتوحة (لتتوسّع الشجرة تدريجيًا مع كل مستوى).
  const [open, setOpen] = useState(bus.allExpanded);
  const [items, setItems] = useState<T[] | null>(null);
  const [busy, setBusy] = useState(false);

  // loader يُعاد إنشاؤه كل رندر؛ نحفظه في ref كي لا تعتمد التأثيرات على هويّته.
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const loadedRef = useRef(false);
  const seenExpand = useRef(bus.expandTick);
  const seenCollapse = useRef(bus.collapseTick);

  function loadOnce() {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setBusy(true);
    loaderRef
      .current()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setBusy(false));
  }

  // تُحمّل الأبناء إذا رُكّبت النودة مفتوحة أصلًا (بسبب allExpanded).
  useEffect(() => {
    if (open) loadOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // توسيع الكل: افتح وحمّل.
  useEffect(() => {
    if (bus.expandTick > seenExpand.current) {
      seenExpand.current = bus.expandTick;
      setOpen(true);
      loadOnce();
    }
  }, [bus.expandTick]);

  // طيّ الكل: أغلق (نُبقي الأبناء محمّلين للفتح السريع لاحقًا).
  useEffect(() => {
    if (bus.collapseTick > seenCollapse.current) {
      seenCollapse.current = bus.collapseTick;
      setOpen(false);
    }
  }, [bus.collapseTick]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) loadOnce();
  }
  function expand() {
    setOpen(true);
    loadOnce();
  }
  function collapse() {
    setOpen(false);
  }
  return { open, items, busy, toggle, expand, collapse };
}

/**
 * حافلة توسيع مقصورة على فرع واحد: ترث تكّات الأب (كي يبقى "توسيع الكل" العام نافذاً)
 * وتضيف تكّاتها الخاصة، فيتتالى أمر التوسيع/الطيّ إلى أحفاد هذه النودة فقط.
 * كل نودة فرعية تلفّ أبناءها بـ <ExpandBusProvider value={bus}> لتمرير الحافلة.
 */
export function useSubtreeBus() {
  const parent = useContext(ExpandBusContext);
  const [local, setLocal] = useState({ e: 0, c: 0 });
  const [expanded, setExpanded] = useState(false);

  const bus: ExpandBus = {
    allExpanded: expanded || parent.allExpanded,
    expandTick: parent.expandTick + local.e,
    collapseTick: parent.collapseTick + local.c,
  };
  const expandSubtree = () => {
    setExpanded(true);
    setLocal((s) => ({ ...s, e: s.e + 1 }));
  };
  const collapseSubtree = () => {
    setExpanded(false);
    setLocal((s) => ({ ...s, c: s.c + 1 }));
  };
  return {
    bus,
    subtreeExpanded: expanded || parent.allExpanded,
    expandSubtree,
    collapseSubtree,
  };
}

/* ---------------- topic node (lessons + problems) ---------------- */

export function TopicNode({ topic, ctx, depth = 3 }: { topic: Topic; ctx: Ctx; depth?: number }) {
  const router = useRouter();
  const lessons = useLazy<Lesson>(() => getPublishedLessons(topic.id));
  const [problems, setProblems] = useState<ProblemListItem[] | null>(null);

  // حمّل المسائل أوّل مرة يُفتح فيها الموضوع — سواء يدويًا أو عبر "توسيع الكل".
  useEffect(() => {
    if (lessons.open && problems === null) {
      getProblems(topic.id).then(setProblems).catch(() => setProblems([]));
    }
  }, [lessons.open, problems, topic.id]);

  return (
    <div>
      <Row
        depth={depth}
        kind="chapter"
        expandable
        expanded={lessons.open}
        onClick={lessons.toggle}
        icon={<BookOpen className="h-4 w-4" />}
        label={topic.nameAr}
        meta={topic._count ? `${topic._count.lessons} دروس` : undefined}
      />
      {lessons.open && (
        <Branch>
          {lessons.busy ? (
            <Loading />
          ) : (
            <>
              {lessons.items?.length === 0 && <Empty text="لا دروس منشورة بعد." />}
              {lessons.items?.map((le, idx) => {
                const locked = ctx.plan === 'free' && idx > 0;
                const done = !!ctx.progress[le.id]?.completedAt;
                const started = !done && !!ctx.progress[le.id];
                const noVideo = !le.videoUrl; // الدرس بلا فيديو بعد
                const duration = formatDuration(le.durationSeconds, le.durationMinutes);
                return (
                  <Row
                    key={le.id}
                    kind="lesson"
                    depth={depth + 1}
                    onClick={() => router.push(locked ? '/pricing' : `/lessons/${le.id}`)}
                    state={locked ? 'locked' : done ? 'done' : started ? 'started' : noVideo ? 'soon' : undefined}
                    label={le.title}
                    meta={locked ? 'مدفوع' : (duration ?? (noVideo ? 'قريباً' : undefined)) ?? undefined}
                  />
                );
              })}
              {problems && problems.length > 0 && (
                <Row
                  kind="cta"
                  depth={depth + 1}
                  onClick={() => router.push(`/problems/${problems[0].id}/solve`)}
                  label={`المسائل (${problems.length})`}
                />
              )}
            </>
          )}
        </Branch>
      )}
    </div>
  );
}
