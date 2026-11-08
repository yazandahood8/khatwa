'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, ChevronLeft, Play, Sparkles, Star } from 'lucide-react';
import { getStudentDashboard, type StudentDashboard } from '@/lib/content-api';
import { getFullProgress, type StudentStats } from '@/lib/progress-api';
import { AppShell } from '@/components/app-shell';
import { studentNav } from '@/components/nav-items';
import { DashArt } from '@/components/dashboard-art';
import { CircularProgress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const DAILY_GOAL = 5; // مسائل اليوم — daily problem goal

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getStudentDashboard(), getFullProgress()])
      .then(([d, s]) => {
        if (d.status === 'fulfilled') setData(d.value);
        else setData({ lastLesson: null, completedCount: 0, inProgressCount: 0 });
        if (s.status === 'fulfilled') setStats(s.value);
      })
      .finally(() => setLoading(false));
  }, []);

  const todayDone = Math.min(stats?.today.problemsSolved ?? 0, DAILY_GOAL);

  return (
    <AppShell nav={studentNav} title="لوحتي">
      <div className="mx-auto grid max-w-7xl gap-3.5 lg:grid-cols-12">
        {/* الترحيب — welcome banner */}
        <section className="animate-fade-slide-up relative min-h-[11rem] overflow-hidden rounded-xl bg-gradient-to-l from-primary/20 via-primary-light to-primary/15 p-4 shadow-sheet ring-1 ring-primary/10 lg:col-span-12">
          {/* soft circles, like the mock */}
          <span aria-hidden className="pointer-events-none absolute -bottom-16 left-4 hidden h-44 w-44 rounded-full bg-white/60 md:block" />
          <span aria-hidden className="pointer-events-none absolute -top-12 left-[38%] hidden h-28 w-28 rounded-full bg-white/50 md:block" />
          <DashArt name="hero-sparkles" className="absolute right-[14%] top-1 hidden h-auto w-[20%] max-w-[13rem] md:block" />
          <DashArt name="hero-plane-trail" className="absolute left-[17%] top-0 hidden h-auto w-[22%] max-w-[14rem] md:block" />
          <DashArt name="hero-girl" className="absolute -bottom-[22%] left-1 hidden h-[118%] w-auto max-w-none md:block" />
          <DashArt name="hero-trophy" className="absolute -bottom-1 right-2 hidden h-[88%] w-auto max-w-none md:block" />
          <div className="relative mx-auto flex flex-col items-center gap-1.5 py-2 text-center md:w-[52%]">
            <h2 className="font-display text-[clamp(1.25rem,2vw,2.1rem)] font-extrabold leading-tight text-foreground">
              ابدأ رحلتك التعليمية
            </h2>
            <p className="text-base text-foreground/80">اختر درسك الأول وانطلق خطوة بخطوة</p>
            <Link
              href="/courses"
              className="mt-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-lime px-6 font-display text-sm font-bold text-foreground shadow-glow-lime transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-[3px] active:shadow-none"
            >
              تصفّح الدروس <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* نسبتك في التعلّم — learning ratio */}
        <section className="animate-fade-slide-up flex flex-col items-center justify-center gap-2 rounded-xl bg-white p-4 text-center shadow-sheet ring-1 ring-primary/10 [animation-delay:80ms] lg:col-span-4 lg:row-span-2">
          <p className="flex items-center gap-2 font-display text-base font-extrabold">
            <Sparkles className="h-4 w-4 text-gold" /> نسبتك في التعلّم
          </p>
          {loading ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : (
            <CircularProgress value={stats?.accuracy ?? 0} size={104} stroke={10}>
              <span className="font-display text-xl font-extrabold">{stats?.accuracy ?? 0}%</span>
            </CircularProgress>
          )}
          <p className="text-xs font-semibold text-foreground/80">
            {loading ? '—' : `${(stats?.problemsSolved ?? 0).toLocaleString('ar')} من ${(stats?.problemsAttempted ?? 0).toLocaleString('ar')} سؤال`}
          </p>
        </section>

        {/* روابط سريعة — quick links */}
        <nav aria-label="روابط سريعة" className="animate-fade-slide-up grid gap-3.5 [animation-delay:120ms] sm:grid-cols-2 lg:col-span-8">
          <QuickCard href="/courses" art="card-book" tone="from-lime-light to-white" title="كل الدروس" desc="تصفّح المواد والمواضيع" />
          <QuickCard href="/progress" art="card-trophy" tone="from-tint-lavender to-white" title="تقدّمي والإنجازات" desc="نقاطك وأوسمتك وإحصاءاتك" />
        </nav>

        {/* الإحصائيات — stats */}
        <section aria-label="الإحصائيات" className="animate-fade-slide-up grid grid-cols-2 gap-3.5 [animation-delay:160ms] sm:grid-cols-4 lg:col-span-8">
          <StatCell loading={loading} icon={Play} filled tone="bg-primary-light" iconTone="text-primary" value={stats?.week.completedLessons ?? data?.completedCount ?? 0} label="دروس هذا الأسبوع" />
          <StatCell loading={loading} icon={CheckCircle2} tone="bg-tint-lavender" iconTone="text-primary" value={stats?.problemsSolved ?? 0} label="مسائل محلولة" />
          <StatCell loading={loading} icon={CalendarDays} tone="bg-lime-light" iconTone="text-success" value={stats?.streak ?? 0} label="أيام متواصلة" />
          <StatCell loading={loading} icon={Star} filled tone="bg-tint-sun" iconTone="text-gold" value={stats?.points ?? 0} label="نقطة" />
        </section>

        {/* هدف اليوم — daily goal */}
        <GoalBar done={todayDone} total={DAILY_GOAL} loading={loading} />

        {/* استمرار التعلّم — continue learning */}
        <ContinueBanner loading={loading} lesson={data?.lastLesson ?? null} />
      </div>
    </AppShell>
  );
}

