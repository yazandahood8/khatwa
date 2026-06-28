'use client';

import { useEffect, useState } from 'react';
import {
  updateProfileSchema,
  changePasswordSchema,
  UserRole,
  LEVELS,
  type PublicUser,
} from '@khatwa/shared';
import { useAuth } from '@/providers/auth-provider';
import { apiFetch } from '@/lib/api';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GRADES = [7, 8, 9, 10, 11, 12];

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [level, setLevel] = useState('');
  const [pInfo, setPInfo] = useState<{ ok?: string; err?: string }>({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwInfo, setPwInfo] = useState<{ ok?: string; err?: string }>({});
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
    setPInfo({});
    const parsed = updateProfileSchema.safeParse({
      name,
      ...(isStudent && grade ? { grade } : {}),
      ...(isStudent && level ? { level } : {}),
    });
    if (!parsed.success) {
      setPInfo({ err: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' });
      return;
    }
    setSavingProfile(true);
    try {
      await apiFetch<PublicUser>('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(parsed.data),
      });
      await refresh();
      setPInfo({ ok: 'تم حفظ التغييرات ✅' });
    } catch (err) {
      setPInfo({ err: err instanceof Error ? err.message : 'فشل الحفظ' });
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwInfo({});
    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!parsed.success) {
      setPwInfo({ err: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' });
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
      setPwInfo({ ok: 'تم تغيير كلمة السر ✅' });
    } catch (err) {
      setPwInfo({ err: err instanceof Error ? err.message : 'فشل التغيير' });
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">الملف الشخصي</h1>

        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input value={user?.email ?? ''} dir="ltr" disabled />
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
                      <option value="">اختر</option>
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
              {pInfo.err && <p className="text-sm text-destructive">{pInfo.err}</p>}
              {pInfo.ok && <p className="text-sm text-green-600">{pInfo.ok}</p>}
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? 'جارٍ الحفظ…' : 'حفظ'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تغيير كلمة السر</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={savePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">كلمة السر الحالية</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
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
              {pwInfo.err && <p className="text-sm text-destructive">{pwInfo.err}</p>}
              {pwInfo.ok && <p className="text-sm text-green-600">{pwInfo.ok}</p>}
              <Button type="submit" disabled={savingPw}>
                {savingPw ? 'جارٍ التغيير…' : 'تغيير كلمة السر'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
