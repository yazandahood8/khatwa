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

function StatusBadge({ s }: { s: AdminSub }) {
  if (s.expired)
    return <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">منتهٍ</span>;
  if (s.isPaid)
    return <span className="rounded-full bg-success/10 px-3 py-0.5 text-xs font-bold text-success">مدفوع 💳</span>;
  if (s.isTrial)
    return <span className="rounded-full bg-gold-light px-3 py-0.5 text-xs font-bold text-gold-text">تجربة</span>;
  return <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">مجاني</span>;
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<AdminSub[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [paying, setPaying] = useState(0);
  const [trials, setTrials] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const load = useCallback(() => {
    getAdminSubscriptions()
      .then((d) => {
        setSubs(d.subscriptions);
        setRevenue(d.monthlyRevenue);
        setPaying(d.paying);
        setTrials(d.trials);
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
      <h1 className="text-3xl font-extrabold">الاشتراكات</h1>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">
              الإيراد الشهري الحقيقي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{revenue} ₪</p>
            <p className="text-xs text-muted-foreground">مدفوع فعلاً عبر PayPlus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">مشتركون مدفوعون</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{paying}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">قيد التجربة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{trials}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">مجاني</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.free ?? 0}</p>
          </CardContent>
        </Card>
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
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{s.student.name}</p>
                      <StatusBadge s={s} />
                    </div>
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
