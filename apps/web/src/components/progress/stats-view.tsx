'use client';

import type { StudentStats } from '@/lib/progress-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-2xl">{icon}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

export function StatsView({ stats }: { stats: StudentStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="النقاط" value={stats.points} icon="⭐" />
        <Stat label="أيام متواصلة" value={`${stats.streak} 🔥`} icon="🔥" />
        <Stat label="دروس مكتملة" value={stats.completedLessons} icon="🎬" />
        <Stat label="دقة الحلول" value={`${stats.accuracy}%`} icon="🎯" />
      </div>

      {/* الإنجازات — badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">الإنجازات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.badges.map((b) => (
              <div
                key={b.key}
                className={cn(
                  'rounded-lg border p-3 text-center',
                  b.earned ? 'border-primary bg-primary/5' : 'opacity-40 grayscale',
                )}
              >
                <p className="text-3xl">{b.icon}</p>
                <p className="text-xs font-medium">{b.label}</p>
                {!b.earned && <p className="text-[10px] text-muted-foreground">مقفل</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل — details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">هذا الأسبوع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>📚 دروس مكتملة: {stats.week.completedLessons}</p>
            <p>✏️ مسائل محلولة: {stats.week.problemsSolved}</p>
            <p>⏱️ وقت الدراسة الكلي: {stats.studyMinutes} دقيقة</p>
            <p>🏆 أفضل سلسلة: {stats.bestStreak} أيام</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">المسائل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>✅ محلولة: {stats.problemsSolved} من {stats.problemsAttempted}</p>
            <p>🥇 من أول محاولة: {stats.firstTrySolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* يحتاج مراجعة — needs review */}
      {stats.difficult.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">يحتاج مراجعة (تعثّر فيها)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {stats.difficult.map((d) => (
                <li key={d.problemId} className="flex items-center justify-between text-sm" dir="auto">
                  <span className="truncate">⚠️ {d.question}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{d.attempts} محاولات</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
