'use client';

import { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { SUBJECT_REFERENCE } from '@/lib/references';
import { Button } from '@/components/ui/button';

/**
 * زرّ "قواعد" — يفتح لوحة مرجع سريع لأوامر/قوانين المادة (C# أو الرياضيات).
 */
export function ReferenceButton({ subject }: { subject: 'csharp' | 'math' }) {
  const [open, setOpen] = useState(false);
  const sections = SUBJECT_REFERENCE[subject];
  const title = subject === 'csharp' ? 'أوامر C#' : 'قوانين وصيغ';

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <BookOpen className="h-4 w-4" /> قواعد
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-foreground/40 backdrop-blur-sm">
          <button className="flex-1" aria-label="إغلاق" onClick={() => setOpen(false)} />
          <div className="flex h-full w-full max-w-md flex-col bg-card shadow-float">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <BookOpen className="h-5 w-5 text-primary" /> {title}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
              <div className="space-y-5">
                {sections.map((sec) => (
                  <section key={sec.title}>
                    <h3 className="mb-2 font-display text-sm font-bold text-primary">{sec.title}</h3>
                    <div className="space-y-2">
                      {sec.items.map((it, i) => (
                        <div key={i} className="rounded-lg border border-border bg-muted/40 p-2.5">
                          {it.label && (
                            <p className="mb-1 text-xs font-medium text-muted-foreground" dir="auto">
                              {it.label}
                            </p>
                          )}
                          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-foreground" dir="ltr">
                            {it.code}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
