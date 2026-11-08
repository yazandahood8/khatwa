'use client';

import { Button } from '@/components/ui/button';
import { Ring } from '@/components/decor';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-secondary/50 p-6 text-center">
      <Ring className="-end-16 -top-16 h-64 w-64" />
      <div className="relative max-w-md space-y-5 rounded-3xl bg-card p-10 shadow-elevated">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-tint-sun font-display text-3xl font-extrabold text-gold-text">
          !
        </span>
        <h1 className="font-display text-2xl font-extrabold">حدث خطأ غير متوقع</h1>
        <p className="text-muted-foreground">لا تقلق، الأمر ليس منك. جرّب مرة أخرى.</p>
        <Button size="lg" onClick={reset}>
          إعادة المحاولة
        </Button>
      </div>
    </main>
  );
}
