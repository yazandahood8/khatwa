'use client';

import { useEffect, useState } from 'react';
import { User, KeyRound } from 'lucide-react';
import {
  updateProfileSchema,
  changePasswordSchema,
  UserRole,
  LEVELS,
  type PublicUser,
} from '@khatwa/shared';
import { useAuth } from '@/providers/auth-provider';
import { apiFetch } from '@/lib/api';
import { AppShell } from '@/components/app-shell';
import { navForRole } from '@/components/nav-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

const GRADES = [7, 8, 9, 10, 11, 12];
const SELECT_CLASS =
  'flex h-12 w-full rounded-md border-[1.5px] border-input bg-card px-4 text-base transition-all focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15';

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [level, setLevel] = useState('');
  const [pErr, setPErr] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setGrade(user.grade ? String(user.grade) : '');
      setLevel(user.level ?? '');
    }
  }, [user]);

  const isStudent = user?.role === UserRole.STUDENT;

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setPErr(null);
    const parsed = updateProfileSchema.safeParse({
      name,
      ...(isStudent && grade ? { grade } : {}),
      ...(isStudent && level ? { level } : {}),
    });
    if (!parsed.success) {
      setPErr(parsed.error.issues[0]?.message ?? 'بيانات غير صالحة');
      return;
    }
    setSavingProfile(true);
    try {
      await apiFetch<PublicUser>('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(parsed.data),
      });
      await refresh();
      toast('تم حفظ التغييرات', 'success');
    } catch (err) {
      const m = err instanceof Error ? err.message : 'فشل الحفظ';
      setPErr(m);
      toast(m, 'error');
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwErr(null);
    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!parsed.success) {
      setPwErr(parsed.error.issues[0]?.message ?? 'بيانات غير صالحة');
      return;
    }
    setSavingPw(true);
    try {
      await apiFetch('/api/users/password', {
        method: 'PUT',
        body: JSON.stringify(parsed.data),
      });
      setCurrentPassword('');
      setNewPassword('');
      toast('تم تغيير كلمة السر', 'success');
    } catch (err) {
      const m = err instanceof Error ? err.message : 'فشل التغيير';
      setPwErr(m);
      toast(m, 'error');
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <AppShell nav={navForRole(user?.role)} title="الملف الشخصي">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-display text-2xl font-bold">الملف الشخصي</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" /> المعلومات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input value={user?.email ?? ''} dir="ltr" disabled />
              </div>
              {isStudent && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="grade">الصف</Label>
                    <select id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} className={SELECT_CLASS}>
                      <option value="">اختر</option>
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          صف {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="level">المستوى</Label>
                    <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className={SELECT_CLASS}>
                      <option value="">—</option>
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {pErr && <p className="text-sm text-destructive">{pErr}</p>}
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5 text-primary" /> تغيير كلمة السر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={savePassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">كلمة السر الحالية</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div>
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
              {pwErr && <p className="text-sm text-destructive">{pwErr}</p>}
              <Button type="submit" disabled={savingPw}>
                {savingPw ? 'جارٍ التغيير…' : 'تغيير كلمة السر'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
