'use client';

import { PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#2B7FE8', '#BEDD3F', '#FAB912', '#FF7AA8', '#7C83FF'];

/** احتفال — celebration modal with a lightweight confetti burst. */
export function Celebration({
  attempts,
  isLast,
  onNext,
  onClose,
}: {
  attempts: number;
  isLast: boolean;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      {/* قصاصات — confetti */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 h-2.5 w-2.5 rounded-[2px]"
            style={{
              left: `${Math.random() * 100}%`,
              background: COLORS[i % COLORS.length],
              animation: `confettiFall ${800 + Math.random() * 700}ms ${Math.random() * 300}ms ease-in forwards`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-sm animate-fade-slide-up rounded-[2rem] bg-card p-8 text-center shadow-float">
        <span className="mx-auto grid h-20 w-20 animate-success-pop place-items-center rounded-full gradient-primary text-white shadow-glow-primary">
          <PartyPopper className="h-10 w-10" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold">ممتاز! 🎉</h2>
        <p className="mt-1 text-muted-foreground">
          حللت المسألة {attempts <= 1 ? 'من أول محاولة! 🔥' : `بعد ${attempts} محاولات.`}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-lime py-3 font-display font-bold text-foreground">
          <span className="text-xl">⭐</span> +{attempts <= 1 ? 12 : 8} نقطة
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button variant="gradient" size="lg" onClick={onNext}>
            {isLast ? 'إنهاء التمارين' : 'المسألة التالية'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            مراجعة الحل
          </Button>
        </div>
      </div>
    </div>
  );
}
