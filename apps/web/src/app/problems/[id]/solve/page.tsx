'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Plus, CheckCircle2, Pencil, MessageCircle, RotateCcw, Keyboard } from 'lucide-react';
import {
  getProblem,
  getProblems,
  checkAnswer,
  getAttempt,
  getTopicProgress,
  type ProblemFull,
  type ProblemListItem,
} from '@/lib/problems-api';
import { Math } from '@/components/math/math';
import { MathKeyboard } from '@/components/math/math-keyboard';
import { ScratchPad } from '@/components/math/scratch-pad';
import { AiTutorPanel, type AiTutorHandle } from '@/components/solve/ai-tutor-panel';
import { CodeSolve } from '@/components/solve/code-solve';
import { QuestionNav } from '@/components/solve/question-nav';
import { ReferenceButton } from '@/components/solve/reference-button';
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
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());
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
        getTopicProgress(p.topicId)
          .then((items) => {
            setSolvedIds(new Set(items.filter((it) => it.completedAt).map((it) => it.problemId)));
            setAttemptedIds(new Set(items.filter((it) => !it.completedAt).map((it) => it.problemId)));
          })
          .catch(() => {});
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

  // أثناء التحميل: شاشة محايدة بدل وميض واجهة الرياضيات قبل معرفة نوع المسألة
  if (!problem) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">جارٍ تحميل المسألة…</span>
        </div>
      </div>
    );
  }

  // مسألة برمجة (علوم الحاسوب) — واجهة كتابة الكود + المصحّح الذكي بدل الخطوات
  if (problem.language) {
    return <CodeSolve problem={problem} sequence={sequence} />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* الرأس — header with progress */}
      <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <QuestionNav
            problems={sequence}
            currentId={id}
            solvedIds={solved ? new Set(solvedIds).add(id) : solvedIds}
            attemptedIds={attemptedIds}
          />
          <Progress value={progressPct} className="max-w-xs" />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            المحاولات: {attempts}
          </span>
        </div>
        <ReferenceButton subject="math" />
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

            {/* مسار الحل — solution builder / step path (يُخفى في وضع المسودة) */}
            {!showPad && (steps.length > 0 || !solved) && (
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
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-success/10 px-4 py-3">
                <span className="flex items-center gap-2 font-display font-semibold text-success">
                  <CheckCircle2 className="h-5 w-5" /> حللت المسألة!
                </span>
                <div className="flex gap-2">
                  {/* حلّ من جديد — أعد فتح الإدخال لإعادة الحل دون تغيير عدّاد المحاولات */}
                  <Button variant="secondary" onClick={reset}>
                    <RotateCcw /> حلّ من جديد
                  </Button>
                  <Button variant="gradient" onClick={goNext}>
                    {next ? 'المسألة التالية' : 'إنهاء التمارين'}
                  </Button>
                </div>
              </div>
            )}

            {showPad && (
              <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-display text-sm font-semibold text-muted-foreground">مسودة حرة</p>
                  {/* العودة لوضع لوحة المفاتيح والخطوات */}
                  <Button variant="secondary" size="sm" onClick={() => setShowPad(false)}>
                    <Keyboard /> لوحة المفاتيح
                  </Button>
                </div>
                <ScratchPad
                  onAnalyze={(img) => {
                    setShowChat(true); // على الجوال: افتح لوح المساعد ليظهر الرد
                    aiRef.current?.sendDraft(img);
                  }}
                />
              </div>
            )}
          </div>

          {/* لوحة المفاتيح + الأزرار — keyboard & actions (يُخفى في وضع المسودة) */}
          {!solved && !showPad && (
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

        {/* المساعد الذكي — نسخة واحدة تتكيّف: عمود جانبي على الحاسوب، لوح سفلي منزلق على الجوال.
            نبقيها مركّبة دائماً (حتى مغلقة على الجوال) كي تبقى المحادثة والـ ref ثابتَين. */}
        <aside
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 h-[78vh] rounded-t-2xl border-t border-border bg-card p-4 shadow-float transition-transform duration-300',
            'lg:static lg:z-auto lg:h-auto lg:w-[360px] lg:shrink-0 lg:translate-y-0 lg:rounded-none lg:border-t-0 lg:border-r lg:bg-transparent lg:shadow-none lg:transition-none',
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
            <AiTutorPanel
              ref={aiRef}
              problemId={id}
              onSolved={handleAiSolved}
              getState={() => ({ attemptsCount: attempts, current })}
            />
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
          aria-label="افتح المساعد الذكي"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
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
