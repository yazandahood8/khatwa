import { segmentBidi } from '@/lib/bidi';

/**
 * يعرض نصّ سؤال يخلط العربية بالرياضيات مع عزل كل مقطع رياضي (bidi isolation)
 * حتى لا تتشوّش الرموز المحايدة. renders a mixed Arabic/math question stem.
 */
export function QuestionText({ text, className }: { text: string; className?: string }) {
  const segments = segmentBidi(text);
  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.kind === 'math' ? (
          <span key={i} dir="ltr" style={{ unicodeBidi: 'isolate' }}>
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </span>
  );
}
