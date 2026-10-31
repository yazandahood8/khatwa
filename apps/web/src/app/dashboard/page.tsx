'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, BookOpen, CheckCircle2, Flame, Star, ArrowLeft, Check, TrendingUp } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { getStudentDashboard, type StudentDashboard } from '@/lib/content-api';
import { getFullProgress, type StudentStats } from '@/lib/progress-api';
import { AppShell } from '@/components/app-shell';
import { studentNav } from '@/components/nav-items';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Blob, DotGrid, Ring, Sparkle } from '@/components/decor';
import { cn } from '@/lib/utils';

const DAILY_GOAL = 5; // مسائل اليوم — daily problem goal

export default function StudentDashboardPage() {
  const { user } = useAuth();
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
  const firstName = (user?.name ?? '').split(' ')[0];
  const today = new Date().toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <AppShell nav={studentNav} title="لوحتي">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* بطاقة اليوم — today's hero card (bright blue) */}
        <section className="gradient-primary animate-fade-slide-up relative overflow-hidden rounded-[2rem] p-6 text-white shadow-float sm:p-9">
          <Blob className="-start-20 -bottom-24 h-80 w-80 opacity-15" color="white" />
          <Ring className="-end-14 -top-14 h-48 w-48" color="hsl(0 0% 100% / 0.14)" />
          <DotGrid tone="white" className="end-1/3 top-5 hidden h-16 w-28 opacity-50 sm:block" />
          <Sparkle className="end-10 bottom-8 h-7 w-7 animate-float" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="space-y-3">
              <p className="text-sm font-medium text-white/85" suppressHydrationWarning>
                {today}
              </p>
              <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl">
                أهلاً يا <span className="marker !text-foreground">{firstName || 'صديقي'}</span>
              </h1>
              <p className="max-w-md text-white/90">
                {todayDone >= DAILY_GOAL
                  ? 'أنجزت هدف اليوم — أنت بطل! واصل التقدّم.'
                  : `حُلّ ${DAILY_GOAL - todayDone} مسائل أخرى لتُكمل هدف اليوم.`}
              </p>
              {stats && stats.streak > 0 && (
                <Badge variant="streak" size="lg" className="mt-1">
                  <Flame className="h-4 w-4 animate-fire-pulse" /> {stats.streak} أيام متواصلة
                </Badge>
              )}
            </div>

            {/* هدف اليوم — today's goal as five round steps */}
            <GoalSteps done={todayDone} total={DAILY_GOAL} loading={loading} />
          </div>
        </section>

        {/* الإحصائيات — colorful stat tiles */}
        <section aria-label="الإحصائيات" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCell loading={loading} icon={BookOpen} tone="bg-tint-lavender" value={stats?.week.completedLessons ?? data?.completedCount ?? 0} label="دروس هذا الأسبوع" />
          <StatCell loading={loading} icon={CheckCircle2} tone="bg-lime-light" value={stats?.problemsSolved ?? 0} label="مسائل محلولة" />
          <StatCell loading={loading} icon={Flame} tone="bg-tint-pink" value={stats?.streak ?? 0} label="أيام متواصلة" />
          <StatCell loading={loading} icon={Star} tone="bg-tint-sun" value={stats?.points ?? 0} label="نقطة" />
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* استمرار التعلّم — continue learning (most prominent) */}
          <section className="space-y-4">
            <SectionTitle>استمر من حيث توقّفت</SectionTitle>
            {loading ? (
              <Skeleton className="h-48 rounded-3xl" />
            ) : data?.lastLesson ? (
              <ContinueCard lesson={data.lastLesson} />
            ) : (
              <Card className="rounded-3xl border-2 border-dashed border-primary/30 bg-primary-light/40 shadow-none">
                <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow-primary">
                    <BookOpen className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-extrabold">ابدأ رحلتك التعليمية</p>
                    <p className="text-sm text-muted-foreground">اختر درسك الأول وانطلق خطوة بخطوة.</p>
                  </div>
                  <Link href="/courses">
                    <Button variant="gradient">تصفّح الدروس</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </section>

          {/* روابط سريعة — quick links */}
          <section className="space-y-4">
            <SectionTitle>روابط سريعة</SectionTitle>
            <nav aria-label="روابط سريعة" className="space-y-3">
              <QuickLink href="/courses" icon={BookOpen} tone="bg-primary text-primary-foreground" title="كل الدروس" desc="تصفّح المواد والمواضيع" />
              <QuickLink href="/progress" icon={TrendingUp} tone="bg-lime text-foreground" title="تقدّمي والإنجازات" desc="نقاطك وأوسمتك وإحصاءاتك" />
            </nav>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold">
      <span aria-hidden className="h-3 w-3 rounded-full bg-lime ring-4 ring-lime/30" />
      {children}
    </h2>
  );
}

