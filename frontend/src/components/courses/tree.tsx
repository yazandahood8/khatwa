'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ArrowLeft,
  Clock,
  ChevronsUpDown,
  ChevronsDownUp,
  Lock,
  CheckCircle2,
  MonitorPlay,
  Play,
  Triangle,
  Calculator,
  Loader2,
} from 'lucide-react';
import { type Topic, type Lesson, type ProgressRow, getPublishedLessons } from '@/lib/content-api';
import { getProblems, type ProblemListItem } from '@/lib/problems-api';
import { cn } from '@/lib/utils';
import { BookIcon, CalcArt, Sparkle } from '@/components/courses/art';

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

/** حاوية الأبناء: خط ربط على اليسار (كما في التصميم) + ظهور سلس (يحترم reduced-motion). */
export function Branch({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="group"
      className="relative ml-3 mr-1 mt-2 space-y-2 rounded-bl-2xl border-l-2 border-primary/25 pl-3 before:absolute before:-left-[6px] before:top-5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-primary/40 duration-200 animate-in fade-in slide-in-from-top-1 sm:ml-5 sm:pl-5"
    >
      {children}
    </div>
  );
}

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card';

/** حلقة نسبة + شريط تقدّم + "X من N دروس" لبانر المادة. */
function SubjectProgress({ total, completed }: { total: number; completed: number }) {
  const pct = Math.round((completed / total) * 100);
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div
      className="me-3 flex shrink-0 items-center gap-3"
      role="img"
      aria-label={`مكتمل ${completed} من ${total} دروس (${pct}%)`}
    >
      <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="32" cy="32" r={R} fill="none" strokeWidth="6" className="stroke-card" />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct / 100)}
            className="stroke-primary transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-xs font-extrabold sm:text-sm">{pct}%</span>
      </div>
      <div className="hidden w-32 sm:block">
        <p className="text-sm font-bold">مكتمل</p>
        <div className="my-1.5 h-2 overflow-hidden rounded-full bg-card">
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">
          {completed} من {total} دروس
        </p>
      </div>
    </div>
  );
}

