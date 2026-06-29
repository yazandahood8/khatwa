'use client';

import { Check, X } from 'lucide-react';
import { Math } from '@/components/math/math';

/**
 * مؤشّر الخطوات — the signature "خطوة" step path.
 * Each solved step becomes a glowing check with a particle burst,
 * connected by a drawn line — you feel yourself walking the path.
 */
export function StepPath({
  steps,
  onRemove,
  active,
}: {
  steps: string[];
  onRemove: (index: number) => void;
  active?: React.ReactNode;
}) {
  return (
    <ol className="relative space-y-2">
      {steps.map((s, i) => {
        const isLatest = i === steps.length - 1;
        return (
          <li key={i} className="animate-step-reveal">
            <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 px-3 py-2.5">
              <StepCheck burst={isLatest} index={i + 1} />
              <div className="flex-1 text-base" dir="ltr">
                <Math expr={s} />
              </div>
              <button
                onClick={() => onRemove(i)}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label="حذف الخطوة"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </li>
        );
      })}

      {/* الخطوة الحالية — current awakening step */}
      {active && (
        <li className="animate-step-reveal">
          <div className="flex items-center gap-3 rounded-xl border-[1.5px] border-primary/40 bg-primary-light/40 px-3 py-2.5">
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

function StepCheck({ burst, index }: { burst: boolean; index: number }) {
  return (
    <span className="relative grid h-7 w-7 shrink-0 place-items-center">
      <span
        className="grid h-7 w-7 place-items-center rounded-full bg-success text-white"
        style={burst ? { animation: 'checkGlow 500ms cubic-bezier(0.16,1,0.3,1) both' } : undefined}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
        <span className="sr-only">الخطوة {index} مكتملة</span>
      </span>
      {/* انفجار الجسيمات — particle burst on the newest step */}
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
