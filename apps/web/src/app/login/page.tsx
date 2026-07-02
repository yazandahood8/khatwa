'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSchema } from '@khatwa/shared';
import { useAuth } from '@/providers/auth-provider';
import { dashboardPathForRole } from '@/lib/routes';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  const maintenance = params.get('maintenance') === '1';

  return (
    <AuthLayout title="تسجيل الدخول" subtitle="أهلاً بعودتك إلى خطوة 👋">
      {maintenance && (
        <p className="mb-4 rounded-xl bg-warning/10 px-4 py-3 text-sm font-medium text-warning">
          🛠️ الموقع تحت الصيانة حالياً. الدخول متاح للمستخدمين المصرّح لهم فقط.
        </p>
      )}
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
            autoComplete="email"
            aria-invalid={!!error}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password" className="mb-0">
              كلمة السر
            </Label>
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
            aria-invalid={!!error}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'جارٍ الدخول…' : 'دخول'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ما عندك حساب؟{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          سجّل الآن
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center">…</main>}>
      <LoginForm />
    </Suspense>
  );
}
