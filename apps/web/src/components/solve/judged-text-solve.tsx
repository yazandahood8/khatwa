'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Send, RotateCcw, CheckCircle2, AlertTriangle, XCircle, Lightbulb, PenLine, BookOpen } from 'lucide-react';
import { streamJudge } from '@/lib/ai-api';
import { getAttempt, getTopicProgress, type ProblemFull, type ProblemListItem } from '@/lib/problems-api';
import { ApiClientError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Celebration } from '@/components/solve/celebration';
import { QuestionNav } from '@/components/solve/question-nav';
import { QuestionHint } from '@/components/solve/question-hint';
import { ReferenceButton } from '@/components/solve/reference-button';
import { cn } from '@/lib/utils';

type Verdict = 'correct' | 'partial' | 'incorrect';
const VERDICT_RE = /\[(CORRECT|PARTIAL|INCORRECT)\]/g;

type Variant = 'writing' | 'reading';

const COPY: Record<Variant, {
  icon: typeof PenLine;
  headerLabel: string;
  passageLabel: string;
  answerLabel: string;
  placeholder: string;
  rows: number;
  submitLabel: string;
  panelTitle: string;
  solvedMsg: string;
  goodBadge: string;
}> = {
  writing: {
    icon: PenLine,
    headerLabel: 'مهمّة كتابة — اكتب بالإنجليزية',
    passageLabel: 'Task / موجز المهمّة',
    answerLabel: 'نصّك',
    placeholder: 'Write your answer in English…',
    rows: 10,
    submitLabel: 'قيّم كتابتي',
    panelTitle: 'تقييم الكتابة',
    solvedMsg: 'أحسنت! كتابتك حقّقت المهمّة.',
    goodBadge: 'ممتاز',
  },
  reading: {
    icon: BookOpen,
    headerLabel: 'فهم مقروء — أجب بالإنجليزية',
    passageLabel: 'Passage',
    answerLabel: 'إجابتك',
    placeholder: 'Answer in your own words…',
    rows: 6,
    submitLabel: 'قيّم إجابتي',
    panelTitle: 'تقييم الإجابة',
    solvedMsg: 'أحسنت! إجابتك صحيحة.',
    goodBadge: 'صحيح',
  },
};

/**
 * شاشة إجابة نصّية حرّة يقيّمها الذكاء الاصطناعي (كتابة إنجليزية أو فهم مقروء مفتوح).
 * تبثّ التقييم عبر /judge وتقرأ وسم [CORRECT]/[PARTIAL]/[INCORRECT] (مثل ExplainSolve للحاسوب).
 */
