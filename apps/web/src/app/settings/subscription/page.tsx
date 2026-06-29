'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Crown, ArrowUpCircle } from 'lucide-react';
import {
  getCurrentSubscription,
  cancelSubscription,
  type CurrentSubscription,
} from '@/lib/subscription-api';
import { useAuth } from '@/providers/auth-provider';
import { AppShell } from '@/components/app-shell';
import { navForRole } from '@/components/nav-items';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';

const PLAN_LABEL: Record<string, string> = {
  free: 'مجاني',
  basic: 'أساسي · 49₪',
  premium: 'بريميوم · 79₪',
};

export default function SubscriptionSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
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
      toast('تم الإلغاء — عُدت للباقة المجانية', 'info');
    } finally {
      setBusy(false);
    }
  }

  const isPremium = sub?.plan === 'premium';

  return (
    <AppShell nav={navForRole(user?.role)} title="الاشتراك">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-display text-2xl font-bold">الاشتراك</h1>

        <Card className="overflow-hidden">
          {/* رأس متدرّج — gradient header */}
          <div className="gradient-primary p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-white/80">
                {isPremium ? <Crown className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                باقتك الحالية
              </span>
              {sub && <Badge className="bg-white/20 text-white">{sub.plan === 'free' ? 'مجاني' : 'مفعّل'}</Badge>}
            </div>
            {sub ? (
              <p className="mt-2 font-display text-3xl font-bold">{PLAN_LABEL[sub.plan] ?? sub.plan}</p>
            ) : (
              <Skeleton className="mt-2 h-9 w-40 bg-white/20" />
            )}
          </div>
          <CardContent className="space-y-4 p-6">
            {!sub ? (
              <Skeleton className="h-5 w-64" />
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{sub.aiDailyLimit}</span> سؤال
                  للمساعد الذكي يومياً
                  {sub.endsAt && ` · يتجدّد في ${new Date(sub.endsAt).toLocaleDateString('ar')}`}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/pricing">
                    <Button variant="gradient">
                      <ArrowUpCircle /> {isPremium ? 'إدارة الباقة' : 'ترقية الباقة'}
                    </Button>
                  </Link>
                  {sub.plan !== 'free' && (
                    <Button variant="destructive" onClick={doCancel} disabled={busy}>
                      إلغاء الاشتراك
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
          💳 الدفع عبر PayPlus قيد التفعيل — الترقية حالياً تجريبية لاختبار الميزات.
        </p>
      </div>
    </AppShell>
  );
}