/** هدف اليوم — one round step per problem; solved steps fill with lime and a tick. */
function GoalSteps({ done, total, loading }: { done: number; total: number; loading: boolean }) {
  return (
    <div className="shrink-0 rounded-3xl bg-white/15 p-4 backdrop-blur-sm">
      <p className="mb-2.5 flex items-baseline justify-between gap-6 text-sm">
        <span className="font-bold">هدف اليوم</span>
        <span className="font-mono text-white/85">
          {loading ? '—' : done}/{total}
        </span>
      </p>
      <ol className="flex gap-2" aria-label={`هدف اليوم: ${done} من ${total} مسائل محلولة`}>
        {Array.from({ length: total }).map((_, i) => {
          const filled = !loading && i < done;
          return (
            <li
              key={i}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-full font-display text-sm font-bold transition-all duration-300',
                filled
                  ? 'bg-lime text-foreground shadow-[0_3px_0_0_hsl(var(--lime-dark))]'
                  : 'border-2 border-dashed border-white/50 text-white/80',
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {filled ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-white/80">مسائل محلولة</p>
    </div>
  );
}

function StatCell({
  icon: Icon,
  value,
  label,
  loading,
  tone,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  loading: boolean;
  tone: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4 rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1', tone)}>
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-card text-primary shadow-subtle">
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </p>
      {loading ? (
        <Skeleton className="h-10 w-16 rounded-xl" />
      ) : (
        <p className="font-display text-5xl font-extrabold leading-none">{value.toLocaleString('ar')}</p>
      )}
    </div>
  );
}

function ContinueCard({ lesson }: { lesson: NonNullable<StudentDashboard['lastLesson']> }) {
  const total = (lesson.durationMinutes ?? 0) * 60;
  const pct = total > 0 ? Math.min(100, Math.round((lesson.watchTimeSeconds / total) * 100)) : 0;
  return (
    <Card interactive className="group overflow-hidden rounded-3xl">
      <div className="flex flex-col sm:flex-row">
        {/* غلاف الفيديو — video thumbnail */}
        <div className="gradient-primary relative grid aspect-video w-full place-items-center sm:aspect-auto sm:w-60">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-lime text-foreground shadow-glow-lime transition-transform duration-300 group-hover:scale-110">
            <Play className="h-6 w-6 translate-x-[-1px] fill-current" />
          </span>
          <span className="absolute bottom-3 start-3 rounded-full bg-black/20 px-2.5 py-0.5 font-mono text-xs text-white">{pct}%</span>
        </div>
        <CardContent className="flex flex-1 flex-col justify-between gap-4 p-6">
          <div className="space-y-2">
            <Badge variant="default" size="sm">
              {lesson.topicName}
            </Badge>
            <h3 className="font-display text-2xl font-extrabold">{lesson.title}</h3>
            <div className="flex items-center gap-3 pt-1">
              <Progress value={pct} className="max-w-xs" />
              <span className="shrink-0 text-sm font-bold text-muted-foreground">{pct}%</span>
            </div>
          </div>
          <Link href={`/lessons/${lesson.id}`} className="self-start">
            <Button size="lg">
              <Play className="fill-current" /> كمّل الدرس
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  desc,
  tone,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
    >
      <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', tone)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="font-display text-lg font-bold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <ArrowLeft className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