export function JudgedTextSolve({
  problem,
  sequence,
  variant,
}: {
  problem: ProblemFull;
  sequence: ProblemListItem[];
  variant: Variant;
}) {
  const router = useRouter();
  const id = problem.id;
  const copy = COPY[variant];
  const HeaderIcon = copy.icon;

  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [panelMode, setPanelMode] = useState<'judge' | 'hint'>('judge');
  const [feedback, setFeedback] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());
  const rawRef = useRef('');

  useEffect(() => {
    setAnswer('');
    setFeedback('');
    setVerdict(null);
    setError(null);
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
    setFeedback('');
    setVerdict(null);
    setError(null);
    setSolved(false);
    setCelebrate(false);
  }

  async function hint() {
    if (busy) return;
    setBusy(true);
    setPanelMode('hint');
    setFeedback('');
    setVerdict(null);
    setError(null);
    rawRef.current = '';
    try {
      await streamJudge(id, { code: answer, history: [], hint: true }, (chunk) => {
        rawRef.current += chunk;
        setFeedback(rawRef.current.trimEnd());
      });
    } catch (e) {
      setError(e instanceof ApiClientError && e.code === 'RATE_LIMITED' ? e.message : 'تعذّر الحصول على تلميح. حاول مرة ثانية.');
    } finally {
      setBusy(false);
    }
  }

  async function judge() {
    if (!answer.trim() || busy) return;
    setBusy(true);
    setPanelMode('judge');
    setFeedback('');
    setVerdict(null);
    setError(null);
    rawRef.current = '';
    try {
      await streamJudge(id, { code: answer, history: [] }, (chunk) => {
        rawRef.current += chunk;
        setFeedback(rawRef.current.replace(VERDICT_RE, '').trimEnd());
      });
      const m = rawRef.current.match(/\[(CORRECT|PARTIAL|INCORRECT)\]/);
      const v: Verdict = m?.[1] === 'CORRECT' ? 'correct' : m?.[1] === 'PARTIAL' ? 'partial' : 'incorrect';
      setVerdict(v);
      setAttempts((n) => n + 1);
      if (v === 'correct' && !solved) {
        setSolved(true);
        setTimeout(() => setCelebrate(true), 600);
      }
    } catch (e) {
      setError(e instanceof ApiClientError && e.code === 'RATE_LIMITED' ? e.message : 'تعذّر الاتصال بالمصحّح. حاول مرة ثانية.');
    } finally {
      setBusy(false);
    }
  }

  const badge =
    verdict === 'correct'
      ? { icon: CheckCircle2, text: copy.goodBadge, cls: 'bg-success/10 text-success' }
      : verdict === 'partial'
        ? { icon: AlertTriangle, text: 'قريب', cls: 'bg-warning/10 text-warning' }
        : verdict === 'incorrect'
          ? { icon: XCircle, text: 'يحتاج تحسين', cls: 'bg-destructive/10 text-destructive' }
          : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-secondary/50">
      <header className="m-3 mb-0 flex items-center gap-4 rounded-full bg-card px-4 py-2.5 shadow-card ring-1 ring-primary/10 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <QuestionNav
            problems={sequence}
            currentId={id}
            icon={<HeaderIcon className="h-4 w-4 text-primary" />}
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
        <div className="mx-auto w-full max-w-3xl space-y-4">
          {/* القطعة/الموجز */}
          {problem.passage && (
            <div className="rounded-2xl border border-border bg-muted/40 p-5 shadow-card">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.passageLabel}</p>
              <QuestionHint
                text={problem.passage}
                hintWords={problem.passageHintWords}
                label="كلمات القطعة"
                dir="ltr"
                textClassName="max-h-72 overflow-y-auto whitespace-pre-wrap text-base leading-relaxed scrollbar-thin"
              />
            </div>
          )}

          {/* بطاقة السؤال */}
          <div className="rounded-3xl border-e-8 border-primary bg-card p-6 shadow-elevated">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.headerLabel}</p>
            <QuestionHint
              text={problem.question}
              hintWords={problem.hintWords}
              label="كلمات مهمّة"
              textClassName="whitespace-pre-wrap text-lg leading-relaxed"
            />
          </div>

          {/* مربّع الإجابة */}
          <div className="rounded-2xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">{copy.answerLabel}</span>
              {answer.trim() && (
                <button
                  onClick={() => setAnswer('')}
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  type="button"
                >
                  <RotateCcw className="h-3 w-3" /> مسح
                </button>
              )}
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              dir="ltr"
              rows={copy.rows}
              placeholder={copy.placeholder}
              className="w-full resize-y rounded-b-2xl bg-transparent p-4 text-base leading-relaxed outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="gradient" onClick={judge} disabled={busy || !answer.trim()} className="flex-1 sm:flex-none">
              <Send /> {busy && panelMode === 'judge' ? 'جارٍ التقييم…' : copy.submitLabel}
            </Button>
            <Button variant="secondary" onClick={hint} disabled={busy}>
              <Lightbulb /> {busy && panelMode === 'hint' ? 'جارٍ التلميح…' : 'تلميح'}
            </Button>
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">{error}</p>
          )}

          {/* ردّ المصحّح */}
          {(feedback || busy) && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="mb-2 flex items-center gap-2">
                <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {panelMode === 'hint' ? (
                    <>
                      <Lightbulb className="h-3.5 w-3.5 text-warning" /> تلميح
                    </>
                  ) : (
                    copy.panelTitle
                  )}
                </p>
                {panelMode === 'judge' && badge && (
                  <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', badge.cls)}>
                    <badge.icon className="h-3.5 w-3.5" /> {badge.text}
                  </span>
                )}
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed" dir="auto">
                {feedback || (
                  <span className="text-muted-foreground">{panelMode === 'hint' ? '…يجهّز تلميحاً' : '…يقيّم إجابتك'}</span>
                )}
                {busy && <span className="ml-0.5 inline-block animate-pulse">▍</span>}
              </div>
            </div>
          )}

          {solved && !celebrate && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-3xl bg-lime-light px-5 py-4">
              <span className="flex items-center gap-2 font-display font-semibold text-success">
                <CheckCircle2 className="h-5 w-5" /> {copy.solvedMsg}
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
