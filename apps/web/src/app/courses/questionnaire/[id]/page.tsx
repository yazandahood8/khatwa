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

export default function QuestionnairePage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const id = params.id;
  const number = search.get('n');

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
  const title = number ? `نموذج ${number}` : 'الدورة';

  return (
    <AppShell nav={studentNav} title={title}>
      <div className="mx-auto max-w-3xl space-y-4">
        <button
          onClick={() => router.push('/courses')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" /> رجوع للدروس
        </button>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <div className="rounded-2xl border border-border bg-card p-2 shadow-card">
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
