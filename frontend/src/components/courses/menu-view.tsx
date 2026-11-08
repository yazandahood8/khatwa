'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Lock,
  CheckCircle2,
  CirclePlay,
  Calculator,
  BookOpen,
  Clock,
} from 'lucide-react';
import {
  type Subject,
  type Grade,
  type Level,
  type Questionnaire,
  type Topic,
  type Lesson,
  getSubjects,
  getGrades,
  getUnitTracks,
  getLevels,
  getQuestionnaires,
  getTopics,
  getQuestionnaireTopics,
  getPublishedLessons,
} from '@/lib/content-api';
import { getProblems, type ProblemListItem } from '@/lib/problems-api';
import { Card } from '@/components/ui/card';
import { Loading, Empty, type Ctx } from '@/components/courses/tree';
import { cn } from '@/lib/utils';

/**
 * عرض القائمة (بطاقات) للدروس — بديل لعرض الشجرة.
 * تنقّل بالتدرّج: مادة ← صف/مسار ← مستوى ← موضوع ← دروس كبطاقات، مع مسار تنقّل (breadcrumb) للرجوع.
 */

type Crumb =
  | { kind: 'root' }
  | { kind: 'subject'; subject: Subject }
  | { kind: 'grade'; grade: Grade }
  | { kind: 'level'; level: Level; label: string }
  | { kind: 'questionnaire'; q: Questionnaire }
  | { kind: 'topic'; topic: Topic };

