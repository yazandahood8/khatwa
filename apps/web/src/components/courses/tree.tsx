'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
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

export function Row({
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
  return { open, items, busy, toggle };
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
        expandable
        expanded={lessons.open}
        onClick={lessons.toggle}
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
                const noVideo = !le.videoUrl; // الدرس بلا فيديو بعد
                const duration = formatDuration(le.durationSeconds, le.durationMinutes);
                return (
                  <Row
                    key={le.id}
                    depth={depth + 1}
                    onClick={() => router.push(locked ? '/pricing' : `/lessons/${le.id}`)}
                    locked={locked}
                    icon={
                      done ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : started ? (
                        <CirclePlay className="h-4 w-4 text-primary" />
                      ) : (
                        <CirclePlay className={cn('h-4 w-4', noVideo ? 'text-muted-foreground/50' : 'text-muted-foreground')} />
                      )
                    }
                    label={le.title}
                    meta={
                      locked
                        ? 'مدفوع'
                        : (duration ?? (noVideo ? 'قريباً' : undefined)) ?? undefined
                    }
                  />
                );
              })}
              {problems && problems.length > 0 && (
                <Row
                  depth={depth + 1}
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
