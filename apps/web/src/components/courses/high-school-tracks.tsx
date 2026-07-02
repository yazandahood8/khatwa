'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Clock, ArrowLeft } from 'lucide-react';
import {
  getUnitTracks,
  getQuestionnaires,
  getTopics,
  type Level,
  type Questionnaire,
  type Topic,
} from '@/lib/content-api';
import { Card } from '@/components/ui/card';
import { Loading, Empty, TopicNode, type Ctx } from '@/components/courses/tree';
import { cn } from '@/lib/utils';

/**
 * مسارات المرحلة الثانوية حسب الوحدات (3/4/5): تبويبات وحدات + محتوى المسار.
 * محتوى المسار: بطاقات نماذج (رياضيات — تحت questionnaire) أو شجرة مواضيع (علوم الحاسوب — تحت المستوى مباشرةً).
 */
export function HighSchoolTracks({ subjectId, ctx }: { subjectId: string; ctx: Ctx }) {
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

  const activeTrack = tracks.find((t) => t.id === active) ?? null;

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
      {activeTrack &&
        // مسار قائم على النماذج (رياضيات) مقابل مسار مواضيع مباشرة (علوم الحاسوب).
        ((activeTrack._count?.questionnaires ?? 0) > 0 ? (
          <QuestionnaireGrid levelId={activeTrack.id} />
        ) : (
          <TrackTopicTree levelId={activeTrack.id} ctx={ctx} />
        ))}
    </div>
  );
}

function trackLabel(t: Level) {
  return t.unitLevel ? `${t.unitLevel} وحدات` : t.name;
}

/** شجرة مواضيع مسار وحدات (علوم الحاسوب) — مواضيع مُجمّعة حسب الوِحدة (topic.description) ثم دروس/مسائل. */
function TrackTopicTree({ levelId, ctx }: { levelId: string; ctx: Ctx }) {
  const [topics, setTopics] = useState<Topic[] | null>(null);

  useEffect(() => {
    setTopics(null);
    getTopics(levelId)
      .then(setTopics)
      .catch(() => setTopics([]));
  }, [levelId]);

  if (topics === null) return <Loading />;
  if (topics.length === 0) return <Empty text="لا مواضيع في هذا المسار بعد." />;

  // تجميع حسب الوِحدة مع الحفاظ على ترتيب المنهج
  const groups: { unit: string; topics: Topic[] }[] = [];
  for (const t of topics) {
    const unit = t.description ?? '';
    const g = groups.find((x) => x.unit === unit);
    if (g) g.topics.push(t);
    else groups.push({ unit, topics: [t] });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-1">
      {groups.map((g) => (
        <div key={g.unit || 'ungrouped'}>
          {g.unit && (
            <p className="px-3 pb-1 pt-3 text-xs font-semibold text-muted-foreground">{g.unit}</p>
          )}
          {g.topics.map((t) => (
            <TopicNode key={t.id} topic={t} ctx={ctx} depth={1} />
          ))}
        </div>
      ))}
    </div>
  );
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
