'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  Brain,
  Check,
  ChevronLeft,
  Clock,
  HeartHandshake,
  MessageCircle,
  PencilRuler,
  Play,
  Rocket,
  Star as StarIcon,
  Target,
  Users,
  Video,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { HeroIllustration } from '@/components/decor';
import { KidAvatar, type KidVariant } from '@/components/landing/kid-avatars';
import { cn } from '@/lib/utils';

type PopupId = 'how' | 'why' | 'parents' | 'reviews' | 'start';

const CARDS: {
  id: PopupId;
  title: string;
  hint: string;
  icon: React.ElementType;
  avatar: KidVariant;
  bg: string;
  header: string;
  /** Desktop placement around the illustration + float rotation. */
  pos: string;
}[] = [
  {
    id: 'how',
    title: 'كيف بتتعلّم؟',
    hint: '٣ خطوات بسيطة',
    icon: Video,
    avatar: 'boy-dark',
    bg: 'bg-tint-lavender',
    header: 'bg-tint-lavender',
    pos: 'lg:right-[-3%] lg:top-[1%] [--rot:-3deg]',
  },
  {
    id: 'why',
    title: 'ليش رح تحبّها؟',
    hint: 'للطالب',
    icon: Brain,
    avatar: 'girl-ponytail',
    bg: 'bg-tint-pink',
    header: 'bg-tint-pink',
    pos: 'lg:left-[-3%] lg:top-[19%] [--rot:2deg]',
  },
  {
    id: 'parents',
    title: 'لأولياء الأمور',
    hint: 'تقارير وتوفير',
    icon: HeartHandshake,
    avatar: 'girl-hijab',
    bg: 'bg-primary-light',
    header: 'bg-primary-light',
    pos: 'lg:right-[-3%] lg:top-[39%] [--rot:2deg]',
  },
  {
    id: 'reviews',
    title: 'ماذا يقول الأهل؟',
    hint: 'آراء حقيقية',
    icon: Users,
    avatar: 'boy-glasses',
    bg: 'bg-tint-sun',
    header: 'bg-tint-sun',
    pos: 'lg:left-[-3%] lg:top-[58%] [--rot:-2deg]',
  },
  {
    id: 'start',
    title: 'جاهز تبدأ؟',
    hint: 'مجاناً بدون بطاقة',
    icon: Rocket,
    avatar: 'boy-cap',
    bg: 'bg-lime-light',
    header: 'bg-lime-light',
    pos: 'lg:bottom-0 lg:right-[8%] [--rot:3deg]',
  },
];

const Ctx = React.createContext<{ open: (id: PopupId) => void } | null>(null);

/** يملك حالة النافذة المنبثقة ويعرضها — wrap the hero with this. */
export function LandingPopups({ freeLimit, children }: { freeLimit: number; children: React.ReactNode }) {
  const [active, setActive] = React.useState<PopupId | null>(null);
  const close = React.useCallback(() => setActive(null), []);
  const value = React.useMemo(() => ({ open: setActive }), []);
  const card = CARDS.find((c) => c.id === active);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Modal
        open={!!card}
        onClose={close}
        title={card?.title ?? ''}
        headerClassName={card?.header}
        className={active === 'start' ? 'max-w-xl' : undefined}
      >
        {active === 'how' && <HowBody />}
        {active === 'why' && <WhyBody />}
        {active === 'parents' && <ParentsBody />}
        {active === 'reviews' && <ReviewsBody />}
        {active === 'start' && <StartBody freeLimit={freeLimit} />}
      </Modal>
    </Ctx.Provider>
  );
}

function usePopup() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('usePopup must be used within LandingPopups');
  return ctx;
}

/** زر «شاهد كيف يعمل» — opens the how-it-works popup. */
export function WatchHowButton() {
  const { open } = usePopup();
  return (
    <Button variant="secondary" size="lg" onClick={() => open('how')}>
      <Play className="fill-current" /> شاهد كيف يعمل
    </Button>
  );
}

