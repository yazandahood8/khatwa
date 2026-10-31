import Link from 'next/link';
import { Check } from 'lucide-react';

/** غلاف صفحات الدخول — split branded auth layout. */
export function AuthLayout({
  title,
  subtitle,
  children,
  bare = false,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  bare?: boolean; // أثناء الصيانة: أخفِ اللوحة الترويجية واعرض النموذج فقط
}) {
  return (
    <main className={bare ? 'flex min-h-screen items-center justify-center' : 'grid min-h-screen lg:grid-cols-2'}>
      {/* اللوحة الترويجية — brand panel (تُخفى في وضع الصيانة) */}
      <div
        className={
          'relative hidden flex-col justify-between overflow-hidden gradient-primary p-12 text-white lg:flex ' +
          (bare ? '!hidden' : '')
        }
      >
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
            خ
          </span>
          خطوة
        </Link>
        <div className="space-y-6">
          <h2 className="font-display text-3xl font-bold leading-snug">
            تعلّم الرياضيات
            <br />
            خطوة بخطوة 🚀
          </h2>
          <ul className="space-y-3 text-white/90">
            {['مساعد ذكي صبور 24/7', 'دروس فيديو واضحة', 'تمارين تفاعلية مع تلميحات', 'تتبّع تقدّمك وإنجازاتك'].map(
              (f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ),
            )}
          </ul>
        </div>
        <p className="text-sm text-white/70">انضمّ لأكثر من 1000 طالب يتعلّمون بثقة.</p>
        {/* زخرفة — soft decorative orbs */}
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 top-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* منطقة النموذج — form area */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-right">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 font-display text-xl font-bold lg:hidden"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white">
                خ
              </span>
              خطوة
            </Link>
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
