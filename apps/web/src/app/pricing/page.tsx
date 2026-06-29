'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Check, Crown } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { upgradePlan } from '@/lib/subscription-api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TIERS = [
  {
    key: 'free' as const,
    name: 'مجاني',
    price: '0',
    featured: false,
    features: ['درس واحد من كل وحدة', '10 أسئلة للمساعد الذكي يومياً', 'حل المسائل التفاعلي', 'بدون تقارير للأهل'],
    cta: 'ابدأ مجاناً',
  },
  {
    key: 'basic' as const,
    name: 'أساسي',
    price: '49',
    featured: false,
    features: ['كل الدروس المسجّلة', '50 سؤال للمساعد الذكي يومياً', 'تتبّع التقدّم', 'مسودة حرة (Scratch Pad)'],
    cta: 'اشترك بالأساسي',
  },
  {
    key: 'premium' as const,
    name: 'بريميوم',
    price: '79',
    featured: true,
    features: [
      'كل الدروس المسجّلة',
      '80 سؤال للمساعد الذكي يومياً',
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
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href={user ? '/dashboard' : '/'}
        className="inline-flex items-center gap-1 text-sm text-primary transition-colors hover:underline"
      >
        <ChevronRight className="h-4 w-4" /> رجوع
      </Link>

      <div className="mb-12 mt-4 text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">اختر باقتك</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          بدل 600₪ للمدرّس الخصوصي — مساعد ذكي 24/7 بسعر كوب قهوة بالأسبوع.
        </p>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.key}
            className={cn(
              'relative flex flex-col rounded-2xl border bg-card p-6 transition-all',
              t.featured
                ? 'border-2 border-primary shadow-elevated md:-mt-4 md:mb-4'
                : 'border-border shadow-card',
            )}
          >
            {t.featured && (
              <Badge variant="default" className="absolute -top-3 right-1/2 translate-x-1/2 gap-1">
                <Crown className="h-3.5 w-3.5" /> الأكثر مبيعاً
              </Badge>
            )}
            <div className="text-center">
              <h2 className="font-display text-xl font-semibold">{t.name}</h2>
              <p className="mt-2 font-display text-4xl font-bold">
                {t.price}
                <span className="text-base font-normal text-muted-foreground"> ₪/شهر</span>
              </p>
            </div>
            <ul className="my-6 flex-1 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => choose(t.key)}
              disabled={busy === t.key}
              variant={t.featured ? 'gradient' : 'secondary'}
              className="w-full"
            >
              {busy === t.key ? 'جارٍ…' : t.cta}
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        💳 الدفع الإلكتروني (PayPlus) قيد التفعيل — حالياً الترقية تجريبية لاختبار الميزات.
      </p>
    </main>
  );
}
