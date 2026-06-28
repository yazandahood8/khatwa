import { AI_DAILY_LIMITS, SubscriptionPlan } from '@khatwa/shared';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">🎓 خطوة</h1>
        <p className="text-xl text-muted-foreground">منصة تعليمية تفاعلية للطلاب العرب في إسرائيل</p>
        <p className="text-sm text-muted-foreground">
          مساعد ذكاء اصطناعي يوجّهك خطوة بخطوة — بدون ما يعطيك الجواب
        </p>
      </div>

      <div className="flex gap-4">
        <Button size="lg">ابدأ مجاناً</Button>
        <Button size="lg" variant="outline">
          شاهد كيف تعمل
        </Button>
      </div>

      {/* تأكيد ربط الحزمة المشتركة — verifies @khatwa/shared is wired up */}
      <p className="text-xs text-muted-foreground">
        الباقة المجانية: {AI_DAILY_LIMITS[SubscriptionPlan.FREE]} أسئلة يومياً للذكاء الاصطناعي
      </p>
    </main>
  );
}
