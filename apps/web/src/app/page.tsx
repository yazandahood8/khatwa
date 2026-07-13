import Link from 'next/link';
import {
  Sparkles,
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
} from 'lucide-react';
import { AI_DAILY_LIMITS, SubscriptionPlan } from '@khatwa/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* الشريط العلوي — top nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white shadow-glow-primary">
              خ
            </span>
            خطوة
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="gradient" size="sm">
                ابدأ مجاناً
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* البطل — hero (بصوت الطالب) */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-slide-up space-y-6">
          <Badge variant="achievement" size="lg">
            <Sparkles className="h-4 w-4" /> مساعدك الذكي بكل مادة
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            عالق بسؤال؟ <span className="gradient-text">المساعد معك</span> لحدّ ما تفهمه.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            احضر درس قصير، جرّب تحلّ، ولمّا تعلق اسأل المساعد — بيوجّهك خطوة بخطوة بلهجتك، ساعة ما
            بدك. وما بيعطيك الجواب جاهز، عشان تفهم بنفسك وتثبت بالامتحان.
          </p>
          {/* المواد — subjects */}
          <div className="flex flex-wrap gap-2">
            {[
              { e: '📐', t: 'رياضيات' },
              { e: '🔤', t: 'إنجليزي' },
              { e: '💻', t: 'علوم الحاسوب' },
            ].map((s) => (
              <span
                key={s.t}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium"
              >
                <span aria-hidden>{s.e}</span> {s.t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button variant="gradient" size="lg">
                ابدأ مجاناً
              </Button>
            </Link>
            <Link href="#how">
              <Button variant="secondary" size="lg">
                <Play className="fill-primary text-primary" /> شاهد كيف يعمل
              </Button>
            </Link>
          </div>
          {/* إثبات اجتماعي — social proof */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2 -space-x-reverse">
              {['أ', 'م', 'س', 'ر'].map((c, i) => (
                <span
                  key={i}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-primary-light font-display text-sm font-bold text-primary"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              انضمّ لأكثر من <span className="font-semibold text-foreground">1000 طالب</span>
            </p>
          </div>
        </div>

        {/* بطاقة معاينة — preview card */}
        <div className="animate-fade-slide-up [animation-delay:120ms]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
              <Bot className="h-5 w-5" /> المساعد الذكي
            </div>
            <div className="space-y-3">
              <div dir="ltr" className="rounded-xl border-r-4 border-primary bg-primary-light/40 p-3 text-left">
                <span className="font-mono text-lg">x² − 5x + 6 = 0</span>
              </div>
              <div className="max-w-[85%] rounded-[18px] rounded-bl-[4px] bg-primary-light px-4 py-2.5 text-sm">
                تمام! شو لو نحاول نحلّلها لقوسين؟ أي عددين ضربهما 6 وجمعهما −5؟ 🤔
              </div>
              <div className="ms-auto max-w-[85%] rounded-[18px] rounded-br-[4px] bg-primary px-4 py-2.5 text-sm text-white">
                −2 و −3 ✅
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/5 px-3 py-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-success text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span dir="ltr" className="font-mono">(x−2)(x−3) = 0</span>
                <span className="ms-auto text-xs font-semibold text-gold-text">+8 نقطة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* كيف بتتعلّم — how it works (بصوت الطالب) */}
      <section id="how" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="mb-12 text-center font-display text-3xl font-bold">كيف بتتعلّم عليها؟</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Video, title: 'شاهد الدرس', desc: 'فيديو قصير وواضح يشرحلك الفكرة من الصفر.' },
            { icon: PencilRuler, title: 'حلّ التمارين', desc: 'تمارين تفاعلية لكل درس — رياضيات، إنجليزي، وحاسوب.' },
            { icon: Bot, title: 'اسأل المساعد', desc: 'عالق؟ المساعد يوجّهك خطوة بخطوة حتى تفهم.' },
          ].map((s, i) => (
            <div key={s.title} className="text-center">
              <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-white shadow-glow-primary">
                <s.icon className="h-7 w-7" />
              </span>
              <p className="mb-1 font-display text-xs font-semibold text-primary">الخطوة {i + 1}</p>
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ليش رح تحبّها — student benefits */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-12 text-center font-display text-3xl font-bold">ليش رح تحبّها؟</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              <div key={b.title} className="rounded-2xl border border-border bg-background p-6 shadow-card">
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary-light text-primary">
                  <b.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* لأولياء الأمور — parent-trust band */}
      <section className="border-y border-border bg-primary-light/20 py-16">
        <div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <Badge variant="default" size="lg">
              <HeartHandshake className="h-4 w-4" /> لأولياء الأمور
            </Badge>
            <h2 className="font-display text-3xl font-bold">
              تعليم بجودة المدرّس الخصوصي — وإنتوا مطّلعين على كل خطوة
            </h2>
            <p className="text-muted-foreground">
              وفّر حتى <span className="font-semibold text-foreground">90%</span> من تكلفة المدرّس
              الخصوصي، مع تقارير أسبوعية تتابع تقدّم ابنك، ومحتوى آمن ومناسب للأولاد.
            </p>
          </div>

          {/* المقارنة — comparison */}
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            {/* مدرس خصوصي */}
            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="mb-4 font-display text-lg font-semibold text-muted-foreground">
                مدرّس خصوصي
              </h3>
              <p className="mb-5 font-display text-3xl font-bold text-muted-foreground">
                600₪<span className="text-base font-normal"> / شهر</span>
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {['ساعتان أسبوعياً فقط', 'مواعيد ثابتة وصعبة', 'يعطي الجواب أحياناً', 'بدون متابعة للأهل'].map(
                  (f) => (
                    <li key={f} className="flex items-center gap-2">
                      <X className="h-4 w-4 shrink-0 text-destructive" /> {f}
                    </li>
                  ),
                )}
              </ul>
            </div>
            {/* خطوة */}
            <div className="relative rounded-2xl border-2 border-primary bg-background p-6 shadow-card">
              <Badge variant="default" className="absolute -top-3 right-6">
                خطوة
              </Badge>
              <h3 className="mb-4 font-display text-lg font-semibold text-primary">خطوة</h3>
              <p className="mb-5 font-display text-3xl font-bold">
                <span className="text-success">99₪</span>
                <span className="text-base font-normal text-muted-foreground"> / شهر</span>
              </p>
              <ul className="space-y-3 text-sm">
                {['متاح 24/7 بلا حدود', 'تعلّم وقتما تشاء', 'يوجّهك خطوة بخطوة', 'تقارير أسبوعية للأهل'].map(
                  (f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-success" strokeWidth={3} /> {f}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* الشهادات — parent testimonials */}
          <div>
            <h3 className="mb-8 text-center font-display text-2xl font-bold">ماذا يقول الأهل؟</h3>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { q: 'ابني صار يحلّ الرياضيات لحاله وبثقة. أحسن استثمار عملناه.', n: 'أم محمد', c: 'حيفا' },
                { q: 'وفّرنا مصاريف المدرّس، والنتائج تحسّنت بشكل ملحوظ.', n: 'أبو سامي', c: 'الناصرة' },
                { q: 'المساعد صبور ما بيملّ — بنتي بتحبّ تتعلّم عليه.', n: 'أم ليان', c: 'كفر قاسم' },
              ].map((t) => (
                <div key={t.n} className="rounded-2xl border border-border bg-background p-6 shadow-card">
                  <div className="mb-3 flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold" />
                    ))}
                  </div>
                  <p className="mb-4 leading-relaxed">«{t.q}»</p>
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light font-display font-bold text-primary">
                      {t.n.charAt(0)}
                    </span>
                    <div className="text-sm">
                      <p className="font-semibold">{t.n}</p>
                      <p className="text-muted-foreground">{t.c}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل — final CTA (بصوت الطالب) */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <div className="rounded-2xl gradient-primary p-10 text-white shadow-float">
          <h2 className="font-display text-3xl font-bold">جاهز تبدأ؟</h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">
            أول درس من كل وحدة مجاني بالكامل — بدون بطاقة ائتمان. جرّب وشوف بنفسك.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> متاح 24/7</span>
            <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> بلهجتك</span>
            <span className="flex items-center gap-1.5"><HeartHandshake className="h-4 w-4" /> صبور ما بيملّ</span>
          </div>
          <Link href="/register" className="mt-8 inline-block">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              ابدأ مجاناً الآن
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          الباقة المجانية: {AI_DAILY_LIMITS[SubscriptionPlan.FREE]} أسئلة يومياً للمساعد الذكي
        </p>
      </section>

      {/* تذييل — footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} خطوة — منصة تعليمية للطلاب العرب في إسرائيل</p>
      </footer>
    </div>
  );
}
