'use client';

import { useMemo, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { QuestionText } from '@/components/math/question-text';
import type { HintWord } from '@/lib/problems-api';
import { cn } from '@/lib/utils';

/**
 * نصّ إنجليزي (سؤال أو قطعة) مع زرّ «تلميح» تدريجي (بلا ذكاء اصطناعي):
 *  - ضغطة 1: تُبرِز الكلمات المهمة في النصّ (عريضة + حمراء).
 *  - ضغطة 2: تُظهر ترجمتها العربية أسفل النصّ.
 *  - ضغطة 3: تُخفي كلّ شيء وتعود للحالة الأصلية.
 * الكلمات وترجماتها تأتي مع المسألة (hintWords / passageHintWords). نصّ بلا كلمات لا يُظهر الزرّ.
 */

type Token = { match: boolean; text: string };

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// يقسّم نصّ السؤال إلى مقاطع مطابِقة (كلمة مهمة) وغير مطابِقة، مع الحفاظ على حالة الأحرف الأصلية.
function tokenize(text: string, words: HintWord[]): Token[] {
  const uniq = [...new Set(words.map((w) => w.en.trim()).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  if (uniq.length === 0) return [{ match: false, text }];
  const re = new RegExp(`\\b(${uniq.map(escapeRegExp).join('|')})\\b`, 'gi');
  const out: Token[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ match: false, text: text.slice(last, i) });
    out.push({ match: true, text: m[0] });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ match: false, text: text.slice(last) });
  return out;
}

export function QuestionHint({
  text,
  hintWords,
  label = 'تلميح',
  className,
  textClassName = 'text-xl leading-relaxed',
  dir = 'auto',
}: {
  text: string;
  hintWords?: HintWord[] | null;
  label?: string;
  className?: string;
  textClassName?: string;
  dir?: 'auto' | 'ltr' | 'rtl';
}) {
  // 0 = عادي، 1 = إبراز، 2 = ترجمة
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const words = hintWords ?? [];
  const hasWords = words.length > 0;
  const tokens = useMemo(() => tokenize(text, words), [text, words]);

  const next = () => setStage((s) => ((s + 1) % 3) as 0 | 1 | 2);
  const btnText = stage === 0 ? label : stage === 1 ? 'الترجمة' : 'إخفاء';

  return (
    <div className={className}>
      <div className={textClassName} dir={dir}>
        {hasWords
          ? tokens.map((t, i) =>
              t.match ? (
                <span
                  key={i}
                  dir="ltr"
                  style={{ unicodeBidi: 'isolate' }}
                  className={cn(stage >= 1 && 'font-bold text-destructive')}
                >
                  {t.text}
                </span>
              ) : (
                <QuestionText key={i} text={t.text} />
              ),
            )
          : <QuestionText text={text} />}
      </div>

      {hasWords && (
        <>
          <button
            type="button"
            onClick={next}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-3 py-1.5 text-sm font-medium text-warning transition-colors hover:bg-warning/20"
          >
            <Lightbulb className="h-4 w-4" /> {btnText}
          </button>

          {stage === 2 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {words.map((w, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-sm"
                >
                  <span dir="ltr" className="font-semibold text-destructive">
                    {w.en}
                  </span>
                  <span className="text-muted-foreground">—</span>
                  <span dir="rtl">{w.ar}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
