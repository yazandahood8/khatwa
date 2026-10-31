'use client';

import { Star, Flame, Clapperboard, Target, CheckCircle2, Award, AlertTriangle, Calendar } from 'lucide-react';
import type { StudentStats } from '@/lib/progress-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgress, Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const TOP = [
  { key: 'points', icon: Star, label: 'النقاط', tint: 'bg-gold-light text-gold-text' },
  { key: 'streak', icon: Flame, label: 'أيام متواصلة', tint: 'bg-gold-light text-gold-text' },
  { key: 'completedLessons', icon: Clapperboard, label: 'دروس مكتملة', tint: 'bg-primary-light text-primary' },
] as const;

export function StatsView({ stats }: { stats: StudentStats }) {
  const earned = stats.badges.filter((b) => b.earned).length;
  return (
    <div className="space-y-6">
      {/* البطاقات العليا — top stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TOP.map((s) => (
          <Card key={s.key} className="gradient-stat">
            <CardContent className="flex flex-col gap-3 p-5">
              <span className={cn('grid h-10 w-10 place-items-center rounded-xl', s.tint)}>
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-3xl font-bold leading-none">
                  {(stats[s.key] as number).toLocaleString('ar')}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {/* دقة الحلول — accuracy ring */}
        <Card className="gradient-stat">
          <CardContent className="flex items-center gap-4 p-5">
            <CircularProgress value={stats.accuracy} size={64} stroke={7}>
              <span className="text-sm">{stats.accuracy}%</span>
            </CircularProgress>
            <div>
              <p className="font-display font-semibold">دقة الحلول</p>
              <p className="text-xs text-muted-foreground">
                <Target className="mb-0.5 inline h-3 w-3" /> الإجابات الصحيحة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الإنجازات — achievements */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-gold" /> الإنجازات
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {earned} / {stats.badges.length}
          </span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.badges.map((b) => (
              <div
                key={b.key}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl border p-4 text-center transition-all',
                  b.earned
                    ? 'border-gold bg-gold-light text-gold-text shadow-subtle'
                    : 'border-border bg-muted/30 opacity-50 grayscale',
                )}
              >
                <span className="text-3xl">{b.icon}</span>
                <p className="text-xs font-semibold">{b.label}</p>
                {!b.earned && <p className="text-[10px] text-muted-foreground">مقفل</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل — details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" /> هذا الأسبوع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            <Row icon="📚" label="دروس مكتملة" value={stats.week.completedLessons} />
            <Row icon="✏️" label="مسائل محلولة" value={stats.week.problemsSolved} />
            <Row icon="⏱️" label="وقت الدراسة" value={`${stats.studyMinutes} دقيقة`} />
            <Row icon="🏆" label="أفضل سلسلة" value={`${stats.bestStreak} أيام`} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-success" /> المسائل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">محلولة</span>
                <span className="font-medium">
                  {stats.problemsSolved} / {stats.problemsAttempted}
                </span>
              </div>
              <Progress
                value={stats.problemsAttempted ? (stats.problemsSolved / stats.problemsAttempted) * 100 : 0}
              />
            </div>
            <Row icon="🥇" label="من أول محاولة" value={stats.firstTrySolved} />
          </CardContent>
        </Card>
      </div>

      {/* يحتاج مراجعة — needs review */}
      {stats.difficult.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" /> يحتاج مراجعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.difficult.map((d) => (
                <li
                  key={d.problemId}
                  className="flex items-center justify-between gap-2 rounded-lg bg-warning/5 px-3 py-2 text-sm"
                  dir="auto"
                >
                  <span className="truncate">{d.question}</span>
                  <span className="shrink-0 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                    {d.attempts} محاولات
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">
        <span>{icon}</span>
        {label}
      </span>
      <span className="font-display font-semibold">{value}</span>
    </div>
  );
}