/** الرسم + خمس بطاقات عائمة حوله (شبكة على الجوال) — illustration with floating cards. */
export function HeroCards() {
  const { open } = usePopup();
  return (
    <div className="relative mx-auto w-full max-w-[580px] lg:aspect-[10/11]">
      <div className="mx-auto w-[70%] max-w-[300px] lg:absolute lg:inset-x-[19%] lg:inset-y-[12%] lg:w-auto lg:max-w-none">
        <HeroIllustration className="max-w-none" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:contents">
        {CARDS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => open(c.id)}
            style={{ animationDelay: `${i * 0.7}s` }}
            className={cn(
              'group z-10 flex items-center gap-3 rounded-[1.75rem] p-3 pe-4 text-start shadow-sheet ring-2 ring-white transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-float',
              'lg:absolute lg:w-[15.5rem] lg:animate-float',
              c.bg,
              i === CARDS.length - 1 && 'min-[460px]:col-span-2',
              c.pos,
            )}
          >
            <span className="relative grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-end overflow-hidden rounded-[1.25rem] bg-white shadow-card transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <KidAvatar variant={c.avatar} className="h-full w-full" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-extrabold leading-tight">{c.title}</span>
              <span className="mt-0.5 block text-xs font-semibold text-foreground/70">{c.hint}</span>
            </span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-card text-primary shadow-subtle transition-transform group-hover:-translate-x-1">
              <ChevronLeft className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── popup bodies (copy unchanged) ───────────────────────── */

function HowBody() {
  const steps = [
    { icon: Video, title: 'شاهد الدرس', desc: 'فيديو قصير وواضح يشرحلك الفكرة من الصفر.', tone: 'bg-tint-lavender' },
    { icon: PencilRuler, title: 'حلّ التمارين', desc: 'تمارين تفاعلية لكل درس — رياضيات، إنجليزي، وحاسوب.', tone: 'bg-primary-light' },
    { icon: Bot, title: 'اسأل المساعد', desc: 'عالق؟ المساعد يوجّهك خطوة بخطوة حتى تفهم.', tone: 'bg-lime-light' },
  ];
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className={cn('relative overflow-hidden rounded-3xl p-6', s.tone)}>
          <span aria-hidden className="absolute -end-2 -top-5 font-display text-8xl font-extrabold leading-none opacity-10">
            {i + 1}
          </span>
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-card text-primary shadow-card">
            <s.icon className="h-5 w-5" />
          </span>
          <h3 className="font-display text-xl font-extrabold">{s.title}</h3>
          <p className="mt-1.5 leading-relaxed text-muted-foreground">{s.desc}</p>
        </li>
      ))}
    </ol>
  );
}

