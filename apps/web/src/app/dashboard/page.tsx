'use client';

import { useAuth } from '@/providers/auth-provider';
import { DashboardHeader } from '@/components/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentDashboard() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-2 text-2xl font-bold">
          {loading ? 'جارٍ التحميل…' : `أهلاً ${user?.name ?? ''}! 👋`}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {user?.grade ? `صف ${user.grade}${user.level ? ` · ${user.level}` : ''}` : 'لوحة الطالب'}
        </p>

        <Card>
          <CardHeader>
            <CardTitle>ابدأ التعلّم</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            الدروس والمسائل ستظهر هنا قريباً (Sprint 4 وما بعده). الآن، حسابك جاهز ومصادقتك تعمل ✅
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
