'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { upgradePlan } from '@/lib/subscription-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TIERS = [
  {
    key: 'free' as const,
    name: 'مجاني',
    price: '0',
    badge: null,
    features: [
      'درس واحد من كل وحدة',
      '10 أسئلة للمساعد الذكي يومياً',
      'حل المسائل التفاعلي',
      'بدون تقارير للأهل',
    ],
    cta: 'ابدأ مجاناً',
  },
  {
    key: 'basic' as const,
    name: 'أساسي',
    price: '49',
    badge: null,
    features: [
      'كل الدروس المسجّلة',
      '50 سؤال للمساعد الذكي يومياً',
      'تتبّع التقدّم',
      'مسودة حرة (Scratch Pad)',
    ],
    cta: 'اشترك بالأساسي',
  },
  {
    key: 'premium' as const,
    name: 'بريميوم',
    price: '79',
    badge: 'الأكثر مبيعاً',
    features: [
      'كل الدروس المسجّلة',
      '150 سؤال للمساعد الذكي يومياً',
      'تقارير أسبوعية مفصّلة للأهل',
      'أولوية في الدعم',
      'إشعارات تذكير ذكية',
    ],
    cta: 'اشترك بالبريميوم',
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function choose(plan: 'free' | 'basic' | 'premium') {
    if (!user) {
      router.push('/register');
      return;
    }
    if (plan === 'free') {
      router.push('/dashboard');
      return;
    }
    setBusy(plan);
    try {
      await upgradePlan(plan);
      router.push('/settings/subscription');
    } catch {
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-2 flex items-center justify-between">
        <Link href={user ? '/dashboard' : '/'} className="text-sm text-primary hover:underline">
          ‹ رجوع
        </Link>
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">اختر باقتك</h1>
        <p className="mt-2 text-muted-foreground">
          بدل 600 شيكل للمدرس الخصوصي — مساعد ذكي 24/7 بسعر كوب قهوة بالأسبوع
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <Card key={t.key} className={cn('flex flex-col', t.badge && 'border-primary shadow-lg')}>
            <CardHeader className="text-center">
              {t.badge && (
                <span className="mx-auto mb-2 w-fit rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                  {t.badge}
                </span>
              )}
              <CardTitle>{t.name}</CardTitle>
              <p className="text-3xl font-bold">
                {t.price} <span className="text-base font-normal text-muted-foreground">₪/شهر</span>
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="mb-6 flex-1 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => choose(t.key)}
                disabled={busy === t.key}
                variant={t.badge ? 'default' : 'outline'}
                className="w-full"
              >
                {busy === t.key ? 'جارٍ…' : t.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        💳 الدفع الإلكتروني (PayPlus) قيد التفعيل — حالياً الترقية تجريبية لاختبار الميزات.
      </p>
    </main>
  );
}
