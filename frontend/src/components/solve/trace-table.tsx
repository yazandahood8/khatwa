'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Play, RotateCcw, CheckCircle2, AlertTriangle, XCircle, TableProperties, Lightbulb, Plus } from 'lucide-react';
import { streamJudge } from '@/lib/ai-api';
import { getAttempt, getTopicProgress, type ProblemFull, type ProblemListItem } from '@/lib/problems-api';
import { ApiClientError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Celebration } from '@/components/solve/celebration';
import { QuestionNav } from '@/components/solve/question-nav';
import { ReferenceButton } from '@/components/solve/reference-button';
import { cn } from '@/lib/utils';

type Verdict = 'correct' | 'partial' | 'incorrect';
const VERDICT_RE = /\[(CORRECT|PARTIAL|INCORRECT)\]/g;

const DEFAULT_HEADERS = ['الخطوة', 'المتغيّر', 'الطباعة'];
const emptyRow = (n: number) => Array.from({ length: n }, () => '');

/** شاشة تتبّع عادي — الطالب يملأ جدول تتبّع (טבلת מעקب) ويقيّمه المصحّح الذكي. */
export function TraceTable({ problem, sequence }: { problem: ProblemFull; sequence: ProblemListItem[] }) {
  const router = useRouter();
  const id = problem.id;

  const [headers, setHeaders] = useState<string[]>(DEFAULT_HEADERS);
  const [rows, setRows] = useState<string[][]>([emptyRow(3), emptyRow(3), emptyRow(3)]);
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
    setHeaders(DEFAULT_HEADERS);
    setRows([emptyRow(3), emptyRow(3), emptyRow(3)]);
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

  function setCell(r: number, c: number, v: string) {
    setRows((prev) => prev.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row)));
  }
  function setHeader(c: number, v: string) {
    setHeaders((prev) => prev.map((h, ci) => (ci === c ? v : h)));
  }
  function addRow() {
    setRows((prev) => [...prev, emptyRow(headers.length)]);
  }
  function addCol() {
    setHeaders((prev) => [...prev, `عمود ${prev.length + 1}`]);
    setRows((prev) => prev.map((row) => [...row, '']));
  }
  function resetGrid() {
    setHeaders(DEFAULT_HEADERS);
    setRows([emptyRow(3), emptyRow(3), emptyRow(3)]);
  }

  const hasContent = rows.some((r) => r.some((c) => c.trim()));

  /** حوّل الشبكة إلى جدول Markdown يُرسَل للمصحّح. */
  function serialize() {
    const head = `| ${headers.join(' | ')} |`;
    const sep = `| ${headers.map(() => '---').join(' | ')} |`;
    const body = rows
      .filter((r) => r.some((c) => c.trim()))
      .map((r) => `| ${r.map((c) => c.trim() || ' ').join(' | ')} |`)
      .join('\n');
    return `${head}\n${sep}\n${body}`;
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
      await streamJudge(id, { code: hasContent ? serialize() : '', history: [], hint: true }, (chunk) => {
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

  async function judge() {
    if (!hasContent || busy) return;
    setBusy(true);
    setPanelMode('judge');
    setFeedback('');
    setVerdict(null);
    setError(null);
    rawRef.current = '';
    try {
      await streamJudge(id, { code: serialize(), history: [] }, (chunk) => {
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
        e instanceof ApiClientError && e.code === 'RATE_LIMITED' ? e.message : 'تعذّر الاتصال بالمصحّح. حاول مرة ثانية.',
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
    <div className="flex h-screen flex-col overflow-hidden bg-secondary/50">
      <header className="m-3 mb-0 flex items-center gap-4 rounded-full bg-card px-4 py-2.5 shadow-card ring-1 ring-primary/10 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <QuestionNav
            problems={sequence}
            currentId={id}
            icon={<TableProperties className="h-4 w-4 text-primary" />}
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
          <div className="rounded-3xl border-e-8 border-primary bg-card p-6 shadow-elevated">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">تتبّع الكود التالي بجدول التتبّع</p>
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed" dir="ltr">
              {problem.question}
            </div>
          </div>

          {/* جدول التتبّع القابل للتحرير */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">جدول التتبّع</span>
              <button
                onClick={resetGrid}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                type="button"
              >
                <RotateCcw className="h-3 w-3" /> إعادة تعيين
              </button>
            </div>
            <div className="overflow-x-auto p-3 scrollbar-thin">
              <table className="w-full border-collapse text-sm" dir="rtl">
                <thead>
                  <tr>
                    {headers.map((h, c) => (
                      <th key={c} className="border border-border p-1">
                        <input
                          value={h}
                          onChange={(e) => setHeader(c, e.target.value)}
                          className="w-full min-w-24 rounded bg-muted/40 px-2 py-1 text-center text-xs font-semibold outline-none focus:bg-muted"
                          dir="auto"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} className="border border-border p-1">
                          <input
                            value={cell}
                            onChange={(e) => setCell(r, c, e.target.value)}
                            className="w-full min-w-24 rounded px-2 py-1 text-center outline-none focus:bg-muted/50"
                            dir="auto"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border px-3 py-2">
              <Button size="sm" variant="outline" onClick={addRow}>
                <Plus className="h-3.5 w-3.5" /> صفّ
              </Button>
              <Button size="sm" variant="outline" onClick={addCol}>
                <Plus className="h-3.5 w-3.5" /> عمود
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="gradient" onClick={judge} disabled={busy || !hasContent} className="flex-1 sm:flex-none">
              <Play /> {busy && panelMode === 'judge' ? 'جارٍ الفحص…' : 'افحص تتبّعي'}
            </Button>
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
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-3xl bg-lime-light px-5 py-4">
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
