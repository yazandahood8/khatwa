'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';

const INDENT = '    '; // 4 مسافات
const OPEN: Record<string, string> = { '{': '}', '(': ')', '[': ']' };
const CLOSERS = new Set(['}', ')', ']']);

/**
 * محرّر كود بسيط (شبيه ببيئة المترجم): ترقيم أسطر + إزاحة تلقائية + Tab + إغلاق أقواس.
 * controlled textarea — value/onChange من الأب.
 */
export function CodeEditor({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<number | null>(null);

  const lineCount = useMemo(() => Math.max(1, value.split('\n').length), [value]);

  // بعد أي تعديل برمجي للقيمة: ضع المؤشّر في الموضع المطلوب
  useLayoutEffect(() => {
    if (caretRef.current != null && taRef.current) {
      taRef.current.selectionStart = taRef.current.selectionEnd = caretRef.current;
      caretRef.current = null;
    }
  }, [value]);

  function apply(next: string, caret: number) {
    caretRef.current = caret;
    onChange(next);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget;
    const { selectionStart: s, selectionEnd: end, value: v } = ta;
    const before = v[s - 1];
    const after = v[s];

    // Tab → مسافات
    if (e.key === 'Tab') {
      e.preventDefault();
      apply(v.slice(0, s) + INDENT + v.slice(end), s + INDENT.length);
      return;
    }

    // Enter → إزاحة تلقائية (+ توسيع الكتلة بين قوسين)
    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = v.lastIndexOf('\n', s - 1) + 1;
      const indent = (v.slice(lineStart, s).match(/^[ \t]*/) ?? [''])[0];
      if (before && OPEN[before] && after === OPEN[before]) {
        // { | }  ←  افتح كتلة بسطر مُزاح ثم القوس المغلق في سطره
        const ins = '\n' + indent + INDENT + '\n' + indent;
        apply(v.slice(0, s) + ins + v.slice(end), s + 1 + indent.length + INDENT.length);
        return;
      }
      const extra = before && OPEN[before] ? INDENT : '';
      const ins = '\n' + indent + extra;
      apply(v.slice(0, s) + ins + v.slice(end), s + ins.length);
      return;
    }

    // إغلاق تلقائي للأقواس والاقتباس
    if (s === end && (OPEN[e.key] || e.key === '"')) {
      e.preventDefault();
      const close = OPEN[e.key] ?? '"';
      apply(v.slice(0, s) + e.key + close + v.slice(end), s + 1);
      return;
    }

    // تخطّي قوس الإغلاق إن كان التالي مطابقاً
    if (s === end && (CLOSERS.has(e.key) || e.key === '"') && after === e.key) {
      e.preventDefault();
      ta.selectionStart = ta.selectionEnd = s + 1;
      return;
    }

    // Backspace: احذف الزوج الفارغ ( | )
    if (e.key === 'Backspace' && s === end && before && OPEN[before] && after === OPEN[before]) {
      e.preventDefault();
      apply(v.slice(0, s - 1) + v.slice(s + 1), s - 1);
      return;
    }
  }

  return (
    <div className={'flex font-mono text-[13px] leading-5 ' + (className ?? '')}>
      <div
        ref={gutterRef}
        aria-hidden
        className="h-72 select-none overflow-hidden py-4 pl-3 pr-2 text-left text-white/25"
        dir="ltr"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onScroll={(e) => {
          if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop;
        }}
        dir="ltr"
        wrap="off"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={placeholder}
        className="h-72 flex-1 overflow-auto whitespace-pre bg-transparent py-4 pl-2 pr-4 leading-5 text-[#d4d4e8] outline-none scrollbar-thin placeholder:text-white/30"
      />
    </div>
  );
}