function GoalBar({ done, total, loading }: { done: number; total: number; loading: boolean }) {
  const pct = Math.round((done / total) * 100);
  return (
    <section
      aria-label="هدف اليوم"
      className="animate-fade-slide-up flex flex-col gap-2.5 rounded-xl bg-white p-3 shadow-sheet ring-1 ring-primary/10 [animation-delay:200ms] sm:flex-row sm:items-center sm:gap-4 lg:col-span-12"
    >
      <div className="flex items-center gap-2.5">
        <DashArt name="goal-target" className="h-9 w-9 shrink-0" />
        <div>
          <p className="font-display text-base font-extrabold">هدف اليوم</p>
          <p className="text-[11px] text-muted-foreground">أجب على {total.toLocaleString('ar')} أسئلة</p>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-4">
        <span className="rounded-full bg-primary-light px-3 py-1 font-mono text-sm font-bold text-primary" dir="ltr">
          {loading ? '—' : done} / {total}
        </span>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-primary-light">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-700 motion-reduce:transition-none"
            style={{ width: `${loading ? 0 : pct}%` }}
          />
        </div>
      </div>

      <ol dir="ltr" className="flex gap-2" aria-label={`هدف اليوم: ${done} من ${total} مسائل محلولة`}>
        {Array.from({ length: total }).map((_, i) => {
          const filled = !loading && i < done;
          return (
            <li
              key={i}
              className={cn(
                'grid h-7 w-7 place-items-center rounded-lg font-display text-xs font-bold transition-all duration-300',
                filled ? 'bg-primary text-primary-foreground shadow-glow-primary' : 'bg-primary-light text-primary',
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {(i + 1).toLocaleString('ar')}
            </li>
          );
        })}
      </ol>

      <DashArt name="goal-star" className="hidden h-10 w-10 shrink-0 lg:block" />
    </section>
  );
}

function ContinueBanner({ loading, lesson }: { loading: boolean; lesson: StudentDashboard['lastLesson'] }) {
  const total = (lesson?.durationMinutes ?? 0) * 60;
  const pct = lesson && total > 0 ? Math.min(100, Math.round((lesson.watchTimeSeconds / total) * 100)) : 0;
  const href = lesson ? `/lessons/${lesson.id}` : '/courses';

  return (
    <section
      aria-label="استمر من حيث توقّفت"
      className="animate-fade-slide-up relative flex flex-col gap-2.5 overflow-hidden rounded-xl bg-primary-light/60 p-3 shadow-sheet ring-1 ring-primary/10 [animation-delay:240ms] sm:flex-row sm:items-center sm:justify-between lg:col-span-12"
    >
      <DashArt name="continue-laptop" className="pointer-events-none absolute start-1/2 top-1/2 hidden h-16 w-auto -translate-x-1/2 -translate-y-1/2 md:block rtl:translate-x-1/2" />

      <div className="relative min-w-0 space-y-1">
        <h2 className="font-display text-base font-extrabold">استمر من حيث توقّفت</h2>
        {loading ? (
          <Skeleton className="h-5 w-48" />
        ) : lesson ? (
          <>
            <p className="truncate text-sm text-foreground/80">
              {lesson.topicName} · {lesson.title}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="h-2.5 w-48 max-w-full overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-bold text-muted-foreground">{pct.toLocaleString('ar')}%</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-foreground/80">ابدأ رحلتك التعليمية — اختر درسك الأول وانطلق خطوة بخطوة.</p>
        )}
      </div>

      <Link
        href={href}
        className="relative inline-flex h-9 shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-primary px-5 font-display text-xs font-bold text-primary-foreground shadow-glow-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark active:translate-y-[3px] active:shadow-none sm:self-center"
      >
        {lesson ? 'متابعة الدرس' : 'تصفّح الدروس'} <ChevronLeft className="h-5 w-5" />
      </Link>
    </section>
  );
}

function StatCell({
  icon: Icon,
  value,
  label,
  loading,
  tone,
  iconTone,
  filled = false,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  loading: boolean;
  tone: string;
  iconTone: string;
  /** solid shapes (play, star) fill in; outlined icons (check, calendar) must not, or their details vanish */
  filled?: boolean;
}) {
  return (
    <div className={cn('flex flex-col items-center gap-1 rounded-xl p-3 text-center ring-1 ring-primary/10 transition-transform duration-300 hover:-translate-y-1', tone)}>
      <Icon className={cn('h-5 w-5', iconTone)} fill={filled ? 'currentColor' : 'none'} strokeWidth={filled ? 1.5 : 2} />
      {loading ? (
        <Skeleton className="h-6 w-8 rounded-xl" />
      ) : (
        <p className="font-display text-xl font-extrabold leading-none">{value.toLocaleString('ar')}</p>
      )}
      <p className="text-[11px] font-semibold text-foreground/80">{label}</p>
    </div>
  );
}

function QuickCard({
  href,
  art,
  title,
  desc,
  tone,
}: {
  href: string;
  art: string;
  title: string;
  desc: string;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-h-[5.5rem] items-center justify-between gap-2 overflow-hidden rounded-xl bg-gradient-to-l p-3 shadow-sheet ring-1 ring-primary/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-float',
        tone,
      )}
    >
      <div className="relative min-w-0">
        <p className="font-display text-base font-extrabold leading-tight">{title}</p>
        <p className="mt-0.5 text-[11px] text-foreground/70">{desc}</p>
      </div>
      <DashArt name={art} className="h-14 w-14 shrink-0 transition-transform duration-300 group-hover:scale-105" />
      <span className="absolute bottom-2 left-2 grid h-6 w-6 place-items-center rounded-full bg-white text-foreground shadow-card transition-transform duration-200 group-hover:-translate-x-1">
        <ChevronLeft className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
