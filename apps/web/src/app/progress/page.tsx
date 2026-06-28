'use client';

import { useEffect, useState } from 'react';
import { getFullProgress, type StudentStats } from '@/lib/progress-api';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatsView } from '@/components/progress/stats-view';

export default function ProgressPage() {
  const [stats, setStats] = useState<StudentStats | null>(null);

  useEffect(() => {
    getFullProgress().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">تقدّمي 📈</h1>
        {stats ? (
          <StatsView stats={stats} />
        ) : (
          <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>
        )}
      </main>
    </div>
  );
}
