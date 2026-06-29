'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, Lock, CheckCircle2, Rocket, Clock, PlayCircle } from 'lucide-react';
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
    if (v && resumeAt.current > 0 && resumeAt.current < v.duration) {
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
      <div className="mx-auto max-w-4xl space-y-5">
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
    </AppShell>
  );
}
