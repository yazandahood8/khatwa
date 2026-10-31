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
        {/* صفحة اليوم — today's page in the notebook */}
        <section className="paper-grid margin-rule animate-fade-slide-up rounded-md border border-border bg-card py-6 pe-5 shadow-sheet sm:py-8 sm:pe-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="space-y-3">
              <p className="relative text-sm text-muted-foreground" suppressHydrationWarning>
                <span aria-hidden className="margin-gutter font-mono text-xs text-margin" suppressHydrationWarning>
                  {new Date().getDate()}
                </span>
                {today}
              </p>
              <h1 className="font-display text-3xl font-bold leading-tight sm:text-[2.5rem]">
                أهلاً يا <span className="marker">{firstName || 'صديقي'}</span>
              </h1>
              <p className="max-w-md text-muted-foreground">
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

            {/* هدف اليوم — today's goal as five step boxes */}
            <GoalSteps done={todayDone} total={DAILY_GOAL} loading={loading} />
          </div>
        </section>

        {/* الإحصائيات — stats ledger */}
        <section
          aria-label="الإحصائيات"
          className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4"
        >
          <StatCell loading={loading} icon={BookOpen} value={stats?.week.completedLessons ?? data?.completedCount ?? 0} label="دروس هذا الأسبوع" />
          <StatCell loading={loading} icon={CheckCircle2} value={stats?.problemsSolved ?? 0} label="مسائل محلولة" />
          <StatCell loading={loading} icon={Flame} value={stats?.streak ?? 0} label="أيام متواصلة" />
          <StatCell loading={loading} icon={Star} value={stats?.points ?? 0} label="نقطة" />
        </section>

        {/* استمرار التعلّم — continue learning (most prominent) */}
        <section className="space-y-4">
          <SectionTitle>استمر من حيث توقّفت</SectionTitle>
          {loading ? (
            <Skeleton className="h-40 rounded-md" />
          ) : data?.lastLesson ? (
            <ContinueCard lesson={data.lastLesson} />
          ) : (
            <Card className="border-dashed border-foreground/25 shadow-none">
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-md border-[1.5px] border-foreground text-foreground shadow-[0_3px_0_0_hsl(var(--foreground))]">
                  <BookOpen className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold">ابدأ رحلتك التعليمية</p>
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
        <nav aria-label="روابط سريعة" className="divide-y divide-border overflow-hidden rounded-md border border-border bg-card">
          <QuickLink href="/courses" icon={BookOpen} title="كل الدروس" desc="تصفّح المواد والمواضيع" />
          <QuickLink href="/progress" icon={TrendingUp} title="تقدّمي والإنجازات" desc="نقاطك وأوسمتك وإحصاءاتك" />
        </nav>
      </div>
    </AppShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-xl font-semibold">
      <span aria-hidden className="h-[3px] w-6 rounded-sm bg-margin" />
      {children}
    </h2>
  );
}

/** هدف اليوم — one box per problem; solved boxes are inked in with a tick. */
function GoalSteps({ done, total, loading }: { done: number; total: number; loading: boolean }) {
  return (
    <div className="shrink-0">
      <p className="mb-2.5 flex items-baseline justify-between gap-6 text-sm">
        <span className="font-semibold">هدف اليوم</span>
        <span className="font-mono text-muted-foreground">
          {loading ? '—' : done}/{total}
        </span>
      </p>
      <ol className="flex gap-1.5" aria-label={`هدف اليوم: ${done} من ${total} مسائل محلولة`}>
        {Array.from({ length: total }).map((_, i) => {
          const filled = !loading && i < done;
          return (
            <li
              key={i}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-md border-[1.5px] font-mono text-sm transition-all duration-300',
                filled
                  ? 'border-foreground bg-foreground text-background shadow-[0_3px_0_0_hsl(var(--primary))]'
                  : 'border-dashed border-foreground/30 bg-card text-muted-foreground',
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {filled ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-muted-foreground">مسائل محلولة</p>
    </div>
  );
}

function StatCell({
  icon: Icon,
  value,
  label,
  loading,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 bg-card p-5">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </p>
      {loading ? (
        <Skeleton className="h-9 w-16 rounded-sm" />
      ) : (
        <p className="font-display text-4xl font-bold leading-none">{value.toLocaleString('ar')}</p>
      )}
    </div>
  );
}

function ContinueCard({ lesson }: { lesson: NonNullable<StudentDashboard['lastLesson']> }) {
  const total = (lesson.durationMinutes ?? 0) * 60;
  const pct = total > 0 ? Math.min(100, Math.round((lesson.watchTimeSeconds / total) * 100)) : 0;
  return (
    <Card interactive className="group overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* غلاف الفيديو — video thumbnail */}
        <div className="gradient-primary relative grid aspect-video w-full place-items-center sm:aspect-auto sm:w-60">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-card text-foreground shadow-[0_3px_0_0_hsl(var(--margin))] transition-transform duration-200 group-hover:scale-105">
            <Play className="h-6 w-6 translate-x-[-1px] fill-current" />
          </span>
          <span className="absolute bottom-3 start-3 font-mono text-xs text-white/60">{pct}%</span>
        </div>
        <CardContent className="flex flex-1 flex-col justify-between gap-4 p-6">
          <div className="space-y-1.5">
            <Badge variant="default" size="sm">
              {lesson.topicName}
            </Badge>
            <h3 className="font-display text-2xl font-semibold">{lesson.title}</h3>
            <div className="flex items-center gap-3 pt-1">
              <Progress value={pct} className="max-w-xs" />
              <span className="shrink-0 text-sm font-medium text-muted-foreground">{pct}%</span>
            </div>
          </div>
          <Link href={`/lessons/${lesson.id}`} className="self-start">
            <Button variant="gradient" size="lg">
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
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} className="group flex items-center gap-4 p-5 transition-colors duration-200 hover:bg-muted/60">
      <Icon className="h-5 w-5 shrink-0 text-primary" />
      <div className="flex-1">
        <p className="font-display text-lg font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <ArrowLeft className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-foreground" />
    </Link>
  );
}