export function Row({
  depth,
  kind,
  expandable,
  expanded,
  onClick,
  icon,
  label,
  subtitle,
  meta,
  state,
  current,
  progress,
  tag,
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
  /** سطر ثانوي تحت العنوان (عدد الأبناء مثلًا). */
  subtitle?: string;
  meta?: string;
  /** حالة الدرس (للصفوف من نوع lesson). */
  state?: LessonState;
  /** الدرس المميّز (أول درس في الفصل): شريط تمييز + زر تشغيل أكبر. */
  current?: boolean;
  /** تقدّم المادة (للصف subject): دروس مكتملة من إجمالي المنشورة. */
  progress?: { total: number; completed: number };
  /** شارة صغيرة على رأس الفصل (مثل "الفصل الأول"). */
  tag?: string;
  /** يظهر زر توسيع/طيّ الفرع كامل عند هذه النودة. */
  onToggleSubtree?: () => void;
  subtreeExpanded?: boolean;
}) {
  const k: RowKind =
    kind ??
    (!expandable ? 'lesson' : depth === 0 ? 'subject' : depth === 1 ? 'grade' : depth === 2 ? 'book' : 'chapter');

  /* ---- exercises CTA: [button] [text] [illustration] ---- */
  if (k === 'cta') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-l from-primary-light via-primary/10 to-primary-light p-3 text-start transition-all duration-200 hover:shadow-card active:scale-[0.995] sm:gap-4 sm:px-5 sm:py-3',
          FOCUS,
        )}
      >
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow-primary transition-transform duration-150 group-active:translate-y-0.5">
          ابدأ التمرين
          <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
        </span>
        <span className="min-w-0 flex-1 text-center">
          <span className="block font-display text-base font-extrabold leading-snug sm:text-lg">{label}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">اختبر فهمك بعد إنهاء الدروس</span>
        </span>
        <CalcArt className="hidden h-16 w-32 shrink-0 sm:block" />
      </button>
    );
  }

  /* ---- lesson: [type tile] [title] [state circle | duration] [pill] ---- */
  if (k === 'lesson') {
    const locked = state === 'locked';
    const done = state === 'done';
    const started = state === 'started';
    const accent = !locked && (started || current);
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl border-b border-border/70 bg-card px-3 py-2.5 text-start transition-colors duration-150 hover:bg-primary-light active:bg-primary/10',
          accent && 'border-s-4 border-s-primary',
          FOCUS,
        )}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary transition-transform duration-150 group-hover:scale-105">
          <MonitorPlay className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1 text-sm font-bold leading-snug sm:text-base">{label}</span>
        <span
          className={cn(
            'hidden shrink-0 place-items-center rounded-full sm:grid',
            locked
              ? 'h-10 w-10 bg-primary-light text-muted-foreground'
              : accent
                ? 'h-11 w-11 bg-primary/15 text-primary ring-4 ring-primary/10'
                : 'h-10 w-10 bg-primary/10 text-primary',
          )}
        >
          {locked ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        </span>
        {meta && !locked && (
          <>
            <span className="hidden h-8 w-px shrink-0 bg-border sm:block" aria-hidden />
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              <Clock className="h-3.5 w-3.5" /> {meta}
            </span>
          </>
        )}
        {done && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
            مكتمل <CheckCircle2 className="h-3.5 w-3.5" />
          </span>
        )}
        {started && (
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
            قيد المتابعة
          </span>
        )}
        {locked && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-600">
            {meta} <Lock className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
    );
  }

  /* ---- expandable: subject / grade / book / chapter ---- */
  const isSubject = k === 'subject';
  const sub = subtitle ?? meta;

  const chevron = (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-card text-primary shadow-subtle transition-transform duration-200',
        isSubject ? 'h-10 w-10' : 'h-8 w-8',
        expanded && 'rotate-180',
      )}
      aria-hidden
    >
      <ChevronDown className="h-4 w-4" />
    </span>
  );
  const toggleSubtree = onToggleSubtree && (
    <button
      type="button"
      onClick={onToggleSubtree}
      aria-label={subtreeExpanded ? 'طيّ الفرع' : 'توسيع الفرع'}
      title={subtreeExpanded ? 'طيّ الفرع' : 'توسيع الفرع'}
      className={cn(
        'mx-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground/70 transition-colors duration-150 hover:bg-card hover:text-primary',
        FOCUS,
      )}
    >
      {subtreeExpanded ? <ChevronsDownUp className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}
    </button>
  );

  const shell = cn(
    'flex items-center rounded-2xl transition-colors duration-150',
    isSubject
      ? 'bg-gradient-to-l from-tint-lavender via-primary-light to-tint-lavender'
      : k === 'chapter'
        ? 'bg-gradient-to-l from-card to-tint-lavender/70'
        : 'bg-tint-lavender/60 hover:bg-tint-lavender',
  );

  // المادة: [chevron][icon][title] من اليمين (RTL عادي). الصف/الكتاب/الفصل: [icon][title] يسار و chevron أقصى اليمين.
  if (isSubject) {
    return (
      <div className={shell}>
        {toggleSubtree}
        <button
          type="button"
          onClick={onClick}
          aria-expanded={!!expanded}
          className={cn('flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-3 text-start', FOCUS)}
        >
          {chevron}
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary-light to-tint-lavender text-3xl shadow-card">
            {icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-xl font-extrabold leading-snug sm:text-2xl">{label}</span>
            {sub && <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">{sub}</span>}
          </span>
        </button>
        {progress && progress.total > 0 && <SubjectProgress {...progress} />}
      </div>
    );
  }

  return (
    <div className={shell}>
      <button
        type="button"
        onClick={onClick}
        aria-expanded={!!expanded}
        className={cn('flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3 py-2.5', FOCUS)}
      >
        <span
          className={cn(
            'grid shrink-0 place-items-center',
            k === 'chapter'
              ? 'h-12 w-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-white shadow-card'
              : 'h-11 w-11',
          )}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1 text-start">
          <span className="block font-display text-base font-bold leading-snug sm:text-lg">{label}</span>
          {sub && <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">{sub}</span>}
        </span>
      </button>
      {toggleSubtree}
      {tag && (
        <span className="hidden shrink-0 rounded-full bg-gradient-to-l from-violet-500 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-subtle sm:inline-flex">
          {tag}
        </span>
      )}
      <button type="button" onClick={onClick} tabIndex={-1} aria-hidden className="me-3 rounded-full">
        {chevron}
      </button>
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
  if (minutes != null) return `${minutes} دقيقة`;
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

const ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];

export function TopicNode({
  topic,
  ctx,
  depth = 3,
  index,
}: {
  topic: Topic;
  ctx: Ctx;
  depth?: number;
  /** ترتيب الفصل داخل الكتاب (يبدأ من 0) — يُعرض كشارة "الفصل الأول". */
  index?: number;
}) {
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
    <div
      className={cn(
        'relative rounded-2xl transition-colors duration-200',
        lessons.open ? 'border-2 border-violet-500/60 bg-card' : 'border border-border/70',
      )}
    >
      {lessons.open && <Sparkle className="pointer-events-none absolute -left-7 top-4 hidden h-9 w-7 sm:block" />}
      <Row
        depth={depth}
        kind="chapter"
        expandable
        expanded={lessons.open}
        onClick={lessons.toggle}
        icon={<BookIcon className="h-7 w-7 brightness-200 saturate-0" />}
        label={topic.nameAr}
        tag={index === undefined ? undefined : `الفصل ${ORDINALS[index] ?? index + 1}`}
        subtitle={topic._count ? `${topic._count.lessons} دروس` : undefined}
      />
      {lessons.open && (
        <div className="space-y-1 p-2 duration-200 animate-in fade-in slide-in-from-top-1 sm:p-3">
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
                    current={idx === 0}
                    label={le.title}
                    meta={locked ? 'مدفوع' : (duration ?? (noVideo ? 'قريباً' : undefined)) ?? undefined}
                  />
                );
              })}
              {problems && problems.length > 0 && (
                <div className="pt-2">
                  <Row
                    kind="cta"
                    depth={depth + 1}
                    onClick={() => router.push(`/problems/${problems[0].id}/solve`)}
                    label={`المسائل (${problems.length}) – ابدأ التمرين`}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
