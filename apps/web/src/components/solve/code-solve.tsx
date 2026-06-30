'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Play, RotateCcw, CheckCircle2, AlertTriangle, XCircle, Terminal, Lightbulb } from 'lucide-react';
import { streamJudge } from '@/lib/ai-api';
import { getAttempt, getTopicProgress, type ProblemFull, type ProblemListItem } from '@/lib/problems-api';
import { ApiClientError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Celebration } from '@/components/solve/celebration';
import { QuestionNav } from '@/components/solve/question-nav';
import { ReferenceButton } from '@/components/solve/reference-button';
import { CodeEditor } from '@/components/solve/code-editor';
import { cn } from '@/lib/utils';

type Verdict = 'correct' | 'partial' | 'incorrect';

const VERDICT_RE = /\[(CORRECT|PARTIAL|INCORRECT)\]/g;

/** شاشة حل مسائل البرمجة (علوم الحاسوب) — كود + مصحّح ذكي بدل الخطوات. */
export function CodeSolve({ problem, sequence }: { problem: ProblemFull; sequence: ProblemListItem[] }) {
  const router = useRouter();
  const id = problem.id;

  const [code, setCode] = useState(problem.starterCode ?? '');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [panelMode, setPanelMode] = useState<'judge' | 'hint'>('judge');
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());
  const rawRef = useRef('');

  useEffect(() => {
    setCode(problem.starterCode ?? '');
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
  }, [id, problem.starterCode, problem.topicId]);

  const index = sequence.findIndex((p) => p.id === id);
  const total = sequence.length;
  const next = index >= 0 ? sequence[index + 1] : undefined;
  const progressPct = total > 0 && index >= 0 ? ((index + (solved ? 1 : 0)) / total) * 100 : 0;

  function goNext() {
    if (next) router.push(`/problems/${next.id}/solve`);
    else router.push('/courses');
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
      await streamJudge(id, { code, history: [], hint: true }, (chunk) => {
        rawRef.current += chunk;
        setFeedback(rawRef.current.trimEnd());
      });
    } catch (e) {
      setError(
        e instanceof ApiClientError && e.code === 'RATE_LIMITED'
          ? e.message
          : 'تعذّر الحصول على تلميح. حاول مرة ثانية.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function judge() {
    if (!code.trim() || busy) return;
    setBusy(true);
    setPanelMode('judge');
    setFeedback('');
    setVerdict(null);
    setError(null);
    rawRef.current = '';
    try {
      await streamJudge(id, { code, history: [] }, (chunk) => {
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
      setError(
        e instanceof ApiClientError && e.code === 'RATE_LIMITED'
          ? e.message
          : 'تعذّر الاتصال بالمصحّح. حاول مرة ثانية.',
      );
    } finally {
      setBusy(false);
    }
  }

  const badge =
    verdict === 'correct'
      ? { icon: CheckCircle2, text: 'صحيح', cls: 'bg-success/10 text-success' }
      : verdict === 'partial'
        ? { icon: AlertTriangle, text: 'قريب', cls: 'bg-warning/10 text-warning' }
        : verdict === 'incorrect'
          ? { icon: XCircle, text: 'غير صحيح', cls: 'bg-destructive/10 text-destructive' }
          : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* الرأس — header */}
      <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <QuestionNav
            problems={sequence}
            currentId={id}
            icon={<Terminal className="h-4 w-4 text-primary" />}
            solvedIds={solved ? new Set(solvedIds).add(id) : solvedIds}
            attemptedIds={attemptedIds}
          />
          <Progress value={progressPct} className="max-w-xs" />
          <span className="hidden text-xs text-muted-foreground sm:inline">المحاولات: {attempts}</span>
        </div>
        <ReferenceButton subject="csharp" />
        <Link href="/courses">
          <Button variant="secondary" size="sm">
            <X className="h-4 w-4" /> إنهاء
          </Button>
        </Link>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 scrollbar-thin sm:p-6">
        <div className="mx-auto w-full max-w-3xl space-y-4">
          {/* بطاقة المسألة — problem card */}
          <div className="rounded-2xl border-r-4 border-primary bg-card p-5 shadow-card">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">المطلوب</p>
            <div className="whitespace-pre-wrap text-lg leading-relaxed" dir="auto">
              {problem.question}
            </div>
          </div>

          {/* محرّر الكود — code editor */}
          <div className="overflow-hidden rounded-2xl border border-border bg-[#1e1e2e] shadow-card">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <span className="font-mono text-xs text-white/60">كودك — C#</span>
              <button
                onClick={() => setCode(problem.starterCode ?? '')}
                className="flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-white/90"
                type="button"
              >
                <RotateCcw className="h-3 w-3" /> إعادة تعيين
              </button>
            </div>
            <CodeEditor
              value={code}
              onChange={setCode}
              placeholder="// اكتب كودك هنا… (أو الناتج المتوقّع لأسئلة التتبّع)"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="gradient" onClick={judge} disabled={busy || !code.trim()} className="flex-1 sm:flex-none">
              <Play /> {busy && panelMode === 'judge' ? 'جارٍ الفحص…' : 'افحص كودي'}
            </Button>
            <Button variant="secondary" onClick={hint} disabled={busy}>
              <Lightbulb /> {busy && panelMode === 'hint' ? 'جارٍ التلميح…' : 'تلميح'}
            </Button>
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">{error}</p>
          )}

          {/* ردّ المصحّح — judge feedback */}
          {(feedback || busy) && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="mb-2 flex items-center gap-2">
                <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {panelMode === 'hint' ? (
                    <>
                      <Lightbulb className="h-3.5 w-3.5 text-warning" /> تلميح
                    </>
                  ) : (
                    'المصحّح الذكي'
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
                  <span className="text-muted-foreground">{panelMode === 'hint' ? '…يجهّز تلميحاً' : '…يفحص كودك'}</span>
                )}
                {busy && <span className="ml-0.5 inline-block animate-pulse">▍</span>}
              </div>
            </div>
          )}

          {/* solved banner */}
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
        </div>
      </div>

      {celebrate && (
        <Celebration attempts={attempts} isLast={!next} onNext={goNext} onClose={() => setCelebrate(false)} />
      )}
    </div>
  );
}
