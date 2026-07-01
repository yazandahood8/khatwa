'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Clock, ArrowLeft } from 'lucide-react';
import {
  getUnitTracks,
  getQuestionnaires,
  type Level,
  type Questionnaire,
} from '@/lib/content-api';
import { Card } from '@/components/ui/card';
import { Loading, Empty } from '@/components/courses/tree';
import { cn } from '@/lib/utils';

/** بطاقات المرحلة الثانوية (10-12): تبويبات وحدات (3/4/5) + بطاقات نموذج. */
export function HighSchoolTracks({ subjectId }: { subjectId: string }) {
  const [tracks, setTracks] = useState<Level[] | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    getUnitTracks(subjectId)
      .then((ts) => {
        setTracks(ts);
        setActive(ts[0]?.id ?? null);
      })
      .catch(() => setTracks([]));
  }, [subjectId]);

  if (tracks === null) return <Loading />;
  if (tracks.length === 0) return null;

  return (
    <div className="space-y-4 px-2 py-3">
      <p className="text-sm font-semibold text-muted-foreground">المرحلة الثانوية — حسب الوحدات</p>
      <div className="flex flex-wrap gap-2">
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              active === t.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {trackLabel(t)}
          </button>
        ))}
      </div>
      {active && <QuestionnaireGrid levelId={active} />}
    </div>
  );
}

function trackLabel(t: Level) {
  return t.unitLevel ? `${t.unitLevel} وحدات` : t.name;
}

function QuestionnaireGrid({ levelId }: { levelId: string }) {
  const [items, setItems] = useState<Questionnaire[] | null>(null);

  useEffect(() => {
    setItems(null);
    getQuestionnaires(levelId)
      .then(setItems)
      .catch(() => setItems([]));
  }, [levelId]);

  if (items === null) return <Loading />;
  if (items.length === 0) return <Empty text="لا يوجد نماذج في هذا المسار بعد." />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((q) => (
        <QuestionnaireCard key={q.id} q={q} />
      ))}
    </div>
  );
}

function QuestionnaireCard({ q }: { q: Questionnaire }) {
  const router = useRouter();
  const hours = q.durationMinutes > 0 ? Math.max(1, Math.round(q.durationMinutes / 60)) : 0;
  return (
    <Card
      interactive
      onClick={() => router.push(`/courses/questionnaire/${q.id}?n=${q.number}`)}
      className="flex flex-col p-5"
    >
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold italic text-primary">
        ƒx
      </span>
      <h3 className="font-display text-xl font-bold">{q.title ?? `نموذج ${q.number}`}</h3>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" /> {q.studentCount} طالب
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" /> {hours > 0 ? `${hours} ساعة` : 'قريباً'}
        </span>
      </div>
      <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
        لمشاهدة الدورة <ArrowLeft className="h-4 w-4" />
      </span>
    </Card>
  );
}
