/**
 * محتوى الشالونات (10-12) — topics + lessons لكل نموذج، مفتاحه رقم الشالون.
 * الدروس بلا فيديو بعد؛ المدة بالثواني (mm:ss) من المصدر. تُضاف شالونات جديدة كمفاتيح جديدة.
 */

export interface QLesson {
  chapter: number; // رقم الالفصل (يُستخدم للترتيب)
  title: string;
  sec: number; // المدة بالثواني
}
export interface QTopic {
  name: string;
  lessons: QLesson[];
}
export interface QContent {
  topics: QTopic[];
}

export const QUESTIONNAIRE_CONTENT: Record<number, QContent> = {
  // الرياضيات 3 وحدات — نموذج 182
  182: {
    topics: [
      {
        name: 'الجبر',
        lessons: [
          { chapter: 1, title: 'مقدمة في الجبر', sec: 931 },
          { chapter: 2, title: 'معادلات من الدرجة الأولى', sec: 745 },
          { chapter: 3, title: 'معادلات من الدرجة الثانية', sec: 362 },
          { chapter: 4, title: 'معادلات من الدرجة الثالثة فما فوق', sec: 113 },
          { chapter: 9, title: 'تغيير موضوع الصيغة', sec: 116 },
          { chapter: 14, title: 'قراءة الرسوم البيانية', sec: 211 },
          { chapter: 15, title: 'المتتالية الحسابية', sec: 460 },
        ],
      },
      {
        name: 'الدوال والرسوم البيانية',
        lessons: [
          { chapter: 5, title: 'مقدمة في الدوال', sec: 284 },
          { chapter: 6, title: 'الدالة الخطية', sec: 504 },
          { chapter: 7, title: 'الدالة التربيعية', sec: 573 },
          { chapter: 8, title: 'أسئلة من بنك وزارة التربية والتعليم', sec: 87 },
        ],
      },
      {
        name: 'المسائل الكلامية',
        lessons: [
          { chapter: 10, title: 'مسائل كلامية أساسية', sec: 250 },
          { chapter: 11, title: 'مسائل كلامية بمجهولين', sec: 49 },
          { chapter: 12, title: 'مسائل كلامية مع النسب المئوية', sec: 306 },
          { chapter: 13, title: 'مسائل كلامية - مراجعة عامة', sec: 169 },
        ],
      },
      {
        name: 'حساب المثلثات',
        lessons: [{ chapter: 16, title: 'حساب المثلثات', sec: 623 }],
      },
      {
        name: 'الإحصاء',
        lessons: [
          { chapter: 17, title: 'مقدمة في الإحصاء', sec: 127 },
          { chapter: 18, title: 'المقاييس المركزية - المنوال', sec: 37 },
          { chapter: 19, title: 'المقاييس المركزية - المتوسط الحسابي', sec: 212 },
          { chapter: 20, title: 'المقاييس المركزية - الوسيط', sec: 63 },
          { chapter: 21, title: 'أسئلة تلخيصية - المقاييس المركزية', sec: 48 },
        ],
      },
      {
        name: 'الاحتمالات',
        lessons: [
          { chapter: 22, title: 'مقدمة في الاحتمالات', sec: 156 },
          { chapter: 23, title: 'احتمال حادثة واحدة', sec: 168 },
          { chapter: 24, title: 'احتمال حادثتين', sec: 223 },
        ],
      },
    ],
  },
};
