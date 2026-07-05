'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Play, RotateCcw, CheckCircle2, AlertTriangle, XCircle, Boxes, Lightbulb, Plus, Trash2, PencilRuler, Layers } from 'lucide-react';
import { streamJudge } from '@/lib/ai-api';
import { getAttempt, getTopicProgress, type ProblemFull, type ProblemListItem } from '@/lib/problems-api';
import { ApiClientError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Celebration } from '@/components/solve/celebration';
import { QuestionNav } from '@/components/solve/question-nav';
import { ReferenceButton } from '@/components/solve/reference-button';
import { PhotoCaptureButton } from '@/components/solve/photo-capture-button';
import { ScratchPad } from '@/components/math/scratch-pad';
import { cn } from '@/lib/utils';

type Verdict = 'correct' | 'partial' | 'incorrect';
const VERDICT_RE = /\[(CORRECT|PARTIAL|INCORRECT)\]/g;

type Frame = { call: string; note: string; ret: string };
const emptyFrame = (): Frame => ({ call: '', note: '', ret: '' });

/** شاشة تتبّع عودي — الطالب يبني الإطارات (صناديق) أو يرسمها/يصوّرها، ويقيّمها المصحّح الذكي. */
export function TraceRecursion({ problem, sequence }: { problem: ProblemFull; sequence: ProblemListItem[] }) {
  const router = useRouter();
  const id = problem.id;

  const [tab, setTab] = useState<'frames' | 'draw'>('frames');
  const [frames, setFrames] = useState<Frame[]>([emptyFrame(), emptyFrame()]);
  const [finalResult, setFinalResult] = useState('');
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
    setFrames([emptyFrame(), emptyFrame()]);
    setFinalResult('');
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
  function resolveAgain() {
    setFeedback('');
    setVerdict(null);
    setError(null);
    setSolved(false);
    setCelebrate(false);
  }

  function setFrame(i: number, patch: Partial<Frame>) {
    setFrames((prev) => prev.map((f, fi) => (fi === i ? { ...f, ...patch } : f)));
  }
  function addFrame() {
    setFrames((prev) => [...prev, emptyFrame()]);
  }
  function removeFrame(i: number) {
    setFrames((prev) => (prev.length > 1 ? prev.filter((_, fi) => fi !== i) : prev));
  }

  const hasFrames = frames.some((f) => f.call.trim() || f.ret.trim()) || finalResult.trim();

  /** حوّل الإطارات إلى نصّ منظّم (نزول + إرجاع) يُرسَل للمصحّح. */
  function serializeFrames() {
    const lines = frames
      .filter((f) => f.call.trim() || f.note.trim() || f.ret.trim())
      .map((f, i) => {
        const parts = [`إطار ${i + 1}: ${f.call.trim() || '—'}`];
        if (f.note.trim()) parts.push(`ينتظر/محلّي: ${f.note.trim()}`);
        if (f.ret.trim()) parts.push(`يرجع: ${f.ret.trim()}`);
        return parts.join('  |  ');
      });
    if (finalResult.trim()) lines.push(`النتيجة النهائية: ${finalResult.trim()}`);
    return lines.join('\n');
  }

  function parseVerdict() {
    const m = rawRef.current.match(/\[(CORRECT|PARTIAL|INCORRECT)\]/);
    const v: Verdict = m?.[1] === 'CORRECT' ? 'correct' : m?.[1] === 'PARTIAL' ? 'partial' : 'incorrect';
    setVerdict(v);
    setAttempts((n) => n + 1);
    if (v === 'correct' && !solved) {
      setSolved(true);
      setTimeout(() => setCelebrate(true), 600);
    }
  }

  async function runJudge(body: Parameters<typeof streamJudge>[1]) {
    setBusy(true);
    setPanelMode('judge');
    setFeedback('');
    setVerdict(null);
    setError(null);
    rawRef.current = '';
    try {
      await streamJudge(id, body, (chunk) => {
        rawRef.current += chunk;
        setFeedback(rawRef.current.replace(VERDICT_RE, '').trimEnd());
      });
      parseVerdict();
    } catch (e) {
      setError(
        e instanceof ApiClientError && e.code === 'RATE_LIMITED' ? e.message : 'تعذّر الاتصال بالمصحّح. حاول مرة ثانية.',
      );
    } finally {
      setBusy(false);
    }
  }

  function judgeFrames() {
    if (!hasFrames || busy) return;
    runJudge({ code: serializeFrames(), history: [] });
  }
  function judgeImage(image: string, mediaType: 'image/png' | 'image/jpeg') {
    if (busy) return;
    runJudge({ code: '', history: [], image, mediaType });
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
      await streamJudge(id, { code: hasFrames ? serializeFrames() : '', history: [], hint: true }, (chunk) => {
        rawRef.current += chunk;
        setFeedback(rawRef.current.trimEnd());
      });
    } catch (e) {
      setError(
        e instanceof ApiClientError && e.code === 'RATE_LIMITED' ? e.message : 'تعذّر الحصول على تلميح. حاول مرة ثانية.',
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
      <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <QuestionNav
            problems={sequence}
            currentId={id}
            icon={<Boxes className="h-4 w-4 text-primary" />}
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
          {/* بطاقة المسألة (الكود المُعطى للتتبّع) */}
          <div className="rounded-2xl border-r-4 border-primary bg-card p-5 shadow-card">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              تتبّع الاستدعاء العودي — ارسم/املأ إطارات التنفيذ (صناديق)
            </p>
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed" dir="ltr">
              {problem.question}
            </div>
          </div>

          {/* اختيار طريقة الإدخال */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab('frames')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                tab === 'frames' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted/50',
              )}
            >
              <Layers className="h-4 w-4" /> باني الإطارات
            </button>
            <button
              type="button"
              onClick={() => setTab('draw')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                tab === 'draw' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted/50',
              )}
            >
              <PencilRuler className="h-4 w-4" /> ارسم / صوّر
            </button>
          </div>

          {tab === 'frames' ? (
            <div className="space-y-3">
              {frames.map((f, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-3 shadow-card">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">صندوق {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFrame(i)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="حذف الصندوق"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <input
                      value={f.call}
                      onChange={(e) => setFrame(i, { call: e.target.value })}
                      placeholder="الاستدعاء — مثل Factorial(3)"
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      dir="auto"
                    />
                    <input
                      value={f.note}
                      onChange={(e) => setFrame(i, { note: e.target.value })}
                      placeholder="ينتظر / متغيّرات — مثل 3×_"
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      dir="auto"
                    />
                    <input
                      value={f.ret}
                      onChange={(e) => setFrame(i, { ret: e.target.value })}
                      placeholder="يرجع — مثل 6"
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      dir="auto"
                    />
                  </div>
                  {i < frames.length - 1 && <div className="mt-2 text-center text-lg text-muted-foreground">↓ يستدعي</div>}
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={addFrame}>
                  <Plus className="h-3.5 w-3.5" /> صندوق (استدعاء)
                </Button>
                <div className="flex flex-1 items-center gap-2">
                  <label className="text-xs font-semibold text-muted-foreground">النتيجة النهائية:</label>
                  <input
                    value={finalResult}
                    onChange={(e) => setFinalResult(e.target.value)}
                    placeholder="القيمة الراجعة للاستدعاء الأول"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                    dir="auto"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
                <p className="mb-2 text-xs text-muted-foreground">
                  ارسم الصناديق والأسهم بإصبعك ثم اعرضها للمصحّح، أو صوّر ورقتك.
                </p>
                <ScratchPad onAnalyze={(png) => judgeImage(png, 'image/png')} />
                <div className="mt-2">
                  <PhotoCaptureButton
                    onCapture={(r) => judgeImage(r.base64, r.mediaType)}
                    onError={(m) => setError(m)}
                    disabled={busy}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {tab === 'frames' && (
              <Button variant="gradient" onClick={judgeFrames} disabled={busy || !hasFrames} className="flex-1 sm:flex-none">
                <Play /> {busy && panelMode === 'judge' ? 'جارٍ الفحص…' : 'افحص تتبّعي'}
              </Button>
            )}
            <Button variant="secondary" onClick={hint} disabled={busy}>
              <Lightbulb /> {busy && panelMode === 'hint' ? 'جارٍ التلميح…' : 'تلميح'}
            </Button>
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">{error}</p>
          )}

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
                  <span className="text-muted-foreground">{panelMode === 'hint' ? '…يجهّز تلميحاً' : '…يفحص تتبّعك'}</span>
                )}
                {busy && <span className="ml-0.5 inline-block animate-pulse">▍</span>}
              </div>
            </div>
          )}

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
    </div>
  );
}
