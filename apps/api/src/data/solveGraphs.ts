/**
 * رسوم الحلّ الموجّه لكل مسألة — per-problem guided solve graphs (code-level, no DB).
 *
 * نخزّنها كوحدة كود (مثل generatedHints.json) لا كجداول قاعدة بيانات، حتى تُنشر كتغيير
 * كود بحت بلا إعادة توليد Prisma Client — أكثر موثوقيّة في النشر. المفتاح = معرّف المسألة.
 * أضِف مسائل جديدة بنفس القالب: محطّات مرتّبة (بعضها إجباري) + أخطاء معروفة برسائل موجّهة.
 */
import type { GuidedGraph } from '../services/guidedSolve';

export const SOLVE_GRAPHS: Record<string, GuidedGraph> = {
  // "ثمن دفتر x وثمن قلم 4. اكتب تعبيراً لثمن 3 دفاتر وقلمين ثم احسبه عند x=6."
  cmqzjp1vo0042nbs81w2wx0d4: {
    milestones: [
      { id: 'notebooks', label: 'ثمن 3 دفاتر = 3x', targetExpr: '3x', required: false,
        praise: 'تمام، 3 دفاتر يعني 3x 👍' },
      { id: 'pens', label: 'ثمن قلمين = 8', targetExpr: '2*4', required: false,
        praise: 'صح، قلمين = 2×4 = 8 👍' },
      { id: 'expr', label: 'التعبير', targetExpr: '3x+8', required: true,
        praise: 'ممتاز! هاد هو التعبير: 3x + 8 🎯',
        pendingHint: 'اجمع ثمن الدفاتر مع ثمن القلمين بتعبير واحد.' },
      { id: 'value', label: 'القيمة عند x=6', targetExpr: '26', required: true,
        praise: 'أحسنت! القيمة عند x=6 هي 26 ✅',
        pendingHint: 'عوّض x = 6 بالتعبير واحسب القيمة.' },
    ],
    wrong: [
      { matchExpr: '5x', message: 'ما بتقدر تجمع الدفاتر مع الأقلام — الدفتر ثمنه x والقلم ثمنه 4، مختلفين. خليهم منفصلين.' },
      { matchExpr: '3x+4', message: 'قرّبت! بس عندك قلمين مش قلم واحد: 2 × 4 = 8، مش 4.' },
      { matchExpr: '3x+2', message: 'الـ2 هي عدد الأقلام، وثمن القلم 4 — لازم تضرب 2 × 4.' },
      { matchExpr: '7x', message: 'ما منجمع 3 و4 — الـ4 هو ثمن القلم مش عدد دفاتر.' },
      { matchExpr: '36', message: 'انتبه: 3 × 6 = 18، مش 36.' },
      { matchExpr: '24', message: 'راجع الجمع: 18 + 8 = ؟ (مش 24).' },
      { matchExpr: '28', message: 'راجع الجمع: 18 + 8 = ؟ (مش 28).' },
    ],
    fallbackHint: 'ابدأ بثمن 3 دفاتر (كل دفتر x)، وبعدها ثمن القلمين.',
  },
};
