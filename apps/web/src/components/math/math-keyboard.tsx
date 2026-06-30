'use client';

import { Delete } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROWS: string[][] = [
  ['7', '8', '9', '(', ')', '←'],
  ['4', '5', '6', '+', '-', '×'],
  ['1', '2', '3', '÷', '=', '√'],
  ['0', '.', 'x', 'y', 'z', '^'],
  ['²', '³', 'π', '|', ',', '/'],
  ['sin', 'cos', 'tan', 'e', '[', ']'],
  ['{', '}', '≤', '≥', '±', 'C'],
];

// رموز تُدرَج بصيغة مختلفة عن النص الظاهر — keys whose inserted token differs from the label.
const INSERT: Record<string, string> = { sin: 'sin(', cos: 'cos(', tan: 'tan(' };

const OPERATORS = [
  '+', '-', '×', '÷', '=', '√', '^', '(', ')', '/',
  '|', '[', ']', '{', '}', '≤', '≥', '±', 'sin', 'cos', 'tan',
];

/** لوحة المفاتيح الرياضية — math input keyboard. */
export function MathKeyboard({
  onInput,
  onBackspace,
  onClear,
}: {
  onInput: (token: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}) {
  function press(key: string) {
    if (key === '←') return onBackspace();
    if (key === 'C') return onClear();
    onInput(INSERT[key] ?? key);
  }

  return (
    <div
      dir="ltr"
      className="grid select-none gap-2 rounded-xl border border-border bg-muted/40 p-2.5"
    >
      {ROWS.map((row, ri) => (
        <div key={ri} className="grid grid-cols-6 gap-2">
          {row.map((key) => {
            const isOp = OPERATORS.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => press(key)}
                className={cn(
                  'flex h-[52px] items-center justify-center rounded-[10px] border border-border bg-card font-mono text-lg font-medium text-foreground transition-all duration-[120ms]',
                  'hover:border-primary hover:bg-primary-light active:scale-[0.93] active:border-primary active:bg-primary active:text-white',
                  isOp && 'text-primary',
                  key === '←' &&
                    'border-warning/30 bg-warning/10 text-warning hover:border-warning hover:bg-warning/20',
                  key === 'C' &&
                    'border-destructive/30 bg-destructive/10 text-destructive hover:border-destructive hover:bg-destructive/20',
                )}
                aria-label={key === '←' ? 'حذف' : key === 'C' ? 'مسح الكل' : key}
              >
                {key === '←' ? <Delete className="h-5 w-5" /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
