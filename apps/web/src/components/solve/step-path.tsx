'use client';

import { Check, X, Trash2 } from 'lucide-react';
import { Math } from '@/components/math/math';

/** خطوة كتبها الطالب مع نتيجتها: صحيحة / خاطئة / قيد التحقّق (null). */
export type SolveStep = { text: string; ok: boolean | null };

/**
 * مؤشّر الخطوات — the signature "خطوة" step path.
 * الخطوة الصحيحة ✓ خضراء، الخاطئة ✗ حمراء (يقدر يعدّلها/يحذفها)، وقيد التحقّق رقم باهت.
 */
export function StepPath({
  steps,
  onRemove,
  active,
}: {
  steps: SolveStep[];
  onRemove: (index: number) => void;
  active?: React.ReactNode;
}) {
  return (
    <ol className="relative space-y-2">
      {steps.map((s, i) => {
        const isLatest = i === steps.length - 1;
        const tone: Tone = s.ok === false ? 'wrong' : s.ok === true ? 'ok' : 'pending';
        const box =
          tone === 'wrong'
            ? 'border-destructive/30 bg-destructive/5'
            : tone === 'ok'
              ? 'border-lime-dark/20 bg-lime-light'
              : 'border-border bg-muted/40';
        return (
          <li key={i} className="animate-step-reveal">
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 ${box}`}>
              <StepMark tone={tone} burst={tone === 'ok' && isLatest} index={i + 1} />
              <div className="flex-1 text-base" dir="ltr">
                <Math expr={s.text} />
              </div>
              <button
                onClick={() => onRemove(i)}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label={tone === 'wrong' ? 'حذف الخطوة الخاطئة' : 'حذف الخطوة'}
                title="حذف / تعديل"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        );
      })}

      {/* الخطوة الحالية — current awakening step */}
      {active && (
        <li className="animate-step-reveal">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-light/50 px-4 py-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-[1.5px] border-primary bg-card font-display text-sm font-bold text-primary">
              {steps.length + 1}
            </span>
            <div className="flex-1">{active}</div>
          </div>
        </li>
      )}
    </ol>
  );
}

type Tone = 'ok' | 'wrong' | 'pending';

function StepMark({ tone, burst, index }: { tone: Tone; burst: boolean; index: number }) {
  if (tone === 'pending') {
    return (
      <span className="grid h-7 w-7 shrink-0 animate-pulse place-items-center rounded-full border border-border bg-card text-xs font-bold text-muted-foreground">
        {index}
      </span>
    );
  }
  if (tone === 'wrong') {
    return (
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-destructive text-white">
        <X className="h-4 w-4" strokeWidth={3} />
        <span className="sr-only">الخطوة {index} خاطئة</span>
      </span>
    );
  }
  return (
    <span className="relative grid h-7 w-7 shrink-0 place-items-center">
      <span
        className="grid h-7 w-7 place-items-center rounded-full bg-success text-white"
        style={burst ? { animation: 'checkGlow 500ms cubic-bezier(0.16,1,0.3,1) both' } : undefined}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
        <span className="sr-only">الخطوة {index} صحيحة</span>
      </span>
      {burst &&
        PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary"
            style={{
              // @ts-expect-error custom props consumed by the keyframe
              '--px': `${p.x}px`,
              '--py': `${p.y}px`,
              animation: 'particleBurst 600ms cubic-bezier(0.16,1,0.3,1) forwards',
            }}
          />
        ))}
    </span>
  );
}

const PARTICLES = [
  { x: -14, y: -10 },
  { x: 14, y: -10 },
  { x: -12, y: 12 },
  { x: 12, y: 12 },
];
