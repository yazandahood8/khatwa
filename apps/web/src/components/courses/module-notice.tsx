'use client';

import { useEffect, useState } from 'react';
import { Info, X, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * ملاحظة الموديول — نافذة تنبيه تظهر عند دخول الطالب موديولًا معيّنًا (حسب رقم الشالون).
 * تُستخدم خاصةً لوحدات الأدب لتوضيح أن النصوص هنا تدريبية أصلية، وأن النصوص المعتمدة
 * رسميًا من وزارة التربية (محمية بحقوق النشر وخاصة بكل مدرسة) يضيفها المعلّم.
 * تظهر مرّة واحدة (تُحفظ في localStorage) مع زر لإعادة فتحها. الرياضيات لا نوتة لها.
 */

interface Notice {
  title: string;
  body: string;
}

// ملاحظة الأدب — تُشارك بين موديولات الأدب: B(3و)، D(4و)، F(5و).
const LITERATURE_NOTICE: Notice = {
  title: 'ملاحظة مهمّة — وحدة الأدب (Literature)',
  body:
    'النصوص الأدبية في هذه الوحدة (القصص والقصائد) أصلية ومخصّصة للتدريب على مهارات الأدب فقط: الشخصيات، الحبكة، الفكرة/الرسالة، الاستجابة الشخصية، وكتابة تقرير الكتاب.\n\n' +
    'في بجروت الأدب الحقيقية يدرس الطالب قصصًا وقصائد محدّدة من القائمة المعتمدة رسميًا من وزارة التربية، ويختار المعلّم/المدرسة النصوص منها — وهي تختلف من مدرسة لأخرى. لذلك لا يمكن تضمينها هنا لأنها محمية بحقوق النشر وخاصة بكل مدرسة.\n\n' +
    '📌 اطلب من معلّمك النصوص المعتمدة لمدرستك، أو راجع القائمة الرسمية على بوابة الإنجليزية — ثم درّب مهاراتك هنا.',
};

// ملاحظات حسب رقم الموديول (Questionnaire.number). قابلة للتوسّع لاحقًا.
const MODULE_NOTICES: Record<number, Notice> = {
  16383: LITERATURE_NOTICE, // Module B (3 وحدات)
  16483: LITERATURE_NOTICE, // Module D (4 وحدات)
  16583: LITERATURE_NOTICE, // Module F (5 وحدات — مستقبلاً)
};

export function ModuleNotice({ number }: { number: number | null }) {
  const notice = number != null ? MODULE_NOTICES[number] : undefined;
  const [open, setOpen] = useState(false);

  // يظهر تلقائيًا أول مرة لهذا الموديول، ثم يبقى زر لإعادة فتحه.
  useEffect(() => {
    if (!notice || number == null) return;
    const key = `en-module-notice-${number}`;
    if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
      setOpen(true);
    }
  }, [notice, number]);

  if (!notice || number == null) return null;

  const dismiss = () => {
    if (typeof window !== 'undefined') localStorage.setItem(`en-module-notice-${number}`, '1');
    setOpen(false);
  };

  return (
    <>
      {/* شريط تنبيه صغير دائم + زر لإعادة فتح النافذة */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-2.5 text-start text-sm font-medium text-warning transition-colors hover:bg-warning/20"
      >
        <BookMarked className="h-4 w-4 shrink-0" />
        <span className="flex-1">ملاحظة عن نصوص الأدب — اضغط للتفاصيل</span>
        <Info className="h-4 w-4 shrink-0 opacity-70" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <button className="absolute inset-0" aria-label="إغلاق" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-float">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <BookMarked className="h-5 w-5 text-warning" /> {notice.title}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground" dir="rtl">
              {notice.body}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
                إغلاق
              </Button>
              <Button variant="gradient" size="sm" onClick={dismiss}>
                فهمت، عدم الإظهار ثانيةً
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
