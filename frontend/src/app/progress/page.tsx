'use client';

import { useEffect, useState } from 'react';
import { getFullProgress, type StudentStats } from '@/lib/progress-api';
import { AppShell } from '@/components/app-shell';
import { studentNav } from '@/components/nav-items';
import { StatsView } from '@/components/progress/stats-view';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProgressPage() {
  const [stats, setStats] = useState<StudentStats | null>(null);

  useEffect(() => {
    getFullProgress().then(setStats).catch(() => {});
  }, []);

  return (
    <AppShell nav={studentNav} title="تقدّمي">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">تقدّمي 📈</h1>
          <p className="text-muted-foreground">نقاطك وأوسمتك ورحلتك خطوة بخطوة.</p>
        </div>
        {stats ? (
          <StatsView stats={stats} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-48 rounded-xl" />
          </div>
        )}
      </div>
    </AppShell>
  );
}