function WhyBody() {
  const items = [
    { icon: Clock, title: 'وقت ما بدك', desc: 'بلا مواعيد ولا انتظار — الليل، العطلة، قبل الامتحان بساعة. جاهز 24/7.', tone: 'bg-primary-light' },
    { icon: MessageCircle, title: 'بلا إحراج', desc: 'اسأل قدّ ما بدك وأعِد السؤال ألف مرة — المساعد ما بيملّ ولا بينرفز.', tone: 'bg-tint-pink' },
    { icon: Brain, title: 'تفهم بنفسك', desc: 'ما بيعطيك الجواب جاهز — بيوجّهك بأسئلة حتى توصل لحالك، فبتثبت المعلومة.', tone: 'bg-lime-light' },
    { icon: Target, title: 'جاهز للامتحان', desc: 'تمارين على نمط البجروت لكل درس، وتلميحات لمّا تعلق.', tone: 'bg-tint-sun' },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((b) => (
        <div key={b.title} className={cn('flex items-start gap-4 rounded-3xl p-5', b.tone)}>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-card text-primary shadow-card">
            <b.icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-extrabold">{b.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ParentsBody() {
  const rows = [
    ['ساعتان أسبوعياً فقط', 'متاح 24/7 بلا حدود'],
    ['مواعيد ثابتة وصعبة', 'تعلّم وقتما تشاء'],
    ['يعطي الجواب أحياناً', 'يوجّهك خطوة بخطوة'],
    ['بدون متابعة للأهل', 'تقارير أسبوعية للأهل'],
  ];
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-display text-2xl font-extrabold leading-snug">
          تعليم بجودة المدرّس الخصوصي — وإنتوا <span className="text-primary">مطّلعين على كل خطوة</span>
        </h3>
        <p className="text-muted-foreground">
          وفّر حتى <span className="font-bold text-foreground">90%</span> من تكلفة المدرّس الخصوصي، مع
          تقارير أسبوعية تتابع تقدّم ابنك، ومحتوى آمن ومناسب للأولاد.
        </p>
      </div>
      <div className="overflow-hidden rounded-3xl ring-1 ring-border">
        <div className="grid grid-cols-2">
          <div className="p-5">
            <h4 className="text-sm font-bold text-muted-foreground">مدرّس خصوصي</h4>
            <p className="mt-1 font-display text-3xl font-extrabold text-muted-foreground">
              600₪<span className="text-base font-medium"> / شهر</span>
            </p>
          </div>
          <div className="bg-lime p-5">
            <h4 className="text-sm font-bold">خطوة</h4>
            <p className="mt-1 font-display text-3xl font-extrabold">
              99₪<span className="text-base font-medium"> / شهر</span>
            </p>
          </div>
        </div>
        {rows.map(([them, us]) => (
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
  );
}

function ReviewsBody() {
  const reviews = [
    { q: 'ابني صار يحلّ الرياضيات لحاله وبثقة. أحسن استثمار عملناه.', n: 'أم محمد', c: 'حيفا' },
    { q: 'وفّرنا مصاريف المدرّس، والنتائج تحسّنت بشكل ملحوظ.', n: 'أبو سامي', c: 'الناصرة' },
    { q: 'المساعد صبور ما بيملّ — بنتي بتحبّ تتعلّم عليه.', n: 'أم ليان', c: 'كفر قاسم' },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {reviews.map((t) => (
        <figure key={t.n} className="rounded-3xl bg-secondary/70 p-5 ring-1 ring-border">
          <div className="mb-3 flex gap-0.5 text-gold" aria-label="5 من 5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <blockquote className="leading-relaxed">«{t.q}»</blockquote>
          <figcaption className="mt-4 text-sm">
            <span className="font-bold">{t.n}</span>
            <span className="text-muted-foreground"> · {t.c}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function StartBody({ freeLimit }: { freeLimit: number }) {
  return (
    <div className="space-y-5 text-center">
      <p className="mx-auto max-w-md text-lg text-muted-foreground">
        أول درس من كل وحدة مجاني بالكامل — بدون بطاقة ائتمان. جرّب وشوف بنفسك.
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-sm font-bold">
        <span className="flex items-center gap-1.5 rounded-full bg-primary-light px-4 py-1.5"><Clock className="h-4 w-4 text-primary" /> متاح 24/7</span>
        <span className="flex items-center gap-1.5 rounded-full bg-primary-light px-4 py-1.5"><MessageCircle className="h-4 w-4 text-primary" /> بلهجتك</span>
        <span className="flex items-center gap-1.5 rounded-full bg-primary-light px-4 py-1.5"><HeartHandshake className="h-4 w-4 text-primary" /> صبور ما بيملّ</span>
      </div>
      <Link href="/register" className="inline-block">
        <Button variant="gradient" size="lg">
          ابدأ مجاناً الآن <ArrowLeft />
        </Button>
      </Link>
      <p className="text-xs text-muted-foreground">الباقة المجانية: {freeLimit} أسئلة يومياً للمساعد الذكي</p>
    </div>
  );
}
