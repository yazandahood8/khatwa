'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getCurrentSubscription,
  cancelSubscription,
  type CurrentSubscription,
} from '@/lib/subscription-api';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PLAN_LABEL: Record<string, string> = {
  free: 'مجاني',
  basic: 'أساسي (49₪)',
  premium: 'بريميوم (79₪)',
};

export default function SubscriptionSettingsPage() {
  const [sub, setSub] = useState<CurrentSubscription | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => getCurrentSubscription().then(setSub).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  async function doCancel() {
    if (!confirm('إلغاء الاشتراك والعودة للباقة المجانية؟')) return;
    setBusy(true);
    try {
      await cancelSubscription();
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">الاشتراك</h1>

        <Card>
          <CardHeader>
            <CardTitle>باقتك الحالية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!sub ? (
              <p className="text-muted-foreground">جارٍ التحميل…</p>
            ) : (
              <>
                <p className="text-2xl font-bold">{PLAN_LABEL[sub.plan] ?? sub.plan}</p>
                <p className="text-sm text-muted-foreground">
                  {sub.aiDailyLimit} سؤال للمساعد الذكي يومياً
                  {sub.endsAt && ` · يتجدّد في ${new Date(sub.endsAt).toLocaleDateString('ar')}`}
                </p>
                <div className="flex gap-2 pt-2">
                  <Link href="/pricing">
                    <Button>{sub.plan === 'premium' ? 'إدارة الباقة' : 'ترقية الباقة ⬆️'}</Button>
                  </Link>
                  {sub.plan !== 'free' && (
                    <Button variant="outline" onClick={doCancel} disabled={busy}>
                      إلغاء الاشتراك
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          💳 الدفع عبر PayPlus قيد التفعيل — الترقية حالياً تجريبية لاختبار الميزات.
        </p>
      </main>
    </div>
  );
}
