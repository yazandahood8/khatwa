import { BrandMark } from '@/components/brand-mark';
import { Blob, DotGrid, MathSymbol, Ring, Sparkle, Star, Trophy } from '@/components/decor';

const STEPS = ['مساعد ذكي صبور 24/7', 'دروس فيديو واضحة', 'تمارين تفاعلية مع تلميحات', 'تتبّع تقدّمك وإنجازاتك'];

/** غلاف صفحات الدخول — split auth layout: a bright blue adventure panel beside a white form card. */
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
    <main
      className={
        bare
          ? 'flex min-h-screen items-center justify-center bg-secondary/50'
          : 'grid min-h-screen bg-secondary/50 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:p-4'
      }
    >
      {/* اللوحة الترويجية — brand panel (تُخفى في وضع الصيانة) */}
      <div
        className={
          'gradient-primary relative hidden flex-col justify-between overflow-hidden rounded-3xl p-12 text-sidebar-foreground lg:flex ' +
          (bare ? '!hidden' : '')
        }
      >
        <Blob className="-bottom-24 -start-24 h-[26rem] w-[26rem] opacity-20" color="white" />
        <Ring className="-end-16 top-24 h-52 w-52" color="hsl(0 0% 100% / 0.12)" />
        <DotGrid tone="white" className="bottom-32 end-10 h-24 w-32 opacity-60" />
        <Sparkle className="end-24 top-16 h-7 w-7 animate-float" />
        <Star className="start-16 top-1/2 h-8 w-8 animate-drift" />
        <Trophy className="end-12 bottom-24 h-24 w-20 animate-float-slow" />
        <MathSymbol char="+" tone="lime" className="start-12 top-40 animate-float [--rot:8deg]" />
        <MathSymbol char="π" tone="sun" className="end-40 top-1/2 animate-drift [--rot:-6deg]" />

        <div className="relative">
          <BrandMark tone="ink" size="lg" />
        </div>

        <div className="relative space-y-8">
          <h2 className="font-display text-5xl font-extrabold leading-[1.15]">
            تعلّم
            <br />
            <span className="marker !text-foreground">خطوة</span> بخطوة.
          </h2>

          <ol className="space-y-3">
            {STEPS.map((f, i) => (
              <li
                key={f}
                className="flex items-center gap-4 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lime font-display text-base font-bold text-foreground">
                  {i + 1}
                </span>
                <span className="text-[17px] font-medium text-white">{f}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="relative text-sm text-white/80">انضمّ لأكثر من 1000 طالب يتعلّمون بثقة.</p>
      </div>

      {/* منطقة النموذج — form area */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-elevated ring-1 ring-primary/10 sm:p-9">
          <div className="mb-8 text-center lg:text-right">
            <BrandMark className="mb-6 lg:hidden" />
            <h1 className="font-display text-3xl font-extrabold leading-tight">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
            <span aria-hidden className="mx-auto mt-5 block h-1.5 w-12 rounded-full bg-lime lg:mx-0" />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
