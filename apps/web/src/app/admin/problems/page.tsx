'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  getProblems,
  getProblem,
  deleteProblem,
  type ProblemListItem,
  type ProblemFull,
} from '@/lib/problems-api';
import { ProblemEditor } from '@/components/admin/problem-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DIFF_LABEL: Record<string, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };

function ProblemsManager() {
  const topicId = useSearchParams().get('topicId') ?? '';
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [editing, setEditing] = useState<ProblemFull | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!topicId) return;
    getProblems(topicId).then(setProblems).catch((e) => setError(e.message));
  }, [topicId]);

  useEffect(() => reload(), [reload]);

  async function openEdit(id: string) {
    setError(null);
    try {
      setEditing(await getProblem(id));
      setCreating(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر التحميل');
    }
  }

  function closeEditor() {
    setEditing(null);
    setCreating(false);
  }
  function afterSave() {
    closeEditor();
    reload();
  }

  if (!topicId) {
    return (
      <p className="text-muted-foreground">
        افتح هذه الصفحة من موضوع داخل{' '}
        <Link href="/admin/content" className="text-primary hover:underline">
          إدارة المحتوى
        </Link>
        .
      </p>
    );
  }

  if (creating || editing) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{editing ? 'تعديل مسألة' : 'مسألة جديدة'}</h1>
        <ProblemEditor topicId={topicId} existing={editing} onSaved={afterSave} onCancel={closeEditor} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/content" className="text-sm text-primary hover:underline">
            ‹ إدارة المحتوى
          </Link>
          <h1 className="text-2xl font-bold">مسائل الموضوع</h1>
        </div>
        <Button onClick={() => setCreating(true)}>+ مسألة جديدة</Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {problems.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا توجد مسائل بعد. أضف أول مسألة!</p>
      ) : (
        <div className="grid gap-2">
          {problems.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium" dir="ltr">{p.question}</p>
                  <p className="text-xs text-muted-foreground">
                    {DIFF_LABEL[p.difficulty] ?? p.difficulty} · {p._count?.methods ?? 0} طرق ·{' '}
                    {p._count?.commonMistakes ?? 0} أخطاء
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p.id)}>
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm('حذف المسألة؟')) deleteProblem(p.id).then(reload);
                    }}
                  >
                    🗑️
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={<p>جارٍ التحميل…</p>}>
      <ProblemsManager />
    </Suspense>
  );
}
