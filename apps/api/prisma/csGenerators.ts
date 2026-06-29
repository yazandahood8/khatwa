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

  // ---------- ما هي علوم الحاسوب؟ ----------
  '3 وحدات|ما هي علوم الحاسوب؟|2': () => [
    q('اكتب خوارزمية نصية (بدون كود) لصنع كوب قهوة.', E,
      `1) سخّن الماء حتى الغليان.
2) ضع ملعقة قهوة وسكراً حسب الرغبة في الكوب.
3) اسكب الماء المغلي في الكوب.
4) قلّب المزيج.
5) قدّم القهوة.`),
    q('اكتب خوارزمية (نصية) لإيجاد أكبر عدد من ثلاثة أعداد a, b, c.', M,
      `1) افترض أن الأكبر = a.
2) إذا كان b أكبر من الأكبر، اجعل الأكبر = b.
3) إذا كان c أكبر من الأكبر، اجعل الأكبر = c.
4) أعد قيمة الأكبر.`),
    q('ما الفرق بين الخوارزمية والبرنامج؟ أعطِ مثالاً.', H,
      `الخوارزمية: سلسلة خطوات منطقية لحل مشكلة، مستقلّة عن لغة البرمجة (مثل: وصفة طبخ).
البرنامج: تنفيذ الخوارزمية بلغة برمجة محدّدة (مثل C#) ينفّذه الحاسوب.
مثال: خوارزمية "أوجد الأكبر" يمكن كتابتها بأي لغة؛ البرنامج هو الكود الفعلي بـ C#.`),
    q('اكتب خوارزمية للبحث عن كلمة في قاموس مرتّب ألفبائياً (بحث ثنائي نصّي).', H,
      `1) افتح القاموس في المنتصف.
2) إذا كانت الكلمة في هذه الصفحة، توقّف.
3) إذا كانت الكلمة تسبق هذه الصفحة ألفبائياً، ابحث في النصف الأول.
4) وإلا ابحث في النصف الثاني.
5) كرّر حتى تجدها أو ينتهي النطاق.`),
  ],
  '3 وحدات|ما هي علوم الحاسوب؟|5': () => [
    q('اكتب برنامجاً يطبع اسمك.', E, `Console.WriteLine("أحمد");`),
    q('اكتب برنامجاً يطبع اسمك في سطر وعمرك في سطر آخر.', M,
      `Console.WriteLine("أحمد");
Console.WriteLine(17);`),
    q('ما الفرق بين Console.Write و Console.WriteLine؟ أعطِ مثالاً.', H,
      `Write: يطبع دون الانتقال لسطر جديد.
WriteLine: يطبع ثم ينتقل لسطر جديد.
مثال:
Console.Write("A"); Console.Write("B");   // AB في سطر واحد
Console.WriteLine("A"); Console.WriteLine("B"); // A ثم B في سطرين`),
    q('اكتب برنامجاً يطبع مثلث نجوم من 5 صفوف (الصف i فيه i نجمة).', H,
      `for (int i = 1; i <= 5; i++)
{
    for (int j = 1; j <= i; j++) Console.Write("*");
    Console.WriteLine();
}`),
  ],

  // ---------- حلقة while ----------
  '3 وحدات|حلقة while|2': () => [
    q('اكتب حلقة while تطبع الأعداد من 10 إلى 1 تنازلياً.', E,
      `int i = 10;
while (i >= 1)
{
    Console.WriteLine(i);
    i--;
}`),
    q('اكتب حلقة while تطبع الأعداد الزوجية بين 1 و100.', M,
      `int i = 2;
while (i <= 100)
{
    Console.WriteLine(i);
    i += 2;
}`),
    q('اكتب برنامجاً يجد أول عدد أكبر من 1000 يقبل القسمة على 13 و7 معاً.', H,
      `int n = 1001;
while (!(n % 13 == 0 && n % 7 == 0)) n++;
Console.WriteLine(n); // 1001 (لأن 13*7=91 و 91*11=1001)`),
    q('تتبّع الكود وأعطِ الناتج:\nint x = 1;\nwhile (x < 100) x = x * 2;\nConsole.WriteLine(x);', H,
      `الناتج: 128
التتبّع: 1,2,4,8,16,32,64 ثم 128 (يتوقّف لأن 128 ليست < 100)`),
  ],
  '3 وحدات|حلقة while|3': () => [
    q('احسب مجموع الأعداد من 1 إلى n (يُدخله المستخدم).', E,
      `int n = int.Parse(Console.ReadLine());
int sum = 0, i = 1;
while (i <= n) { sum += i; i++; }
Console.WriteLine(sum);`),
    q('احسب مضروب العدد n!  (factorial).', M,
      `int n = int.Parse(Console.ReadLine());
long fact = 1;
for (int i = 2; i <= n; i++) fact *= i;
Console.WriteLine(fact);`),
    q('اقرأ أعداداً من المستخدم حتى يُدخل -1، ثم اطبع مجموعها ومتوسطها.', H,
      `int sum = 0, count = 0;
int x = int.Parse(Console.ReadLine());
while (x != -1)
{
    sum += x; count++;
    x = int.Parse(Console.ReadLine());
}
Console.WriteLine(sum);
Console.WriteLine(count > 0 ? (double)sum / count : 0);`),
    q('احسب مجموع أرقام عدد صحيح (مثال: 1234 ⇒ 1+2+3+4 = 10).', H,
      `int n = int.Parse(Console.ReadLine());
n = Math.Abs(n);
int sum = 0;
while (n > 0) { sum += n % 10; n /= 10; }
Console.WriteLine(sum);`),
  ],

  // ---------- حلقة for ----------
  '3 وحدات|حلقة for|1': () => [
    q('اكتب حلقة for تطبع الأعداد من 1 إلى 10.', E,
      `for (int i = 1; i <= 10; i++)
    Console.WriteLine(i);`),
    q('اكتب حلقة for تطبع جدول ضرب العدد 7.', M,
      `for (int i = 1; i <= 10; i++)
    Console.WriteLine("7 x " + i + " = " + (7 * i));`),
    q('تتبّع الكود وأعطِ الناتج:\nfor (int i = 1; i <= 4; i++)\n    for (int j = 1; j <= i; j++)\n        Console.Write("*");\nConsole.WriteLine();', H,
      `الناتج: ********** (عشر نجوم في سطر واحد ثم سطر جديد)
السبب: غياب الأقواس يجعل WriteLine خارج الحلقتين فينفّذ مرة واحدة؛ عدد النجوم 1+2+3+4 = 10`),
    q('اكتب برنامجاً يطبع الأعداد الأولية من 1 إلى 100.', H,
      `for (int n = 2; n <= 100; n++)
{
    bool prime = true;
    for (int d = 2; d * d <= n; d++)
        if (n % d == 0) { prime = false; break; }
    if (prime) Console.Write(n + " ");
}`),
  ],
  '3 وحدات|حلقة for|3': () => [
    q('اطبع مصفوفة نجوم 5×5.', E,
      `for (int i = 0; i < 5; i++)
{
    for (int j = 0; j < 5; j++) Console.Write("*");
    Console.WriteLine();
}`),
    q('اطبع مثلث نجوم متزايداً: صف 1 نجمة، صف 2 نجمتان، ... حتى n.', M,
      `for (int i = 1; i <= n; i++)
{
    for (int j = 1; j <= i; j++) Console.Write("*");
    Console.WriteLine();
}`),
    q('اطبع جدول الضرب الكامل من 1×1 حتى 10×10.', H,
      `for (int i = 1; i <= 10; i++)
{
    for (int j = 1; j <= 10; j++)
        Console.Write((i * j) + "\\t");
    Console.WriteLine();
}`),
    q('اطبع نمطاً: الصف i يحتوي i نجمة، كل نجمة متبوعة بمسافة.', H,
      `for (int i = 1; i <= n; i++)
{
    for (int j = 1; j <= i; j++) Console.Write("* ");
    Console.WriteLine();
}`),
  ],

  // ---------- المصفوفة أحادية البعد (Array) ----------
  '3 وحدات|المصفوفة أحادية البعد (Array)|2': () => [
    q('أعلن مصفوفة تحتوي أيام الأسبوع واطبع اليوم الثالث.', E,
      `string[] days = { "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت" };
Console.WriteLine(days[2]); // الثلاثاء`),
    q('ما ناتج:  int[] a = {2,4,6,8}; Console.WriteLine(a[a.Length-1]);  ؟', M,
      `الناتج: 8
السبب: a.Length = 4، والفهرس 3 هو آخر عنصر (8)`),
    q('اكتب كوداً يعكس ترتيب المصفوفة في مكانها (دون مصفوفة إضافية).', H,
      `int left = 0, right = arr.Length - 1;
while (left < right)
{
    int temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++; right--;
}`),
    q('ما الخطأ في:  int[] arr = new int[5]; arr[5] = 10;  وما الاستثناء الناتج؟', H,
      `الفهارس الصالحة 0..4 فقط، و arr[5] خارج الحدود.
الاستثناء: IndexOutOfRangeException`),
  ],
  '3 وحدات|المصفوفة أحادية البعد (Array)|5': () => [
    q('استخدم LinearSearch للبحث عن 7 في {3,7,1,9,4}. ما الموقع المُرجَع؟', E,
      `الموقع 1 (الفهرس)، لأن 7 يقع في arr[1].`),
    q('عدّل البحث التسلسلي ليرجع عدد مرات ظهور العنصر (لا أول موقع).', M,
      `static int CountOccurrences(int[] arr, int target)
{
    int count = 0;
    for (int i = 0; i < arr.Length; i++)
        if (arr[i] == target) count++;
    return count;
}`),
    q('اكتب دالة bool ContainsDuplicate(int[] arr) ترجع true إذا وُجد عنصر متكرر.', H,
      `static bool ContainsDuplicate(int[] arr)
{
    for (int i = 0; i < arr.Length; i++)
        for (int j = i + 1; j < arr.Length; j++)
            if (arr[i] == arr[j]) return true;
    return false;
}`),
    q('اكتب دالة int FindSecondMax(int[] arr) ترجع ثاني أكبر عنصر دون ترتيب.', H,
      `static int FindSecondMax(int[] arr)
{
    int max = int.MinValue, second = int.MinValue;
    foreach (int x in arr)
    {
        if (x > max) { second = max; max = x; }
        else if (x > second && x < max) second = x;
    }
    return second;
}`),
  ],
  '3 وحدات|المصفوفة أحادية البعد (Array)|9': () => [
    q('تتبّع Bubble Sort على {5,3,8,1,2} — أظهر المصفوفة بعد التمرير الأول.', E,
      `بعد التمرير الأول: {3, 5, 1, 2, 8}
(أكبر عنصر 8 "يطفو" إلى النهاية)`),
    q('كم عدد المقارنات في Bubble Sort لمصفوفة حجمها n؟ وما كفاءتها الزمنية؟', M,
      `عدد المقارنات = n(n-1)/2 في أسوأ حال.
الكفاءة: O(n²)`),
    q('عدّل Bubble Sort ليرتّب تنازلياً.', H,
      `static void BubbleSortDesc(int[] arr)
{
    for (int i = 0; i < arr.Length - 1; i++)
        for (int j = 0; j < arr.Length - 1 - i; j++)
            if (arr[j] < arr[j + 1]) // عكس الشرط
            {
                int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
            }
}`),
    q('قارن بين Bubble Sort و Selection Sort من حيث الكفاءة وعدد التبديلات.', H,
      `كلاهما O(n²) في المقارنات.
Bubble Sort: تبديلات كثيرة، لكن يمكن إيقافه مبكراً (بعلَم flag) إذا كانت المصفوفة مرتّبة.
Selection Sort: عدد تبديلات أقل (O(n))، لكنه لا يستفيد من الترتيب المسبق.`),
  ],
  '3 وحدات|المصفوفة أحادية البعد (Array)|11': () => [
    q('تتبّع البحث الثنائي عن 7 في {1,3,5,7,9,11,13}. كم خطوة يلزم؟', E,
      `mid = (0+6)/2 = 3، و arr[3] = 7 ⇒ وُجد في خطوة واحدة عند الفهرس 3.`),
    q('كم خطوة (أسوأ حال) يحتاج البحث الثنائي لـ1024 عنصراً؟ وما كفاءته؟', M,
      `log₂(1024) = 10 خطوات كحدٍّ أقصى.
الكفاءة: O(log n)`),
    q('لماذا يجب أن تكون المصفوفة مرتّبة قبل البحث الثنائي؟ ماذا يحدث لو لم تكن؟', H,
      `لأن البحث الثنائي يقرّر اتجاه البحث (يمين/يسار) بناءً على الترتيب.
لو لم تكن مرتّبة فقد يتجاهل النصف الذي يحوي العنصر ويعطي نتيجة خاطئة (لم يوجد).`),
    q('اكتب BinarySearchRecursive(int[] arr, int target, int low, int high).', H,
      `static int BinarySearchRecursive(int[] arr, int target, int low, int high)
{
    if (low > high) return -1;
    int mid = (low + high) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return BinarySearchRecursive(arr, target, mid + 1, high);
    return BinarySearchRecursive(arr, target, low, mid - 1);
}`),
  ],

  // ---------- المصفوفة ثنائية البعد (2D Array) ----------
  '3 وحدات|المصفوفة ثنائية البعد (2D Array)|2': () => [
    q('اطبع مصفوفة 3×3 أعدادها من 1 إلى 9.', E,
      `int[,] m = { {1,2,3}, {4,5,6}, {7,8,9} };
for (int i = 0; i < 3; i++)
{
    for (int j = 0; j < 3; j++) Console.Write(m[i, j] + " ");
    Console.WriteLine();
}`),
    q('اكتب دالة تحسب وتطبع مجموع كل صف في مصفوفة n×m.', M,
      `static void RowSums(int[,] m)
{
    for (int i = 0; i < m.GetLength(0); i++)
    {
        int sum = 0;
        for (int j = 0; j < m.GetLength(1); j++) sum += m[i, j];
        Console.WriteLine("صف " + i + ": " + sum);
    }
}`),
    q('اكتب دالة int MaxIn2D(int[,] m) تجد أكبر عنصر في مصفوفة ثنائية البعد.', H,
      `static int MaxIn2D(int[,] m)
{
    int max = m[0, 0];
    for (int i = 0; i < m.GetLength(0); i++)
        for (int j = 0; j < m.GetLength(1); j++)
            if (m[i, j] > max) max = m[i, j];
    return max;
}`),
    q('اكتب كوداً يطبع منقول المصفوفة (Transpose).', H,
      `for (int j = 0; j < m.GetLength(1); j++)
{
    for (int i = 0; i < m.GetLength(0); i++) Console.Write(m[i, j] + " ");
    Console.WriteLine();
}`),
  ],

  // ---------- الكلاسات والأغراض (Classes & Objects) ----------
  '3 وحدات|الكلاسات والأغراض (Classes & Objects)|2': () => [
    q('أضف حقل City إلى الكلاس Student وأنشئ غرضاً منه وعيّن قيمه.', E,
      `class Student
{
    public string Name;
    public int Age;
    public double Grade;
    public string City;
}
Student s = new Student();
s.Name = "أحمد"; s.Age = 17; s.City = "حيفا";`),
    q('اكتب كلاس Car بحقول: الاسم، سنة الصنع، السعر.', M,
      `class Car
{
    public string Name;
    public int Year;
    public double Price;
}`),
    q('اكتب كلاس BankAccount بحقول: رقم الحساب، الرصيد، اسم صاحبه.', H,
      `class BankAccount
{
    public int AccountNumber;
    public double Balance;
    public string Owner;
}`),
    q('لماذا نستخدم private للحقول بدل public؟ ما مبدأ التغليف (Encapsulation)؟', H,
      `التغليف: إخفاء الحقول الداخلية والتحكّم في الوصول إليها عبر دوال/خصائص.
نستخدم private لمنع تعديل الحقل مباشرة من الخارج بقيم غير صحيحة،
ونوفّر get/set للتحقّق من القيم. هذا يحمي تماسك بيانات الغرض.`),
  ],
  '3 وحدات|الكلاسات والأغراض (Classes & Objects)|3': () => [
    q('أضف Constructor للكلاس Car يأخذ الاسم والسنة والسعر.', E,
      `public Car(string name, int year, double price)
{
    Name = name;
    Year = year;
    Price = price;
}`),
    q('أضف Constructor افتراضياً (بدون معاملات) يضع قيماً افتراضية للكلاس Car.', M,
      `public Car()
{
    Name = "غير معروف";
    Year = 2020;
    Price = 0;
}`),
    q('اكتب كلاس Rectangle بـ Constructor يأخذ الطول والعرض، ودالتي Area() و Perimeter().', H,
      `class Rectangle
{
    private double width, height;
    public Rectangle(double w, double h) { width = w; height = h; }
    public double Area() => width * height;
    public double Perimeter() => 2 * (width + height);
}`),
    q('ما الفرق بين الدالة البانية (Constructor) والدوال الاعتيادية؟ ومتى تُستدعى؟', H,
      `الدالة البانية: تحمل اسم الكلاس، بلا نوع راجع، وتُستدعى تلقائياً مرّة واحدة عند إنشاء الغرض بـ new لتهيئة حقوله.
الدوال الاعتيادية: تُستدعى يدوياً متى شئنا، ولها نوع راجع (أو void)، وتنفّذ سلوكاً.`),
  ],
  '3 وحدات|الكلاسات والأغراض (Classes & Objects)|7': () => [
    q('أنشئ مصفوفة من 5 طلاب واطبع أسماءهم (تجاهل العناصر الفارغة).', E,
      `Student[] students = new Student[5];
students[0] = new Student("أحمد", 17);
students[1] = new Student("سارة", 16);
for (int i = 0; i < students.Length; i++)
    if (students[i] != null)
        Console.WriteLine(students[i].Name);`),
    q('اكتب دالة Student FindBestStudent(Student[] arr) ترجع الطالب ذا أعلى علامة.', M,
      `static Student FindBestStudent(Student[] arr)
{
    Student best = arr[0];
    for (int i = 1; i < arr.Length; i++)
        if (arr[i].Grade > best.Grade) best = arr[i];
    return best;
}`),
    q('اكتب دالة void SortByGrade(Student[] arr) ترتّب الطلاب تنازلياً حسب العلامة.', H,
      `static void SortByGrade(Student[] arr)
{
    for (int i = 0; i < arr.Length - 1; i++)
        for (int j = 0; j < arr.Length - 1 - i; j++)
            if (arr[j].Grade < arr[j + 1].Grade)
            {
                Student t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
            }
}`),
    q('اكتب دالة Student[] FilterByCity(Student[] arr, string city) ترجع طلاب مدينة معيّنة.', H,
      `static Student[] FilterByCity(Student[] arr, string city)
{
    int count = 0;
    foreach (Student s in arr) if (s != null && s.City == city) count++;
    Student[] result = new Student[count];
    int k = 0;
    foreach (Student s in arr) if (s != null && s.City == city) result[k++] = s;
    return result;
}`),
  ],

  // ---------- الوراثة وتعدد الأشكال (Inheritance & Polymorphism) ----------
  '3 وحدات|الوراثة وتعدد الأشكال (Inheritance & Polymorphism)|2': () => [
    q('أضف كلاس Cat يرث من Animal ويطبع "مياو" في الدالة Speak.', E,
      `class Cat : Animal
{
    public Cat(string name) : base(name) { }
    public override void Speak() { Console.WriteLine("مياو"); }
}`),
    q('أضف كلاس Person يرث من Animal بحقل إضافي Job.', M,
      `class Person : Animal
{
    public string Job;
    public Person(string name, string job) : base(name) { Job = job; }
    public override void Speak() { Console.WriteLine("مرحباً، أنا " + Name); }
}`),
    q('اكتب هرمية وراثة: Vehicle أب، و Car و Truck و Motorcycle أبناء، لكلٍّ دالة Info().', H,
      `class Vehicle
{
    public string Name;
    public Vehicle(string n) { Name = n; }
    public virtual void Info() => Console.WriteLine("مركبة: " + Name);
}
class Car : Vehicle { public Car(string n) : base(n) { } public override void Info() => Console.WriteLine("سيارة: " + Name); }
class Truck : Vehicle { public Truck(string n) : base(n) { } public override void Info() => Console.WriteLine("شاحنة: " + Name); }
class Motorcycle : Vehicle { public Motorcycle(string n) : base(n) { } public override void Info() => Console.WriteLine("دراجة: " + Name); }`),
    q('ما ناتج:  Animal a = new Dog("ريكس"); a.Speak();  ؟ اشرح.', H,
      `الناتج: هاو هاو!
السبب (تعدد الأشكال): رغم أن نوع المرجع Animal، يشير الغرض فعلياً إلى Dog،
فتُستدعى نسخة Dog من الدالة virtual المُتجاوَزة بـ override أثناء التشغيل.`),
  ],
  '3 وحدات|الوراثة وتعدد الأشكال (Inheritance & Polymorphism)|5': () => [
    q('مصفوفة Animal[] فيها Dog و Cat و Animal، ونمرّ عليها بـ foreach نستدعي Speak(). ما الناتج؟', E,
      `هاو هاو!
مياو
صوت عام
كل غرض يستدعي نسخته الخاصة من Speak (تعدد الأشكال).`),
    q('لماذا يمكن وضع غرض Dog في مصفوفة من النوع Animal[]؟', M,
      `لأن Dog يرث من Animal (علاقة is-a)، فكل Dog هو Animal،
ويُسمح بإسناد الابن إلى مرجع من نوع الأب.`),
    q('اكتب دالة double TotalArea(Shape[] shapes) حيث Shape كلاس مجرّد بدالة Area().', H,
      `static double TotalArea(Shape[] shapes)
{
    double total = 0;
    foreach (Shape s in shapes) total += s.Area();
    return total;
}`),
    q('ما الفرق بين override و new عند تجاوز دالة في الكلاس الابن؟', H,
      `override: تجاوز حقيقي لدالة virtual/abstract؛ يُحسم وقت التشغيل حسب النوع الفعلي للغرض (polymorphism).
new: إخفاء الدالة فقط؛ يُحسم وقت الترجمة حسب نوع المرجع، فلا يحدث تعدد أشكال.`),
  ],
  '3 وحدات|الوراثة وتعدد الأشكال (Inheritance & Polymorphism)|6': () => [
    q('أضف كلاس Rectangle يرث من الكلاس المجرّد Shape (ينفّذ Area و Perimeter).', E,
      `class Rectangle : Shape
{
    double w, h;
    public Rectangle(double w, double h) { this.w = w; this.h = h; }
    public override double Area() => w * h;
    public override double Perimeter() => 2 * (w + h);
}`),
    q('لماذا لا يمكن إنشاء غرض من الكلاس المجرّد Shape مباشرة بـ new Shape()؟', M,
      `لأن Shape مجرّد (abstract) ويحوي دوالاً مجرّدة بلا تنفيذ،
فهو قالب فقط؛ يجب أن يرثه كلاس ملموس ينفّذ تلك الدوال ثم نُنشئ منه.`),
    q('اكتب دالة double TotalArea(Shape[] shapes) تحسب المساحة الكلية لمجموعة أشكال.', H,
      `static double TotalArea(Shape[] shapes)
{
    double total = 0;
    foreach (Shape s in shapes) total += s.Area();
    return total;
}`),
    q('ما الفرق بين الكلاس المجرّد (abstract class) والواجهة (interface)؟', H,
      `الكلاس المجرّد: قد يحوي دوالاً منفّذة وحقولاً، والوراثة منه أحادية (كلاس واحد).
الواجهة: تعرّف توقيعات فقط (تقليدياً بلا تنفيذ ولا حقول)، ويمكن لكلاس تطبيق عدّة واجهات.`),
  ],

  // ============================================================
  //  5 وحدات — مباني المعطيات
  // ============================================================

  // ---------- العودية (Recursion) ----------
  '5 وحدات|العودية (Recursion / רקורסיה)|2': () => [
    q('تتبّع استدعاء Factorial(4) وأظهر الاستدعاءات وقيمها.', E,
      `Factorial(4) = 4 * Factorial(3)
Factorial(3) = 3 * Factorial(2)
Factorial(2) = 2 * Factorial(1)
Factorial(1) = 1 * Factorial(0)
Factorial(0) = 1   (الحالة الأساسية)
النتيجة: 1*1*2*3*4 = 24`),
    q('اكتب دالة Power(int b, int exp) بالعودية.', M,
      `static int Power(int b, int exp)
{
    if (exp == 0) return 1;        // الحالة الأساسية
    return b * Power(b, exp - 1);  // الحالة العودية
}`),
    q('اكتب دالة SumDigits(int n) بالعودية (مثال: SumDigits(123) = 6).', H,
      `static int SumDigits(int n)
{
    if (n < 10) return n;
    return n % 10 + SumDigits(n / 10);
}`),
    q('ما مشكلة Fib(50) بالعودية الساذجة؟ كيف تحلّها بالحفظ (Memoization)؟', H,
      `المشكلة: تكرار هائل لإعادة حساب نفس القيم ⇒ تعقيد أُسّي O(2^n) وبطء شديد.
الحل بالحفظ:
static long Fib(int n, long[] memo)
{
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = Fib(n - 1, memo) + Fib(n - 2, memo);
    return memo[n];
}`),
  ],
  '5 وحدات|العودية (Recursion / רקורסיה)|4': () => [
    q('اكتب دالة MaxArray(int[] arr, int index) ترجع أكبر عنصر بالعودية.', E,
      `static int MaxArray(int[] arr, int index)
{
    if (index == arr.Length - 1) return arr[index];
    int restMax = MaxArray(arr, index + 1);
    return arr[index] > restMax ? arr[index] : restMax;
}`),
    q('اكتب دالة CountEven(int[] arr, int index) تعدّ الأعداد الزوجية بالعودية.', M,
      `static int CountEven(int[] arr, int index)
{
    if (index == arr.Length) return 0;
    int rest = CountEven(arr, index + 1);
    return (arr[index] % 2 == 0) ? rest + 1 : rest;
}`),
    q('اكتب دالة ReverseArray(int[] arr, int left, int right) تعكس المصفوفة بالعودية.', H,
      `static void ReverseArray(int[] arr, int left, int right)
{
    if (left >= right) return;
    int t = arr[left]; arr[left] = arr[right]; arr[right] = t;
    ReverseArray(arr, left + 1, right - 1);
}`),
    q('اكتب BinarySearchRecursive بكفاءة O(log n).', H,
      `static int BinarySearchRecursive(int[] arr, int target, int low, int high)
{
    if (low > high) return -1;
    int mid = (low + high) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return BinarySearchRecursive(arr, target, mid + 1, high);
    return BinarySearchRecursive(arr, target, low, mid - 1);
}`),
  ],
  '5 وحدات|العودية (Recursion / רקורסיה)|8': () => [
    q('تتبّع MergeSort على {5,2,8,1,9} — صف التقسيم والدمج باختصار.', E,
      `التقسيم: {5,2,8,1,9} → {5,2} و{8,1,9}
{5,2}→{5},{2} ثم دمج → {2,5}
{8,1,9}→{8} و{1,9}→{1},{9}→{1,9} ثم دمج → {1,8,9}
الدمج النهائي: {2,5} + {1,8,9} → {1,2,5,8,9}`),
    q('اكتب دالة Merge الكاملة لدمج جزأين مرتّبين من المصفوفة.', M,
      `static void Merge(int[] arr, int left, int mid, int right)
{
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;
    while (i <= mid && j <= right)
        temp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    for (int t = 0; t < temp.Length; t++) arr[left + t] = temp[t];
}`),
    q('قارن كفاءة MergeSort مع BubbleSort عملياً.', H,
      `MergeSort: O(n log n) — يقسم المصفوفة نصفين (log n مستويات) ويدمج كلاً بـ O(n).
BubbleSort: O(n²) — حلقتان متداخلتان.
لـ n = 1,000,000: MergeSort ≈ 20 مليون عملية، BubbleSort ≈ 10^12 عملية ⇒ MergeSort أسرع بكثير.`),
    q('كيف تطبّق MergeSort لترتيب حروف سلسلة نصية؟', H,
      `نحوّل النص إلى مصفوفة حروف ونطبّق نفس الخوارزمية على char[]:
char[] a = s.ToCharArray();
MergeSort(a, 0, a.Length - 1); // نفس منطق int مع المقارنة a[i] <= a[j]
string sorted = new string(a);`),
  ],

  // ---------- الكفاءة الزمنية (Big-O) ----------
  '5 وحدات|الكفاءة الزمنية (Big-O Notation)|2': () => [
    q('ما كفاءة دالة تجمع عناصر مصفوفة حجمها n؟', E,
      `O(n) — مرور واحد على جميع العناصر، فالزمن يتناسب طردياً مع n.`),
    q('عند n = 1000، كم عملية تقريباً لكل من O(1), O(log n), O(n), O(n²)؟', M,
      `O(1) ≈ 1
O(log n) ≈ 10
O(n) = 1000
O(n²) = 1,000,000`),
    q('ما كفاءة BubbleSort على مصفوفة مرتّبة مسبقاً (باستخدام علَم flag)؟', H,
      `O(n) — التمرير الأول لا يُجري أي تبديل، فيكتشف العلَم أن المصفوفة مرتّبة ويتوقّف.`),
    q('اكتب خوارزمية بكفاءة O(n) لإيجاد كل زوج مجموعه k في مصفوفة.', H,
      `static void FindPairs(int[] arr, int k)
{
    HashSet<int> seen = new HashSet<int>();
    foreach (int x in arr)
    {
        if (seen.Contains(k - x))
            Console.WriteLine((k - x) + " + " + x + " = " + k);
        seen.Add(x);
    }
}`),
  ],

  // ---------- المكدس (Stack) ----------
  '5 وحدات|المكدس (Stack)|2': () => [
    q('تتبّع: Push(3), Push(7), Push(1), Pop(), Peek(). ما قيمتا Pop و Peek وحالة المكدس؟', E,
      `Pop() ترجع 1 (آخر ما دخل أول ما يخرج — LIFO).
Peek() ترجع 7 (القمة الحالية).
المكدس يحوي: [3, 7] والقمة 7.`),
    q('أضف دالة Size() للمكدس ترجع عدد العناصر.', M,
      `public int Size()
{
    return top + 1; // top يبدأ من -1
}`),
    q('استخدم مكدساً لعكس سلسلة نصية.', H,
      `static string Reverse(string s)
{
    Stack<char> st = new Stack<char>();
    foreach (char c in s) st.Push(c);
    string result = "";
    while (st.Count > 0) result += st.Pop();
    return result;
}`),
    q('اكتب bool IsBalanced(string s) تتحقق إن كانت الأقواس متوازنة: {[()]} صحيحة، {[(]} خاطئة.', H,
      `static bool IsBalanced(string s)
{
    Stack<char> st = new Stack<char>();
    foreach (char c in s)
    {
        if (c == '(' || c == '[' || c == '{') st.Push(c);
        else if (c == ')' || c == ']' || c == '}')
        {
            if (st.Count == 0) return false;
            char open = st.Pop();
            if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{'))
                return false;
        }
    }
    return st.Count == 0;
}`),
  ],

  // ---------- الطابور (Queue) ----------
  '5 وحدات|الطابور (Queue)|2': () => [
    q('تتبّع: Enqueue(A), Enqueue(B), Dequeue(), Enqueue(C), Front(). ما الناتج وحالة الطابور؟', E,
      `Dequeue() ترجع A (أول من دخل أول من يخرج — FIFO).
Front() ترجع B.
الطابور يحوي: [B, C].`),
    q('ما الفرق بين الطابور والمكدس؟ متى تستخدم كلاً منهما؟', M,
      `الطابور FIFO (الأول دخولاً أول خروجاً) — يُستخدم في الانتظار/الجدولة و BFS.
المكدس LIFO (الأخير دخولاً أول خروجاً) — يُستخدم في التراجع (Undo) واستدعاءات الدوال و DFS.`),
    q('كيف تستخدم طابورين لعكس محتوى طابور أصلي؟', H,
      `نُفرّغ الطابور الأصلي إلى مكدس ثم نعيده للطابور (أبسط)،
أو نستخدم العودية: نسحب العنصر الأمامي، نعكس الباقي عودياً، ثم نُضيف العنصر في النهاية.
الفكرة: عكس FIFO يتطلّب بنية LIFO وسيطة.`),
    q('نفّذ طابوراً دائرياً (Circular Queue) بمصفوفة.', H,
      `class CircularQueue
{
    private int[] data; private int front, rear, count, size;
    public CircularQueue(int n) { size = n; data = new int[n]; front = 0; rear = -1; count = 0; }
    public void Enqueue(int x) { if (count == size) return; rear = (rear + 1) % size; data[rear] = x; count++; }
    public int Dequeue() { int x = data[front]; front = (front + 1) % size; count--; return x; }
    public bool IsEmpty() { return count == 0; }
}`),
  ],

  // ---------- القوائم المرتبطة (Linked List) ----------
  '5 وحدات|القوائم المرتبطة (Linked List)|2': () => [
    q('تتبّع: AddFirst(3), AddFirst(7), AddFirst(1). صف القائمة الناتجة.', E,
      `القائمة: 1 → 7 → 3 → null
(كل إضافة في الرأس تضع العنصر الجديد أولاً، فالأحدث يصبح الرأس head).`),
    q('اكتب دالة Print() لطباعة كل عناصر القائمة المرتبطة.', M,
      `public void Print()
{
    Node curr = head;
    while (curr != null)
    {
        Console.Write(curr.Data + " ");
        curr = curr.Next;
    }
    Console.WriteLine();
}`),
    q('اكتب دالة AddLast(int data) للإضافة في نهاية القائمة.', H,
      `public void AddLast(int data)
{
    Node newNode = new Node(data);
    if (head == null) { head = newNode; return; }
    Node curr = head;
    while (curr.Next != null) curr = curr.Next;
    curr.Next = newNode;
}`),
    q('اكتب دالة Reverse() لعكس ترتيب القائمة المرتبطة.', H,
      `public void Reverse()
{
    Node prev = null, curr = head;
    while (curr != null)
    {
        Node next = curr.Next;
        curr.Next = prev;
        prev = curr;
        curr = next;
    }
    head = prev;
}`),
  ],
  '5 وحدات|القوائم المرتبطة (Linked List)|4': () => [
    q('تتبّع حذف 7 من القائمة: 1 → 7 → 3 → 5. ما النتيجة؟', E,
      `النتيجة: 1 → 3 → 5
(نجعل Next للعقدة 1 يشير إلى العقدة 3، متجاوزين العقدة 7).`),
    q('لماذا يُعالَج حذف العنصر الأول (الرأس) بشكل مختلف عن باقي العناصر؟', M,
      `لأنه لا توجد عقدة سابقة له لتعديل مؤشّرها؛
فنحرّك head نفسه إلى head.Next بدل تعديل curr.Next.`),
    q('اكتب دالة RemoveDuplicates() لحذف القيم المكرّرة من القائمة.', H,
      `public void RemoveDuplicates()
{
    Node curr = head;
    while (curr != null)
    {
        Node runner = curr;
        while (runner.Next != null)
        {
            if (runner.Next.Data == curr.Data) runner.Next = runner.Next.Next;
            else runner = runner.Next;
        }
        curr = curr.Next;
    }
}`),
    q('اكتب دالة تدمج قائمتين مرتّبتين في قائمة مرتّبة واحدة.', H,
      `static Node MergeSorted(Node a, Node b)
{
    Node dummy = new Node(0), tail = dummy;
    while (a != null && b != null)
    {
        if (a.Data <= b.Data) { tail.Next = a; a = a.Next; }
        else { tail.Next = b; b = b.Next; }
        tail = tail.Next;
    }
    tail.Next = (a != null) ? a : b;
    return dummy.Next;
}`),
  ],

  // ---------- الأشجار الثنائية (Binary Trees) ----------
  '5 وحدات|الأشجار الثنائية (Binary Trees)|2': () => [
    q('صف شجرة جذرها 5، ابنها الأيسر 3، وابنها الأيمن 7.', E,
      `العقدة الجذر تحمل 5، ولها:
Left → عقدة قيمتها 3
Right → عقدة قيمتها 7
(كلاهما ورقة بلا أبناء).`),
    q('اكتب كوداً ينشئ الشجرة: جذر 5، يسار 3، يمين 7.', M,
      `BinNode root = new BinNode(5);
root.Left = new BinNode(3);
root.Right = new BinNode(7);`),
    q('اكتب دالة CountNodes(BinNode root) تعدّ عقد الشجرة بالعودية.', H,
      `static int CountNodes(BinNode root)
{
    if (root == null) return 0;
    return 1 + CountNodes(root.Left) + CountNodes(root.Right);
}`),
    q('اكتب دالة IsSymmetric(BinNode root) تتحقق إن كانت الشجرة متماثلة حول محورها.', H,
      `static bool IsSymmetric(BinNode root)
{
    if (root == null) return true;
    return Mirror(root.Left, root.Right);
}
static bool Mirror(BinNode a, BinNode b)
{
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a.Data == b.Data && Mirror(a.Left, b.Right) && Mirror(a.Right, b.Left);
}`),
  ],
  '5 وحدات|الأشجار الثنائية (Binary Trees)|3': () => [
    q('للشجرة: جذر=1، يسار=2، يمين=3، وابنا 2 هما 4 (يسار) و5 (يمين). أعطِ Preorder و Inorder و Postorder.', E,
      `Preorder (جذر-يسار-يمين): 1 2 4 5 3
Inorder (يسار-جذر-يمين): 4 2 5 1 3
Postorder (يسار-يمين-جذر): 4 5 2 3 1`),
    q('لماذا يعطي مسح Inorder على شجرة بحث ثنائية (BST) العناصر مرتّبة تصاعدياً؟', M,
      `لأن في BST كل ما في الشجرة الفرعية اليسرى أصغر من الجذر، وكل ما في اليمنى أكبر.
وInorder يزور (يسار ثم الجذر ثم يمين)، فيخرج العناصر من الأصغر إلى الأكبر.`),
    q('اكتب دالة MaxValue(BinNode root) ترجع أكبر قيمة في الشجرة بالعودية.', H,
      `static int MaxValue(BinNode root)
{
    int max = root.Data;
    if (root.Left != null) max = Math.Max(max, MaxValue(root.Left));
    if (root.Right != null) max = Math.Max(max, MaxValue(root.Right));
    return max;
}`),
    q('اكتب دالة LCA(BinNode root, int a, int b) لإيجاد أقرب سلف مشترك في BST.', H,
      `static BinNode LCA(BinNode root, int a, int b)
{
    if (root == null) return null;
    if (a < root.Data && b < root.Data) return LCA(root.Left, a, b);
    if (a > root.Data && b > root.Data) return LCA(root.Right, a, b);
    return root; // تفرّق المساران هنا
}`),
  ],
  '5 وحدات|الأشجار الثنائية (Binary Trees)|7': () => [
    q('أدرج {5, 3, 7, 1, 4} في شجرة بحث ثنائية (BST). صف الشجرة الناتجة.', E,
      `الجذر 5.
3 < 5 ⇒ يسار 5.
7 > 5 ⇒ يمين 5.
1 < 5 و1 < 3 ⇒ يسار 3.
4 < 5 و4 > 3 ⇒ يمين 3.`),
    q('اكتب دالة Search(BinNode root, int val) للبحث في BST.', M,
      `static bool Search(BinNode root, int val)
{
    if (root == null) return false;
    if (root.Data == val) return true;
    return val < root.Data ? Search(root.Left, val) : Search(root.Right, val);
}`),
    q('لماذا يعطي Inorder على BST المُدرَج فيها {5,3,7,1,4} الترتيب {1,3,4,5,7}؟', H,
      `لأن Inorder يزور اليسار (الأصغر) ثم الجذر ثم اليمين (الأكبر)،
وخاصية BST تضمن أن هذا الترتيب يساوي ترتيب القيم تصاعدياً.`),
    q('اكتب دالة Delete(BinNode root, int val) لحذف عقدة من BST (الحالات الثلاث).', H,
      `static BinNode Delete(BinNode root, int val)
{
    if (root == null) return null;
    if (val < root.Data) root.Left = Delete(root.Left, val);
    else if (val > root.Data) root.Right = Delete(root.Right, val);
    else
    {
        if (root.Left == null) return root.Right;   // بلا ابن أيسر
        if (root.Right == null) return root.Left;    // بلا ابن أيمن
        BinNode min = root.Right;                    // عقدتان: أصغر اليمين
        while (min.Left != null) min = min.Left;
        root.Data = min.Data;
        root.Right = Delete(root.Right, min.Data);
    }
    return root;
}`),
  ],
};