export function MenuView({ ctx }: { ctx: Ctx }) {
  const [stack, setStack] = useState<Crumb[]>([{ kind: 'root' }]);
  const top = stack[stack.length - 1];

  const push = (c: Crumb) => setStack((s) => [...s, c]);
  const goTo = (i: number) => setStack((s) => s.slice(0, i + 1));

  return (
    <div className="space-y-4">
      {stack.length > 1 && (
        <nav className="flex flex-wrap items-center gap-0.5 text-sm">
          {stack.map((c, i) => (
            <Fragment key={i}>
              {i > 0 && <ChevronLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
              <button
                onClick={() => goTo(i)}
                className={cn(
                  'max-w-[12rem] truncate rounded-full px-3 py-1.5 font-semibold transition-colors',
                  i === stack.length - 1
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-primary-light hover:text-primary',
                )}
              >
                {crumbLabel(c)}
              </button>
            </Fragment>
          ))}
        </nav>
      )}

      {top.kind === 'root' && <SubjectsStage onOpen={push} />}
      {top.kind === 'subject' && <SubjectStage subject={top.subject} onOpen={push} />}
      {top.kind === 'grade' && <GradeStage grade={top.grade} onOpen={push} />}
      {top.kind === 'level' && <LevelStage level={top.level} onOpen={push} />}
      {top.kind === 'questionnaire' && (
        <TopicsStage loader={() => getQuestionnaireTopics(top.q.id)} depKey={`qt${top.q.id}`} onOpen={push} />
      )}
      {top.kind === 'topic' && <LessonsStage topic={top.topic} ctx={ctx} />}
    </div>
  );
}

function crumbLabel(c: Crumb): string {
  switch (c.kind) {
    case 'root':
      return 'المواد';
    case 'subject':
      return c.subject.nameAr;
    case 'grade':
      return `صف ${c.grade.gradeNumber}`;
    case 'level':
      return c.label;
    case 'questionnaire':
      return c.q.title ?? `نموذج ${c.q.number}`;
    case 'topic':
      return c.topic.nameAr;
  }
}

/* ---------------- stages ---------------- */

function SubjectsStage({ onOpen }: { onOpen: (c: Crumb) => void }) {
  const items = useFetch(() => getSubjects(), 'subjects');
  if (!items) return <Loading />;
  if (items.length === 0) return <Empty text="لا توجد مواد متاحة بعد." />;
  return (
    <Grid>
      {items.map((s) => (
        <MenuCard
          key={s.id}
          icon={<span className="text-2xl">{s.icon ?? '📘'}</span>}
          title={s.nameAr}
          meta={s._count ? `${s._count.grades} صفوف` : undefined}
          onClick={() => onOpen({ kind: 'subject', subject: s })}
        />
      ))}
    </Grid>
  );
}

function SubjectStage({ subject, onOpen }: { subject: Subject; onOpen: (c: Crumb) => void }) {
  const grades = useFetch(() => getGrades(subject.id), `g${subject.id}`);
  const tracks = useFetch(() => getUnitTracks(subject.id), `t${subject.id}`);
  if (!grades || !tracks) return <Loading />;

  // 7-9 في الشجرة العادية؛ 10-12 حسب مسارات الوحدات (كما في عرض الشجرة).
  const middle = grades.filter((g) => g.gradeNumber <= 9);
  if (middle.length === 0 && tracks.length === 0)
    return <Empty text="لا صفوف متاحة بعد." />;

  return (
    <div className="space-y-6">
      {middle.length > 0 && (
        <Section title="الصفوف">
          <Grid>
            {middle.map((g) => (
              <MenuCard
                key={g.id}
                icon="🎓"
                title={`صف ${g.gradeNumber}`}
                meta={g._count ? `${g._count.levels} مستويات` : undefined}
                onClick={() => onOpen({ kind: 'grade', grade: g })}
              />
            ))}
          </Grid>
        </Section>
      )}
      {tracks.length > 0 && (
        <Section title="المرحلة الثانوية — حسب الوحدات">
          <Grid>
            {tracks.map((t) => (
              <MenuCard
                key={t.id}
                icon="🧭"
                title={trackLabel(t)}
                meta={t._count ? `${t._count.topics} مواضيع` : undefined}
                onClick={() => onOpen({ kind: 'level', level: t, label: trackLabel(t) })}
              />
            ))}
          </Grid>
        </Section>
      )}
    </div>
  );
}

function GradeStage({ grade, onOpen }: { grade: Grade; onOpen: (c: Crumb) => void }) {
  const items = useFetch(() => getLevels(grade.id), `lv${grade.id}`);
  if (!items) return <Loading />;
  if (items.length === 0) return <Empty text="لا مستويات." />;
  return (
    <Grid>
      {items.map((l) => (
        <MenuCard
          key={l.id}
          icon="📗"
          title={l.name}
          meta={l._count ? `${l._count.topics} مواضيع` : undefined}
          onClick={() => onOpen({ kind: 'level', level: l, label: l.name })}
        />
      ))}
    </Grid>
  );
}

function LevelStage({ level, onOpen }: { level: Level; onOpen: (c: Crumb) => void }) {
  // مسار قائم على النماذج (رياضيات) مقابل مسار مواضيع مباشرة.
  if ((level._count?.questionnaires ?? 0) > 0)
    return <QuestionnairesStage level={level} onOpen={onOpen} />;
  return <TopicsStage loader={() => getTopics(level.id)} depKey={`t${level.id}`} onOpen={onOpen} />;
}

function QuestionnairesStage({ level, onOpen }: { level: Level; onOpen: (c: Crumb) => void }) {
  const items = useFetch(() => getQuestionnaires(level.id), `q${level.id}`);
  if (!items) return <Loading />;
  if (items.length === 0) return <Empty text="لا يوجد نماذج في هذا المسار بعد." />;
  return (
    <Grid>
      {items.map((q) => (
        <MenuCard
          key={q.id}
          icon={<span className="font-display text-lg font-bold italic">ƒx</span>}
          title={q.title ?? `نموذج ${q.number}`}
          meta={`${q.lessonCount} دروس`}
          onClick={() => onOpen({ kind: 'questionnaire', q })}
        />
      ))}
    </Grid>
  );
}

function TopicsStage({
  loader,
  depKey,
  onOpen,
}: {
  loader: () => Promise<Topic[]>;
  depKey: string;
  onOpen: (c: Crumb) => void;
}) {
  const items = useFetch(loader, depKey);
  if (!items) return <Loading />;
  if (items.length === 0) return <Empty text="لا مواضيع بعد." />;
  return (
    <Grid>
      {items.map((t) => (
        <MenuCard
          key={t.id}
          icon={<BookOpen className="h-5 w-5" />}
          title={t.nameAr}
          meta={t._count ? `${t._count.lessons} دروس` : undefined}
          onClick={() => onOpen({ kind: 'topic', topic: t })}
        />
      ))}
    </Grid>
  );
}

function LessonsStage({ topic, ctx }: { topic: Topic; ctx: Ctx }) {
  const router = useRouter();
  const lessons = useFetch(() => getPublishedLessons(topic.id), `le${topic.id}`);
  const [problems, setProblems] = useState<ProblemListItem[] | null>(null);

  useEffect(() => {
    setProblems(null);
    getProblems(topic.id)
      .then(setProblems)
      .catch(() => setProblems([]));
  }, [topic.id]);

  if (!lessons) return <Loading />;

  return (
    <div className="space-y-4">
      {lessons.length === 0 ? (
        <Empty text="لا دروس منشورة بعد." />
      ) : (
        <Grid>
          {lessons.map((le, idx) => {
            const locked = ctx.plan === 'free' && idx > 0;
            const done = !!ctx.progress[le.id]?.completedAt;
            const started = !done && !!ctx.progress[le.id];
            const noVideo = !le.videoUrl; // الدرس بلا فيديو بعد
            const duration = formatDuration(le.durationSeconds, le.durationMinutes);
            return (
              <LessonCard
                key={le.id}
                lesson={le}
                locked={locked}
                done={done}
                started={started}
                noVideo={noVideo}
                duration={duration}
                onClick={() => router.push(locked ? '/pricing' : `/lessons/${le.id}`)}
              />
            );
          })}
        </Grid>
      )}
      {problems && problems.length > 0 && (
        <Card
          interactive
          onClick={() => router.push(`/problems/${problems[0].id}/solve`)}
          className="flex items-center gap-3 rounded-3xl bg-lime-light p-4 text-foreground"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime">
            <Calculator className="h-5 w-5" />
          </span>
          <span className="flex-1 font-semibold">{`المسائل (${problems.length}) — ابدأ التمرين`}</span>
          <ChevronLeft className="h-4 w-4" />
        </Card>
      )}
    </div>
  );
}

/* ---------------- cards & layout ---------------- */

function LessonCard({
  lesson,
  locked,
  done,
  started,
  noVideo,
  duration,
  onClick,
}: {
  lesson: Lesson;
  locked: boolean;
  done: boolean;
  started: boolean;
  noVideo: boolean;
  duration: string | null;
  onClick: () => void;
}) {
  const meta = locked ? 'مدفوع' : (duration ?? (noVideo ? 'قريباً' : null));
  return (
    <Card interactive onClick={onClick} className="flex items-center gap-3 rounded-3xl p-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light">
        {done ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : started ? (
          <CirclePlay className="h-5 w-5 text-primary" />
        ) : (
          <CirclePlay
            className={cn('h-5 w-5', noVideo ? 'text-muted-foreground/50' : 'text-primary')}
          />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{lesson.title}</span>
        {meta && (
          <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            {!locked && duration && <Clock className="h-3 w-3" />}
            {meta}
          </span>
        )}
      </span>
      {locked && <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </Card>
  );
}

function MenuCard({
  icon,
  title,
  meta,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  meta?: string;
  onClick: () => void;
}) {
  // لون ثابت لكل بطاقة بحسب العنوان — a stable colorful tint per card
  const tones = ['bg-tint-lavender', 'bg-lime-light', 'bg-tint-sky', 'bg-tint-pink', 'bg-tint-sun'];
  const tone = tones[Array.from(title).reduce((a, ch) => a + ch.charCodeAt(0), 0) % tones.length];
  return (
    <Card interactive onClick={onClick} className="group flex items-center gap-3 rounded-3xl p-4">
      <span
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-primary transition-transform duration-300 group-hover:rotate-6',
          tone,
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-lg font-bold">{title}</span>
        {meta && <span className="block text-xs text-muted-foreground">{meta}</span>}
      </span>
      <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
    </Card>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

/* ---------------- helpers ---------------- */

function trackLabel(t: Level) {
  return t.unitLevel ? `${t.unitLevel} وحدات` : t.name;
}

/** مدة الدرس للعرض: mm:ss من الثواني، وإلا "X د" من الدقائق، وإلا null. */
function formatDuration(seconds?: number | null, minutes?: number | null): string | null {
  if (seconds != null) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  if (minutes != null) return `${minutes} د`;
  return null;
}

/** جلب مرة واحدة عند تغيّر المفتاح — reset to loading while refetching. */
function useFetch<T>(loader: () => Promise<T[]>, depKey: string): T[] | null {
  const [items, setItems] = useState<T[] | null>(null);
  useEffect(() => {
    let alive = true;
    setItems(null);
    loader()
      .then((r) => alive && setItems(r))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey]);
  return items;
}
