'use client';

import { useState } from 'react';
import { Difficulty } from '@khatwa/shared';
import {
  createProblem,
  updateProblem,
  type ProblemFull,
} from '@/lib/problems-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StepForm {
  description: string;
  expression: string;
  hint: string;
}
interface MethodForm {
  name: string;
  isRecommended: boolean;
  steps: StepForm[];
}
interface MistakeForm {
  description: string;
  wrongExample: string;
  correction: string;
}

const emptyStep = (): StepForm => ({ description: '', expression: '', hint: '' });
const emptyMethod = (): MethodForm => ({ name: '', isRecommended: false, steps: [emptyStep()] });
const emptyMistake = (): MistakeForm => ({ description: '', wrongExample: '', correction: '' });

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: Difficulty.EASY, label: 'سهل' },
  { value: Difficulty.MEDIUM, label: 'متوسط' },
  { value: Difficulty.HARD, label: 'صعب' },
];

// نوع المسألة — رياضيات (طرق/خطوات) أو أنواع الإنجليزية.
type EditorKind = 'math' | 'mcq' | 'cloze' | 'reading' | 'writing';
const ENGLISH_KINDS = ['mcq', 'cloze', 'reading', 'writing'] as const;
const KINDS: { value: EditorKind; label: string }[] = [
  { value: 'math', label: 'رياضيات (طرق وخطوات)' },
  { value: 'mcq', label: 'إنجليزي — اختيار من متعدّد' },
  { value: 'cloze', label: 'إنجليزي — إكمال فراغ' },
  { value: 'reading', label: 'إنجليزي — فهم مقروء' },
  { value: 'writing', label: 'إنجليزي — كتابة' },
];

