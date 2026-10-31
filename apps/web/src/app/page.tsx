import Link from 'next/link';
import {
  Play,
  Check,
  X,
  Clock,
  HeartHandshake,
  MessageCircle,
  Brain,
  Target,
  Video,
  PencilRuler,
  Bot,
  Star,
  Sigma,
  Languages,
  Code2,
  ArrowLeft,
} from 'lucide-react';
import { AI_DAILY_LIMITS, SubscriptionPlan } from '@khatwa/shared';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/brand-mark';

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* الشريط العلوي — top nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandMark />
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">ابدأ مجاناً</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* البطل — hero (بصوت الطالب) */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pb-28 lg:pt-20">
        <div className="animate-fade-slide-up space-y-7">
          {/* المواد — subjects, set like a notebook's subject label */}
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground">
            {[
              { icon: Sigma, t: 'رياضيات' },
              { icon: Languages, t: 'إنجليزي' },
              { icon: Code2, t: 'علوم الحاسوب' },
            ].map((s, i) => (
              <li key={s.t} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden className="me-2.5 h-3.5 w-px bg-border" />}
                <s.icon className="h-4 w-4 text-primary" /> {s.t}
              </li>
            ))}
          </ul>

          <h1 className="font-display text-[2.6rem] font-bold leading-[1.18] sm:text-[3.6rem]">
            عالق بسؤال؟
            <br />
            <span className="marker animate-marker">المساعد معك</span> لحدّ ما تفهمه.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            احضر درس قصير، جرّب تحلّ، ولمّا تعلق اسأل المساعد — بيوجّهك خطوة بخطوة بلهجتك، ساعة ما
            بدك. وما بيعطيك الجواب جاهز، عشان تفهم بنفسك وتثبت بالامتحان.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button variant="gradient" size="lg">
                ابدأ مجاناً
              </Button>
            </Link>
            <Link href="#how">
              <Button variant="secondary" size="lg">
                <Play className="fill-current" /> شاهد كيف يعمل
              </Button>
            </Link>
          </div>

          {/* إثبات اجتماعي — social proof */}
          <p className="flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
            <span aria-hidden className="h-[3px] w-6 rounded-sm bg-margin" />
            انضمّ لأكثر من <span className="font-semibold text-foreground">1000 طالب</span>
          </p>
        </div>

        {/* الصفحة المحلولة — the worked page (signature) */}
        <div className="animate-fade-slide-up [animation-delay:120ms] lg:ps-6">
          <WorkedPage />
        </div>
      </section>

      {/* كيف بتتعلّم — how it works (بصوت الطالب) */}
      <section id="how" className="scroll-mt-20 border-t border-border bg-card/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead kicker="٣ خطوات" title="كيف بتتعلّم عليها؟" />
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              { icon: Video, title: 'شاهد الدرس', desc: 'فيديو قصير وواضح يشرحلك الفكرة من الصفر.' },
              { icon: PencilRuler, title: 'حلّ التمارين', desc: 'تمارين تفاعلية لكل درس — رياضيات، إنجليزي، وحاسوب.' },
              { icon: Bot, title: 'اسأل المساعد', desc: 'عالق؟ المساعد يوجّهك خطوة بخطوة حتى تفهم.' },
            ].map((s, i) => (
              <li key={s.title} className="group border-t-2 border-foreground pt-5">
                <div className="mb-6 flex items-start justify-between">
                  <span className="font-display text-6xl font-bold leading-none text-foreground/15 transition-colors duration-300 group-hover:text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <s.icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                </div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-margin">الخطوة {i + 1}</p>
                <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-xs text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ليش رح تحبّها — student benefits (ledger, not cards) */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead kicker="للطالب" title="ليش رح تحبّها؟" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                title: 'وقت ما بدك',
                desc: 'بلا مواعيد ولا انتظار — الليل، العطلة، قبل الامتحان بساعة. جاهز 24/7.',
              },
              {
                icon: MessageCircle,
                title: 'بلا إحراج',
                desc: 'اسأل قدّ ما بدك وأعِد السؤال ألف مرة — المساعد ما بيملّ ولا بينرفز.',
              },
              {
                icon: Brain,
                title: 'تفهم بنفسك',
                desc: 'ما بيعطيك الجواب جاهز — بيوجّهك بأسئلة حتى توصل لحالك، فبتثبت المعلومة.',
              },
              {
                icon: Target,
                title: 'جاهز للامتحان',
                desc: 'تمارين على نمط البجروت لكل درس، وتلميحات لمّا تعلق.',
              },
            ].map((b) => (
              <div key={b.title} className="bg-background p-7 transition-colors duration-200 hover:bg-card">
                <b.icon className="mb-5 h-6 w-6 text-primary" strokeWidth={1.75} />
                <h3 className="font-display text-xl font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* لأولياء الأمور — parent-trust band (ink page) */}
      <section className="gradient-primary py-20 text-sidebar-foreground">
        <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end">
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-highlight">
                <HeartHandshake className="h-4 w-4" /> لأولياء الأمور
              </p>
              <h2 className="font-display text-3xl font-bold leading-snug sm:text-4xl">
                تعليم بجودة المدرّس الخصوصي — وإنتوا مطّلعين على كل خطوة
              </h2>
              <p className="max-w-lg text-white/70">
                وفّر حتى <span className="font-semibold text-white">90%</span> من تكلفة المدرّس
                الخصوصي، مع تقارير أسبوعية تتابع تقدّم ابنك، ومحتوى آمن ومناسب للأولاد.
              </p>
            </div>

            {/* المقارنة — comparison ledger */}
            <div className="overflow-hidden rounded-md border border-white/15">
              <div className="grid grid-cols-2">
                <div className="border-e border-white/15 p-5">
                  <h3 className="text-sm font-semibold text-white/55">مدرّس خصوصي</h3>
                  <p className="mt-2 font-display text-3xl font-bold text-white/55">
                    600₪<span className="text-base font-normal"> / شهر</span>
                  </p>
                </div>
                <div className="relative bg-white/[0.06] p-5">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-highlight" />
                  <h3 className="text-sm font-semibold text-highlight">خطوة</h3>
                  <p className="mt-2 font-display text-3xl font-bold">
                    99₪<span className="text-base font-normal text-white/60"> / شهر</span>
                  </p>
                </div>
              </div>
              {[
                ['ساعتان أسبوعياً فقط', 'متاح 24/7 بلا حدود'],
                ['مواعيد ثابتة وصعبة', 'تعلّم وقتما تشاء'],
                ['يعطي الجواب أحياناً', 'يوجّهك خطوة بخطوة'],
                ['بدون متابعة للأهل', 'تقارير أسبوعية للأهل'],
              ].map(([them, us]) => (
                <div key={us} className="grid grid-cols-2 border-t border-white/10 text-sm">
                  <p className="flex items-center gap-2 border-e border-white/15 px-5 py-3 text-white/55">
                    <X className="h-4 w-4 shrink-0 text-margin" /> {them}
                  </p>
                  <p className="flex items-center gap-2 bg-white/[0.06] px-5 py-3">
                    <Check className="h-4 w-4 shrink-0 text-highlight" strokeWidth={3} /> {us}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* الشهادات — parent testimonials */}
          <div>
            <h3 className="mb-8 font-display text-2xl font-bold">ماذا يقول الأهل؟</h3>
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {[
                { q: 'ابني صار يحلّ الرياضيات لحاله وبثقة. أحسن استثمار عملناه.', n: 'أم محمد', c: 'حيفا' },
                { q: 'وفّرنا مصاريف المدرّس، والنتائج تحسّنت بشكل ملحوظ.', n: 'أبو سامي', c: 'الناصرة' },
                { q: 'المساعد صبور ما بيملّ — بنتي بتحبّ تتعلّم عليه.', n: 'أم ليان', c: 'كفر قاسم' },
              ].map((t) => (
                <figure key={t.n} className="border-s-2 border-margin ps-5">
                  <div className="mb-3 flex gap-0.5 text-highlight" aria-label="5 من 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg leading-relaxed">«{t.q}»</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold">{t.n}</span>
                    <span className="text-white/50"> · {t.c}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل — final CTA (بصوت الطالب), a fresh ruled sheet */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
        <div className="paper-ruled margin-rule rounded-md border border-border bg-card py-10 pe-6 shadow-sheet sm:pe-10">
          <div className="relative">
            <span aria-hidden className="margin-gutter text-margin">
              <PencilRuler className="mx-auto h-5 w-5" />
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              جاهز <span className="marker">تبدأ؟</span>
            </h2>
          </div>
          <p className="mt-3 max-w-md text-muted-foreground">
            أول درس من كل وحدة مجاني بالكامل — بدون بطاقة ائتمان. جرّب وشوف بنفسك.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> متاح 24/7</span>
            <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-primary" /> بلهجتك</span>
            <span className="flex items-center gap-1.5"><HeartHandshake className="h-4 w-4 text-primary" /> صبور ما بيملّ</span>
          </div>
          <Link href="/register" className="mt-8 inline-block">
            <Button variant="gradient" size="lg">
              ابدأ مجاناً الآن <ArrowLeft />
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          الباقة المجانية: {AI_DAILY_LIMITS[SubscriptionPlan.FREE]} أسئلة يومياً للمساعد الذكي
        </p>
      </section>

      {/* تذييل — footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <BrandMark className="text-base text-foreground" />
          <p>© {new Date().getFullYear()} خطوة — منصة تعليمية للطلاب العرب في إسرائيل</p>
        </div>
      </footer>
    </div>
  );
}

/** عنوان قسم — section heading with a margin tick and kicker. */
function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground">
        <span aria-hidden className="h-[3px] w-6 rounded-sm bg-margin" />
        {kicker}
      </span>
    </div>
  );
}

/**
 * الصفحة المحلولة — a page from the student's notebook: graph paper, a red
 * margin rule, and each step of the solution numbered in the margin.
 */
function WorkedPage() {
  const row =
    'relative flex min-h-[3.25rem] items-center border-b border-dashed border-primary/15 py-3 last:border-b-0';
  return (
    <figure className="paper-grid margin-rule relative rounded-md border border-border bg-card pb-2 pe-5 pt-4 shadow-sheet lg:-rotate-1">
      <figcaption className="mb-1 flex items-center justify-between border-b border-foreground/15 pb-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">تمرين ٣ · معادلات تربيعية</span>
        <span className="flex items-center gap-1.5 text-primary">
          <Bot className="h-4 w-4" /> المساعد الذكي
        </span>
      </figcaption>

      {/* السؤال — the problem */}
      <div className={row}>
        <span className="margin-gutter font-display text-lg font-bold text-margin">؟</span>
        <span dir="ltr" className="w-full text-left font-mono text-xl font-medium">
          x² − 5x + 6 = 0
        </span>
      </div>

      {/* ملاحظة المساعد — tutor's note in the margin's voice */}
      <div className={row}>
        <span className="margin-gutter text-primary">
          <MessageCircle className="mx-auto h-4 w-4" />
        </span>
        <p className="border-s-2 border-primary/40 ps-3 text-[15px] leading-relaxed text-primary">
          تمام! شو لو نحاول نحلّلها لقوسين؟ أي عددين ضربهما 6 وجمعهما −5؟
        </p>
      </div>

      {/* الخطوة ١ — student step */}
      <div className={row}>
        <span className="margin-gutter font-mono text-sm font-medium text-muted-foreground">1</span>
        <span className="flex items-center gap-2 text-[15px]">
          <span dir="ltr" className="font-mono">−2 , −3</span>
          <Check className="h-4 w-4 text-success" strokeWidth={3} />
        </span>
      </div>

      {/* الخطوة ٢ — result */}
      <div className={row}>
        <span className="margin-gutter">
          <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-success text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        </span>
        <span dir="ltr" className="marker font-mono text-lg">(x−2)(x−3) = 0</span>
        <span className="ms-auto -rotate-6 rounded-sm border-[1.5px] border-success px-2 py-0.5 text-xs font-bold text-success">
          +8 نقطة
        </span>
      </div>
    </figure>
  );
}
