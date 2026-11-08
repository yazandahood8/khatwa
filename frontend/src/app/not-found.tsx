import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Blob, DotGrid, Sparkle } from '@/components/decor';

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-secondary/50 p-6 text-center">
      <Blob className="-start-24 -top-24 h-96 w-96 opacity-60" color="hsl(var(--tint-sky))" />
      <DotGrid className="bottom-10 end-10 h-24 w-32" />
      <Sparkle className="end-1/4 top-1/4 h-8 w-8 animate-float" />
      <div className="relative max-w-md space-y-5 rounded-3xl bg-card p-10 shadow-elevated">
        <p className="font-display text-8xl font-extrabold leading-none text-primary">404</p>
        <h1 className="font-display text-2xl font-extrabold">ضعنا في الطريق!</h1>
        <p className="text-muted-foreground">الصفحة التي تبحث عنها غير موجودة. لا بأس، لنرجع خطوة للخلف.</p>
        <Link href="/" className="inline-block">
          <Button size="lg">العودة للرئيسية</Button>
        </Link>
      </div>
    </main>
  );
}
