'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Check, Crown } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { checkoutPlan } from '@/lib/subscription-api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DotGrid, Ring } from '@/components/decor';
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
    key: 'premium' as const,
    name: 'بريميوم',
    price: '99',
    featured: true,
    features: [
      'تجربة مجانية 7 أيام',
      'كل الدروس المسجّلة',
      '30 سؤال للمساعد الذكي يومياً (٥٠٠ شهرياً)',
      'تقارير أسبوعية مفصّلة للأهل',
      'أولوية في الدعم',
      'إشعارات تذكير ذكية',
    ],
    cta: 'ابدأ تجربة 7 أيام مجاناً',
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
      const res = await checkoutPlan(plan);
      if (res.url) {
        window.location.href = res.url; // توجيه لصفحة دفع PayPlus
        return;
      }
      router.push('/settings/subscription'); // المسار التجريبي (PayPlus غير مهيأ بعد)
    } catch {
      setBusy(null);
    }
  }

  return (
    <main className="relative overflow-hidden bg-secondary/50">
    <Ring className="-start-20 top-24 hidden h-56 w-56 md:block" />
    <DotGrid className="end-8 top-32 hidden h-24 w-32 md:block" />
    <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href={user ? '/dashboard' : '/'}
        className="inline-flex items-center gap-1 rounded-full bg-card px-4 py-1.5 text-sm font-bold text-primary shadow-subtle transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <ChevronRight className="h-4 w-4" /> رجوع
      </Link>

      <div className="mb-14 mt-6 text-center">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
          اختر <span className="marker">باقتك</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          بدل 600₪ للمدرّس الخصوصي — مساعد ذكي 24/7 بسعر كوب قهوة بالأسبوع. جرّب 7 أيام مجاناً.
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl items-start gap-6 md:grid-cols-2">
        {TIERS.map((t) => (
          <div
            key={t.key}
            className={cn(
              'relative flex flex-col rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1',
              t.featured
                ? 'gradient-primary text-white shadow-float md:-mt-4 md:mb-4'
                : 'border border-border/70 bg-card shadow-card',
            )}
          >
            {t.featured && (
              <Badge variant="achievement" className="absolute -top-3 right-1/2 translate-x-1/2 gap-1">
                <Crown className="h-3.5 w-3.5" /> الأكثر مبيعاً
              </Badge>
            )}
            <div className="text-center">
              <h2 className="font-display text-2xl font-extrabold">{t.name}</h2>
              <p className="mt-2 font-display text-5xl font-extrabold">
                {t.price}
                <span className={cn('text-base font-medium', t.featured ? 'text-white/80' : 'text-muted-foreground')}> ₪/شهر</span>
              </p>
            </div>
            <ul className="my-6 flex-1 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full',
                      t.featured ? 'bg-lime text-foreground' : 'bg-lime-light text-lime-dark',
                    )}
                  >
                    <Check className="h-3 w-3" strokeWidth={3.5} />
                  </span>
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
    </div>
    </main>
  );
}
