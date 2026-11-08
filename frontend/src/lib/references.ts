/**
 * مراجع سريعة لكل مادة — أوامر/صياغة C# للحاسوب، وقوانين/صيغ للرياضيات.
 * تُعرض في لوحة "قواعد" داخل صفحة حل المسألة.
 */
export interface RefItem {
  label?: string; // وصف بالعربي (اختياري)
  code: string; // الأمر أو الصيغة (يُعرض بخط برمجي LTR)
}
export interface RefSection {
  title: string;
  items: RefItem[];
}

const CSHARP: RefSection[] = [
  {
    title: 'المتغيرات والأنواع',
    items: [
      { label: 'عدد صحيح', code: 'int age = 17;' },
      { label: 'عدد عشري', code: 'double price = 9.99;' },
      { label: 'نص', code: 'string name = "أحمد";' },
      { label: 'منطقي', code: 'bool isOk = true;' },
      { label: 'حرف', code: "char c = 'A';" },
    ],
  },
  {
    title: 'الإدخال والإخراج',
    items: [
      { label: 'طباعة + سطر جديد', code: 'Console.WriteLine(x);' },
      { label: 'طباعة بلا سطر', code: 'Console.Write(x);' },
      { label: 'قراءة نص', code: 'string s = Console.ReadLine();' },
      { label: 'قراءة عدد', code: 'int n = int.Parse(Console.ReadLine());' },
      { label: 'تحويل لعشري', code: 'double d = double.Parse(s);' },
    ],
  },
  {
    title: 'العمليات والمقارنة',
    items: [
      { label: 'حسابية', code: '+   -   *   /   %' },
      { label: 'مقارنة', code: '==   !=   <   >   <=   >=' },
      { label: 'منطقية', code: '&&   ||   !' },
    ],
  },
  {
    title: 'الشروط',
    items: [
      { code: 'if (cond) { ... }\nelse if (cond2) { ... }\nelse { ... }' },
      { label: 'اختيار متعدّد', code: 'switch (x) {\n  case 1: ...; break;\n  default: ...; break;\n}' },
    ],
  },
  {
    title: 'الحلقات',
    items: [
      { code: 'for (int i = 0; i < n; i++) { ... }' },
      { code: 'while (cond) { ... }' },
      { code: 'do { ... } while (cond);' },
      { label: 'مرور على مجموعة', code: 'foreach (int x in arr) { ... }' },
      { label: 'تحكّم', code: 'break;   continue;' },
    ],
  },
  {
    title: 'الدوال (Methods)',
    items: [
      { label: 'بقيمة راجعة', code: 'static int Max(int a, int b) {\n  return a > b ? a : b;\n}' },
      { label: 'بدون قيمة', code: 'static void Print(string s) {\n  Console.WriteLine(s);\n}' },
    ],
  },
  {
    title: 'المصفوفات',
    items: [
      { label: 'إعلان فارغة', code: 'int[] arr = new int[5];' },
      { label: 'جاهزة', code: 'int[] a = {3, 7, 1, 9};' },
      { label: 'الوصول والطول', code: 'arr[i]      arr.Length' },
      { label: 'ثنائية البعد', code: 'int[,] m = new int[3, 4];\nm[i, j]   m.GetLength(0)' },
    ],
  },
  {
    title: 'السلاسل النصية',
    items: [
      { code: 's.Length' },
      { code: 's[i]' },
      { code: 's.Substring(start, len)' },
      { code: 's.ToUpper()   s.ToLower()' },
    ],
  },
  {
    title: 'الكائنات (OOP)',
    items: [
      { label: 'كلاس + حقول', code: 'class Student {\n  public string Name;\n  public int Age;\n}' },
      { label: 'دالة بانية', code: 'public Student(string n) { Name = n; }' },
      { label: 'إنشاء غرض', code: 'Student s = new Student("أحمد");' },
      { label: 'وراثة', code: 'class Dog : Animal {\n  public Dog(string n) : base(n) { }\n  public override void Speak() { ... }\n}' },
      { label: 'تجريدي / واجهة', code: 'abstract class Shape { public abstract double Area(); }\ninterface IShape { double Area(); }' },
    ],
  },
  {
    title: 'مباني المعطيات (5 وحدات)',
    items: [
      { label: 'عودية', code: 'static int Fact(int n) {\n  if (n == 0) return 1;       // أساس\n  return n * Fact(n - 1);     // عودي\n}' },
      { label: 'مكدس (LIFO)', code: 'Push   Pop   Peek   IsEmpty' },
      { label: 'طابور (FIFO)', code: 'Enqueue   Dequeue   Front' },
      { label: 'عقدة قائمة', code: 'class Node { public int Data; public Node Next; }' },
      { label: 'عقدة شجرة', code: 'class BinNode { public int Data; public BinNode Left, Right; }' },
    ],
  },
  {
    title: 'SQL (مشروع قواعد البيانات)',
    items: [
      { code: 'SELECT col FROM Table WHERE cond;' },
      { code: 'ORDER BY col DESC;' },
      { code: 'GROUP BY col;   AVG(col)  COUNT(*)' },
      { code: 'SELECT * FROM A JOIN B ON A.id = B.aId;' },
    ],
  },
];

