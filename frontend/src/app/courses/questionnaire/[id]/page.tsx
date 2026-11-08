'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import {
  type Topic,
  type ProgressRow,
  getQuestionnaireTopics,
  getMyProgress,
} from '@/lib/content-api';
import { getCurrentSubscription } from '@/lib/subscription-api';
import { AppShell } from '@/components/app-shell';
import { studentNav } from '@/components/nav-items';
import { TopicNode, Loading, Empty, type Ctx, type ProgressMap } from '@/components/courses/tree';
import { ModuleNotice } from '@/components/courses/module-notice';
import { PageHeader } from '@/components/page-header';

export default function QuestionnairePage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const id = params.id;
  const number = search.get('n');
  const titleParam = search.get('t'); // عنوان الموديول/النموذج (إنجليزي: "Module A …")

  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [plan, setPlan] = useState('free');
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    getQuestionnaireTopics(id)
      .then(setTopics)
      .catch(() => setTopics([]));
    getCurrentSubscription().then((s) => setPlan(s.plan)).catch(() => {});
    getMyProgress()
      .then((rows: ProgressRow[]) =>
        setProgress(Object.fromEntries(rows.map((r) => [r.lessonId, r]))),
      )
      .catch(() => {});
  }, [id]);

  const ctx: Ctx = { plan, progress };
  const title = titleParam || (number ? `نموذج ${number}` : 'الدورة');

  return (
    <AppShell nav={studentNav} title={title}>
      <div className="mx-auto max-w-3xl space-y-4">
        <button
          onClick={() => router.push('/courses')}
          className="inline-flex min-h-10 items-center gap-1 rounded-full bg-primary-light px-4 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowRight className="h-4 w-4" /> رجوع للدروس
        </button>
        <PageHeader title={title} tone="lavender" />
        <ModuleNotice number={number ? Number(number) : null} />
        <div className="rounded-3xl border border-border/70 bg-card p-3 shadow-card">
          {topics === null ? (
            <Loading />
          ) : topics.length === 0 ? (
            <Empty text="لا مواضيع في هذا النموذج بعد." />
          ) : (
            topics.map((t) => <TopicNode key={t.id} topic={t} ctx={ctx} depth={0} />)
          )}
        </div>
      </div>
    </AppShell>
  );
}
