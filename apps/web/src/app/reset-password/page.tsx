'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema } from '@khatwa/shared';
import { apiFetch } from '@/lib/api';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = resetPasswordSchema.safeParse({ token, newPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'بيانات غير صالحة');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      });
      setDone(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="text-center text-sm text-destructive">
        رابط غير صالح. اطلب رابطاً جديداً من{' '}
        <Link href="/forgot-password" className="text-primary hover:underline">
          هنا
        </Link>
        .
      </p>
    );
  }

  if (done) {
    return (
      <div className="space-y-3 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <p className="text-sm">تم تعيين كلمة السر الجديدة. يتم تحويلك…</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="newPassword">كلمة السر الجديدة</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="8 أحرف على الأقل"
          autoComplete="new-password"
          aria-invalid={!!error}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'جارٍ الحفظ…' : 'تعيين كلمة السر'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="إعادة تعيين كلمة السر" subtitle="اختر كلمة سر جديدة لحسابك">
      <Suspense fallback={<p className="text-center text-sm">جارٍ التحميل…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