const MATH: RefSection[] = [
  {
    title: 'الجبر وصيغ الضرب',
    items: [
      { code: '(a ± b)² = a² ± 2ab + b²' },
      { code: '(a + b)(a − b) = a² − b²' },
      { label: 'القانون العام', code: 'x = (−b ± √(b²−4ac)) / 2a' },
      { label: 'المميّز', code: 'Δ = b² − 4ac' },
      { label: 'مجموع/حاصل الجذرين', code: 'x₁+x₂ = −b/a   ،   x₁·x₂ = c/a' },
    ],
  },
  {
    title: 'الدالة التربيعية',
    items: [
      { code: 'y = ax² + bx + c' },
      { label: 'محور التماثل', code: 'x = −b / 2a' },
      { label: 'شكل الرأس', code: 'y = a(x − h)² + k   ،   الرأس (h, k)' },
    ],
  },
  {
    title: 'المساحات والمحيطات',
    items: [
      { label: 'مثلث', code: 'A = ½ × قاعدة × ارتفاع' },
      { label: 'مستطيل', code: 'A = الطول × العرض   ،   P = 2(ل + ع)' },
      { label: 'دائرة', code: 'A = πr²   ،   C = 2πr' },
      { label: 'متوازي أضلاع', code: 'A = قاعدة × ارتفاع' },
      { label: 'شبه منحرف', code: 'A = ½(ق₁ + ق₂) × ارتفاع' },
    ],
  },
  {
    title: 'الهندسة',
    items: [
      { label: 'فيثاغورس', code: 'a² + b² = c²' },
      { label: 'مجموع زوايا المثلث', code: '180°' },
      { label: 'حجم المنشور', code: 'V = مساحة القاعدة × الارتفاع' },
      { label: 'حجم الأسطوانة', code: 'V = πr²h' },
      { label: 'حجم المخروط', code: 'V = ⅓ πr²h' },
    ],
  },
  {
    title: 'الهندسة التحليلية',
    items: [
      { label: 'المسافة', code: 'd = √((x₂−x₁)² + (y₂−y₁)²)' },
      { label: 'المنتصف', code: 'M = ((x₁+x₂)/2 , (y₁+y₂)/2)' },
      { label: 'الميل', code: 'm = (y₂−y₁)/(x₂−x₁)' },
      { label: 'المستقيم', code: 'y = mx + b' },
      { label: 'الدائرة', code: '(x−a)² + (y−b)² = r²' },
    ],
  },
  {
    title: 'المثلثات',
    items: [
      { label: 'الهوية', code: 'sin²θ + cos²θ = 1' },
      { label: 'قانون الجيب', code: 'a/sinA = b/sinB = c/sinC' },
      { label: 'جيب التمام', code: 'c² = a² + b² − 2ab·cosC' },
      { label: 'مساحة المثلث', code: 'A = ½ ab·sinC' },
    ],
  },
  {
    title: 'المتتاليات',
    items: [
      { label: 'حسابية', code: 'aₙ = a₁ + (n−1)d   ،   Sₙ = n(a₁+aₙ)/2' },
      { label: 'هندسية', code: 'aₙ = a₁·rⁿ⁻¹   ،   Sₙ = a₁(rⁿ−1)/(r−1)' },
      { label: 'مجموع لانهائي |r|<1', code: 'S∞ = a₁/(1−r)' },
    ],
  },
  {
    title: 'التفاضل',
    items: [
      { code: "(xⁿ)' = n·xⁿ⁻¹" },
      { code: "(sin x)' = cos x   ،   (cos x)' = −sin x" },
      { code: "(eˣ)' = eˣ   ،   (ln x)' = 1/x" },
      { label: 'الرأس/القصوى', code: "f'(x) = 0" },
    ],
  },
  {
    title: 'التكامل',
    items: [
      { code: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C' },
      { code: '∫eˣ dx = eˣ + C   ،   ∫(1/x) dx = ln|x| + C' },
      { label: 'المساحة تحت منحنى', code: '∫[a→b] f(x) dx' },
    ],
  },
  {
    title: 'الأعداد المركّبة',
    items: [
      { code: 'i² = −1   ،   z = a + bi' },
      { label: 'القيمة المطلقة', code: '|z| = √(a² + b²)' },
      { label: 'المرافق', code: 'z̄ = a − bi' },
    ],
  },
];

const ENGLISH: RefSection[] = [
  {
    title: 'Verb Tenses — الأزمنة',
    items: [
      { label: 'مضارع بسيط', code: 'She works every day.' },
      { label: 'مضارع مستمر', code: 'She is working now.' },
      { label: 'ماضٍ بسيط', code: 'She worked yesterday.' },
      { label: 'مضارع تام', code: 'She has worked here for a year.' },
      { label: 'مستقبل', code: 'She will work / is going to work.' },
    ],
  },
  {
    title: 'Connectors — أدوات الربط',
    items: [
      { label: 'إضافة', code: 'and, also, in addition, moreover' },
      { label: 'تضاد', code: 'but, however, although, on the other hand' },
      { label: 'سبب/نتيجة', code: 'because, so, therefore, as a result' },
      { label: 'ترتيب', code: 'first, then, after that, finally' },
    ],
  },
  {
    title: 'Prepositions — حروف الجر',
    items: [
      { label: 'زمن', code: 'at 5 o’clock · on Monday · in July / 2026' },
      { label: 'مكان', code: 'at home · on the table · in the room' },
      { label: 'حركة', code: 'to, into, from, through, across' },
    ],
  },
  {
    title: 'Essay / Letter — بنية الكتابة',
    items: [
      { label: 'مقال', code: 'Introduction → Body (2–3 paragraphs) → Conclusion' },
      { label: 'رسالة رسمية', code: 'Dear Sir/Madam, … Yours faithfully,' },
      { label: 'رسالة ودّية', code: 'Dear Sam, … Best wishes, / Love,' },
    ],
  },
  {
    title: 'Reading tips — الفهم المقروء',
    items: [
      { label: 'Skim', code: 'اقرأ العنوان والجملة الأولى من كل فقرة لفكرة عامة.' },
      { label: 'Scan', code: 'ابحث عن الكلمة المفتاحية في السؤال داخل النصّ.' },
      { label: 'In your own words', code: 'أعد الصياغة، لا تنسخ الجملة كما هي.' },
    ],
  },
];

export const SUBJECT_REFERENCE: Record<'csharp' | 'math' | 'english', RefSection[]> = {
  csharp: CSHARP,
  math: MATH,
  english: ENGLISH,
};
