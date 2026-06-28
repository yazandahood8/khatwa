'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSchema } from '@khatwa/shared';
import { useAuth } from '@/providers/auth-provider';
import { dashboardPathForRole } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'بيانات غير صالحة');
      return;
    }

    setLoading(true);
    try {
      const user = await login(parsed.data);
      router.push(params.get('callbackUrl') || dashboardPathForRole(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>تسجيل الدخول</CardTitle>
          <CardDescription>أهلاً بعودتك إلى خطوة 👋</CardDescription>
        </CardHeader>
        <CardContent>
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
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة السر</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  نسيت كلمة السر؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جارٍ الدخول…' : 'دخول'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ما عندك حساب؟{' '}
            <Link href="/register" className="text-primary hover:underline">
              سجّل الآن
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center">…</main>}>
      <LoginForm />
    </Suspense>
  );
}
