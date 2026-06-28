'use client';

import { useAuth } from '@/providers/auth-provider';
import { DashboardHeader } from '@/components/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-2xl font-bold">
          {loading ? 'جارٍ التحميل…' : `لوحة الإدارة — ${user?.name ?? ''}`}
        </h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {['الطلاب', 'الدروس', 'المسائل'].map((label) => (
            <Card key={label}>
              <CardHeader>
                <CardTitle className="text-base">{label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                الإدارة الكاملة تأتي في السبرينتات القادمة.
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
