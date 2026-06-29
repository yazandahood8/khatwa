'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListChecks, ChevronDown, Check } from 'lucide-react';
import type { ProblemListItem } from '@/lib/problems-api';
import { cn } from '@/lib/utils';

const DIFF: Record<string, { label: string; cls: string }> = {
  easy: { label: 'سهل', cls: 'bg-success/15 text-success' },
  medium: { label: 'متوسط', cls: 'bg-warning/15 text-warning' },
  hard: { label: 'صعب', cls: 'bg-destructive/15 text-destructive' },
};

/**
 * قائمة أسئلة الدرس — يعرض كل أسئلة الموضوع نفسه ويتيح الانتقال لأيّ سؤال بحرّية
 * (دون اشتراط إنهاء السابق).
 */
export function QuestionNav({
  problems,
  currentId,
  icon,
  solvedIds,
  attemptedIds,
}: {
  problems: ProblemListItem[];
  currentId: string;
  icon?: React.ReactNode;
  solvedIds?: Set<string>;
  attemptedIds?: Set<string>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const index = problems.findIndex((p) => p.id === currentId);
  const solvedCount = solvedIds ? problems.filter((p) => solvedIds.has(p.id)).length : 0;

  if (problems.length === 0) {
    return (
      <span className="flex items-center gap-1.5 whitespace-nowrap font-display text-sm font-semibold">
        {icon} تمرين
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1 font-display text-sm font-semibold transition-colors hover:bg-muted"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon ?? <ListChecks className="h-4 w-4 text-primary" />}
        المسألة {index + 1} من {problems.length}
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div
            className="absolute right-0 z-40 mt-2 max-h-[70vh] w-[min(22rem,90vw)] overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-float scrollbar-thin"
            role="listbox"
          >
            <p className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <span>أسئلة الدرس</span>
              {solvedIds && (
                <span className="text-success">
                  {solvedCount}/{problems.length} ✓
                </span>
              )}
            </p>
            {problems.map((p, i) => {
              const isCurrent = p.id === currentId;
              const isSolved = solvedIds?.has(p.id) ?? false;
              const isAttempted = !isSolved && (attemptedIds?.has(p.id) ?? false);
              const d = DIFF[p.difficulty];
              return (
                <button
                  key={p.id}
                  type="button"
                  role="option"
                  aria-selected={isCurrent}
                  onClick={() => {
                    setOpen(false);
                    if (!isCurrent) router.push(`/problems/${p.id}/solve`);
                  }}
                  className={cn(
                    'flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-right transition-colors',
                    isCurrent ? 'bg-primary/10' : 'hover:bg-muted',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold',
                      isSolved
                        ? 'bg-success text-white'
                        : isCurrent
                          ? 'gradient-primary text-white'
                          : isAttempted
                            ? 'bg-warning/20 text-warning ring-1 ring-warning/40'
                            : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {isSolved ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="line-clamp-2 flex-1 text-sm leading-snug" dir="auto">
                    {p.question}
                  </span>
                  {d && (
                    <span className={cn('mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold', d.cls)}>
                      {d.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
