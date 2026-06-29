'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Plus, CheckCircle2, Pencil, MessageCircle } from 'lucide-react';
import {
  getProblem,
  getProblems,
  checkAnswer,
  getAttempt,
  type ProblemFull,
  type ProblemListItem,
} from '@/lib/problems-api';
import { Math } from '@/components/math/math';
import { MathKeyboard } from '@/components/math/math-keyboard';
import { ScratchPad } from '@/components/math/scratch-pad';
import { AiTutorPanel, type AiTutorHandle } from '@/components/solve/ai-tutor-panel';
import { CodeSolve } from '@/components/solve/code-solve';
import { QuestionNav } from '@/components/solve/question-nav';
import { StepPath } from '@/components/solve/step-path';
import { Celebration } from '@/components/solve/celebration';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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
  const [showChat, setShowChat] = useState(false); // mobile chat sheet
  const [checking, setChecking] = useState(false);
  const [shake, setShake] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const aiRef = useRef<AiTutorHandle>(null);
  const solvedRef = useRef(false);

  const reset = () => {
    setCurrent('');
    setSteps([]);
    setFeedback(null);
    setSolved(false);
    setCelebrate(false);
    solvedRef.current = false;
  };

  // المساعد الذكي أكّد اكتمال الحل — AI confirmed the full solve
  const handleAiSolved = useCallback(() => {
    if (solvedRef.current) return;
    solvedRef.current = true;
    setSolved(true);
    setFeedback({ correct: true, msg: 'حليت المسألة! أحسنت 🎉' });
    setTimeout(() => setCelebrate(true), 650);
  }, []);

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
          if (a.completedAt) {
            setSolved(true);
            solvedRef.current = true;
          }
        } else setAttempts(0);
      })
      .catch(() => {});
  }, [id]);

  const index = sequence.findIndex((p) => p.id === id);
  const total = sequence.length;
  const next = index >= 0 ? sequence[index + 1] : undefined;
  const progressPct = total > 0 && index >= 0 ? ((index + (solved ? 1 : 0)) / total) * 100 : 0;

  const addStep = () => {
    if (!current.trim()) return;
    const step = current.trim();
    setSteps((s) => [...s, step]);
    setCurrent('');
    aiRef.current?.sendStep(step);
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
        setSteps((s) => [...s, current.trim()]);
        setCurrent('');
        setSolved(true);
        solvedRef.current = true;
        setFeedback({ correct: true, msg: 'إجابة صحيحة! أحسنت 🎉' });
        setTimeout(() => setCelebrate(true), 650);
      } else {
        setFeedback({ correct: false, msg: 'مش بعد… راجع خطواتك وحاول مرة ثانية 💪' });
        setShake(true);
        setTimeout(() => setShake(false), 450);
      }
    } catch (e) {
      setFeedback({ correct: false, msg: e instanceof Error ? e.message : 'حدث خطأ' });
    } finally {
      setChecking(false);
    }
  }, [current, steps, id, problem]);

  function goNext() {
    if (next) router.push(`/problems/${next.id}/solve`);
    else router.push('/courses');
  }

  // مسألة برمجة (علوم الحاسوب) — واجهة كتابة الكود + المصحّح الذكي بدل الخطوات
  if (problem?.language) {
    return <CodeSolve problem={problem} sequence={sequence} />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* الرأس — header with progress */}
      <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <QuestionNav problems={sequence} currentId={id} />
          <Progress value={progressPct} className="max-w-xs" />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            المحاولات: {attempts}
          </span>
        </div>
        <Link href="/courses">
          <Button variant="secondary" size="sm">
            <X className="h-4 w-4" /> إنهاء
          </Button>
        </Link>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* المنطقة الرئيسية — problem + builder + keyboard */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 scrollbar-thin sm:p-6">
          <div className="mx-auto w-full max-w-2xl space-y-4">
            {/* بطاقة المسألة — problem card */}
            <div className="rounded-2xl border-r-4 border-primary bg-card p-5 shadow-card">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                المسألة
              </p>
              <div className="text-xl leading-relaxed" dir="auto">
                {problem ? problem.question : 'جارٍ التحميل…'}
              </div>
            </div>

            {/* مسار الحل — solution builder / step path */}
            {(steps.length > 0 || !solved) && (
              <div className="space-y-2">
                <p className="font-display text-sm font-semibold text-muted-foreground">خطواتك</p>
                <StepPath
                  steps={steps}
                  onRemove={(i) => setSteps((arr) => arr.filter((_, idx) => idx !== i))}
                  active={
                    !solved && (
                      <div
                        className={cn(
                          'rounded-lg border bg-card px-3 py-2 text-lg transition-all',
                          shake && 'animate-error-shake border-destructive',
                          !shake && 'border-border',
                        )}
                        dir="ltr"
                      >
                        {current ? (
                          <Math expr={current} />
                        ) : (
                          <span className="text-muted-foreground">…اكتب خطوتك</span>
                        )}
                      </div>
                    )
                  }
                />
              </div>
            )}

            {/* feedback */}
            {feedback && !celebrate && (
              <p
                className={cn(
                  'rounded-xl px-4 py-2.5 text-sm font-medium',
                  feedback.correct
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive',
                )}
              >
                {feedback.msg}
              </p>
            )}

            {/* solved banner (after closing celebration) */}
            {solved && !celebrate && (
              <div className="flex items-center justify-between rounded-xl bg-success/10 px-4 py-3">
                <span className="flex items-center gap-2 font-display font-semibold text-success">
                  <CheckCircle2 className="h-5 w-5" /> حللت المسألة!
                </span>
                <Button variant="gradient" onClick={goNext}>
                  {next ? 'المسألة التالية' : 'إنهاء التمارين'}
                </Button>
              </div>
            )}

            {showPad && (
              <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <p className="mb-2 font-display text-sm font-semibold text-muted-foreground">مسودة حرة</p>
                <ScratchPad onAnalyze={(img) => aiRef.current?.sendDraft(img)} />
              </div>
            )}
          </div>

          {/* لوحة المفاتيح + الأزرار — keyboard & actions (sticky bottom) */}
          {!solved && (
            <div className="mx-auto mt-4 w-full max-w-2xl space-y-3">
              <MathKeyboard
                onInput={(t) => setCurrent((c) => c + t)}
                onBackspace={() => setCurrent((c) => c.slice(0, -1))}
                onClear={() => setCurrent('')}
              />
              <p className="text-xs text-muted-foreground">
                💡 لو في أكثر من حل، افصل بينها بفاصلة — مثال: <span dir="ltr">-2,-3</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={addStep} disabled={!current.trim()}>
                  <Plus /> أضف خطوة
                </Button>
                <Button variant="gradient" onClick={check} disabled={checking} className="flex-1 sm:flex-none">
                  <CheckCircle2 /> {checking ? 'جارٍ التحقق…' : 'تحقق من الخطوة'}
                </Button>
                <Button variant="ghost" onClick={() => setShowPad((v) => !v)}>
                  <Pencil /> مسودة
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* المساعد الذكي — AI tutor (desktop side panel) */}
        <aside className="hidden w-[360px] shrink-0 border-r border-border p-4 lg:block">
          <AiTutorPanel ref={aiRef} problemId={id} onSolved={handleAiSolved} getState={() => ({ attemptsCount: attempts, current })} />
        </aside>
      </div>

      {/* زرّ المحادثة العائم — mobile floating chat button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full gradient-primary text-white shadow-float lg:hidden"
        aria-label="افتح المساعد الذكي"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* لوح المحادثة على الجوال — mobile chat sheet */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex flex-col bg-foreground/40 backdrop-blur-sm lg:hidden">
          <button className="flex-1" aria-label="إغلاق" onClick={() => setShowChat(false)} />
          <div className="h-[70vh] rounded-t-2xl bg-card p-4">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
            <div className="h-[calc(100%-1.5rem)]">
              <AiTutorPanel ref={aiRef} problemId={id} onSolved={handleAiSolved} getState={() => ({ attemptsCount: attempts, current })} />
            </div>
          </div>
        </div>
      )}

      {celebrate && (
        <Celebration
          attempts={attempts}
          isLast={!next}
          onNext={goNext}
          onClose={() => setCelebrate(false)}
        />
      )}
    </div>
  );
}
