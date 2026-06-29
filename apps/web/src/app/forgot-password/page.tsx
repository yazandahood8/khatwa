'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema } from '@khatwa/shared';
import { apiFetch } from '@/lib/api';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'بريد غير صالح');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch<{ message: string; resetUrl?: string }>(
        '/api/auth/forgot-password',
        { method: 'POST', body: JSON.stringify(parsed.data) },
      );
      setSent(true);
      if (res.resetUrl) setDevLink(res.resetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="نسيت كلمة السر" subtitle="أدخل بريدك وسنرسل لك رابط إعادة التعيين">
      {sent ? (
        <div className="space-y-4 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="text-sm">إذا كان البريد مسجّلاً، فستصلك رسالة لإعادة تعيين كلمة السر.</p>
          {devLink && (
            <div className="break-all rounded-xl bg-muted p-3 text-xs">
              <p className="mb-1 font-medium">رابط التطوير (البريد غير مفعّل بعد):</p>
              <Link href={devLink} className="text-primary hover:underline">
                {devLink}
              </Link>
            </div>
          )}
          <Link href="/login" className="block text-sm text-primary hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!error}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'جارٍ الإرسال…' : 'إرسال الرابط'}
          </Button>
          <Link href="/login" className="block text-center text-sm text-primary hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
