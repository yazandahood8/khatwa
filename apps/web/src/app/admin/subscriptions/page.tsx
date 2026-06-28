'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getAdminSubscriptions,
  setStudentPlan,
  type AdminSub,
} from '@/lib/subscription-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PLANS = ['free', 'basic', 'premium'];
const PLAN_LABEL: Record<string, string> = { free: 'مجاني', basic: 'أساسي', premium: 'بريميوم' };

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<AdminSub[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const load = useCallback(() => {
    getAdminSubscriptions()
      .then((d) => {
        setSubs(d.subscriptions);
        setRevenue(d.monthlyRevenue);
        setCounts(d.counts);
      })
      .catch(() => {});
  }, []);
  useEffect(() => load(), [load]);

  async function change(studentId: string, plan: string) {
    await setStudentPlan(studentId, plan);
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الاشتراكات</h1>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">الإيراد الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{revenue} ₪</p>
          </CardContent>
        </Card>
        {PLANS.map((p) => (
          <Card key={p}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-muted-foreground">{PLAN_LABEL[p]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{counts[p] ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>كل المشتركين ({subs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {subs.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا يوجد مشتركون بعد.</p>
          ) : (
            <div className="divide-y">
              {subs.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.student.name}</p>
                    <p className="truncate text-xs text-muted-foreground" dir="ltr">
                      {s.student.email}
                    </p>
                  </div>
                  <select
                    value={s.plan}
                    onChange={(e) => change(s.student.id, e.target.value)}
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                  >
                    {PLANS.map((p) => (
                      <option key={p} value={p}>
                        {PLAN_LABEL[p]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
