import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionHint } from '@/components/solve/question-hint';

/**
 * زرّ «تلميح» (بلا ذكاء اصطناعي) — 3 مراحل: عادي → إبراز → ترجمة → عادي.
 * منطق عميل صرف: لا شبكة، لا خادم.
 */

const words = [
  { en: 'home', ar: 'بيت' },
  { en: 'food', ar: 'طعام' },
];

describe('QuestionHint (تلميح word-hint)', () => {
  it('renders no button when there are no hint words', () => {
    render(<QuestionHint text="نصّ بلا كلمات مهمّة" hintWords={[]} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('نصّ بلا كلمات مهمّة')).toBeInTheDocument();
  });

  it('cycles through the three stages: highlight → translate → hide', async () => {
    const user = userEvent.setup();
    render(<QuestionHint text="I love my home and my food" hintWords={words} />);

    // المرحلة 0 — الزرّ يعرض «تلميح»، بلا إبراز ولا ترجمة.
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('تلميح');
    expect(screen.getByText('home')).not.toHaveClass('font-bold');
    expect(screen.queryByText('بيت')).toBeNull();

    // المرحلة 1 — إبراز: الكلمات المهمّة تصير عريضة/حمراء، الزرّ «الترجمة».
    await user.click(button);
    expect(button).toHaveTextContent('الترجمة');
    expect(screen.getByText('home')).toHaveClass('font-bold', 'text-destructive');
    expect(screen.getByText('food')).toHaveClass('font-bold');

    // المرحلة 2 — ترجمة: تظهر قائمة en — ar، الزرّ «إخفاء».
    await user.click(button);
    expect(button).toHaveTextContent('إخفاء');
    expect(screen.getByText('بيت')).toBeInTheDocument();
    expect(screen.getByText('طعام')).toBeInTheDocument();

    // المرحلة 3 — العودة للحالة الأصلية.
    await user.click(button);
    expect(button).toHaveTextContent('تلميح');
    expect(screen.queryByText('بيت')).toBeNull();
  });

  it('matches whole words case-insensitively and respects word boundaries', async () => {
    const user = userEvent.setup();
    // "home" مطابقة رغم اختلاف الحالة؛ "homework" لا تُطابق (حدّ كلمة).
    render(<QuestionHint text="Home is not homework" hintWords={[{ en: 'home', ar: 'بيت' }]} />);
    await user.click(screen.getByRole('button')); // مرحلة الإبراز

    // الكلمة المستقلة "Home" مبرزة (بحالتها الأصلية)…
    expect(screen.getByText('Home')).toHaveClass('font-bold');
    // …و"homework" لم تُبرَز (لا يوجد span عريض نصّه homework).
    expect(screen.queryByText('homework')).toBeNull(); // مدمجة ضمن مقطع غير مطابِق
    const bold = document.querySelectorAll('.font-bold');
    expect(bold).toHaveLength(1);
    expect(bold[0]).toHaveTextContent('Home');
  });
});
