'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  Lock,
  CheckCircle2,
  Rocket,
  Clock,
  PlayCircle,
  RotateCcw,
  RotateCw,
  Gauge,
  MessageCircle,
  X,
} from 'lucide-react';
import {
  getLessonById,
  getLessonPlayback,
  getMyProgress,
  saveProgress,
  type Lesson,
} from '@/lib/content-api';
import { getProblems } from '@/lib/problems-api';
import { ApiClientError } from '@/lib/api';
import { AppShell } from '@/components/app-shell';
import { studentNav } from '@/components/nav-items';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LessonChatPanel } from '@/components/lessons/lesson-chat-panel';
import { cn } from '@/lib/utils';

export default function LessonPage() {
  const id = useParams().id as string;
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSaved = useRef(0);
  const resumeAt = useRef(0);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchedPercent, setWatchedPercent] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [firstProblemId, setFirstProblemId] = useState<string | null>(null);
  const [rate, setRate] = useState(1);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [l, prog] = await Promise.all([getLessonById(id), getMyProgress()]);
        if (!active) return;
        setLesson(l);
        const mine = prog.find((p) => p.lessonId === id);
        resumeAt.current = mine?.watchTimeSeconds ?? 0;
        if (mine?.completedAt) setCompleted(true);
        if (l.videoUrl) {
          try {
            const { url } = await getLessonPlayback(id);
            if (active) setVideoUrl(url);
          } catch (pe) {
            if (pe instanceof ApiClientError && pe.code === 'UPGRADE_REQUIRED') {
              if (active) setLocked(true);
            } else throw pe;
          }
        }
        getProblems(l.topicId)
          .then((ps) => active && setFirstProblemId(ps[0]?.id ?? null))
          .catch(() => {});
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'تعذّر تحميل الدرس');
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const persist = useCallback(
    (seconds: number, done?: boolean) => {
      saveProgress(id, Math.floor(seconds), done).catch(() => {});
    },
    [id],
  );

  useEffect(() => {
    return () => {
      const v = videoRef.current;
      if (v && v.currentTime > 0) persist(v.currentTime);
    };
  }, [persist]);

  function onLoadedMetadata() {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    if (resumeAt.current > 0 && resumeAt.current < v.duration) {
      v.currentTime = resumeAt.current;
    }
  }

  function onTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Math.round((v.currentTime / v.duration) * 100);
    setWatchedPercent(pct);
    if (v.currentTime - lastSaved.current >= 20) {
      lastSaved.current = v.currentTime;
      persist(v.currentTime);
    }
  }

  function onEnded() {
    setCompleted(true);
    setWatchedPercent(100);
    const v = videoRef.current;
    persist(v?.duration ?? 0, true);
  }

  function skip(delta: number) {
    const v = videoRef.current;
    if (!v) return;
    const max = v.duration || Number.POSITIVE_INFINITY;
    v.currentTime = Math.max(0, Math.min(max, v.currentTime + delta));
  }

  function changeRate(r: number) {
    setRate(r);
    if (videoRef.current) videoRef.current.playbackRate = r;
  }

  // اختصارات لوحة المفاتيح — keyboard shortcuts (space/k = play-pause, ←/→ = ∓10s)
  useEffect(() => {
    if (!videoUrl) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const v = videoRef.current;
      if (!v) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const max = v.duration || Number.POSITIVE_INFINITY;
        v.currentTime = Math.max(0, Math.min(max, v.currentTime + (e.key === 'ArrowRight' ? 10 : -10)));
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        if (v.paused) void v.play();
        else v.pause();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [videoUrl]);

  if (error) {
    return (
      <AppShell nav={studentNav} title="الدرس">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <p className="text-destructive">{error}</p>
          <Link href="/courses">
            <Button variant="secondary">العودة للدروس</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell nav={studentNav} title="الدرس">
      <div className="mx-auto flex max-w-6xl gap-6">
        <div className="min-w-0 flex-1 space-y-5">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-primary transition-colors hover:underline"
        >
          <ChevronRight className="h-4 w-4" /> كل الدروس
        </Link>

        {/* مشغّل الفيديو — video player */}
        {locked ? (
          <Card className="border-primary/30">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary-light text-primary">
                <Lock className="h-7 w-7" />
              </span>
              <p className="font-display text-lg font-semibold">هذا الدرس للباقات المدفوعة</p>
              <p className="text-sm text-muted-foreground">رقِّ باقتك لتشاهد كل الدروس بدون قيود.</p>
              <Link href="/pricing">
                <Button variant="gradient">شاهد الباقات</Button>
              </Link>
            </CardContent>
          </Card>
        ) : videoUrl ? (
          <div className="overflow-hidden rounded-2xl bg-black shadow-elevated">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              controlsList="nodownload"
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={onTimeUpdate}
              onEnded={onEnded}
              className="aspect-video w-full bg-black"
            >
              <track kind="captions" />
            </video>
          </div>
        ) : lesson && !lesson.videoUrl ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-12 text-center text-muted-foreground">
              <PlayCircle className="h-10 w-10 opacity-40" />
              لم يُرفع فيديو لهذا الدرس بعد.
            </CardContent>
          </Card>
        ) : (
          <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />
        )}

        {/* أدوات التحكم — speed + skip (native controls cover play/scrub/fullscreen/volume) */}
        {videoUrl && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => skip(-10)} aria-label="رجوع 10 ثوانٍ">
              <RotateCcw className="h-4 w-4" /> 10
            </Button>
            <Button variant="secondary" size="sm" onClick={() => skip(10)} aria-label="تقديم 10 ثوانٍ">
              <RotateCw className="h-4 w-4" /> 10
            </Button>
            <span className="mx-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Gauge className="h-3.5 w-3.5" /> السرعة
            </span>
            {[0.75, 1, 1.25, 1.5, 2].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => changeRate(r)}
                className={cn(
                  'rounded-md px-2 py-1 text-xs font-medium transition-colors',
                  rate === r ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-accent',
                )}
              >
                {r}×
              </button>
            ))}
          </div>
        )}

        {/* شريط التقدّم — watch progress */}
        {videoUrl && (
          <div className="space-y-1.5">
            <Progress value={watchedPercent} />
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {completed ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" /> أكملت هذا الدرس
                </>
              ) : (
                `شاهدت ${watchedPercent}%`
              )}
            </p>
          </div>
        )}

        {/* معلومات الدرس — lesson info */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {lesson?.durationMinutes && (
              <Badge variant="secondary" size="sm">
                <Clock className="h-3.5 w-3.5" /> {lesson.durationMinutes} دقيقة
              </Badge>
            )}
            {completed && <Badge variant="success" size="sm">مكتمل</Badge>}
          </div>
          <h1 className="font-display text-2xl font-bold">{lesson?.title ?? 'جارٍ التحميل…'}</h1>
          {lesson?.description && <p className="text-muted-foreground">{lesson.description}</p>}
        </div>

        {/* يظهر بعد 80% — practice CTA after 80% */}
        {watchedPercent >= 80 && firstProblemId && (
          <Card className="animate-fade-slide-up overflow-hidden border-none gradient-primary text-white shadow-glow-primary">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-display text-lg font-bold">خلّصت الدرس؟ جرّب مسألة! 📝</p>
                <p className="text-sm text-white/80">طبّق ما تعلّمته خطوة بخطوة مع المساعد الذكي.</p>
              </div>
              <Button
                size="lg"
                onClick={() => router.push(`/problems/${firstProblemId}/solve`)}
                className="bg-white text-primary hover:bg-white/90"
              >
                <Rocket /> ابدأ التمرين
              </Button>
            </CardContent>
          </Card>
        )}
        </div>

        {/* معلّم الدرس — نسخة واحدة تتكيّف: عمود جانبي على الحاسوب، لوح سفلي منزلق على الجوال. */}
        <aside
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 h-[78vh] rounded-t-2xl border-t border-border bg-card p-4 shadow-float transition-transform duration-300',
            'lg:sticky lg:top-6 lg:z-auto lg:h-[calc(100vh-8rem)] lg:w-[360px] lg:shrink-0 lg:translate-y-0 lg:rounded-2xl lg:border-t lg:bg-card lg:p-0 lg:shadow-none lg:transition-none',
            showChat ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          {/* مقبض السحب + إغلاق (جوال فقط) */}
          <div className="relative mb-2 flex h-5 items-center lg:hidden">
            <span className="mx-auto h-1.5 w-12 rounded-full bg-border" />
            <button
              onClick={() => setShowChat(false)}
              className="absolute end-0 text-muted-foreground"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-[calc(100%-1.75rem)] lg:h-full">
            <LessonChatPanel lessonId={id} lessonTitle={lesson?.title} />
          </div>
        </aside>
      </div>

      {/* خلفية معتمة للّوح على الجوال — mobile sheet backdrop */}
      {showChat && (
        <button
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          aria-label="إغلاق"
          onClick={() => setShowChat(false)}
        />
      )}

      {/* زرّ المحادثة العائم — mobile floating chat button (يختفي عند فتح اللوح) */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full gradient-primary text-white shadow-float lg:hidden"
          aria-label="افتح معلّم الدرس"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </AppShell>
  );
}
