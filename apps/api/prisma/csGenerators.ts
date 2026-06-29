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

  // ---------- الدوال (Methods) ----------
  '3 وحدات|الدوال (Methods)|2': () => [
    q('اكتب دالة void PrintLine() تطبع خطاً مكوّناً من 20 نجمة.', E,
      `static void PrintLine()
{
    for (int i = 0; i < 20; i++)
        Console.Write("*");
    Console.WriteLine();
}`),
    q('اكتب دالة void PrintSquare(int n) تطبع مربّع نجوم بحجم n×n.', M,
      `static void PrintSquare(int n)
{
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
            Console.Write("*");
        Console.WriteLine();
    }
}`),
    q('اكتب دالة void PrintMultiplicationTable(int n) تطبع جدول ضرب العدد n من 1 إلى 10.', H,
      `static void PrintMultiplicationTable(int n)
{
    for (int i = 1; i <= 10; i++)
        Console.WriteLine(n + " x " + i + " = " + (n * i));
}`),
    q('اكتب دالة void PrintDiamond(int n) تطبع معيّن نجوم متماثلاً ارتفاعه n.', H,
      `static void PrintDiamond(int n)
{
    for (int i = 1; i <= n; i++)
    {
        for (int s = 0; s < n - i; s++) Console.Write(" ");
        for (int j = 0; j < 2 * i - 1; j++) Console.Write("*");
        Console.WriteLine();
    }
    for (int i = n - 1; i >= 1; i--)
    {
        for (int s = 0; s < n - i; s++) Console.Write(" ");
        for (int j = 0; j < 2 * i - 1; j++) Console.Write("*");
        Console.WriteLine();
    }
}`),
  ],

  '3 وحدات|الدوال (Methods)|3': () => [
    q('اكتب دالة int Max(int a, int b) ترجع الأكبر بين العددين.', E,
      `static int Max(int a, int b)
{
    if (a > b) return a;
    return b;
}`),
    q('اكتب دالة bool IsEven(int n) ترجع true إذا كان العدد زوجياً.', M,
      `static bool IsEven(int n)
{
    return n % 2 == 0;
}`),
    q('اكتب دالة double CalcAverage(int a, int b, int c) ترجع متوسط الأعداد الثلاثة.', H,
      `static double CalcAverage(int a, int b, int c)
{
    return (a + b + c) / 3.0;
}`),
    q('اكتب دالة int GCD(int a, int b) ترجع القاسم المشترك الأكبر (خوارزمية إقليدس).', H,
      `static int GCD(int a, int b)
{
    while (b != 0)
    {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`),
  ],

  '3 وحدات|الدوال (Methods)|6': () => [
    q('باستخدام الدالة Max(int, int)، اكتب دالة Max3(int a, int b, int c) ترجع أكبر ثلاثة أعداد.', E,
      `static int Max3(int a, int b, int c)
{
    return Max(Max(a, b), c);
}`),
    q('اكتب دالة bool IsPrime(int n) تتحقق إن كان العدد أولياً.', M,
      `static bool IsPrime(int n)
{
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}`),
    q('اكتب دالتين: Celsius2Fahrenheit(double c) و Fahrenheit2Celsius(double f).', H,
      `static double Celsius2Fahrenheit(double c) => c * 9.0 / 5 + 32;
static double Fahrenheit2Celsius(double f) => (f - 32) * 5.0 / 9;`),
    q('اكتب دالة int Power(int b, int exp) تحسب b مرفوعاً للأس exp بدون استخدام Math.Pow.', H,
      `static int Power(int b, int exp)
{
    int result = 1;
    for (int i = 0; i < exp; i++)
        result *= b;
    return result;
}`),
  ],

  // ---------- الشروط والتحقق ----------
  '3 وحدات|الشروط والتحقق|3': () => [
    q('اكتب برنامجاً يقرأ عدداً صحيحاً ويطبع إن كان موجباً أو سالباً أو صفراً.', E,
      `int n = int.Parse(Console.ReadLine());
if (n > 0) Console.WriteLine("موجب");
else if (n < 0) Console.WriteLine("سالب");
else Console.WriteLine("صفر");`),
    q('اقرأ علامة طالب واطبع: "راسب" إن كانت أقل من 55، "ناجح" إن كانت بين 55 و89، "ممتاز" إن كانت 90 فأكثر.', M,
      `int g = int.Parse(Console.ReadLine());
if (g < 55) Console.WriteLine("راسب");
else if (g < 90) Console.WriteLine("ناجح");
else Console.WriteLine("ممتاز");`),
    q('اكتب دالة string Grade(int score) ترجع: 90-100 "ممتاز"، 80-89 "جيد جداً"، 70-79 "جيد"، 60-69 "مقبول"، أقل من 60 "راسب".', H,
      `static string Grade(int score)
{
    if (score >= 90) return "ممتاز";
    if (score >= 80) return "جيد جداً";
    if (score >= 70) return "جيد";
    if (score >= 60) return "مقبول";
    return "راسب";
}`),
    q('اكتب دالة bool IsLeap(int year) تتحقق إن كانت السنة كبيسة (تقبل القسمة على 4، عدا القرون إلا إذا قبلت القسمة على 400).', H,
      `static bool IsLeap(int year)
{
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}`),
  ],

  '3 وحدات|الشروط والتحقق|7': () => [
    q('تتبّع الكود وأعطِ الطباعة النهائية:\nint x = 5, y = 3;\nif (x > y) { x = x - y; y = y + 1; }\nelse { y = x + y; }\nConsole.WriteLine(x + " " + y);', E,
      `الطباعة: 2 4
التتبّع: x>y صحيح ⇒ x = 5-3 = 2، y = 3+1 = 4`),
    q('تتبّع الكود وأعطِ الناتج:\nint a = 10;\nif (a % 3 == 0) a = a / 3;\nelse a = a * 2;\nConsole.WriteLine(a);', M,
      `الناتج: 20
التتبّع: 10 % 3 = 1 ≠ 0 ⇒ a = 10 * 2 = 20`),
    q('تتبّع الكود وأعطِ الناتج:\nint x = 7;\nif (x > 5) { if (x % 2 == 1) x = x + 10; else x = x - 10; }\nelse x = 0;\nConsole.WriteLine(x);', H,
      `الناتج: 17
التتبّع: x>5 صحيح، وx فردي ⇒ x = 7 + 10 = 17`),
    q('اكتب كوداً يطبع 7 عند x=3، و15 عند x=10، و7 عند x=7 (دالة على x).', H,
      `if (x >= 10) Console.WriteLine(x + 5);
else Console.WriteLine(7);
// عند x=10 ⇒ 15، وعند x<10 ⇒ 7`),
  ],
};
