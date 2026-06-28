'use client';

import { useCallback, useEffect, useState } from 'react';
import { linkStudentSchema, type PublicUser } from '@khatwa/shared';
import { apiFetch } from '@/lib/api';
import { getParentReport, type ParentReport } from '@/lib/progress-api';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatsView } from '@/components/progress/stats-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ParentDashboard() {
  const [students, setStudents] = useState<PublicUser[]>([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
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
    setMsg(null);
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
      setMsg('تم ربط الطالب بنجاح ✅');
      setStudentEmail('');
      await loadStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل الربط');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-3xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">لوحة ولي الأمر</h1>

        <Card>
          <CardHeader>
            <CardTitle>ربط حساب طالب</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLink} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="studentEmail">بريد الطالب الإلكتروني</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  dir="ltr"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'جارٍ الربط…' : 'ربط'}
              </Button>
            </form>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            {msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أبنائي ({students.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">لم تربط أي طالب بعد.</p>
            ) : (
              <ul className="divide-y">
                {students.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2 py-3">
                    <div>
                      <span className="font-medium">{s.name}</span>
                      <span className="ms-2 text-sm text-muted-foreground">
                        {s.grade ? `صف ${s.grade}` : ''}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={reportFor === s.id ? 'default' : 'outline'}
                      onClick={() => viewReport(s.id)}
                    >
                      📊 التقرير
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* تقرير الطالب — student report */}
        {reportFor && (
          <Card>
            <CardHeader>
              <CardTitle>
                تقرير {report?.student.name ?? '…'}
                {report?.student.grade ? ` · صف ${report.student.grade}` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report ? (
                <StatsView stats={report.stats} />
              ) : (
                <p className="text-sm text-muted-foreground">جارٍ تحميل التقرير…</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
