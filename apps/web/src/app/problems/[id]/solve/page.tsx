'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getProblem,
  getProblems,
  checkAnswer,
  getAttempt,
  type ProblemFull,
  type ProblemListItem,
} from '@/lib/problems-api';
import { DashboardHeader } from '@/components/dashboard-header';
import { Math } from '@/components/math/math';
import { MathKeyboard } from '@/components/math/math-keyboard';
import { ScratchPad } from '@/components/math/scratch-pad';
import { AiTutorPanel, type AiTutorHandle } from '@/components/solve/ai-tutor-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SolvePage() {
  const id = useParams().id as string;
  const router = useRouter();

  const [problem, setProblem] = useState<ProblemFull | null>(null);
  const [sequence, setSequence] = useState<ProblemListItem[]>([]);
  const [current, setCurrent] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [solved, setSolved] = useState(false);
  const [showPad, setShowPad] = useState(false);
  const [checking, setChecking] = useState(false);
  const aiRef = useRef<AiTutorHandle>(null);

  const reset = () => {
    setCurrent('');
    setSteps([]);
    setFeedback(null);
    setSolved(false);
  };

  // تحميل المسألة + التسلسل + المحاولة السابقة
  useEffect(() => {
    reset();
    getProblem(id)
      .then((p) => {
        setProblem(p);
        getProblems(p.topicId).then(setSequence).catch(() => {});
      })
      .catch(() => {});
    getAttempt(id)
      .then((a) => {
        if (a) {
          setAttempts(a.attemptsCount);
          if (a.completedAt) setSolved(true);
        } else setAttempts(0);
      })
      .catch(() => {});
  }, [id]);

  const index = sequence.findIndex((p) => p.id === id);
  const next = index >= 0 ? sequence[index + 1] : undefined;

  const addStep = () => {
    if (!current.trim()) return;
    const step = current.trim();
    setSteps((s) => [...s, step]);
    setCurrent('');
    aiRef.current?.sendStep(step); // اطلب رأي المعلم الذكي بالخطوة
  };

  const check = useCallback(async () => {
    if (!current.trim()) {
      setFeedback({ correct: false, msg: 'اكتب إجابتك أولاً' });
      return;
    }
    setChecking(true);
    try {
      const res = await checkAnswer(id, {
        answer: current,
        steps: [...steps, current],
        methodUsed: problem?.methods.find((m) => m.isRecommended)?.name,
      });
      setAttempts(res.attemptsCount);
      if (res.correct) {
        setSolved(true);
        setFeedback({ correct: true, msg: 'إجابة صحيحة! أحسنت 🎉' });
      } else {
        setFeedback({ correct: false, msg: 'مش بعد… راجع خطواتك وحاول مرة ثانية 💪' });
      }
    } catch (e) {
      setFeedback({ correct: false, msg: e instanceof Error ? e.message : 'حدث خطأ' });
    } finally {
      setChecking(false);
    }
  }, [current, steps, id, problem]);

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-6xl p-4 lg:p-6">
        {/* top bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Link href="/courses" className="text-sm text-primary hover:underline">
            ‹ كل الدروس
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {sequence.length > 0 && index >= 0 && (
              <span>المسألة {index + 1} من {sequence.length}</span>
            )}
            <span>عدد المحاولات: {attempts}</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* left: problem + builder + keyboard */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-muted-foreground">المسألة</CardTitle>
              </CardHeader>
              <CardContent className="text-xl" dir="auto">
                {problem ? problem.question : 'جارٍ التحميل…'}
              </CardContent>
            </Card>

            {/* steps */}
            {steps.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-muted-foreground">خطواتك</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 border-b py-1 last:border-0">
                      <span className="text-xs text-muted-foreground">{i + 1}.</span>
                      <Math expr={s} />
                      <button
                        onClick={() => setSteps((arr) => arr.filter((_, idx) => idx !== i))}
                        className="ms-auto text-xs text-muted-foreground hover:text-destructive"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* current expression + preview */}
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="min-h-[3rem] rounded-md border bg-muted/30 p-3 text-xl" dir="ltr">
                  {current ? <Math expr={current} /> : <span className="text-muted-foreground">…</span>}
                </div>
                {!solved && (
                  <>
                    <MathKeyboard
                      onInput={(t) => setCurrent((c) => c + t)}
                      onBackspace={() => setCurrent((c) => c.slice(0, -1))}
                      onClear={() => setCurrent('')}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 لو في أكثر من حل، افصل بينها بفاصلة — مثال: <span dir="ltr">-2,-3</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={addStep} disabled={!current.trim()}>
                        ➕ أضف خطوة
                      </Button>
                      <Button onClick={check} disabled={checking}>
                        {checking ? 'جارٍ التحقق…' : 'تحقق من الإجابة ✅'}
                      </Button>
                      <Button variant="ghost" onClick={() => setShowPad((v) => !v)}>
                        ✏️ مسودة
                      </Button>
                      <Button variant="ghost" disabled title="يأتي مع المساعد الذكي">
                        💡 تلميح
                      </Button>
                    </div>
                  </>
                )}

                {feedback && (
                  <p className={feedback.correct ? 'text-green-600' : 'text-destructive'}>
                    {feedback.msg}
                  </p>
                )}

                {solved && (
                  <div className="flex items-center justify-between rounded-md bg-green-50 p-3">
                    <span className="font-medium text-green-700">أحسنت! حللت المسألة ✅</span>
                    {next ? (
                      <Button onClick={() => router.push(`/problems/${next.id}/solve`)}>
                        المسألة التالية ←
                      </Button>
                    ) : (
                      <Link href="/courses">
                        <Button>🎉 خلّصت كل المسائل!</Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {showPad && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-muted-foreground">مسودة حرة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScratchPad />
                </CardContent>
              </Card>
            )}
          </div>

          {/* right: AI tutor */}
          <div>
            <AiTutorPanel
              ref={aiRef}
              problemId={id}
              getState={() => ({ attemptsCount: attempts, current })}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
