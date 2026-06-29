/* AUTO-GENERATED from منهج_علوم_الحاسوب_البجروت_الكامل.md — do not edit by hand. */
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Question = { order: number; difficulty: Difficulty; text: string };
export type LessonRow = { order: number; title: string; durationMinutes: number; type: string; questions: Question[] };
export type CsTopicPlan = { level: string; unit: string; name: string; lessons: LessonRow[] };

export const CS_PLAN: CsTopicPlan[] = [
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "ما هي علوم الحاسوب؟",
    "lessons": [
      {
        "order": 1,
        "title": "ما هو الحاسوب وكيف يعمل؟",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الخوارزمية: تعريف وأمثلة يومية",
        "durationMinutes": 12,
        "type": "مفاهيمي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب خوارزمية نصية لصنع كوب قهوة (بدون كود)."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب خوارزمية لإيجاد أكبر عدد من ثلاثة أعداد."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ما الفرق بين خوارزمية وبرنامج؟ أعطِ مثالاً واقعياً."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب خوارزمية للبحث عن كلمة في قاموس مرتّب ألفبائياً."
          }
        ]
      },
      {
        "order": 3,
        "title": "من خوارزمية لبرنامج: المراحل",
        "durationMinutes": 10,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 4,
        "title": "بيئة C# وVisual Studio: الإعداد",
        "durationMinutes": 12,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 5,
        "title": "أول برنامج: Hello World بـ C#",
        "durationMinutes": 12,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب برنامجاً يطبع اسمك."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب برنامجاً يطبع اسمك في سطر وعمرك في سطر ثانٍ."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ما الفرق بين `Console.Write` و`Console.WriteLine`؟ أعطِ مثالاً."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب برنامجاً يطبع مثلث نجوم من 5 صفوف."
          }
        ]
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "المتغيرات وأنواع البيانات",
    "lessons": [
      {
        "order": 1,
        "title": "المتغير: ما هو ولماذا نستخدمه",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "أنواع البيانات: int, double, string, bool, char",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 3,
        "title": "إعلان المتغير والتهيئة (Declaration & Initialization)",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أعلن عن متغيرات لاسم طالب وعمره ومعدله."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ما الخطأ في الكود التالي؟ `int x = \"5\";`"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ما الفرق بين `int x = 5;` و`int x; x = 5;`؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "لماذا لا يمكن كتابة `int 1number = 5;`؟ ما القواعد لأسماء المتغيرات؟"
          }
        ]
      },
      {
        "order": 4,
        "title": "العمليات الحسابية: +، -، *، /، %",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "ما ناتج: `int x = 17 % 5;`"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب كوداً يحسب مساحة مستطيل يُدخل الطول والعرض."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ما الفرق بين `7/2` و`7.0/2` في C#؟ لماذا؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب برنامجاً يحوّل درجة حرارة من سيلزيوس لفهرنهايت: F = C × 9/5 + 32."
          }
        ]
      },
      {
        "order": 5,
        "title": "أولويات العمليات والأقواس",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "الإدخال من المستخدم: Console.ReadLine()",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب برنامجاً يطلب الاسم ويطبع: \"أهلاً [الاسم]!\""
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب برنامجاً يطلب عددين ويطبع مجموعهما."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب برنامجاً يطلب الاسم والعمر ويحسب السنة التي سيبلغ فيها 100 سنة."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ما الخطأ في: `int x = Console.ReadLine();` وكيف تصلحه؟"
          }
        ]
      },
      {
        "order": 7,
        "title": "تحويل الأنواع: int.Parse, Convert.ToDouble",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "العمليات على السلاسل النصية: string",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اطبع الحرف الثالث من كلمة \"برنامج\"."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب كوداً يطبع الكلمة معكوسة."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب دالة تتحقق إذا كانت الكلمة بالينمروم (تُقرأ من الجهتين)."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب كوداً يعدّ عدد الحروف المتحركة (a, e, i, o, u) في جملة."
          }
        ]
      },
      {
        "order": 9,
        "title": "مسائل تطبيقية مركّبة",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "الدوال (Methods)",
    "lessons": [
      {
        "order": 1,
        "title": "ما هي الدالة ولماذا نستخدمها",
        "durationMinutes": 11,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "تعريف دالة بدون قيمة راجعة (void)",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب دالة `PrintLine` تطبع خطاً من 20 نجمة."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب دالة `PrintSquare(int n)` تطبع مربع نجوم n×n."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب دالة `PrintMultiplicationTable(int n)` تطبع جدول ضرب n."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب دالة `PrintDiamond(int n)` تطبع معيّن نجوم."
          }
        ]
      },
      {
        "order": 3,
        "title": "الدوال بقيمة راجعة (return)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب دالة `Max(int a, int b)` ترجع الأكبر."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب دالة `IsEven(int n)` ترجع `true` إذا n زوجي."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب دالة `CalcAverage(int a, int b, int c)` ترجع المتوسط."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب دالة `GCD(int a, int b)` ترجع القاسم المشترك الأكبر (خوارزمية إقليدس)."
          }
        ]
      },
      {
        "order": 4,
        "title": "المعاملات (Parameters) والحجج (Arguments)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "نطاق المتغيرات (Scope)",
        "durationMinutes": 12,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 6,
        "title": "الدوال المتداخلة والتركيبية",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "استخدم الدالة `Max` لإيجاد أكبر ثلاثة أعداد."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب دالة `IsPrime(int n)` تتحقق إذا كان العدد أولياً."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب دالتين: `Celsius2Fahrenheit` و`Fahrenheit2Celsius`، ثم برنامجاً يستخدمهما."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب دالة `Power(int base, int exp)` بدون استخدام Math.Pow."
          }
        ]
      },
      {
        "order": 7,
        "title": "مسائل تطبيقية شاملة",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "الشروط والتحقق",
    "lessons": [
      {
        "order": 1,
        "title": "عوامل المقارنة والقيم المنطقية",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "جملة if البسيطة",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "جملة if-else",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب برنامجاً يحدد إذا كان العدد موجباً أو سالباً أو صفراً."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب برنامجاً يحدد إذا كان الطالب ناجحاً (≥55) وإذا كانت علامته ممتازة (≥90)."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب دالة `Grade(int score)` ترجع: 90-100=\"ممتاز\"، 80-89=\"جيد جداً\"، 70-79=\"جيد\"، 60-69=\"مقبول\"، <60=\"راسب\"."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب برنامجاً يحدد إذا كانت سنة ما كبيسة (قابلة للقسمة على 4، ما عدا قرون إلا إذا قابلة على 400)."
          }
        ]
      },
      {
        "order": 4,
        "title": "جملة if-else if-else المتشعبة",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "العوامل المنطقية: &&، ||، !",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "جملة switch",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "جدول التتبع (טבלת מעקב)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع الكود أعلاه وأعطِ الطباعة النهائية."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "تتبّع: `int a=10; if(a%3==0) a=a/3; else a=a*2; Console.WriteLine(a);`"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "تتبّع برنامجاً بشرطين متشعبين من 6 خطوات."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب كوداً يُنتج الجدول التالي: عند x=3 يطبع 7، عند x=10 يطبع 15، عند x=7 يطبع 7."
          }
        ]
      },
      {
        "order": 8,
        "title": "مسائل تطبيقية مركّبة",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "حلقة while",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم التكرار والحاجة له",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "حلقة while: البنية والعداد",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب حلقة تطبع الأعداد من 10 إلى 1 (تنازلياً)."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب حلقة تطبع الأعداد الزوجية بين 1 و100."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب برنامجاً يجد أول عدد أكبر من 1000 قابل للقسمة على 13 و7 معاً."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "تتبّع: `int x=1; while(x<100) x=x*2; Console.WriteLine(x);`"
          }
        ]
      },
      {
        "order": 3,
        "title": "حلقة while: التراكم والمجموع",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب مجموع الأعداد من 1 إلى n (n يُدخله المستخدم)."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "احسب مضروب n! (factorial)."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب برنامجاً يطلب أعداداً من المستخدم (حتى يُدخل -1) ويحسب مجموعها ومتوسطها."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "احسب مجموع أرقام عدد صحيح (مثلاً 1234 → 1+2+3+4=10)."
          }
        ]
      },
      {
        "order": 4,
        "title": "حلقة while: الإدخال المتكرر",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "حلقة do-while",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "جدول التتبع للحلقات",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "مسائل تطبيقية",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "حلقة for",
    "lessons": [
      {
        "order": 1,
        "title": "حلقة for: البنية والفرق عن while",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب for تطبع الأعداد من 1 إلى 10."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب for تطبع جدول الضرب لـ7."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "تتبّع: `for(int i=1;i<=4;i++) for(int j=1;j<=i;j++) Console.Write(\"*\"); Console.WriteLine();`"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب برنامجاً يطبع الأعداد الأولية من 1 إلى 100."
          }
        ]
      },
      {
        "order": 2,
        "title": "حلقة for: التكرار المحدد",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "الحلقات المتداخلة (Nested Loops)",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اطبع مصفوفة نجوم 5×5."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اطبع مثلث نجوم مثل: صف 1 نجمة، صف 2 نجمتان، ..."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اطبع جدول الضرب من 1×1 حتى 10×10."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اطبع نمط البيانو: صف 1 = `* `, صف 2 = `** `, ..., صف n = `n نجوم`."
          }
        ]
      },
      {
        "order": 4,
        "title": "break وcontinue",
        "durationMinutes": 12,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 5,
        "title": "مسائل مركّبة",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "المصفوفة أحادية البعد (Array)",
    "lessons": [
      {
        "order": 1,
        "title": "ما هي المصفوفة ولماذا نستخدمها",
        "durationMinutes": 11,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "إعلان المصفوفة والوصول للعناصر",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أعلن مصفوفة تحتوي أيام الأسبوع واطبع اليوم الثالث."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ما ناتج: `int[] a = {2,4,6,8}; Console.WriteLine(a[a.Length-1]);`"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب كوداً يعكس ترتيب المصفوفة في مكانها (بدون مصفوفة إضافية)."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ما الخطأ: `int[] arr = new int[5]; arr[5] = 10;` وما النوع الاستثنائي الذي سيظهر؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "ملء المصفوفة بالإدخال (حلقة)",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "طباعة المصفوفة والتنقل عليها",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "البحث في المصفوفة (Linear Search)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "استخدم `LinearSearch` للبحث عن 7 في {3,7,1,9,4}."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "عدّل الدالة لترجع عدد مرات ظهور العنصر (وليس أول موقع)."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب دالة `ContainsDuplicate(int[] arr)` ترجع true إذا يوجد عنصر متكرر."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `FindSecondMax(int[] arr)` ترجع ثاني أكبر عنصر (بدون ترتيب)."
          }
        ]
      },
      {
        "order": 6,
        "title": "أقصى وأدنى عنصر في المصفوفة",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "مجموع ومتوسط عناصر المصفوفة",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "المصفوفة كمعامل للدالة",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 9,
        "title": "خوارزميات الترتيب: Bubble Sort",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع Bubble Sort على المصفوفة {5, 3, 8, 1, 2} — أظهر المصفوفة بعد كل تمرير (pass)."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "كم عدد المقارنات في Bubble Sort لمصفوفة حجمها n؟ ما كفاءتها؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "عدّل Bubble Sort لترتيب تنازلياً."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أيهما أفضل: Bubble Sort أم Selection Sort؟ قارن بأمثلة."
          }
        ]
      },
      {
        "order": 10,
        "title": "خوارزميات الترتيب: Selection Sort",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 11,
        "title": "البحث الثنائي (Binary Search)",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع البحث الثنائي عن 7 في {1,3,5,7,9,11,13}."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "كم خطوة يحتاج البحث الثنائي لـ1024 عنصر؟ ما كفاءته؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "لماذا يجب أن تكون المصفوفة مرتّبة قبل البحث الثنائي؟ ماذا يحدث لو لم تكن؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `BinarySearchRecursive(int[] arr, int target, int low, int high)`."
          }
        ]
      },
      {
        "order": 12,
        "title": "مسائل مركّبة وبجروت سابقة",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "المصفوفة ثنائية البعد (2D Array)",
    "lessons": [
      {
        "order": 1,
        "title": "المصفوفة ثنائية البعد: صفوف وأعمدة",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "ملء وطباعة المصفوفة ثنائية البعد",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اطبع مصفوفة 3×3 أعدادها 1 إلى 9."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب دالة تحسب مجموع كل صف في مصفوفة n×m."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب دالة تجد أكبر عنصر في مصفوفة ثنائية البعد."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب برنامجاً يطبع المصفوفة بصورة منقلبة (Transpose)."
          }
        ]
      },
      {
        "order": 3,
        "title": "دوال على المصفوفة ثنائية البعد",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "مسائل بجروت على المصفوفات ثنائية البعد",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "الكلاسات والأغراض (Classes & Objects)",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم OOP: لماذا الأغراض؟",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "تعريف الكلاس: الحقول والخصائص",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أضف حقلاً `City` للكلاس وأنشئ غرضاً منه."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب كلاس `Car` بحقول: اسم، سنة الصنع، سعر."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب كلاس `BankAccount` بحقول: رقم الحساب، الرصيد، اسم صاحبه."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "لماذا نستخدم `private` للحقول وليس `public`؟ ما مبدأ التغليف؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "الدالة البانية (Constructor)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أضف Constructor للكلاس `Car` من المسألة السابقة."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب Constructor افتراضي (بدون معاملات) يضع قيم افتراضية."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب كلاس `Rectangle` بـ Constructor يأخذ الطول والعرض ودوال `Area()` و`Perimeter()`."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ما الفرق بين الدالة البانية (Constructor) والدوال الاعتيادية؟ متى تُستدعى؟"
          }
        ]
      },
      {
        "order": 4,
        "title": "الدوال (Methods) داخل الكلاس",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "إنشاء غرض (new) واستخدامه",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "الدالة ToString()",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "مصفوفة من الأغراض",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أنشئ مصفوفة من 5 طلاب واطبع أسماءهم."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب دالة `FindBestStudent(Student[] arr)` ترجع الطالب ذو أعلى علامة."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب `SortByGrade(Student[] arr)` ترتّب الطلاب تنازلياً حسب العلامة."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب دالة `FilterByCity(Student[] arr, string city)` ترجع مصفوفة طلاب مدينة معينة."
          }
        ]
      },
      {
        "order": 8,
        "title": "this والحقول الخاصة (private)",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 9,
        "title": "خصائص get/set (Properties)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 10,
        "title": "مسائل كلاسات مركّبة",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "الأساسيات",
    "name": "الوراثة وتعدد الأشكال (Inheritance & Polymorphism)",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم الوراثة: \"is-a\"",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الكلاس الأب والكلاس الابن",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أضف كلاس `Cat` يرث من `Animal` ويطبع \"مياو\"."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أضف `Person` يرث من `Animal` بحقول إضافية: `Job`."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب هيراركي: `Vehicle` → `Car`, `Truck`, `Motorcycle`. كل كلاس بخصائصه."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ما ناتج هذا الكود؟ `Animal a = new Dog(\"ريكس\"); a.Speak();` — شرح كامل."
          }
        ]
      },
      {
        "order": 3,
        "title": "base: استدعاء Constructor الأب",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "تجاوز الدوال (override)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "تعدد الأشكال (Polymorphism)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "ما ناتج الكود أعلاه؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "لماذا يمكن وضع `Dog` في مصفوفة من نوع `Animal[]`؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أضف دالة `TotalArea(Shape[] shapes)` حيث `Shape` كلاس مجرّد بدالة `Area()`."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ما الفرق بين `override` و`new` في تجاوز الدوال؟ متى تستخدم كلاً منهما؟"
          }
        ]
      },
      {
        "order": 6,
        "title": "الكلاس المجرّد (abstract)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أضف كلاس `Rectangle` يرث من `Shape`."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "لماذا لا يمكن إنشاء غرض من `Shape` مباشرة؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب `TotalArea(Shape[] shapes)` تحسب المساحة الكلية لمجموعة أشكال."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ما الفرق بين الكلاس المجرّد (abstract) والواجهة (interface)؟"
          }
        ]
      },
      {
        "order": 7,
        "title": "sealed وvirtual",
        "durationMinutes": 12,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 8,
        "title": "مسائل وراثة كاملة",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "المشروع",
    "name": "قواعد البيانات ونظم المعلومات",
    "lessons": [
      {
        "order": 1,
        "title": "ما هي قاعدة البيانات ولماذا؟",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "النموذج الجدولي: الجداول والعلاقات",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 3,
        "title": "أوامر SQL الأساسية: SELECT",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب استعلاماً يعرض أسماء طلاب من \"حيفا\"."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب استعلاماً يعرض الطلاب مرتّبين تنازلياً حسب العلامة."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب استعلاماً يعرض متوسط علامات كل مدينة."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب استعلاماً يعرض الطلاب الذين علامتهم أعلى من متوسط الصف."
          }
        ]
      },
      {
        "order": 4,
        "title": "فلترة النتائج: WHERE وAND وOR",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "أوامر SQL: INSERT, UPDATE, DELETE",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "GROUP BY وORDER BY",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "JOIN: ربط الجداول",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "الربط مع C#: قراءة من قاعدة بيانات",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 9,
        "title": "مشروع: نظام إدارة بيانات",
        "durationMinutes": 18,
        "type": "مشروع",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "المشروع",
    "name": "بيئة الإنترنت (HTML + JavaScript + SQL)",
    "lessons": [
      {
        "order": 1,
        "title": "كيف يعمل الإنترنت: خادم وعميل",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "HTML الأساسي: بنية الصفحة",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "CSS الأساسي: تنسيق الصفحة",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "JavaScript الأساسي في المتصفح",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "نموذج (Form) وإرسال البيانات",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "بروتوكول HTTP وطلبات GET/POST",
        "durationMinutes": 11,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 7,
        "title": "قاعدة بيانات من الخادم + SQL",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "مشروع: موقع بسيط بقاعدة بيانات",
        "durationMinutes": 18,
        "type": "مشروع",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "المشروع",
    "name": "التشفير (Cryptography)",
    "lessons": [
      {
        "order": 1,
        "title": "ما هو التشفير ولماذا؟",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "شيفرة قيصر (Caesar Cipher)",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "التشفير بالمفتاح المتماثل",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 4,
        "title": "XOR والعمليات الثنائية",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "دالة الهاش (Hash Functions)",
        "durationMinutes": 12,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 6,
        "title": "التشفير غير المتماثل (RSA مبسّط)",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 7,
        "title": "تطبيق: برنامج تشفير بـ C#",
        "durationMinutes": 17,
        "type": "مشروع",
        "questions": []
      }
    ]
  },
  {
    "level": "3 وحدات",
    "unit": "المشروع",
    "name": "تعلّم الآلة (Machine Learning)",
    "lessons": [
      {
        "order": 1,
        "title": "ما هو تعلّم الآلة وأنواعه",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "التعلّم المُوجَّه: Classification",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 3,
        "title": "التعلّم غير الموجَّه: Clustering",
        "durationMinutes": 12,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 4,
        "title": "الشبكات العصبية مبسّطة",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 5,
        "title": "البيانات والتهيئة للنموذج",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 6,
        "title": "التقييم: دقة النموذج",
        "durationMinutes": 12,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 7,
        "title": "مشروع: نموذج تصنيف بسيط",
        "durationMinutes": 17,
        "type": "مشروع",
        "questions": []
      }
    ]
  },
  {
    "level": "5 وحدات",
    "unit": "مباني المعطيات",
    "name": "العودية (Recursion / רקורסיה)",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم العودية: الحالة الأساسية والحالة العودية",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "العودية: factorial وfibonacci",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع `Factorial(4)` — أظهر كل استدعاء وقيمته."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب `Power(int base, int exp)` بالعودية."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب `SumDigits(int n)` بالعودية (مثل: SumDigits(123) = 6)."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ما مشكلة `Fib(50)` بالعودية؟ كيف تحلّها بـ Memoization؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "تتبع استدعاءات العودية (Stack Trace)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "العودية على المصفوفات",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب `MaxArray(int[] arr, int index)` بالعودية."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب `CountEven(int[] arr, int index)` تعدّ الأزواج."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب `ReverseArray(int[] arr, int left, int right)` بالعودية."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `BinarySearchRecursive` — تحدّي الكفاءة: O(log n)."
          }
        ]
      },
      {
        "order": 5,
        "title": "العودية على السلاسل النصية",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "مقارنة العودية مع الحلقات",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 7,
        "title": "العودية الثنائية",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "Merge Sort بالعودية",
        "durationMinutes": 17,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع MergeSort على {5,2,8,1,9} — أظهر التقسيم والدمج."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب دالة `Merge` الكاملة."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "قارن كفاءة MergeSort O(n log n) مع BubbleSort O(n²) عملياً."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب MergeSort بعودية تعمل على سلسلة نصية (ترتيب الحروف)."
          }
        ]
      },
      {
        "order": 9,
        "title": "مسائل عودية من بجروت سابقة",
        "durationMinutes": 18,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "5 وحدات",
    "unit": "مباني المعطيات",
    "name": "الكفاءة الزمنية (Big-O Notation)",
    "lessons": [
      {
        "order": 1,
        "title": "لماذا الكفاءة مهمة؟",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "O(1), O(log n), O(n), O(n²)",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "ما كفاءة دالة تجمع مصفوفة حجمها n؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "قارن: n=1000، كم عملية لكل خوارزمية أعلاه؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ما كفاءة BubbleSort على مصفوفة مرتّبة مسبقاً؟ (أفضل حال)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب خوارزمية O(n) لإيجاد كل الأزواج التي مجموعها = k في مصفوفة."
          }
        ]
      },
      {
        "order": 3,
        "title": "تحليل كفاءة الخوارزميات",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "مقارنة الكفاءات",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "5 وحدات",
    "unit": "مباني المعطيات",
    "name": "المكدس (Stack)",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم المكدس: LIFO",
        "durationMinutes": 11,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "عمليات المكدس: Push, Pop, Peek, IsEmpty",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع: Push(3), Push(7), Push(1), Pop(), Peek(). ما حالة المكدس؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب `Size()` للمكدس."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "استخدم مكدساً لعكس سلسلة نصية."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `IsBalanced(string s)` تتحقق إذا الأقواس متوازنة: {[()]} = true، {[(]} = false."
          }
        ]
      },
      {
        "order": 3,
        "title": "تطبيق المكدس بالمصفوفة",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "تطبيق المكدس بالقائمة المرتبطة",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "تطبيقات المكدس: الأقواس، التعابير",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "5 وحدات",
    "unit": "مباني المعطيات",
    "name": "الطابور (Queue)",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم الطابور: FIFO",
        "durationMinutes": 11,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "عمليات الطابور: Enqueue, Dequeue, Front",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع: Enqueue(A), Enqueue(B), Dequeue(), Enqueue(C), Front(). ما الناتج؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ما الفرق بين الطابور والمكدس؟ متى تستخدم كلاً منهما؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "استخدم طابورين لعكس الطابور الأصلي."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "نفّذ طابور دائري (Circular Queue) بمصفوفة."
          }
        ]
      },
      {
        "order": 3,
        "title": "تطبيق الطابور",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "تطبيقات الطابور الحياتية",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "5 وحدات",
    "unit": "مباني المعطيات",
    "name": "القوائم المرتبطة (Linked List)",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم القائمة المرتبطة: Node والإشارة",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "إنشاء القائمة والإضافة في الرأس",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع إضافة: AddFirst(3), AddFirst(7), AddFirst(1). ارسم القائمة."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب `Print()` لطباعة كل عناصر القائمة."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب `AddLast(int data)` للإضافة في النهاية."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `Reverse()` لعكس ترتيب القائمة المرتبطة."
          }
        ]
      },
      {
        "order": 3,
        "title": "الإضافة في النهاية وفي مكان محدد",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "الحذف من القائمة المرتبطة",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع حذف 7 من القائمة: 1 → 7 → 3 → 5. ارسم النتيجة."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "لماذا يُعالَج حذف العنصر الأول بشكل مختلف؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب `RemoveDuplicates()` لحذف التكرارات من القائمة."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `MergeSorted(LinkedList l1, LinkedList l2)` تدمج قائمتين مرتّبتين."
          }
        ]
      },
      {
        "order": 5,
        "title": "البحث والتنقل في القائمة",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "القائمة المزدوجة (Doubly Linked)",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "مسائل قوائم من بجروت سابقة",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "5 وحدات",
    "unit": "مباني المعطيات",
    "name": "الأشجار الثنائية (Binary Trees)",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم الشجرة: العقد والجذر والأوراق",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "BinNode: تعريف عقدة الشجرة",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "ارسم شجرة جذرها 5، ابن يسار 3، ابن يمين 7."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب كوداً ينشئ الشجرة أعلاه."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب `CountNodes(BinNode root)` بالعودية."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `IsSymmetric(BinNode root)` تتحقق إذا الشجرة متماثلة."
          }
        ]
      },
      {
        "order": 3,
        "title": "مسح الشجرة: Preorder (جذر-يسار-يمين)",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "للشجرة: جذر=1، يسار=2، يمين=3، ابن يسار لـ2=4، ابن يمين لـ2=5. أعطِ Inorder وPreorder وPostorder."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "لماذا Inorder على BST يعطي عناصر مرتّبة؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب `MaxValue(BinNode root)` بالعودية."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `LCA(BinNode root, int a, int b)` يجد أقرب سلف مشترك."
          }
        ]
      },
      {
        "order": 4,
        "title": "مسح الشجرة: Inorder (يسار-جذر-يمين)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "مسح الشجرة: Postorder (يسار-يمين-جذر)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "حساب ارتفاع الشجرة والعمق",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "شجرة البحث الثنائية (BST)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أدرج {5,3,7,1,4} في BST، ارسم النتيجة."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اكتب `Search(BinNode root, int val)` في BST."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "لماذا Inorder على BST الذي أدرجنا فيه {5,3,7,1,4} يعطي {1,3,4,5,7}؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `Delete(BinNode root, int val)` من BST (3 حالات)."
          }
        ]
      },
      {
        "order": 8,
        "title": "الإدراج والبحث في BST",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 9,
        "title": "مسائل أشجار من بجروت سابقة",
        "durationMinutes": 18,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "5 وحدات",
    "unit": "الوحدة الاختيارية",
    "name": "النماذج الحسابية (מודלים חישוביים)",
    "lessons": [
      {
        "order": 1,
        "title": "ما هو الأوتومات ولماذا؟",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الأوتومات المنتهي الحتمي (DFA)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "هل يقبل DFA أعلاه الكلمة: \"aaba\"؟ \"abba\"؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ارسم DFA يقبل الكلمات التي تنتهي بـ \"ab\"."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ارسم DFA يقبل الأعداد الثنائية القابلة للقسمة على 3."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ارسم DFA يقبل الكلمات التي فيها \"aa\" أو \"bb\" كسلسلة جزئية."
          }
        ]
      },
      {
        "order": 3,
        "title": "بناء DFA ورسم مخططه",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "الأوتومات اللاحتمي (NFA)",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "تحويل NFA إلى DFA",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "اللغات الصورية والمنتظمة",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 7,
        "title": "أوتومات المكدس (PDA)",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "آلة تورينغ: مقدمة",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "ما الفرق بين DFA وآلة تورينغ؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "صف خطوات آلة تورينغ لحساب 1+1 بالنظام الأحادي."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ارسم آلة تورينغ تتحقق إذا كانت الكلمة بالينمروم."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "لماذا لا يمكن لآلة تورينغ حل \"مشكلة التوقف\"؟ شرح مبسّط."
          }
        ]
      },
      {
        "order": 9,
        "title": "آلة تورينغ: أمثلة",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 10,
        "title": "مسائل نماذج من بجروت سابقة",
        "durationMinutes": 18,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "5 وحدات",
    "unit": "الوحدة الاختيارية",
    "name": "OOP المتقدم",
    "lessons": [
      {
        "order": 1,
        "title": "مراجعة OOP الأساسي",
        "durationMinutes": 12,
        "type": "مراجعة",
        "questions": []
      },
      {
        "order": 2,
        "title": "الواجهات (Interfaces)",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أضف كلاس `Square` يُطبّق `IShape`."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ما الفرق بين `IShape` كـinterface و`Shape` كـabstract class؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اكتب `IComparable` لكلاس `Student` للمقارنة حسب العلامة."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `interface IStack<T>` ونفّذه."
          }
        ]
      },
      {
        "order": 3,
        "title": "الكلاس المجرّد مقابل الواجهة",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 4,
        "title": "تعدد الأشكال المتقدم",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "العام (Generics): T",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "Delegates والأحداث",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "الأنماط التصميمية: Singleton, Factory",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "مسائل OOP متقدم من البجروت",
        "durationMinutes": 18,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "level": "5 وحدات",
    "unit": "الوحدة الاختيارية",
    "name": "خوارزميات الرسوم البيانية (Graphs)",
    "lessons": [
      {
        "order": 1,
        "title": "ما هو الرسم البياني؟ الأنواع",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "تمثيل الرسم: مصفوفة التجاور",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "تمثيل الرسم: قائمة التجاور",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "المسح بالعرض (BFS)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "تتبّع BFS على: 0→{1,2}, 1→{3}, 2→{4}, ابدأ من 0."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "متى تستخدم BFS ومتى DFS؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "استخدم BFS لإيجاد أقصر مسار في شبكة عير موزونة."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اكتب `IsConnected(Graph g)` بـBFS."
          }
        ]
      },
      {
        "order": 5,
        "title": "المسح بالعمق (DFS)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "أقصر مسار: Dijkstra",
        "durationMinutes": 17,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "الترتيب الطوبولوجي",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "الشجرة الممتدة الدنيا (MST)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 9,
        "title": "ضغط البيانات: Huffman",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 10,
        "title": "مسائل رسوم بيانية من بجروت",
        "durationMinutes": 18,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  }
];
