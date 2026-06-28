'use client';

import { cn } from '@/lib/utils';

const ROWS: string[][] = [
  ['7', '8', '9', '(', ')', '←'],
  ['4', '5', '6', '+', '-', '×'],
  ['1', '2', '3', '÷', '=', '√'],
  ['0', '.', 'x', 'y', 'z', '^'],
  ['²', '³', 'π', ',', '/', 'C'],
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
    onInput(key);
  }

  return (
    <div dir="ltr" className="grid select-none gap-1.5 rounded-lg border bg-muted/40 p-2">
      {ROWS.map((row, ri) => (
        <div key={ri} className="grid grid-cols-6 gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              className={cn(
                'h-11 rounded-md border bg-background text-lg font-medium transition-colors hover:bg-accent active:scale-95',
                key === '←' && 'bg-orange-100 text-orange-700 hover:bg-orange-200',
                key === 'C' && 'bg-red-100 text-red-700 hover:bg-red-200',
                ['+', '-', '×', '÷', '=', '√', '^'].includes(key) && 'text-primary',
              )}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
