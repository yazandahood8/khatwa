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
  Star as StarIcon,
  Sigma,
  Languages,
  Code2,
  ArrowLeft,
} from 'lucide-react';
import { AI_DAILY_LIMITS, SubscriptionPlan } from '@khatwa/shared';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/brand-mark';
import { SectionHeading } from '@/components/section-heading';
import {
  Atom,
  Blob,
  DotGrid,
  HeroIllustration,
  PaperPlane,
  Ring,
  Sparkle,
  Squiggle,
} from '@/components/decor';

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* الشريط العلوي — floating rounded top nav */}
      <div className="sticky top-0 z-30 px-3 pt-3 sm:px-6">
        <header className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full bg-card/90 px-4 shadow-card ring-1 ring-primary/10 backdrop-blur-md sm:px-6">
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
        </header>
      </div>

      {/* البطل — hero (بصوت الطالب) */}
      <section className="relative">
        <Ring className="-start-20 top-40 hidden h-56 w-56 animate-float-slow lg:block" />
        <DotGrid className="end-6 top-24 hidden h-28 w-36 lg:block" />
        <PaperPlane className="start-[6%] top-24 hidden h-12 w-20 animate-drift lg:block" />
        <Sparkle className="start-[42%] top-16 hidden h-6 w-6 animate-float lg:block" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pb-28 lg:pt-16">
          <div className="animate-fade-slide-up space-y-7 text-center lg:text-start">
            {/* المواد — subjects as friendly chips */}
            <ul className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {[
                { icon: Sigma, t: 'رياضيات', c: 'bg-tint-lavender' },
                { icon: Languages, t: 'إنجليزي', c: 'bg-tint-pink' },
                { icon: Code2, t: 'علوم الحاسوب', c: 'bg-lime-light' },
              ].map((s) => (
                <li
                  key={s.t}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-display text-sm font-bold ${s.c}`}
                >
                  <s.icon className="h-4 w-4 text-primary" /> {s.t}
                </li>
              ))}
            </ul>

            <h1 className="font-display text-[2.7rem] font-extrabold leading-[1.15] sm:text-[3.8rem]">
              عالق بسؤال؟
              <br />
              <span className="marker animate-marker">المساعد معك</span>{' '}
              <span className="text-primary">لحدّ ما تفهمه.</span>
            </h1>

            <p className="mx-auto max-w-lg text-lg leading-relaxed text-muted-foreground lg:mx-0">
              احضر درس قصير، جرّب تحلّ، ولمّا تعلق اسأل المساعد — بيوجّهك خطوة بخطوة بلهجتك، ساعة ما
              بدك. وما بيعطيك الجواب جاهز، عشان تفهم بنفسك وتثبت بالامتحان.
            </p>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/register">
                <Button size="lg">
                  ابدأ مجاناً <ArrowLeft />
                </Button>
              </Link>
              <Link href="#how">
                <Button variant="secondary" size="lg">
                  <Play className="fill-current" /> شاهد كيف يعمل
                </Button>
              </Link>
            </div>

            {/* إثبات اجتماعي — social proof */}
            <p className="flex items-center justify-center gap-3 text-sm text-muted-foreground lg:justify-start">
              <span aria-hidden className="h-1.5 w-8 rounded-full bg-lime" />
              انضمّ لأكثر من <span className="font-bold text-foreground">1000 طالب</span>
            </p>
          </div>

          <div className="animate-fade-slide-up [animation-delay:120ms]">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* كيف بتتعلّم — how it works: three colorful feature cards */}
      <section id="how" className="relative scroll-mt-20 bg-secondary/60 py-20">
        <Atom className="start-[5%] top-10 hidden h-20 w-20 opacity-70 md:block" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="٣ خطوات" title="كيف بتتعلّم" accent="عليها؟" />
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Video,
                title: 'شاهد الدرس',
                desc: 'فيديو قصير وواضح يشرحلك الفكرة من الصفر.',
                tone: 'bg-tint-lavender text-foreground',
                tile: 'bg-card text-primary',
              },
              {
                icon: PencilRuler,
                title: 'حلّ التمارين',
                desc: 'تمارين تفاعلية لكل درس — رياضيات، إنجليزي، وحاسوب.',
                tone: 'bg-primary text-primary-foreground md:-translate-y-4',
                tile: 'bg-card text-primary',
              },
              {
                icon: Bot,
                title: 'اسأل المساعد',
                desc: 'عالق؟ المساعد يوجّهك خطوة بخطوة حتى تفهم.',
                tone: 'bg-lime text-foreground',
                tile: 'bg-card text-primary',
              },
            ].map((s, i) => (
              <li
                key={s.title}
                className={`dashed-frame group relative overflow-hidden rounded-3xl p-7 shadow-sheet transition-transform duration-300 hover:-translate-y-2 ${s.tone}`}
              >
                <span
                  aria-hidden
                  className="absolute -end-3 -top-6 font-display text-8xl font-extrabold leading-none opacity-15"
                >
                  {i + 1}
                </span>
                <span className={`mb-8 grid h-14 w-14 place-items-center rounded-full shadow-card ${s.tile}`}>
                  <s.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <h3 className="font-display text-2xl font-extrabold">{s.title}</h3>
                <p className="mt-2 max-w-xs leading-relaxed opacity-85">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ليش رح تحبّها — student benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="للطالب" title="ليش رح" accent="تحبّها؟" />
          <div className="mt-14 grid gap-5 md:grid-cols-6">
            {[
              {
                icon: Clock,
                title: 'وقت ما بدك',
                desc: 'بلا مواعيد ولا انتظار — الليل، العطلة، قبل الامتحان بساعة. جاهز 24/7.',
                cls: 'md:col-span-3 bg-primary-light',
              },
              {
                icon: MessageCircle,
                title: 'بلا إحراج',
                desc: 'اسأل قدّ ما بدك وأعِد السؤال ألف مرة — المساعد ما بيملّ ولا بينرفز.',
                cls: 'md:col-span-3 bg-tint-pink',
              },
              {
                icon: Brain,
                title: 'تفهم بنفسك',
                desc: 'ما بيعطيك الجواب جاهز — بيوجّهك بأسئلة حتى توصل لحالك، فبتثبت المعلومة.',
                cls: 'md:col-span-2 bg-lime-light',
              },
              {
                icon: Target,
                title: 'جاهز للامتحان',
                desc: 'تمارين على نمط البجروت لكل درس، وتلميحات لمّا تعلق.',
                cls: 'md:col-span-4 bg-tint-sun',
              },
            ].map((b) => (
              <div
                key={b.title}
                className={`group flex items-start gap-5 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${b.cls}`}
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-card text-primary shadow-card transition-transform duration-300 group-hover:rotate-6">
                  <b.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold">{b.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* لأولياء الأمور — parent-trust band (bright blue) */}
      <section className="gradient-primary section-curve relative overflow-hidden py-20 text-sidebar-foreground">
        <Blob className="-start-32 -top-24 h-[30rem] w-[30rem] opacity-15" color="white" />
        <div className="relative mx-auto max-w-6xl space-y-16 px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 font-display text-sm font-bold text-white">
                <HeartHandshake className="h-4 w-4" /> لأولياء الأمور
              </p>
              <h2 className="font-display text-3xl font-extrabold leading-snug sm:text-4xl">
                تعليم بجودة المدرّس الخصوصي — وإنتوا{' '}
                <span className="text-lime">مطّلعين على كل خطوة</span>
              </h2>
              <p className="max-w-lg text-white/85">
                وفّر حتى <span className="font-bold text-white">90%</span> من تكلفة المدرّس
                الخصوصي، مع تقارير أسبوعية تتابع تقدّم ابنك، ومحتوى آمن ومناسب للأولاد.
              </p>
            </div>

            {/* المقارنة — comparison card */}
            <div className="overflow-hidden rounded-3xl bg-card text-foreground shadow-float">
              <div className="grid grid-cols-2">
                <div className="p-5">
                  <h3 className="text-sm font-bold text-muted-foreground">مدرّس خصوصي</h3>
                  <p className="mt-2 font-display text-3xl font-extrabold text-muted-foreground">
                    600₪<span className="text-base font-medium"> / شهر</span>
                  </p>
                </div>
                <div className="bg-lime p-5">
                  <h3 className="text-sm font-bold">خطوة</h3>
                  <p className="mt-2 font-display text-3xl font-extrabold">
                    99₪<span className="text-base font-medium"> / شهر</span>
                  </p>
                </div>
              </div>
              {[
                ['ساعتان أسبوعياً فقط', 'متاح 24/7 بلا حدود'],
                ['مواعيد ثابتة وصعبة', 'تعلّم وقتما تشاء'],
                ['يعطي الجواب أحياناً', 'يوجّهك خطوة بخطوة'],
                ['بدون متابعة للأهل', 'تقارير أسبوعية للأهل'],
              ].map(([them, us]) => (
                <div key={us} className="grid grid-cols-2 border-t border-border text-sm">
                  <p className="flex items-center gap-2 px-5 py-3.5 text-muted-foreground">
                    <X className="h-4 w-4 shrink-0 text-destructive" /> {them}
                  </p>
                  <p className="flex items-center gap-2 bg-lime-light px-5 py-3.5 font-semibold">
                    <Check className="h-4 w-4 shrink-0 text-success" strokeWidth={3} /> {us}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* الشهادات — parent testimonials */}
          <div>
            <h3 className="mb-8 font-display text-2xl font-extrabold">ماذا يقول الأهل؟</h3>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { q: 'ابني صار يحلّ الرياضيات لحاله وبثقة. أحسن استثمار عملناه.', n: 'أم محمد', c: 'حيفا' },
                { q: 'وفّرنا مصاريف المدرّس، والنتائج تحسّنت بشكل ملحوظ.', n: 'أبو سامي', c: 'الناصرة' },
                { q: 'المساعد صبور ما بيملّ — بنتي بتحبّ تتعلّم عليه.', n: 'أم ليان', c: 'كفر قاسم' },
              ].map((t) => (
                <figure key={t.n} className="rounded-3xl bg-white/12 p-6 ring-1 ring-white/25 backdrop-blur-sm">
                  <div className="mb-3 flex gap-0.5 text-lime" aria-label="5 من 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg leading-relaxed">«{t.q}»</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-bold">{t.n}</span>
                    <span className="text-white/70"> · {t.c}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل — final CTA */}
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-tint-lavender px-6 py-14 text-center shadow-sheet sm:px-12">
          <Ring className="-start-12 -top-12 h-44 w-44" />
          <DotGrid className="bottom-6 end-6 hidden h-20 w-28 sm:block" />
          <PaperPlane className="end-[12%] top-8 hidden h-10 w-16 animate-drift sm:block" />
          <Squiggle className="start-[12%] bottom-8 hidden h-6 w-24 sm:block" />
          <div className="relative">
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
              جاهز <span className="marker">تبدأ؟</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
              أول درس من كل وحدة مجاني بالكامل — بدون بطاقة ائتمان. جرّب وشوف بنفسك.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-bold">
              <span className="flex items-center gap-1.5 rounded-full bg-card px-4 py-1.5 shadow-subtle"><Clock className="h-4 w-4 text-primary" /> متاح 24/7</span>
              <span className="flex items-center gap-1.5 rounded-full bg-card px-4 py-1.5 shadow-subtle"><MessageCircle className="h-4 w-4 text-primary" /> بلهجتك</span>
              <span className="flex items-center gap-1.5 rounded-full bg-card px-4 py-1.5 shadow-subtle"><HeartHandshake className="h-4 w-4 text-primary" /> صبور ما بيملّ</span>
            </div>
            <Link href="/register" className="mt-8 inline-block">
              <Button variant="gradient" size="lg">
                ابدأ مجاناً الآن <ArrowLeft />
              </Button>
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          الباقة المجانية: {AI_DAILY_LIMITS[SubscriptionPlan.FREE]} أسئلة يومياً للمساعد الذكي
        </p>
      </section>

      {/* تذييل — footer */}
      <footer className="bg-secondary/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <BrandMark className="text-lg" />
          <p>© {new Date().getFullYear()} خطوة — منصة تعليمية للطلاب العرب في إسرائيل</p>
        </div>
      </footer>
    </div>
  );
}
