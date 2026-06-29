/**
 * مولّدات مسائل البرمجة (C#) — لكل مسألة: سؤال + (كود بداية اختياري) + حلٌّ مرجعي.
 * لا توجد خطوات/طرق كالرياضيات؛ يقيّم الذكاء الاصطناعي كودَ الطالب مقابل الحل المرجعي.
 * المفتاح: `${level}|${topic}|${lessonOrder}` (level = "3 وحدات" / "5 وحدات").
 * الدروس غير المغطّاة تستخدم نصوص أسئلة الخطة (بلا حلٍّ مرجعي) مؤقتاً.
 */
import { Difficulty } from '@prisma/client';

export type CsProblem = {
  question: string;
  difficulty: Difficulty;
  starterCode?: string;
  referenceSolution: string; // كود/شرح مرجعي يقيّم عليه الذكاء الاصطناعي
};
export type CsLessonGen = () => CsProblem[];

const E = Difficulty.easy;
const M = Difficulty.medium;
const H = Difficulty.hard;

const q = (
  question: string,
  difficulty: Difficulty,
  referenceSolution: string,
  starterCode?: string,
): CsProblem => ({ question, difficulty, referenceSolution, starterCode });

// ============================================================
//  3 وحدات — أساسيات البرمجة
// ============================================================

export const CS_PROBLEMS: Record<string, CsLessonGen> = {
  // ---------- المتغيرات وأنواع البيانات ----------
  '3 وحدات|المتغيرات وأنواع البيانات|3': () => [
    q(
      'أعلن متغيّرات لاسم طالب (string) وعمره (int) ومعدّله (double) وهيّئها بقيم مناسبة، ثم اطبعها.',
      E,
      `string name = "أحمد";
int age = 17;
double average = 89.5;
Console.WriteLine(name + " " + age + " " + average);`,
    ),
    q(
      'صحّح الخطأ في الكود التالي واشرح سببه:\nint x = "5";',
      M,
      `// الخطأ: إسناد نص (string) لمتغيّر int.
// التصحيح:
int x = 5;
// أو إذا كان لدينا نص فعلاً:
int y = int.Parse("5");`,
    ),
    q(
      'ما الفرق بين  int x = 5;  و  int x; x = 5;  ؟',
      H,
      `الأولى: إعلان وتهيئة في سطر واحد (declaration + initialization).
الثانية: إعلان أولاً (يحجز المتغيّر) ثم إسناد قيمة لاحقاً.
النتيجة النهائية واحدة، لكن لا يجوز استخدام x قبل إسناد قيمة له.`,
    ),
    q(
      'لماذا لا يصحّ  int 1number = 5;  ؟ اذكر قواعد تسمية المتغيّرات في C#.',
      H,
      `لا يجوز أن يبدأ اسم المتغيّر برقم.
القواعد: يبدأ بحرف أو _ ، ويتكوّن من حروف وأرقام و _ فقط،
لا يحتوي فراغات، وليس كلمة محجوزة (مثل int, class)، وحسّاس لحالة الأحرف.
مثال صحيح: int number1 = 5;`,
    ),
  ],

  '3 وحدات|المتغيرات وأنواع البيانات|4': () => [
    q(
      'ما ناتج تنفيذ:  int x = 17 % 5;  ثم  Console.WriteLine(x);  ؟',
      E,
      `2
// لأن % هي باقي القسمة: 17 = 3*5 + 2`,
    ),
    q(
      'اكتب برنامجاً يقرأ طول وعرض مستطيل (int) من المستخدم ويطبع مساحته.',
      M,
      `int length = int.Parse(Console.ReadLine());
int width = int.Parse(Console.ReadLine());
int area = length * width;
Console.WriteLine(area);`,
    ),
    q(
      'ما الفرق بين  7 / 2  و  7.0 / 2  في C# ولماذا؟',
      H,
      `7 / 2 = 3   (قسمة صحيحة integer division لأن كلا المعاملين int، يُهمَل الكسر)
7.0 / 2 = 3.5 (قسمة عشرية لأن أحد المعاملين double)
القاعدة: نوع الناتج يتبع أوسع نوع بين المعاملين.`,
    ),
    q(
      'اكتب برنامجاً يحوّل درجة حرارة من سيلزيوس إلى فهرنهايت وفق F = C × 9 / 5 + 32.',
      H,
      `double c = double.Parse(Console.ReadLine());
double f = c * 9.0 / 5 + 32;
Console.WriteLine(f);`,
    ),
  ],

  '3 وحدات|المتغيرات وأنواع البيانات|6': () => [
    q(
      'اكتب برنامجاً يطلب الاسم من المستخدم ثم يطبع: "أهلاً [الاسم]!".',
      E,
      `string name = Console.ReadLine();
Console.WriteLine("أهلاً " + name + "!");`,
    ),
    q(
      'اكتب برنامجاً يقرأ عددين صحيحين ويطبع مجموعهما.',
      M,
      `int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
Console.WriteLine(a + b);`,
    ),
    q(
      'اكتب برنامجاً يطلب الاسم والعمر الحالي ويطبع السنة التي سيبلغ فيها 100 سنة (افترض السنة 2026).',
      H,
      `string name = Console.ReadLine();
int age = int.Parse(Console.ReadLine());
int year = 2026 + (100 - age);
Console.WriteLine(name + ": " + year);`,
    ),
    q(
      'ما الخطأ في:  int x = Console.ReadLine();  وكيف تصلحه؟',
      H,
      `الخطأ: ReadLine() ترجع string ولا يمكن إسنادها مباشرة لـ int.
التصحيح:
int x = int.Parse(Console.ReadLine());
// أو
int x = Convert.ToInt32(Console.ReadLine());`,
    ),
  ],

  '3 وحدات|المتغيرات وأنواع البيانات|8': () => [
    q(
      'اطبع الحرف الثالث من الكلمة "برنامج" (الفهرسة تبدأ من 0).',
      E,
      `string s = "برنامج";
Console.WriteLine(s[2]); // الحرف الثالث`,
    ),
    q(
      'اكتب كوداً يقرأ كلمة ويطبعها معكوسة.',
      M,
      `string s = Console.ReadLine();
string reversed = "";
for (int i = s.Length - 1; i >= 0; i--)
    reversed += s[i];
Console.WriteLine(reversed);`,
    ),
    q(
      'اكتب دالة  bool IsPalindrome(string s)  ترجع true إذا كانت الكلمة تُقرأ من الجهتين بنفس الشكل.',
      H,
      `static bool IsPalindrome(string s)
{
    int i = 0, j = s.Length - 1;
    while (i < j)
    {
        if (s[i] != s[j]) return false;
        i++; j--;
    }
    return true;
}`,
    ),
    q(
      'اكتب كوداً يعدّ عدد الحروف المتحركة (a, e, i, o, u) في جملة إنجليزية ويطبع العدد.',
      H,
      `string s = Console.ReadLine().ToLower();
int count = 0;
foreach (char c in s)
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        count++;
Console.WriteLine(count);`,
    ),
  ],
};
