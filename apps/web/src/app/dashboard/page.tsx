'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, BookOpen, CheckCircle2, Flame, Star, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { getStudentDashboard, type StudentDashboard } from '@/lib/content-api';
import { getFullProgress, type StudentStats } from '@/lib/progress-api';
import { AppShell } from '@/components/app-shell';
import { studentNav } from '@/components/nav-items';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress, CircularProgress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

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
  const goalPct = (todayDone / DAILY_GOAL) * 100;
  const firstName = (user?.name ?? '').split(' ')[0];

  return (
    <AppShell nav={studentNav} title="لوحتي">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* لافتة الترحيب — hero banner */}
        <section className="animate-fade-slide-up overflow-hidden rounded-2xl gradient-primary p-6 text-white shadow-glow-primary sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold sm:text-[28px]">
                أهلاً يا {firstName || 'صديقي'}! 👋
              </h1>
              <p className="max-w-md text-white/80">
                {todayDone >= DAILY_GOAL
                  ? 'أنجزت هدف اليوم — أنت بطل! واصل التقدّم 🚀'
                  : `حُلّ ${DAILY_GOAL - todayDone} مسائل أخرى لتُكمل هدف اليوم.`}
              </p>
              {stats && stats.streak > 0 && (
                <Badge variant="streak" size="lg" className="mt-1">
                  <Flame className="h-4 w-4 animate-fire-pulse" /> {stats.streak} أيام متواصلة
                </Badge>
              )}
            </div>

            {/* هدف اليوم — today's goal ring */}
            <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <CircularProgress value={goalPct} size={84} stroke={9}>
                <span className="text-lg text-white">
                  {todayDone}
                  <span className="text-white/60">/{DAILY_GOAL}</span>
                </span>
              </CircularProgress>
              <div className="text-sm">
                <p className="font-semibold">هدف اليوم</p>
                <p className="text-white/70">مسائل محلولة</p>
              </div>
            </div>
          </div>
        </section>

        {/* الإحصائيات — stats row */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          ) : (
            <>
              <StatCard icon={BookOpen} tint="primary" value={stats?.week.completedLessons ?? data?.completedCount ?? 0} label="دروس هذا الأسبوع" />
              <StatCard icon={CheckCircle2} tint="success" value={stats?.problemsSolved ?? 0} label="مسائل محلولة" />
              <StatCard icon={Flame} tint="gold" value={stats?.streak ?? 0} label="أيام متواصلة" />
              <StatCard icon={Star} tint="gold" value={stats?.points ?? 0} label="نقطة" />
            </>
          )}
        </section>

        {/* استمرار التعلّم — continue learning (most prominent) */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">استمر من حيث توقّفت</h2>
          {loading ? (
            <Skeleton className="h-40 rounded-2xl" />
          ) : data?.lastLesson ? (
            <ContinueCard lesson={data.lastLesson} />
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary-light text-3xl">
                  📚
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">ابدأ رحلتك التعليمية</p>
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
        <section className="grid gap-4 sm:grid-cols-2">
          <QuickLink href="/courses" icon="📚" title="كل الدروس" desc="تصفّح المواد والمواضيع" />
          <QuickLink href="/progress" icon="📈" title="تقدّمي والإنجازات" desc="نقاطك وأوسمتك وإحصاءاتك" />
        </section>
      </div>
    </AppShell>
  );
}

const TINTS = {
  primary: 'bg-primary-light text-primary',
  success: 'bg-success/10 text-success',
  gold: 'bg-gold-light text-gold-text',
} as const;

function StatCard({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  tint: keyof typeof TINTS;
}) {
  return (
    <Card className="gradient-stat">
      <CardContent className="flex flex-col gap-3 p-5">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${TINTS[tint]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-3xl font-bold leading-none">{value.toLocaleString('ar')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ContinueCard({ lesson }: { lesson: NonNullable<StudentDashboard['lastLesson']> }) {
  const total = (lesson.durationMinutes ?? 0) * 60;
  const pct = total > 0 ? Math.min(100, Math.round((lesson.watchTimeSeconds / total) * 100)) : 0;
  return (
    <Card interactive className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* غلاف الفيديو — video thumbnail */}
        <div className="relative grid aspect-video w-full place-items-center gradient-primary sm:aspect-auto sm:w-56">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/25 backdrop-blur-sm">
            <Play className="h-6 w-6 fill-white text-white" />
          </span>
        </div>
        <CardContent className="flex flex-1 flex-col justify-between gap-4 p-6">
          <div className="space-y-1.5">
            <Badge variant="default" size="sm">
              {lesson.topicName}
            </Badge>
            <h3 className="font-display text-xl font-semibold">{lesson.title}</h3>
            <div className="flex items-center gap-3 pt-1">
              <Progress value={pct} className="max-w-xs" />
              <span className="shrink-0 text-sm font-medium text-muted-foreground">{pct}%</span>
            </div>
          </div>
          <Link href={`/lessons/${lesson.id}`} className="self-start">
            <Button variant="gradient" size="lg">
              <Play className="fill-white" /> كمّل الدرس
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
}

function QuickLink({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link href={href}>
      <Card interactive className="group">
        <CardContent className="flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-light text-2xl">
            {icon}
          </span>
          <div className="flex-1">
            <p className="font-display font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
          <ArrowLeft className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
        </CardContent>
      </Card>
    </Link>
  );
}
