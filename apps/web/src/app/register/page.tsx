'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerSchema, UserRole, LEVELS } from '@khatwa/shared';
import { useAuth } from '@/providers/auth-provider';
import { dashboardPathForRole } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GRADES = [7, 8, 9, 10, 11, 12];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<UserRole.STUDENT | UserRole.PARENT>(UserRole.STUDENT);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('');
  const [level, setLevel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isStudent = role === UserRole.STUDENT;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = registerSchema.safeParse({
      name,
      email,
      password,
      role,
      ...(isStudent && grade ? { grade } : {}),
      ...(isStudent && level ? { level } : {}),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'بيانات غير صالحة');
      return;
    }

    setLoading(true);
    try {
      const user = await register(parsed.data);
      router.push(dashboardPathForRole(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل التسجيل');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>إنشاء حساب جديد</CardTitle>
          <CardDescription>ابدأ رحلتك مع خطوة 🚀</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* اختيار الدور — role toggle */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={isStudent ? 'default' : 'outline'}
                onClick={() => setRole(UserRole.STUDENT)}
              >
                👨‍🎓 طالب
              </Button>
              <Button
                type="button"
                variant={!isStudent ? 'default' : 'outline'}
                onClick={() => setRole(UserRole.PARENT)}
              >
                👨‍👩‍👦 ولي أمر
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
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
              <Label htmlFor="password">كلمة السر</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 أحرف على الأقل"
                autoComplete="new-password"
              />
            </div>

            {isStudent && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="grade">الصف</Label>
                  <select
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">اختر الصف</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        صف {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">المستوى</Label>
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">اختياري</option>
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جارٍ الإنشاء…' : 'إنشاء الحساب'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            عندك حساب؟{' '}
            <Link href="/login" className="text-primary hover:underline">
              سجّل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
