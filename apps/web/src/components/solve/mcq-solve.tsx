'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, CheckCircle2, RotateCcw, ListChecks } from 'lucide-react';
import {
  checkAnswer,
  getAttempt,
  getTopicProgress,
  type ProblemFull,
  type ProblemListItem,
} from '@/lib/problems-api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Celebration } from '@/components/solve/celebration';
import { QuestionNav } from '@/components/solve/question-nav';
import { ProblemFigure } from '@/components/math/problem-figure';
import { QuestionHint } from '@/components/solve/question-hint';
import { ReferenceButton } from '@/components/solve/reference-button';
import { cn } from '@/lib/utils';

/**
 * شاشة سؤال اختيار من متعدّد / إكمال (إنجليزي) — تصحيح تلقائي عبر /check (بلا ذكاء اصطناعي).
 * choices موجودة ⟵ أزرار اختيار؛ غير موجودة (cloze) ⟵ حقل نصّي قصير.
 */
export function McqSolve({ problem, sequence }: { problem: ProblemFull; sequence: ProblemListItem[] }) {
  const router = useRouter();
  const id = problem.id;
  const choices = problem.choices ?? [];
  const isCloze = choices.length === 0;

  const [selected, setSelected] = useState<string>(''); // نص الخيار المختار أو نصّ الإكمال
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [shake, setShake] = useState(false);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelected('');
    setFeedback(null);
    setSolved(false);
    setCelebrate(false);
    getAttempt(id)
      .then((a) => {
        setAttempts(a?.attemptsCount ?? 0);
        if (a?.completedAt) setSolved(true);
      })
      .catch(() => {});
    getTopicProgress(problem.topicId)
      .then((items) => {
        setSolvedIds(new Set(items.filter((it) => it.completedAt).map((it) => it.problemId)));
        setAttemptedIds(new Set(items.filter((it) => !it.completedAt).map((it) => it.problemId)));
      })
      .catch(() => {});
  }, [id, problem.topicId]);

  const index = sequence.findIndex((p) => p.id === id);
  const total = sequence.length;
  const next = index >= 0 ? sequence[index + 1] : undefined;
  const progressPct = total > 0 && index >= 0 ? ((index + (solved ? 1 : 0)) / total) * 100 : 0;

  function goNext() {
    if (next) router.push(`/problems/${next.id}/solve`);
    else router.push('/courses');
  }

  function solveAgain() {
    setSelected('');
    setFeedback(null);
    setSolved(false);
    setCelebrate(false);
  }

  async function submit() {
    if (!selected.trim() || busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      const res = await checkAnswer(id, { answer: selected });
      setAttempts(res.attemptsCount);
      if (res.correct) {
        setSolved(true);
        setFeedback({ correct: true, msg: 'إجابة صحيحة! أحسنت 🎉' });
        setTimeout(() => setCelebrate(true), 600);
      } else {
        setFeedback({ correct: false, msg: 'مش بعد… جرّب إجابة ثانية 💪' });
        setShake(true);
        setTimeout(() => setShake(false), 450);
      }
    } catch (e) {
      setFeedback({ correct: false, msg: e instanceof Error ? e.message : 'حدث خطأ' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <QuestionNav
            problems={sequence}
            currentId={id}
            icon={<ListChecks className="h-4 w-4 text-primary" />}
            solvedIds={solved ? new Set(solvedIds).add(id) : solvedIds}
            attemptedIds={attemptedIds}
          />
          <Progress value={progressPct} className="max-w-xs" />
          <span className="hidden text-xs text-muted-foreground sm:inline">المحاولات: {attempts}</span>
        </div>
        <ReferenceButton subject="english" />
        <Link href="/courses">
          <Button variant="secondary" size="sm">
            <X className="h-4 w-4" /> إنهاء
          </Button>
        </Link>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 scrollbar-thin sm:p-6">
        <div className="mx-auto w-full max-w-2xl space-y-4">
          {/* قطعة اختيارية (فهم مقروء بأسئلة اختيار) */}
          {problem.passage && (
            <div className="rounded-2xl border border-border bg-muted/40 p-5 shadow-card">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Passage</p>
              <div className="max-h-64 overflow-y-auto whitespace-pre-wrap text-base leading-relaxed scrollbar-thin" dir="ltr">
                {problem.passage}
              </div>
            </div>
          )}

          {/* بطاقة السؤال */}
          <div className="rounded-2xl border-r-4 border-primary bg-card p-5 shadow-card">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {isCloze ? 'أكمل الفراغ' : 'اختر الإجابة الصحيحة'}
            </p>
            <QuestionHint question={problem.question} hintWords={problem.hintWords} label="تلميح" />
            {problem.figure && <ProblemFigure spec={problem.figure} />}
          </div>

          {/* الخيارات أو حقل الإكمال */}
          {!solved &&
            (isCloze ? (
              <input
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                dir="ltr"
                placeholder="Type your answer…"
                className={cn(
                  'w-full rounded-xl border bg-card px-4 py-3 text-lg outline-none transition-all',
                  shake ? 'animate-error-shake border-destructive' : 'border-border focus:border-primary',
                )}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            ) : (
              <div className={cn('grid gap-2', shake && 'animate-error-shake')}>
                {choices.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(c.text)}
                    dir="ltr"
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-4 py-3 text-start text-lg transition-all',
                      selected === c.text
                        ? 'border-primary bg-primary/10 font-medium'
                        : 'border-border bg-card hover:border-primary/50',
                    )}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-current text-xs">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{c.text}</span>
                  </button>
                ))}
              </div>
            ))}

          {feedback && !celebrate && (
            <p
              className={cn(
                'rounded-xl px-4 py-2.5 text-sm font-medium',
                feedback.correct ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
              )}
            >
              {feedback.msg}
            </p>
          )}

          {!solved && (
            <Button variant="gradient" onClick={submit} disabled={busy || !selected.trim()} className="w-full sm:w-auto">
              <CheckCircle2 /> {busy ? 'جارٍ التحقق…' : 'تحقق من الإجابة'}
            </Button>
          )}

          {solved && !celebrate && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-success/10 px-4 py-3">
              <span className="flex items-center gap-2 font-display font-semibold text-success">
                <CheckCircle2 className="h-5 w-5" /> إجابة صحيحة!
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={solveAgain}>
                  <RotateCcw /> جرّب من جديد
                </Button>
                <Button variant="gradient" onClick={goNext}>
                  {next ? 'السؤال التالي' : 'إنهاء التمارين'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {celebrate && (
        <Celebration attempts={attempts} isLast={!next} onNext={goNext} onClose={() => setCelebrate(false)} />
      )}
    </div>
  );
}
