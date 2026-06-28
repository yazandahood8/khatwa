'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema } from '@khatwa/shared';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    return <p className="text-center text-sm">✅ تم تعيين كلمة السر الجديدة. يتم تحويلك…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword">كلمة السر الجديدة</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="8 أحرف على الأقل"
          autoComplete="new-password"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'جارٍ الحفظ…' : 'تعيين كلمة السر'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>إعادة تعيين كلمة السر</CardTitle>
          <CardDescription>اختر كلمة سر جديدة لحسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-center text-sm">جارٍ التحميل…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
