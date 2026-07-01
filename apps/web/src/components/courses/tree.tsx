'use client';

import { useState } from 'react';
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

/** hook: lazy-load children once on first expand */
export function useLazy<T>(loader: () => Promise<T[]>) {
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

/* ---------------- topic node (lessons + problems) ---------------- */

export function TopicNode({ topic, ctx, depth = 3 }: { topic: Topic; ctx: Ctx; depth?: number }) {
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
        depth={depth}
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
                const noVideo = !le.videoUrl; // الدرس بلا فيديو بعد — مُعلَّم "قريباً"
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
                        : noVideo
                          ? 'قريباً'
                          : le.durationMinutes
                            ? `${le.durationMinutes} د`
                            : undefined
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