export function ProblemEditor({
  topicId,
  existing,
  onSaved,
  onCancel,
}: {
  topicId: string;
  existing: ProblemFull | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(existing?.code ?? '');
  const [question, setQuestion] = useState(existing?.question ?? '');
  const [finalAnswer, setFinalAnswer] = useState(existing?.finalAnswer ?? '');
  const [difficulty, setDifficulty] = useState<Difficulty>(
    (existing?.difficulty as Difficulty) ?? Difficulty.MEDIUM,
  );
  const [methods, setMethods] = useState<MethodForm[]>(
    existing?.methods.map((m) => ({
      name: m.name,
      isRecommended: m.isRecommended,
      steps: m.steps.map((s) => ({
        description: s.description,
        expression: s.expression,
        hint: s.hint,
      })),
    })) ?? [emptyMethod()],
  );
  const [mistakes, setMistakes] = useState<MistakeForm[]>(
    existing?.commonMistakes.map((m) => ({
      description: m.description,
      wrongExample: m.wrongExample,
      correction: m.correction,
    })) ?? [],
  );
  const initialKind: EditorKind = ENGLISH_KINDS.includes(existing?.kind as (typeof ENGLISH_KINDS)[number])
    ? (existing!.kind as EditorKind)
    : 'math';
  const [kind, setKind] = useState<EditorKind>(initialKind);
  const [choices, setChoices] = useState<string[]>(
    existing?.choices?.map((c) => c.text) ?? ['', '', '', ''],
  );
  const [correctIndex, setCorrectIndex] = useState<number>(() => {
    const idx = existing?.choices?.findIndex((c) => c.text === existing.finalAnswer) ?? -1;
    return idx >= 0 ? idx : 0;
  });
  const [passage, setPassage] = useState(existing?.passage ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isMath = kind === 'math';
  const isMcq = kind === 'mcq';
  const showPassage = kind === 'reading' || kind === 'writing' || kind === 'mcq';

  // ----- method helpers -----
  const updateMethod = (i: number, patch: Partial<MethodForm>) =>
    setMethods((ms) => ms.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const updateStep = (mi: number, si: number, patch: Partial<StepForm>) =>
    setMethods((ms) =>
      ms.map((m, idx) =>
        idx === mi
          ? { ...m, steps: m.steps.map((s, sidx) => (sidx === si ? { ...s, ...patch } : s)) }
          : m,
      ),
    );
  const moveStep = (mi: number, si: number, dir: -1 | 1) =>
    setMethods((ms) =>
      ms.map((m, idx) => {
        if (idx !== mi) return m;
        const steps = [...m.steps];
        const j = si + dir;
        if (j < 0 || j >= steps.length) return m;
        [steps[si], steps[j]] = [steps[j], steps[si]];
        return { ...m, steps };
      }),
    );

  async function save() {
    setError(null);

    // الجواب النهائي: لِـ mcq مشتقّ من الخيار الصحيح؛ لغيرها الحقل النصّي.
    const cleanedChoices = choices.map((c) => c.trim()).filter(Boolean);
    const derivedAnswer = isMcq ? (choices[correctIndex]?.trim() ?? '') : finalAnswer.trim();

    const payload = {
      ...(existing ? {} : { topicId }),
      code: code.trim() || undefined,
      question: question.trim(),
      finalAnswer: derivedAnswer,
      difficulty,
      ...(isMath ? {} : { language: 'english', kind }),
      ...(isMcq ? { choices: cleanedChoices.map((text) => ({ text })) } : {}),
      ...(showPassage && passage.trim() ? { passage: passage.trim() } : {}),
      methods: isMath
        ? methods.map((m) => ({
            name: m.name.trim(),
            isRecommended: m.isRecommended,
            steps: m.steps.map((s, i) => ({
              stepNumber: i + 1,
              description: s.description.trim(),
              expression: s.expression.trim(),
              hint: s.hint.trim(),
            })),
          }))
        : [],
      commonMistakes: mistakes.map((m) => ({
        description: m.description.trim(),
        wrongExample: m.wrongExample.trim(),
        correction: m.correction.trim(),
      })),
    };
    // basic client checks
    if (!payload.question || !payload.finalAnswer) {
      setError(isMcq ? 'السؤال مطلوب، وحدّد الخيار الصحيح' : 'السؤال والجواب النهائي مطلوبان');
      return;
    }
    if (isMath && payload.methods.some((m) => !m.name || m.steps.some((s) => !s.description || !s.expression || !s.hint))) {
      setError('أكمل كل حقول الطرق والخطوات (الوصف + التعبير + التلميح)');
      return;
    }
    if (isMcq && cleanedChoices.length < 2) {
      setError('أضف خيارين على الأقل وحدّد الصحيح منها');
      return;
    }
    setSaving(true);
    try {
      if (existing) await updateProblem(existing.id, payload);
      else await createProblem(payload as Parameters<typeof createProblem>[0]);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle>{existing ? 'تعديل مسألة' : 'مسألة جديدة'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* نوع المسألة */}
        <div className="space-y-1">
          <Label>نوع المسألة</Label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as EditorKind)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        {/* basics */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>السؤال</Label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              dir="auto"
              placeholder={isMath ? 'مثال: حل المعادلة x² + 5x + 6 = 0' : 'نصّ السؤال / التعليمات'}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          {!isMcq && (
            <div className="space-y-1">
              <Label>{isMath ? 'الجواب النهائي' : 'الإجابة / النقاط المرجعية (سرّية)'}</Label>
              <Input
                value={finalAnswer}
                onChange={(e) => setFinalAnswer(e.target.value)}
                dir="auto"
                placeholder={isMath ? 'x = -2 أو x = -3' : 'الإجابة النموذجية أو أهمّ النقاط المطلوبة'}
              />
            </div>
          )}
          <div className="space-y-1">
            <Label>الصعوبة</Label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label>الرمز (اختياري)</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="MATH-10-4YH-EQ2-Q1" dir="ltr" />
          </div>
        </div>

        {/* القطعة / موجز المهمّة (فهم مقروء / كتابة / اختيار بقطعة) */}
        {showPassage && (
          <div className="space-y-1">
            <Label>{kind === 'writing' ? 'موجز المهمّة (Task) — اختياري' : 'القطعة (Passage) — اختياري لأسئلة الاختيار'}</Label>
            <textarea
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              rows={kind === 'reading' ? 6 : 3}
              dir="ltr"
              placeholder={kind === 'writing' ? 'Write a letter to… (150 words)' : 'Paste the reading passage here…'}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        )}

        {/* خيارات الاختيار من متعدّد */}
        {isMcq && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">الخيارات (حدّد الصحيح)</h3>
              {choices.length < 6 && (
                <Button size="sm" variant="outline" onClick={() => setChoices((c) => [...c, ''])}>
                  + خيار
                </Button>
              )}
            </div>
            {choices.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct-choice"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                  title="الإجابة الصحيحة"
                />
                <Input
                  value={c}
                  onChange={(e) => setChoices((cs) => cs.map((x, idx) => (idx === i ? e.target.value : x)))}
                  dir="ltr"
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                />
                {choices.length > 2 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setChoices((cs) => cs.filter((_, idx) => idx !== i))
                    }
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <p className="text-xs text-muted-foreground">الزرّ الدائري يحدّد الخيار الصحيح (يُخزَّن كالجواب النهائي).</p>
          </div>
        )}

        {/* methods (رياضيات فقط) */}
        {isMath && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">طرق الحل</h3>
            <Button size="sm" variant="outline" onClick={() => setMethods((m) => [...m, emptyMethod()])}>
              + طريقة
            </Button>
          </div>
          {methods.map((m, mi) => (
            <Card key={mi} className="bg-muted/30">
              <CardContent className="space-y-3 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    value={m.name}
                    onChange={(e) => updateMethod(mi, { name: e.target.value })}
                    placeholder="اسم الطريقة (تحليل / قانون عام)"
                    className="w-56"
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={m.isRecommended}
                      onChange={(e) => updateMethod(mi, { isRecommended: e.target.checked })}
                    />
                    موصى بها
                  </label>
                  {methods.length > 1 && (
                    <Button size="sm" variant="ghost" onClick={() => setMethods((ms) => ms.filter((_, i) => i !== mi))}>
                      حذف الطريقة 🗑️
                    </Button>
                  )}
                </div>

                {m.steps.map((s, si) => (
                  <div key={si} className="grid gap-2 rounded-md border p-2 sm:grid-cols-[auto_1fr]">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="text-xs text-muted-foreground">خطوة {si + 1}</span>
                      <div className="flex gap-1">
                        <button onClick={() => moveStep(mi, si, -1)} className="text-xs" title="أعلى">▲</button>
                        <button onClick={() => moveStep(mi, si, 1)} className="text-xs" title="أسفل">▼</button>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <Input value={s.description} onChange={(e) => updateStep(mi, si, { description: e.target.value })} placeholder="وصف الخطوة" />
                      <Input value={s.expression} onChange={(e) => updateStep(mi, si, { expression: e.target.value })} placeholder="التعبير الرياضي" dir="ltr" />
                      <div className="flex gap-1">
                        <Input value={s.hint} onChange={(e) => updateStep(mi, si, { hint: e.target.value })} placeholder="التلميح" />
                        {m.steps.length > 1 && (
                          <Button size="sm" variant="ghost" onClick={() => updateMethod(mi, { steps: m.steps.filter((_, i) => i !== si) })}>
                            ✕
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => updateMethod(mi, { steps: [...m.steps, emptyStep()] })}>
                  + خطوة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* common mistakes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">الأخطاء الشائعة</h3>
            <Button size="sm" variant="outline" onClick={() => setMistakes((m) => [...m, emptyMistake()])}>
              + خطأ
            </Button>
          </div>
          {mistakes.map((mk, i) => (
            <div key={i} className="grid gap-2 rounded-md border p-2 sm:grid-cols-3">
              <Input value={mk.description} onChange={(e) => setMistakes((ms) => ms.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x)))} placeholder="وصف الخطأ" />
              <Input value={mk.wrongExample} onChange={(e) => setMistakes((ms) => ms.map((x, idx) => (idx === i ? { ...x, wrongExample: e.target.value } : x)))} placeholder="مثال خاطئ" dir="ltr" />
              <div className="flex gap-1">
                <Input value={mk.correction} onChange={(e) => setMistakes((ms) => ms.map((x, idx) => (idx === i ? { ...x, correction: e.target.value } : x)))} placeholder="التصحيح" />
                <Button size="sm" variant="ghost" onClick={() => setMistakes((ms) => ms.filter((_, idx) => idx !== i))}>✕</Button>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving}>
            {saving ? 'جارٍ الحفظ…' : 'حفظ المسألة'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
