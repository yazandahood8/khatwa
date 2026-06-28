'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { getStudentDashboard, type StudentDashboard } from '@/lib/content-api';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboard | null>(null);

  useEffect(() => {
    getStudentDashboard()
      .then(setData)
      .catch(() => setData({ lastLesson: null, completedCount: 0, inProgressCount: 0 }));
  }, []);

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">أهلاً {user?.name ?? ''}! 👋</h1>

        {/* استمر من حيث توقفت — continue where you left off */}
        {data?.lastLesson ? (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">استمر من حيث توقفت</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{data.lastLesson.title}</p>
                <p className="text-sm text-muted-foreground">{data.lastLesson.topicName}</p>
              </div>
              <Link href={`/lessons/${data.lastLesson.id}`}>
                <Button>كمّل الدرس ▶️</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <span className="text-muted-foreground">ابدأ رحلتك التعليمية الآن!</span>
              <Link href="/courses">
                <Button>تصفّح الدروس</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* إحصائيات — stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="دروس مكتملة" value={data?.completedCount} icon="✅" />
          <Stat label="دروس جارية" value={data?.inProgressCount} icon="🔄" />
          <Link href="/courses">
            <Card className="h-full transition-colors hover:bg-accent">
              <CardContent className="flex h-full items-center justify-center gap-2 p-6 font-medium">
                📚 كل الدروس
              </CardContent>
            </Card>
          </Link>
          <Link href="/progress">
            <Card className="h-full transition-colors hover:bg-accent">
              <CardContent className="flex h-full items-center justify-center gap-2 p-6 font-medium">
                📈 تقدّمي والإنجازات
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value?: number; icon: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
          <span>{icon}</span>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value ?? '—'}</p>
      </CardContent>
    </Card>
  );
}
