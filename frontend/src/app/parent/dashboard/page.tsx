'use client';

import { useCallback, useEffect, useState } from 'react';
import { BarChart3, GraduationCap, Link2, UserPlus } from 'lucide-react';
import { linkStudentSchema, type PublicUser } from '@khatwa/shared';
import { apiFetch } from '@/lib/api';
import { getParentReport, type ParentReport } from '@/lib/progress-api';
import { AppShell } from '@/components/app-shell';
import { parentNav } from '@/components/nav-items';
import { StatsView } from '@/components/progress/stats-view';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';

export default function ParentDashboard() {
  const { toast } = useToast();
  const [students, setStudents] = useState<PublicUser[]>([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ParentReport | null>(null);
  const [reportFor, setReportFor] = useState<string | null>(null);

  async function viewReport(studentId: string) {
    setReportFor(studentId);
    setReport(null);
    try {
      setReport(await getParentReport(studentId));
    } catch {
      /* ignore */
    }
  }

  const loadStudents = useCallback(async () => {
    try {
      setStudents(await apiFetch<PublicUser[]>('/api/parent/students'));
    } catch {
      /* تجاهل — ستظهر القائمة فارغة */
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  async function onLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = linkStudentSchema.safeParse({ studentEmail });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'بريد غير صالح');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/api/parent/link-student', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      });
      toast('تم ربط الطالب بنجاح', 'success');
      setStudentEmail('');
      await loadStudents();
    } catch (err) {
      const m = err instanceof Error ? err.message : 'فشل الربط';
      setError(m);
      toast(m, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell nav={parentNav} title="متابعة الأبناء">
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title="لوحة وليّ الأمر"
          description="تابع تقدّم أبنائك في مكان واحد."
          icon={<GraduationCap className="h-7 w-7" />}
          tone="sky"
        />

        {/* ربط طالب — link a student */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="h-5 w-5 text-primary" /> ربط حساب طالب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLink} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="studentEmail">بريد الطالب الإلكتروني</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  dir="ltr"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  aria-invalid={!!error}
                />
              </div>
              <Button type="submit" disabled={loading}>
                <UserPlus /> {loading ? 'جارٍ الربط…' : 'ربط'}
              </Button>
            </form>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {/* الأبناء — children list */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5 text-primary" /> أبنائي ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-primary/25 bg-primary-light/40 py-8 text-center text-sm text-muted-foreground">
                لم تربط أي طالب بعد.
              </p>
            ) : (
              <ul className="space-y-2">
                {students.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-2 rounded-2xl bg-secondary/60 p-3 transition-colors hover:bg-primary-light/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                        {s.name?.charAt(0) ?? '؟'}
                      </span>
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        {s.grade ? (
                          <p className="text-xs text-muted-foreground">صف {s.grade}</p>
                        ) : null}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={reportFor === s.id ? 'default' : 'secondary'}
                      onClick={() => viewReport(s.id)}
                    >
                      <BarChart3 /> التقرير
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* التقرير — student report */}
        {reportFor && (
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-extrabold">
              تقرير {report?.student.name ?? '…'}
              {report?.student.grade ? ` · صف ${report.student.grade}` : ''}
            </h2>
            {report ? (
              <StatsView stats={report.stats} />
            ) : (
              <Skeleton className="h-48 rounded-3xl" />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
