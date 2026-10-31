'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Users } from 'lucide-react';
import { registerSchema, UserRole, LEVELS } from '@khatwa/shared';
import { useAuth } from '@/providers/auth-provider';
import { dashboardPathForRole } from '@/lib/routes';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const GRADES = [7, 8, 9]; // 10-12 يُختار عبر الوحدات (ثانوي)
const HIGH_SCHOOL = 'hs'; // قيمة خاصة لخيار "المرحلة الثانوية"
const SELECT_CLASS =
  'flex h-12 w-full rounded-2xl border-2 border-input/80 bg-secondary/60 px-5 text-base transition-all focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/15';

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) || /[؀-ۿ]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..4
}
const STRENGTH = [
  { label: '', color: '' },
  { label: 'ضعيفة', color: 'bg-destructive' },
  { label: 'مقبولة', color: 'bg-warning' },
  { label: 'جيدة', color: 'bg-gold' },
  { label: 'قوية', color: 'bg-success' },
];

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
  const isHighSchool = grade === HIGH_SCHOOL;
  const strength = passwordStrength(password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = registerSchema.safeParse({
      name,
      email,
      password,
      role,
      // 7-9: صف. ثانوي (10-12): وحدات (level) بلا صف.
      ...(isStudent && !isHighSchool && grade ? { grade } : {}),
      ...(isStudent && isHighSchool && level ? { level } : {}),
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
    <AuthLayout title="إنشاء حساب جديد" subtitle="ابدأ رحلتك مع خطوة 🚀">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* اختيار الدور — role toggle */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          <RoleTab active={isStudent} onClick={() => setRole(UserRole.STUDENT)} icon={GraduationCap} label="طالب" />
          <RoleTab active={!isStudent} onClick={() => setRole(UserRole.PARENT)} icon={Users} label="وليّ أمر" />
        </div>

        <div>
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
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
          />
        </div>
        <div>
          <Label htmlFor="password">كلمة السر</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 أحرف على الأقل"
            autoComplete="new-password"
          />
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      i <= strength ? STRENGTH[strength].color : 'bg-border',
                    )}
                  />
                ))}
              </div>
              <span className="w-12 text-xs text-muted-foreground">{STRENGTH[strength].label}</span>
            </div>
          )}
        </div>

        {isStudent && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="grade">الصف / المرحلة</Label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => {
                  setGrade(e.target.value);
                  if (e.target.value !== HIGH_SCHOOL) setLevel('');
                }}
                className={SELECT_CLASS}
              >
                <option value="">اختر الصف</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    صف {g}
                  </option>
                ))}
                <option value={HIGH_SCHOOL}>المرحلة الثانوية (10-12)</option>
              </select>
            </div>
            {isHighSchool && (
              <div>
                <Label htmlFor="level">الوحدات</Label>
                <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className={SELECT_CLASS}>
                  <option value="">اختر الوحدات</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'جارٍ الإنشاء…' : 'إنشاء الحساب'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        عندك حساب؟{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          سجّل الدخول
        </Link>
      </p>
    </AuthLayout>
  );
}

function RoleTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all',
        active ? 'bg-card text-primary shadow-subtle' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
