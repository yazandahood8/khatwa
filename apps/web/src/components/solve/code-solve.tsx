'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Play, RotateCcw, CheckCircle2, AlertTriangle, XCircle, Terminal, Lightbulb, Eye } from 'lucide-react';
import { streamJudge } from '@/lib/ai-api';
import { runCode, getAttempt, getTopicProgress, type ProblemFull, type ProblemListItem } from '@/lib/problems-api';
import { ApiClientError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Celebration } from '@/components/solve/celebration';
import { QuestionNav } from '@/components/solve/question-nav';
import { ProblemFigure } from '@/components/math/problem-figure';
import { QuestionText } from '@/components/math/question-text';
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
  const [running, setRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<{
    ok: boolean;
    text: string;
    note?: string;
    match: boolean;
    gradable: boolean;
    expected?: string;
  } | null>(null);
  const [showExpected, setShowExpected] = useState(false);
  const rawRef = useRef('');

  useEffect(() => {
    setCode(problem.starterCode ?? '');
    setFeedback('');
    setVerdict(null);
    setError(null);
    setRunOutput(null);
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

  // حلّ من جديد — امسح آخر نتيجة وأخفِ لافتة الحل ليعيد الطالب الفحص (يُبقي كوده كما هو)
  function resolveAgain() {
    setFeedback('');
    setVerdict(null);
    setError(null);
    setSolved(false);
    setCelebrate(false);
  }

  // تشغيل الكود فعلياً ومقارنة ناتجه بالحل المرجعي (نجاح عند التطابق)
  async function run() {
    if (!code.trim() || running || busy) return;
    setRunning(true);
    setRunOutput(null);
    setShowExpected(false);
    setVerdict(null);
    setError(null);
    try {
      const r = await runCode(id, code);
      setRunOutput({
        ok: r.ok,
        text: r.output,
        note: r.note,
        match: r.match,
        gradable: r.gradable,
        expected: r.expected,
      });
      if (typeof r.attemptsCount === 'number') setAttempts(r.attemptsCount);
      if (r.match && !solved) {
        setSolved(true);
        setTimeout(() => setCelebrate(true), 600);
      }
    } catch {
      setError('تعذّر تشغيل الكود. تحقّق من اتصالك وحاول مرة ثانية.');
    } finally {
      setRunning(false);
    }
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
              <QuestionText text={problem.question} />
            </div>
            {problem.figure && <ProblemFigure spec={problem.figure} />}
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
            <Button variant="gradient" onClick={judge} disabled={busy || running || !code.trim()} className="flex-1 sm:flex-none">
              <Play /> {busy && panelMode === 'judge' ? 'جارٍ الفحص…' : 'افحص كودي'}
            </Button>
            <Button variant="secondary" onClick={run} disabled={busy || running || !code.trim()}>
              <Terminal /> {running ? 'جارٍ التشغيل…' : 'شغّل'}
            </Button>
            <Button variant="secondary" onClick={hint} disabled={busy || running}>
              <Lightbulb /> {busy && panelMode === 'hint' ? 'جارٍ التلميح…' : 'تلميح'}
            </Button>
          </div>

          {/* ناتج التشغيل — run output (terminal) */}
          {(runOutput || running) && (
            <div className="overflow-hidden rounded-2xl border border-border bg-[#1e1e2e] shadow-card">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
                <Terminal className="h-3.5 w-3.5 text-white/60" />
                <span className="font-mono text-xs text-white/60">الناتج</span>
                {runOutput && !running && (
                  <span
                    className={cn(
                      'ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold',
                      !runOutput.ok
                        ? 'bg-destructive/20 text-destructive'
                        : runOutput.match
                          ? 'bg-success/20 text-success'
                          : runOutput.gradable
                            ? 'bg-warning/20 text-warning'
                            : 'bg-white/10 text-white/60',
                    )}
                  >
                    {!runOutput.ok
                      ? 'خطأ'
                      : runOutput.match
                        ? '✅ الناتج مطابق — نجحت!'
                        : runOutput.gradable
                          ? 'الناتج مختلف عن المطلوب'
                          : 'تم التشغيل'}
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-auto p-4 scrollbar-thin" dir="ltr">
                {running ? (
                  <span className="font-mono text-sm text-white/40">…يشغّل كودك</span>
                ) : (
                  <>
                    {runOutput?.note && (
                      <p className="mb-2 font-sans text-xs text-warning" dir="rtl">
                        {runOutput.note}
                      </p>
                    )}
                    {runOutput && runOutput.ok && !runOutput.gradable && !runOutput.note && (
                      <p className="mb-2 font-sans text-xs text-white/50" dir="rtl">
                        هذه المسألة تُقيَّم بالفحص الذكي — اضغط «افحص كودي».
                      </p>
                    )}
                    <pre
                      className={cn(
                        'whitespace-pre-wrap break-words font-mono text-sm leading-relaxed',
                        !runOutput?.ok ? 'text-destructive' : 'text-[#d4d4e8]',
                      )}
                    >
                      {runOutput?.text || (!runOutput?.note ? '(لا يوجد ناتج)' : '')}
                    </pre>
                    {runOutput?.ok && !runOutput.match && runOutput.gradable && runOutput.expected != null && (
                      <button
                        type="button"
                        onClick={() => setShowExpected(true)}
                        className="mt-3 flex items-center gap-1 font-sans text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                        dir="rtl"
                      >
                        <Eye className="h-3.5 w-3.5" /> أظهر الناتج المطلوب
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

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
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-success/10 px-4 py-3">
              <span className="flex items-center gap-2 font-display font-semibold text-success">
                <CheckCircle2 className="h-5 w-5" /> حللت المسألة!
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={resolveAgain}>
                  <RotateCcw /> حلّ من جديد
                </Button>
                <Button variant="gradient" onClick={goNext}>
                  {next ? 'المسألة التالية' : 'إنهاء التمارين'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {celebrate && (
        <Celebration attempts={attempts} isLast={!next} onNext={goNext} onClose={() => setCelebrate(false)} />
      )}

      {/* حوار الناتج المطلوب — expected-output dialog */}
      {showExpected && runOutput?.expected != null && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={() => setShowExpected(false)}
        >
          <div
            className="relative w-full max-w-lg animate-fade-slide-up rounded-2xl bg-card p-6 shadow-float"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowExpected(false)}
              className="absolute left-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 font-display text-lg font-bold">مقارنة الناتج</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> الناتج المطلوب
                </p>
                <pre
                  className="max-h-60 overflow-auto rounded-xl border border-success/30 bg-[#1e1e2e] p-3 font-mono text-sm leading-relaxed text-[#d4d4e8] scrollbar-thin"
                  dir="ltr"
                >
                  {runOutput.expected || '(فارغ)'}
                </pre>
              </div>
              <div>
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-destructive">
                  <XCircle className="h-3.5 w-3.5" /> ناتجك
                </p>
                <pre
                  className="max-h-60 overflow-auto rounded-xl border border-destructive/30 bg-[#1e1e2e] p-3 font-mono text-sm leading-relaxed text-[#d4d4e8] scrollbar-thin"
                  dir="ltr"
                >
                  {runOutput.text || '(فارغ)'}
                </pre>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground" dir="rtl">
              قارن السطرين وعدّل كودك حتى يتطابق الناتج تماماً.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
