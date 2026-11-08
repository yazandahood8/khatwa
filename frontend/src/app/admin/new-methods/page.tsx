'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getNewMethods,
  approveNewMethod,
  rejectNewMethod,
  type NewMethod,
} from '@/lib/admin-review-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewMethodsPage() {
  const [methods, setMethods] = useState<NewMethod[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    getNewMethods()
      .then(setMethods)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => reload(), [reload]);

  async function approve(m: NewMethod) {
    await approveNewMethod(m.id, names[m.id]?.trim() || undefined);
    reload();
  }
  async function reject(id: string) {
    if (confirm('رفض وحذف هذه الطريقة؟')) {
      await rejectNewMethod(id);
      reload();
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold">الطرق الجديدة 🆕</h1>
        <p className="text-sm text-muted-foreground">
          طرق حلّ اكتشفها طلاب ووافق عليها المساعد الذكي — راجعها واعتمدها أو ارفضها.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>
      ) : methods.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            لا توجد طرق جديدة بانتظار المراجعة. ✨
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {methods.map((m) => (
            <Card key={m.id} className="border-primary">
              <CardHeader>
                <CardTitle className="text-base">
                  المسألة: <span dir="auto">{m.problem.question}</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  الجواب الصحيح: <span dir="ltr">{m.problem.finalAnswer}</span> · اكتشفها:{' '}
                  {m.discoverer?.name ?? 'طالب'}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border bg-muted/30 p-3">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">خطوات الطالب:</p>
                  <ol className="space-y-1">
                    {m.steps.map((s) => (
                      <li key={s.id} className="text-sm" dir="auto">
                        {s.stepNumber}. {s.expression}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-wrap items-end gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">اسم الطريقة (اختياري)</label>
                    <Input
                      value={names[m.id] ?? ''}
                      onChange={(e) => setNames((n) => ({ ...n, [m.id]: e.target.value }))}
                      placeholder="مثال: طريقة الإكمال"
                      className="w-56"
                    />
                  </div>
                  <Button onClick={() => approve(m)}>✓ اعتماد كطريقة رسمية</Button>
                  <Button variant="outline" onClick={() => reject(m.id)}>
                    ✗ رفض
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  بعد الاعتماد تقدر تعدّل الخطوات والتلميحات من{' '}
                  <a className="text-primary hover:underline" href="/admin/content">
                    إدارة المحتوى → مسائل الموضوع
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
