'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordSchema } from '@khatwa/shared';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      // في التطوير يرجع الرابط مباشرة (لا يوجد مزود بريد بعد)
      if (res.resetUrl) setDevLink(res.resetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>نسيت كلمة السر</CardTitle>
          <CardDescription>أدخل بريدك وسنرسل لك رابط إعادة التعيين</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <p className="text-sm">
                ✅ إذا كان البريد مسجّلاً، فستصلك رسالة لإعادة تعيين كلمة السر.
              </p>
              {devLink && (
                <div className="rounded-md bg-muted p-3 text-xs break-all">
                  <p className="mb-1 font-medium">رابط التطوير (البريد غير مفعّل بعد):</p>
                  <Link href={devLink} className="text-primary hover:underline">
                    {devLink}
                  </Link>
                </div>
              )}
              <Link href="/login" className="text-sm text-primary hover:underline">
                العودة لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'جارٍ الإرسال…' : 'إرسال الرابط'}
              </Button>
              <Link
                href="/login"
                className="block text-center text-sm text-primary hover:underline"
              >
                العودة لتسجيل الدخول
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
