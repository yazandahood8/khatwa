/**
 * محتوى الشالونات (10-12) — topics + lessons لكل שאלون، مفتاحه رقم الشالون.
 * الدروس بلا فيديو بعد؛ المدة بالثواني (mm:ss) من المصدر. تُضاف شالونات جديدة كمفاتيح جديدة.
 */

export interface QLesson {
  chapter: number; // رقم الפרק (يُستخدم للترتيب)
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
  // מתמטיקה 3 יחידות — שאלון 182
  182: {
    topics: [
      {
        name: 'אלגברה',
        lessons: [
          { chapter: 1, title: 'מבוא לאלגברה', sec: 931 },
          { chapter: 2, title: 'משוואות ממעלה ראשונה', sec: 745 },
          { chapter: 3, title: 'משוואות ממעלה שנייה', sec: 362 },
          { chapter: 4, title: 'משוואות ממעלה שלישית ומעלה', sec: 113 },
          { chapter: 9, title: 'שינוי נושא נוסחה', sec: 116 },
          { chapter: 14, title: 'קריאת גרפים', sec: 211 },
          { chapter: 15, title: 'סדרה חשבונית', sec: 460 },
        ],
      },
      {
        name: 'פונקציות וגרפים',
        lessons: [
          { chapter: 5, title: 'מבוא לפונקציות', sec: 284 },
          { chapter: 6, title: 'הפונקציה הקווית', sec: 504 },
          { chapter: 7, title: 'הפונקציה הריבועית', sec: 573 },
          { chapter: 8, title: 'שאלות מתוך מאגר משרד החינוך', sec: 87 },
        ],
      },
      {
        name: 'בעיות מילוליות',
        lessons: [
          { chapter: 10, title: 'בעיות מילוליות יסודיות', sec: 250 },
          { chapter: 11, title: 'בעיות מילוליות בשני נעלמים', sec: 49 },
          { chapter: 12, title: 'בעיות מילוליות עם אחוזים', sec: 306 },
          { chapter: 13, title: 'בעיות מילוליות - חזרה כללית', sec: 169 },
        ],
      },
      {
        name: 'טריגונומטריה',
        lessons: [{ chapter: 16, title: 'טריגונומטריה', sec: 623 }],
      },
      {
        name: 'סטטיסטיקה',
        lessons: [
          { chapter: 17, title: 'מבוא לסטטיסטיקה', sec: 127 },
          { chapter: 18, title: 'מדדים מרכזיים - השכיח', sec: 37 },
          { chapter: 19, title: 'מדדים מרכזיים - הממוצע', sec: 212 },
          { chapter: 20, title: 'מדדים מרכזיים - החציון', sec: 63 },
          { chapter: 21, title: 'שאלות מסכמות - מדדים מרכזיים', sec: 48 },
        ],
      },
      {
        name: 'הסתברות',
        lessons: [
          { chapter: 22, title: 'מבוא להסתברות', sec: 156 },
          { chapter: 23, title: 'הסתברות של מאורע בודד', sec: 168 },
          { chapter: 24, title: 'הסתברות של שני מאורעות', sec: 223 },
        ],
      },
    ],
  },
};
