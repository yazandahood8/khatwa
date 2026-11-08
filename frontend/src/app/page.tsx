import Link from 'next/link';
import { Sigma, Languages, Code2, ArrowLeft } from 'lucide-react';
import { AI_DAILY_LIMITS, SubscriptionPlan } from '@khatwa/shared';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/brand-mark';
import { DotGrid, PaperPlane, Ring, Sparkle } from '@/components/decor';
import { HeroCards, LandingPopups, WatchHowButton } from '@/components/landing/landing-popups';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
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

      {/* البطل — hero (بصوت الطالب) + خمس بطاقات تفتح نوافذ منبثقة */}
      <section className="relative flex flex-1 items-center">
        <Ring className="-start-20 top-40 hidden h-56 w-56 animate-float-slow lg:block" />
        <DotGrid className="end-6 top-24 hidden h-28 w-36 lg:block" />
        <PaperPlane className="start-[6%] top-24 hidden h-12 w-20 animate-drift lg:block" />
        <Sparkle className="start-[42%] top-16 hidden h-6 w-6 animate-float lg:block" />

        <LandingPopups freeLimit={AI_DAILY_LIMITS[SubscriptionPlan.FREE]}>
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-8">
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
                <WatchHowButton />
              </div>

              {/* إثبات اجتماعي — social proof */}
              <p className="flex items-center justify-center gap-3 text-sm text-muted-foreground lg:justify-start">
                <span aria-hidden className="h-1.5 w-8 rounded-full bg-lime" />
                انضمّ لأكثر من <span className="font-bold text-foreground">1000 طالب</span>
              </p>
            </div>

            <div className="animate-fade-slide-up [animation-delay:120ms]">
              <HeroCards />
            </div>
          </div>
        </LandingPopups>
      </section>

      <p className="px-4 pb-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} خطوة — منصة تعليمية للطلاب العرب في إسرائيل
      </p>
    </div>
  );
}
