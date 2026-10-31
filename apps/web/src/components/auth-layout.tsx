import { BrandMark } from '@/components/brand-mark';

const STEPS = ['مساعد ذكي صبور 24/7', 'دروس فيديو واضحة', 'تمارين تفاعلية مع تلميحات', 'تتبّع تقدّمك وإنجازاتك'];

/** غلاف صفحات الدخول — split auth layout: an ink "worked page" beside a paper form. */
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
    <main className={bare ? 'flex min-h-screen items-center justify-center' : 'grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]'}>
      {/* اللوحة الترويجية — brand panel (تُخفى في وضع الصيانة) */}
      <div
        className={
          'gradient-primary relative hidden flex-col justify-between overflow-hidden p-12 text-sidebar-foreground lg:flex ' +
          (bare ? '!hidden' : '')
        }
      >
        <BrandMark tone="ink" size="lg" />

        <div className="space-y-10">
          <h2 className="font-display text-[2.75rem] font-bold leading-[1.15]">
            تعلّم
            <br />
            <span className="text-highlight">خطوة</span> بخطوة.
          </h2>

          {/* خطوات في الهامش — numbered steps hanging in a red margin */}
          <ol className="relative space-y-0 border-y border-white/[0.1]">
            <span aria-hidden className="absolute inset-y-0 start-12 w-[1.5px] bg-margin/70" />
            {STEPS.map((f, i) => (
              <li key={f} className="flex items-center border-b border-white/[0.07] py-3.5 last:border-b-0">
                <span className="w-12 shrink-0 font-mono text-sm text-white/45">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="ps-5 text-[17px] text-white/90">{f}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-sm text-white/55">انضمّ لأكثر من 1000 طالب يتعلّمون بثقة.</p>
      </div>

      {/* منطقة النموذج — form area */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-right">
            <BrandMark className="mb-8 lg:hidden" />
            <h1 className="font-display text-[1.75rem] font-bold leading-tight">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
            <span aria-hidden className="mx-auto mt-5 block h-[3px] w-10 rounded-sm bg-margin lg:mx-0" />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
