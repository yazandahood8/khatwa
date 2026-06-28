'use client';

import { useEffect, useState } from 'react';
import { getAdminAnalytics, type AdminAnalytics } from '@/lib/progress-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function Metric({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
          <span>{icon}</span>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminAnalyticsPage() {
  const [a, setA] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    getAdminAnalytics().then(setA).catch(() => {});
  }, []);

  if (!a) return <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الإحصائيات 📈</h1>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Metric label="إجمالي الطلاب" value={a.students} icon="👥" />
        <Metric label="نشطون اليوم" value={a.activeToday} icon="🟢" />
        <Metric label="مشتركون مدفوعون" value={a.paid} icon="💎" />
        <Metric label="معدّل التحويل" value={`${a.conversion}%`} icon="📊" />
        <Metric label="الدروس" value={a.lessons} icon="🎬" />
        <Metric label="المسائل" value={a.problems} icon="✏️" />
        <Metric label="محاولات الحل" value={a.attempts} icon="🧮" />
        <Metric label="جلسات الذكاء الاصطناعي" value={a.aiSessions} icon="🤖" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">توزيع الباقات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>🆓 مجاني: {a.planCounts.free ?? 0}</p>
            <p>⭐ أساسي: {a.planCounts.basic ?? 0}</p>
            <p>🚀 بريميوم: {a.planCounts.premium ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">تكلفة الذكاء الاصطناعي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>🔢 إجمالي الـ Tokens: {a.aiTokens.toLocaleString()}</p>
            <p>💵 تكلفة تقريبية: ${a.aiCostUsd}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
