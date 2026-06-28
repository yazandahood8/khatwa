'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  getLessonById,
  getLessonPlayback,
  getMyProgress,
  saveProgress,
  type Lesson,
} from '@/lib/content-api';
import { getProblems } from '@/lib/problems-api';
import { ApiClientError } from '@/lib/api';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

  // تحميل الدرس + رابط المشاهدة + موضع الاستئناف
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

  // حفظ التقدّم عند مغادرة الصفحة
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
    // حفظ كل 20 ثانية — save every 20s
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
      <div className="min-h-screen">
        <DashboardHeader />
        <main className="mx-auto max-w-3xl p-6">
          <p className="text-destructive">{error}</p>
          <Link href="/courses" className="text-primary hover:underline">
            العودة للدروس
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-3xl space-y-4 p-6">
        <Link href="/courses" className="text-sm text-primary hover:underline">
          ‹ كل الدروس
        </Link>
        <h1 className="text-2xl font-bold">{lesson?.title ?? 'جارٍ التحميل…'}</h1>
        {lesson?.description && <p className="text-muted-foreground">{lesson.description}</p>}

        {locked ? (
          <Card className="border-primary">
            <CardContent className="space-y-3 p-8 text-center">
              <p className="text-4xl">🔒</p>
              <p className="font-semibold">هذا الدرس للباقات المدفوعة</p>
              <p className="text-sm text-muted-foreground">
                رقّ باقتك لتشاهد كل الدروس بدون قيود.
              </p>
              <Link href="/pricing">
                <Button>شوف الباقات ⬆️</Button>
              </Link>
            </CardContent>
          </Card>
        ) : videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            controlsList="nodownload"
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
            className="aspect-video w-full rounded-lg bg-black"
          >
            <track kind="captions" />
          </video>
        ) : lesson && !lesson.videoUrl ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              لم يُرفع فيديو لهذا الدرس بعد.
            </CardContent>
          </Card>
        ) : (
          <div className="aspect-video w-full animate-pulse rounded-lg bg-muted" />
        )}

        {videoUrl && (
          <div className="space-y-1">
            <div className="h-2 w-full overflow-hidden rounded bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${watchedPercent}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              {completed ? 'أكملت هذا الدرس ✅' : `شاهدت ${watchedPercent}%`}
            </p>
          </div>
        )}

        {/* يظهر بعد 80% — appears after 80% watched */}
        {watchedPercent >= 80 && firstProblemId && (
          <Card className="border-primary">
            <CardContent className="flex items-center justify-between p-4">
              <span className="font-medium">📝 خلّصت الدرس؟ جرّب مسألة!</span>
              <Button onClick={() => router.push(`/problems/${firstProblemId}/solve`)}>
                ابدأ التمرين 🚀
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
