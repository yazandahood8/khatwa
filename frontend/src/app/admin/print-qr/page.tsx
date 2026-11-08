'use client';

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Printer } from 'lucide-react';
import { getAllProblems, type AdminProblemRow } from '@/lib/problems-api';
import { Button } from '@/components/ui/button';

// عطّل الأداة بضبط NEXT_PUBLIC_FEATURE_WORKSHEET_QR=0 — enabled unless explicitly disabled.
const FEATURE_ENABLED = process.env.NEXT_PUBLIC_FEATURE_WORKSHEET_QR !== '0';

const DIFF_LABEL: Record<string, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };

interface QrItem {
  problem: AdminProblemRow;
  dataUrl: string;
  url: string;
}

export default function PrintQrPage() {
  const [problems, setProblems] = useState<AdminProblemRow[]>([]);
  const [items, setItems] = useState<QrItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // مسائل الرياضيات فقط (language فارغ) ولها كود قابل للطباعة على الورقة.
  const printable = useMemo(
    () => problems.filter((p) => !p.language && p.code),
    [problems],
  );

  useEffect(() => {
    if (!FEATURE_ENABLED) return;
    getAllProblems()
      .then(setProblems)
      .catch((e) => setError(e instanceof Error ? e.message : 'تعذّر تحميل المسائل'))
      .finally(() => setLoading(false));
  }, []);

  // ولّد صور الباركود بعد المعرفة بالمصدر (origin) — generate QR data URLs client-side.
  useEffect(() => {
    if (!printable.length) {
      setItems([]);
      return;
    }
    let cancelled = false;
    const origin = window.location.origin;
    Promise.all(
      printable.map(async (problem) => {
        const url = `${origin}/scan?c=${encodeURIComponent(problem.code!)}`;
        const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 220 });
        return { problem, dataUrl, url } as QrItem;
      }),
    ).then((result) => {
      if (!cancelled) setItems(result);
    });
    return () => {
      cancelled = true;
    };
  }, [printable]);

  function printSheet() {
    const win = window.open('', '_blank', 'width=900,height=1200');
    if (!win) return;
    const cards = items
      .map(
        (it) => `
      <div class="card">
        <img src="${it.dataUrl}" alt="${escapeHtml(it.problem.code!)}" />
        <div class="code">${escapeHtml(it.problem.code!)}</div>
        <div class="q">${escapeHtml(truncate(it.problem.question, 90))}</div>
      </div>`,
      )
      .join('');
    win.document.write(`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
      <title>باركود أسئلة الرياضيات</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'Cairo', system-ui, sans-serif; margin: 16px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .card { border: 1px solid #d4d4d8; border-radius: 10px; padding: 10px; text-align: center; page-break-inside: avoid; }
        .card img { width: 100%; max-width: 150px; height: auto; }
        .code { font-weight: 700; font-size: 12px; margin-top: 4px; direction: ltr; }
        .q { font-size: 11px; color: #52525b; margin-top: 4px; line-height: 1.4; }
        @media print { body { margin: 8mm; } }
      </style></head><body>
      <div class="grid">${cards}</div>
      <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 250); };<\/script>
      </body></html>`);
    win.document.close();
  }

  if (!FEATURE_ENABLED) {
    return (
      <p className="text-muted-foreground">
        أداة طباعة الباركود معطّلة حالياً (NEXT_PUBLIC_FEATURE_WORKSHEET_QR=0).
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">باركود أسئلة الرياضيات</h1>
          <p className="text-sm text-muted-foreground">
            اطبع هذه الأكواد وألصق كل واحد بجانب سؤاله على الورقة. يمسحها الطالب ليصوّر حلّه للمساعد الذكي.
          </p>
        </div>
        <Button onClick={printSheet} disabled={!items.length}>
          <Printer /> طباعة ({items.length})
        </Button>
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>
      ) : printable.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          لا توجد مسائل رياضيات لها كود بعد. أضف حقل «code» للمسألة لتظهر هنا.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.problem.id}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-3 text-center shadow-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.dataUrl} alt={it.problem.code!} className="w-full max-w-[140px]" />
              <span dir="ltr" className="mt-1 text-xs font-bold">
                {it.problem.code}
              </span>
              <span className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                {truncate(it.problem.question, 60)}{' '}
                <span className="text-primary">({DIFF_LABEL[it.problem.difficulty] ?? ''})</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
