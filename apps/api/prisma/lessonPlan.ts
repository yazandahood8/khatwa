/* AUTO-GENERATED from خطة_الدروس_والمسائل_الكاملة.md — do not edit by hand. */
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Question = { order: number; difficulty: Difficulty; text: string };
export type LessonRow = { order: number; title: string; durationMinutes: number; type: string; questions: Question[] };
export type TopicPlan = { grade: number; level: string; domain: string; name: string; lessons: LessonRow[] };

export const LESSON_PLAN: TopicPlan[] = [
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "المتغيرات والتعابير الجبرية",
    "lessons": [
      {
        "order": 1,
        "title": "ما هو المتغير ولماذا نستخدمه",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أحمد عنده x كتاب. اكتب تعبيراً يمثّل عدد الكتب إذا اشترى 3 كتب أخرى."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مريم تكبر سارة بـ 5 سنوات. إذا عمر سارة y، اكتبي تعبيراً لعمر مريم."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "مستطيل طوله ضعف عرضه. إذا العرض = a، اكتب تعبيراً للمحيط."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ثمن قميص أغلى من ثمن بنطال بـ 30 شيكل. إذا ثمن البنطال = t، ما تكلفة 2 قميص و3 بناطيل؟"
          }
        ]
      },
      {
        "order": 2,
        "title": "كتابة التعابير الجبرية من مواقف حياتية",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب تعبيراً لعدد الأقلام إذا كان عندك n قلم واشتريت 7 أقلام."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "شارة تسبق k متراً. بعد دقيقتين قطعت 80 متراً إضافية. اكتب تعبيراً للمسافة الكلية."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ثمن 5 تفاحات وعبوة عصير. إذا ثمن التفاحة x والعصير 8 شيكل، اكتب التعبير واحسبه عندما x=3."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "قاعة تتسع لـ r شخص. ملئت 3/4 منها ثم خرج 12 شخصاً. اكتب تعبيراً لعدد الأشخاص في القاعة الآن."
          }
        ]
      },
      {
        "order": 3,
        "title": "التعويض بقيم عددية في التعابير",
        "durationMinutes": 12,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب قيمة 3x + 5 عندما x = 4."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "احسب قيمة 2a² - 3a + 1 عندما a = 2."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "إذا T = 5n + 20، جد قيمة n التي تجعل T = 70."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "إذا كان محيط مستطيل = 2(l + w)، احسب الطول إذا كان المحيط 44 والعرض 8."
          }
        ]
      },
      {
        "order": 4,
        "title": "جمع وطرح الحدود المتشابهة",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "بسّط: 3x + 5x"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "بسّط: 7a + 3b - 2a + 5b"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "بسّط: 4x² + 3x - 2x² + 5 - x"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "بسّط وعوّض عند x=2: (5x + 3) + (2x - 7) - (x + 1)"
          }
        ]
      },
      {
        "order": 5,
        "title": "قانون التوزيع وإخراج العامل المشترك",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "وسّع: 3(x + 4)"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "وسّع وبسّط: 2(3x + 5) + 4(x - 1)"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أخرج العامل المشترك: 6x² + 9x"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "بسّط: 3(2a + b) - 2(a - 3b) + 5(a + b)"
          }
        ]
      },
      {
        "order": 6,
        "title": "مسائل تطبيقية مركّبة",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "ثمن دفتر x شيكل وثمن قلم 4 شيكل. اكتب تعبيراً لثمن 3 دفاتر وقلمين، ثم احسبه عند x = 6."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مستطيل طوله (3x+2) وعرضه (x+1). اكتب تعبيراً للمحيط وبسّطه."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "بسّط: 5(2x-3) - 3(x+4) + 2(x-1) ثم أوجد القيمة عند x=3."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "مثلث أضلاعه (2x+1) و(3x-2) و(x+5). إذا محيطه = 34، أوجد x ثم طول كل ضلع."
          }
        ]
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "الانتظام والأنماط",
    "lessons": [
      {
        "order": 1,
        "title": "اكتشاف القانون في المتتاليات",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "ما الحد التالي في المتتالية: 2, 5, 8, 11, ...؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ما القانون في المتتالية: 3, 6, 12, 24, ...؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أوجد الحد العاشر في: 4, 7, 10, 13, ..."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "متتالية: 1, 4, 9, 16, ... ما هو الحد العام؟ ما الحد الخامس عشر؟"
          }
        ]
      },
      {
        "order": 2,
        "title": "التعبير عن القانون بصيغة عامة",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب الصيغة العامة للمتتالية: 5, 8, 11, 14, ..."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "متتالية صيغتها aₙ = 3n + 2. أوجد الحد السابع والعشرين."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ما رقم الحد الذي قيمته 50 في المتتالية: 2, 5, 8, 11, ...؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "متتالية: 100, 95, 90, 85, ... بعد كم حد تصل لـ صفر؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "الانتقال بين الجدول والغراف والصيغة",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اكتب جدولاً لـ f(x) = 2x + 1 للقيم x = 0, 1, 2, 3, 4."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "من الجدول: x: 1,2,3,4 و y: 5,8,11,14. أوجد الصيغة."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "من الغراف الخطي الذي يمرّ بـ (0,3) و(2,7)، أوجد الصيغة."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "شركة تنتج n وحدة أرباحها: p = 15n - 300. متى تبدأ الأرباح؟"
          }
        ]
      },
      {
        "order": 4,
        "title": "الأنماط الهندسية والعددية",
        "durationMinutes": 12,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "كم عدد النقاط في الشكل رقم 5 إذا: شكل 1 = 1 نقطة، شكل 2 = 3 نقاط، شكل 3 = 6 نقاط؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مربعات تُبنى هكذا: مربع 1 يحتاج 4 أعواد، مربع 2 يحتاج 7، مربع 3 يحتاج 10. كم عوداً يحتاج المربع n؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أوجد صيغة عدد النقاط في المثلث المرقّم: 1, 3, 6, 10, 15, ..."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "نمط من المستطيلات: 1×2, 2×3, 3×4, ... أوجد مساحة المستطيل رقم 20."
          }
        ]
      },
      {
        "order": 5,
        "title": "مسائل تطبيقية على الانتظام",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "سيارة تقطع 60 كم في ساعة. اكتب دالة المسافة بدلالة الوقت."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "محل يبيع خبزاً. كل رغيف بـ 5 شيكل والتوصيل 15 شيكل. كم يدفع من يطلب n رغيف؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "بركة ماء بها 500 لتر وتُملأ بمعدل 30 لتر/دقيقة. متى تصل لـ 1000 لتر؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "سعر هاتف ينخفض 200 شيكل كل شهر. بدأ بـ 3000 شيكل. متى يصل لـ 500 شيكل؟"
          }
        ]
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "المعادلات الخطية",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم المعادلة والحل",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "حل معادلات من نوع ax = b",
        "durationMinutes": 11,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "حل: 5x = 35"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حل: -3x = 18"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حل: (2/3)x = 8"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حل وتحقق: 0.4x = 6.8"
          }
        ]
      },
      {
        "order": 3,
        "title": "حل معادلات من نوع ax + b = c",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "حل: 2x + 3 = 11"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حل: 5x - 7 = 18"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حل: (x/4) + 3 = 7"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حل: 2(x+3) = 14"
          }
        ]
      },
      {
        "order": 4,
        "title": "حل معادلات من نوع ax + b = cx + d",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "حل: 3x + 5 = x + 11"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حل: 5x - 3 = 2x + 9"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حل: 4(x-2) = 2(x+3)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حل: 3(2x+1) - 5 = 4(x-2) + 7"
          }
        ]
      },
      {
        "order": 5,
        "title": "المسائل اللفظية بالمعادلات",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "جد عدداً إذا أضفت إليه 7 حصلت على 23."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "عمر أب ضعف عمر ابنه ويكبره بـ 28 سنة. أوجد عمريهما."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حديقة مستطيلة طولها أكبر من عرضها بـ 5 أمتار ومحيطها 46 متراً. أوجد أبعادها."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "اشترى حامد بضاعة وباعها بربح 20% فحصل على 360 شيكل. كم دفع ثمناً للبضاعة؟"
          }
        ]
      },
      {
        "order": 6,
        "title": "التحقق من الحل ومسائل مركّبة",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "الزوايا والمستقيمات",
    "lessons": [
      {
        "order": 1,
        "title": "أنواع الزوايا وقياسها",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الزوايا المتجاورة والمتقابلة بالرأس",
        "durationMinutes": 12,
        "type": "مفاهيمي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "إذا كانت زاوية = 65°، أوجد الزاوية المجاورة لها على مستقيم."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مستقيمان يتقاطعان. زاوية واحدة = 3x+10 والمقابلة لها = 5x-20. أوجد x والزوايا الأربع."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ثلاثة مستقيمات تمرّ بنقطة واحدة. زاويتان متجاورتان 40° و75°. أوجد كل الزوايا."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أربعة مستقيمات تخرج من نقطة. ثلاث زوايا متتالية 70°, 85°, 65°. أوجد الزاوية الرابعة."
          }
        ]
      },
      {
        "order": 3,
        "title": "التوازي والتعامد وزوايا القاطع",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "مستقيمان متوازيان وقاطع. إذا زاوية = 55°، أوجد جميع الزوايا الثمانية."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أثبت أن مستقيمين متوازيين إذا كانت الزوايا المتبادلة متساوية = 70°."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "زاوية بين مستقيم وقاطع = 4x-10. الزاوية المناظرة = 3x+15. هل المستقيمان متوازيان؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "في شكل هندسي: مستقيمان متوازيان L1 وL2، وقاطع يصنع مع L1 زاوية 3x+20 ومع L2 زاوية 2x+50. أوجد x وأثبت التوازي."
          }
        ]
      },
      {
        "order": 4,
        "title": "مجموع زوايا المثلث والزاوية الخارجية",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "في مثلث زاويتان 60° و70°. أوجد الزاوية الثالثة."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "في مثلث زاياه x, 2x, 3x. أوجد كل زاوية. ما نوع المثلث؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "الزاوية الخارجية لمثلث = 130° وزاوية داخلية غير مجاورة = 75°. أوجد الزاوية الثالثة."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "مثلث زاياه (x+10)°, (2x-5)°, (3x+15)°. أثبت أن المثلث حاد الزوايا."
          }
        ]
      },
      {
        "order": 5,
        "title": "نظرية: مجموع ضلعين أكبر من الثالث",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 6,
        "title": "مسائل مركّبة على الزوايا",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "المثلثات والمضلعات",
    "lessons": [
      {
        "order": 1,
        "title": "أنواع المثلثات وخصائصها",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "محيط ومساحة المثلث",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "مثلث قاعدته 8 سم وارتفاعه 5 سم. أوجد مساحته."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مثلث مساحته 30 سم² وارتفاعه 6 سم. أوجد قاعدته."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "مثلث متساوي الأضلاع ضلعه 6 سم. أوجد ارتفاعه ثم مساحته. (تلميح: استخدم خاصية النصف)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أرض مثلثة الشكل. القاعدة 40 متراً. ثمن السياج 15 شيكل/متر وثمن التبليط 25 شيكل/م². إذا المحيط 100 م والمساحة 600 م²، احسب التكلفة الكلية."
          }
        ]
      },
      {
        "order": 3,
        "title": "المستطيل والمربع: مساحة ومحيط",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "المضلعات المختلفة ومساحاتها",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "الأشكال المركّبة",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "شكل من مستطيل (6×4) فوقه مثلث قاعدته 6 وارتفاعه 3. أوجد المساحة الكلية."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حرف L: مستطيل كبير (10×8) تُطرح منه زاوية (4×3). أوجد المساحة."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "منزل: مستطيل (12×8) فوقه مثلث ارتفاعه 3. أوجد المساحة والمحيط الخارجي."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أرض على شكل مستطيل (20×15) بداخلها ممر على شكل십자 عرضه 2 م. أوجد مساحة الأرض الصالحة للزراعة."
          }
        ]
      },
      {
        "order": 6,
        "title": "مسائل حياتية على المساحات",
        "durationMinutes": 14,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "الدائرة",
    "lessons": [
      {
        "order": 1,
        "title": "أجزاء الدائرة وثابت π",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "محيط الدائرة وتطبيقاته",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد محيط دائرة نصف قطرها 7 سم. (π ≈ 3.14)"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "محيط دائرة = 62.8 سم. أوجد نصف قطرها وقطرها."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "دراجة هوائية قطر عجلتها 60 سم. كم دورة تدور لتقطع 1 كيلومتر؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حديقة دائرية محيطها 88 متراً. ثمن سياجها 30 شيكل/متر. كم تكلفة السياج؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "مساحة الدائرة وتطبيقاتها",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد مساحة دائرة نصف قطرها 5 سم."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مساحة دائرة = 154 سم². أوجد نصف قطرها."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "دائرتان. نصف قطر الكبيرة = 10 والصغيرة = 6. أوجد مساحة المنطقة بينهما."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ملعب دائري نصف قطره 50 متراً. بداخله ملعب مربع ضلعه 60 متراً. كم تبلَّط المنطقة خارج المربع وداخل الدائرة؟"
          }
        ]
      },
      {
        "order": 4,
        "title": "قوس الدائرة والقطاع الدائري",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد طول قوس قطاع زاويته 90° في دائرة نصف قطرها 8 سم."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أوجد مساحة قطاع زاويته 60° في دائرة نصف قطرها 12 سم."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ساعة طول عقربها الكبير 10 سم. ما المساحة التي يجتازها خلال 20 دقيقة؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "قطاع زاويته 120° ومساحته 75π سم². أوجد نصف قطره ومحيط القطاع."
          }
        ]
      },
      {
        "order": 5,
        "title": "الأشكال المركّبة مع الدائرة",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "الأجسام الهندسية",
    "lessons": [
      {
        "order": 1,
        "title": "المنشور وأنواعه والفرد",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "حجم المنشور المستطيل",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "صندوق أبعاده 5×4×3 سم. أوجد حجمه."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حجم علبة شكلها منشور = 120 سم³. طولها 10 والعرض 4. أوجد ارتفاعها."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "برك سباحة شكلها منشور قاعدتها مستطيل 25×12 متراً وعمقها 2 متر. كم لتراً من الماء تتسع؟ (1 م³ = 1000 لتر)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "صندوق مربعي القاعدة حجمه 500 سم³. إذا ارتفاعه = 2 × ضلع القاعدة. أوجد أبعاده."
          }
        ]
      },
      {
        "order": 3,
        "title": "مساحة السطح الكلية للمنشور",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "مسائل عملية على المنشور",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال العددي",
    "name": "قوانين العمليات الحسابية",
    "lessons": [
      {
        "order": 1,
        "title": "قوانين التبديل والتجميع والتوزيع",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "العناصر المحايدة والمعكوسة",
        "durationMinutes": 10,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 3,
        "title": "تطبيق القوانين في الحساب الذهني",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب ذهنياً: 25 × 4 × 7"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "استخدم قانون التوزيع: 8 × 97 = 8 × (100 - 3)"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أثبت أن: (a+b)² ≠ a² + b² باستخدام مثال عددي."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "احسب: 1+2+3+...+100 (باستخدام قانون مناسب)"
          }
        ]
      },
      {
        "order": 4,
        "title": "مسائل مركّبة باستخدام القوانين",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال العددي",
    "name": "القوى والجذور",
    "lessons": [
      {
        "order": 1,
        "title": "تعريف القوة وقواعدها الأساسية",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "قوانين الأس: الضرب والقسمة",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "بسّط: 2³ × 2⁴"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "بسّط: (3²)³ ÷ 3⁴"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "بسّط: (2³ × 3²) / (2 × 3³)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حل: 2ˣ = 64. ما قيمة x؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "القوة الصفرية والسالبة",
        "durationMinutes": 11,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 4,
        "title": "الجذر التربيعي: تعريف وحساب",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب: √144"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "بسّط: √50 (تلميح: √50 = √(25×2))"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حل: x² = 75. أعطِ الجواب بصيغة مبسّطة."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أثبت أن √2 ليس عدداً نسبياً (إثبات بالتناقض)."
          }
        ]
      },
      {
        "order": 5,
        "title": "مسائل مركّبة",
        "durationMinutes": 14,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال العددي",
    "name": "الأعداد الموجّهة",
    "lessons": [
      {
        "order": 1,
        "title": "الأعداد السالبة في الحياة",
        "durationMinutes": 8,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "مستقيم الأعداد والقيمة المطلقة",
        "durationMinutes": 11,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 3,
        "title": "جمع وطرح الأعداد الموجّهة",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب: (-5) + 8"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "احسب: (-12) - (-7) + 3"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حرارة: صباحاً -8°، ارتفعت 15°، ثم انخفضت 6°. ما الحرارة الآن؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "احسب: |-5 + 8| - |3 - 10| + |(-2)²|"
          }
        ]
      },
      {
        "order": 4,
        "title": "ضرب وقسمة الأعداد الموجّهة",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب: (-4) × 7"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "احسب: (-3) × (-5) × 2"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "احسب: (-2)³ + (-3)²"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حل: (-2)ˣ = -32. ما قيمة x؟"
          }
        ]
      },
      {
        "order": 5,
        "title": "العمليات المختلطة والأولويات",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "مسائل تطبيقية",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال العددي",
    "name": "جملة المحاور",
    "lessons": [
      {
        "order": 1,
        "title": "المحاور والأرباع والإحداثيات",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "تمثيل النقاط وقراءة الإحداثيات",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "مثّل النقاط: A(3,4), B(-2,1), C(0,-3) في جملة محاور."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ما الربع الذي تنتمي له كل نقطة: (-3,5), (2,-4), (-1,-2), (4,3)؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "نقطة A(3,y) تبعد 5 وحدات عن المحور الأفقي. ما قيمة y؟ (حلّان)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "مستطيل رؤوسه A(1,1), B(5,1), C(5,4). أوجد D واحسب المساحة والمحيط."
          }
        ]
      },
      {
        "order": 3,
        "title": "حساب المسافة بين نقطتين (أفقياً/رأسياً)",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "مسائل هندسية في جملة المحاور",
        "durationMinutes": 14,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 7,
    "level": "موحّد",
    "domain": "المجال الإحصائي",
    "name": "جمع وتنظيم المعطيات",
    "lessons": [
      {
        "order": 1,
        "title": "جمع المعطيات وتنظيمها في جداول",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الرسم البياني العصوي والخطي",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "الرسم البياني الدائري",
        "durationMinutes": 11,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "المتوسط والوسيط والمنوال والمدى",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "درجات: 70, 85, 60, 90, 75. أوجد المتوسط والمدى."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "درجات: 5, 8, 3, 7, 8, 4, 8, 6. أوجد الوسيط والمنوال."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "متوسط 6 أعداد = 15. إذا أضفنا عدداً جديداً يصبح المتوسط 16. ما العدد الجديد؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "5 أعداد وسيطها 7 ومتوسطها 8 ومداها 10. أصغر عدد = 3. أوجد مجموعة أعداد ممكنة."
          }
        ]
      },
      {
        "order": 5,
        "title": "قراءة وتفسير ونقد الرسوم البيانية",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 8,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "النسبة والتناسب والنسب المئوية",
    "lessons": [
      {
        "order": 1,
        "title": "النسبة والكسور المتكافئة",
        "durationMinutes": 10,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "التناسب المباشر والعكسي",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 3,
        "title": "مقياس الرسم والخرائط",
        "durationMinutes": 12,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 4,
        "title": "النسب المئوية: حساب وتحويل",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "ما نسبة 15 من 60؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ما هو 35% من 420 شيكل؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "سعر جهاز بعد خصم 20% = 640 شيكل. ما السعر الأصلي؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ارتفع سعر شقة 15% فأصبح 575,000 شيكل. ما السعر الأصلي؟"
          }
        ]
      },
      {
        "order": 5,
        "title": "الزيادة والنقصان بالنسبة المئوية",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "سعر أصلي 200 شيكل، زاد 30%. ما السعر الجديد؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "كوب سعره 50 شيكل. ارتفع 10% ثم انخفض 10%. هل رجع للسعر الأصلي؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "بضاعة بُيعت بخسارة 12% فأصبح ثمنها 440 شيكل. ما الثمن الأصلي؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "عدد الطلاب في مدرسة زاد 20% في السنة الأولى وانخفض 15% في الثانية. ما النسبة المئوية الكلية للتغيير؟"
          }
        ]
      },
      {
        "order": 6,
        "title": "الفائدة البسيطة والخصومات",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 7,
        "title": "مسائل مركّبة",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 8,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "الدالة الخطية",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم الدالة: لكل مدخل مخرج واحد",
        "durationMinutes": 11,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الدالة الخطية: f(x) = mx + b",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 3,
        "title": "الميل: معنى وحساب",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب ميل المستقيم بين (2,3) و(6,7)."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مستقيم ميله 3 ويمرّ بـ (1,5). أوجد نقطة التقاطع مع محور y."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "مستقيم يمرّ بـ (0,4) و(3,0). أوجد ميله ومعادلته."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ثلاث نقاط A(1,2), B(3,6), C(5,10). هل هي على مستقيم واحد؟ علّل."
          }
        ]
      },
      {
        "order": 4,
        "title": "رسم الدالة الخطية من معادلتها",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "إيجاد معادلة المستقيم من نقطة وميل",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "إيجاد معادلة المستقيم من نقطتين",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد معادلة المستقيم الذي يمرّ بـ (0,3) و(2,7)."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أوجد معادلة المستقيم الذي يمرّ بـ (1,-2) و(4,4)."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "مستقيمان: y=2x+1 وy=2x-3. هل يتقاطعان؟ لماذا؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "مثلث رؤوسه A(0,0), B(4,0), C(0,3). أوجد معادلات أضلاعه الثلاثة."
          }
        ]
      },
      {
        "order": 7,
        "title": "المستقيمات المتوازية والمتعامدة",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "تطبيقات الدالة الخطية في الحياة",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 8,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "جملة معادلتين بمجهولين",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم جملة المعادلات والحل البياني",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "حل جملة المعادلات بالإحلال",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "حل: y = 2x و x + y = 9"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حل: y = 3x - 1 و 2x + y = 9"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حل: 2x + 3y = 12 و x = y + 1"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حل: x/2 + y/3 = 4 و x - y = 2"
          }
        ]
      },
      {
        "order": 3,
        "title": "حل جملة المعادلات بالطرح/الجمع",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "الحالات الخاصة (لا حل، حلول لانهائية)",
        "durationMinutes": 12,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 5,
        "title": "المسائل اللفظية بجملة معادلتين",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "عمر أحمد وسارة معاً 30. سارة أكبر بـ 4 سنوات. أوجد عمريهما."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اشترى حامد 3 كتب و2 دفاتر بـ 48 شيكل، و2 كتب و5 دفاتر بـ 50 شيكل. ما ثمن كل منهما؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "مزيج من عصير تفاح (5 شيكل/لتر) وعصير برتقال (8 شيكل/لتر). المزيج 10 لتر بسعر 6.5 شيكل/لتر. أوجد كمية كل نوع."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "قارب يسير مع التيار 30 كم/ساعة وضده 18 كم/ساعة. أوجد سرعة القارب في مياه ساكنة وسرعة التيار."
          }
        ]
      },
      {
        "order": 6,
        "title": "مسائل مركّبة",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 8,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "المتباينات",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم المتباينة وخصائصها",
        "durationMinutes": 11,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "حل المتباينات الخطية",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "حل وارسم: 3x + 5 > 14"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حل وارسم: -2x + 7 ≤ 1"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حل: 2(x-3) > 4(x+1) - 6"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حل: |2x - 3| < 7 (مقدمة للقيمة المطلقة)"
          }
        ]
      },
      {
        "order": 3,
        "title": "تمثيل الحل على مستقيم الأعداد",
        "durationMinutes": 11,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "المتباينة المزدوجة",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "مسائل تطبيقية",
        "durationMinutes": 14,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 8,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "نظرية فيثاغورس",
    "lessons": [
      {
        "order": 1,
        "title": "نص النظرية وإثباتها البصري",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "إيجاد الوتر",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "مثلث قائم ضلعاه 3 و4. أوجد وتره."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مثلث قائم ضلعاه 5 و12. أوجد وتره."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "مستطيل أبعاده 6×8. أوجد طول قطره."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "سلّم طوله 10 م مستند لجدار. قاعدته 6 م من الجدار. على أي ارتفاع يلامس الجدار؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "إيجاد ضلع قائم مجهول",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "النظرية العكسية والتحقق",
        "durationMinutes": 11,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 5,
        "title": "أمثلة كاملة العدد",
        "durationMinutes": 10,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "تطبيقات فيثاغورس في المسائل",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد ارتفاع مثلث متساوي الأضلاع ضلعه 10 سم."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ملعب مستطيل 80×60 متراً. شخص يريد القطر مباشرة. كم يوفّر مقارنة بالمسير على الجوانب؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "نقطة تبعد 13 وحدة عن المركز (0,0) وإحداثيها x=5. أوجد y (حلّان)."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "هل يمكن بناء مثلث أضلاعه 7, 24, 26؟ وإذا كانت أضلاعه 9, 40, 41 هل هو قائم؟"
          }
        ]
      },
      {
        "order": 7,
        "title": "فيثاغورس في الفراغ",
        "durationMinutes": 14,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 8,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "التحويلات الهندسية",
    "lessons": [
      {
        "order": 1,
        "title": "الانسحاب (الإزاحة)",
        "durationMinutes": 12,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الانعكاس حول المحاور",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "انعكاس النقطة A(3,5) حول محور x. ما إحداثيات الصورة؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مثلث رؤوسه (1,2), (3,2), (2,5). ارسم انعكاسه حول محور y."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "نقطة A(3,4) انعكاسها A' هي (-3,4). حول أي محور جرى الانعكاس؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "نقطة تقع في الربع الأول بعد انعكاسها حول y وانعكاس الصورة حول x أصبحت (-3,-4). ما النقطة الأصلية؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "الدوران حول نقطة",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "الأشكال المتطابقة وخصائصها",
        "durationMinutes": 11,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 5,
        "title": "التحويلات المركّبة",
        "durationMinutes": 14,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 8,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "تطابق المثلثات",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم التطابق وشروطه",
        "durationMinutes": 11,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "شرط جا.ج.جا (ض.ض.ز)",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "شرط جا.جا.جا (ض.ض.ض)",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "شرط ز.جا.ز (ز.ض.ز)",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "كتابة إثبات التطابق كاملاً",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "مثلثان: AB=DE, BC=EF, زاوية B = زاوية E. ما شرط التطابق؟ ما النتائج؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "في متوازي أضلاع ABCD، أثبت أن مثلث ABC ≅ مثلث CDA."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "في مثلث ABC، D نقطة على BC بحيث AD منصّف وارتفاع. أثبت أن المثلث متساوي الساقين."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ABCD مستطيل. أثبت أن AC = BD باستخدام تطابق المثلثات."
          }
        ]
      },
      {
        "order": 6,
        "title": "تطبيقات التطابق في النظريات",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 8,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "الأسطوانة والمخروط",
    "lessons": [
      {
        "order": 1,
        "title": "الأسطوانة: الأجزاء والحجم",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أسطوانة نصف قطرها 7 وارتفاعها 10. أوجد حجمها."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "علبة أسطوانية نصف قطرها 5 سم. تُملأ بـ 1570 سم³ من العصير. ما ارتفاعها؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أسطوانة حجمها 500π سم³. إذا ارتفاعها = 2 × نصف قطرها. أوجد أبعادها."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "مخروط داخل أسطوانة نفس القاعدة والارتفاع. ما نسبة حجم المخروط لحجم الأسطوانة؟"
          }
        ]
      },
      {
        "order": 2,
        "title": "مساحة الأسطوانة",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "المخروط: الأجزاء والحجم",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "مساحة المخروط",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "مسائل مركّبة (أسطوانة + مخروط)",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 9,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "التقنية الجبرية المتقدمة",
    "lessons": [
      {
        "order": 1,
        "title": "ضرب ثنائي الحدود: (a+b)(c+d)",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 2,
        "title": "صيغ الضرب المختصر: (a±b)²",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "وسّع: (x+3)²"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "وسّع وبسّط: (2x-5)² + (x+1)²"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "احسب: 98² باستخدام (100-2)²"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أثبت أن: (a+b)² - (a-b)² = 4ab"
          }
        ]
      },
      {
        "order": 3,
        "title": "الفرق بين مربعين: (a+b)(a-b)",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "الكسور الجبرية: التبسيط",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "الكسور الجبرية: الجمع والطرح",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "الكسور الجبرية: الضرب والقسمة",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "التحليل لعوامل: العامل المشترك",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "التحليل لعوامل: الثلاثي التربيعي",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "حلّل: x² + 5x + 6"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حلّل: 2x² + 7x + 3"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حلّل: 3x² - 10x + 8"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حلّل: 6x² - x - 12"
          }
        ]
      },
      {
        "order": 9,
        "title": "التحليل لعوامل: الفرق بين مربعين",
        "durationMinutes": 12,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 10,
        "title": "مسائل مركّبة على التقنية الجبرية",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 9,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "الدالة التربيعية",
    "lessons": [
      {
        "order": 1,
        "title": "تعريف الدالة التربيعية وشكلها",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الرأس ومحور التماثل",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "إيجاد نقاط التقاطع مع المحاور",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد نقطة تقاطع y = x² - 4 مع محور y."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أوجد نقاط تقاطع y = x² - 5x + 6 مع محور x."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "دالة y = x² - 4x + c لا تتقاطع مع محور x. ما قيم c الممكنة؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "دالة تربيعية رأسها (2,3) وتمرّ بـ (0,7). أوجد معادلتها."
          }
        ]
      },
      {
        "order": 4,
        "title": "تحويل من الشكل العام لشكل الرأس",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "التحويلات: إزاحة أفقية وعمودية",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "التحويلات: انعكاس وتمدد",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "رسم الدالة التربيعية كاملاً",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "مسائل على الحد الأقصى والأدنى",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد الحد الأدنى لـ f(x) = x² - 6x + 10."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "كرة تُرمى للأعلى. ارتفاعها: h(t) = -5t² + 20t + 1. ما الارتفاع الأقصى؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "مستطيل محيطه 40 متراً. أوجد أبعاده حتى تكون مساحته أقصى ما يمكن."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "تاجر يبيع x وحدة بسعر (80-x) شيكل للوحدة. ما الكمية التي تُحقق أقصى إيراد؟"
          }
        ]
      }
    ]
  },
  {
    "grade": 9,
    "level": "موحّد",
    "domain": "المجال الجبري",
    "name": "المعادلة التربيعية",
    "lessons": [
      {
        "order": 1,
        "title": "المعادلة التربيعية: التعريف والأنواع",
        "durationMinutes": 11,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الحل بالتحليل لعوامل",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "القانون العام (صيغة الجذرين)",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "حل: x² + 5x + 6 = 0"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حل: 2x² - 7x + 3 = 0"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حل: 3x² + 5x - 2 = 0 ثم تحقق من مجموع الجذرين وحاصل ضربهما."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حل: x² - 2√3·x + 3 = 0 (إجابة بصيغة جذرية)"
          }
        ]
      },
      {
        "order": 4,
        "title": "المميّز وحالاته الثلاث",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد المميّز لـ: x² + 4x + 4 = 0. ما عدد الجذور؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "لأي قيمة k تكون لـ x² + kx + 9 = 0 جذر وحيد؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "لأي قيم m تكون لـ mx² + 6x + 1 = 0 جذران حقيقيان؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "المعادلة x² - 2ax + (a+2) = 0 ليس لها جذور حقيقية. أوجد قيم a."
          }
        ]
      },
      {
        "order": 5,
        "title": "الحل بإكمال المربع",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "مجموع الجذرين وحاصل ضربهما",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "المسائل اللفظية بالمعادلة التربيعية",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "مستطيل طوله أكبر من عرضه بـ 3. مساحته 40. أوجد أبعاده."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "عددان موجبان مجموعهما 7 وحاصل ضربهما 12. أوجدهما."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "مروّج مستطيل الشكل 30×20 متراً. يحيطه ممشى بعرض x. إذا مساحة الممشى 296 م²، أوجد x."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "قارب يقطع 120 كم مع التيار وعائداً. السرعة مع التيار تزيد 4 كم/ساعة عن الرجوع. الرحلة الكاملة 10 ساعات. ما سرعة القارب وسرعة التيار؟"
          }
        ]
      },
      {
        "order": 8,
        "title": "المعادلات التي تتحوّل لتربيعية",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      }
    ]
  },
  {
    "grade": 9,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "تشابه المثلثات المتقدم",
    "lessons": [
      {
        "order": 1,
        "title": "شروط التشابه: ز.ز ونسبة الأضلاع",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 2,
        "title": "حساب أضلاع مجهولة بالتشابه",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "مثلثان متشابهان. أضلاع الأول 3,4,5. أوجد أضلاع الثاني إذا أصغر ضلع فيه = 6."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "في مثلث ABC، D على AB وE على AC بحيث DE∥BC. AD=3, DB=6, DE=4. أوجد BC."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ارتفاع شجرة. ظل شخص طوله 1.8م يساوي 2.4م. ظل الشجرة 16م. ما ارتفاع الشجرة؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "في المثلث القائم ABC (الزاوية القائمة C). CD ارتفاع من C لـAB. إذا AD=4 وDB=9، أوجد CD وAC وBC."
          }
        ]
      },
      {
        "order": 3,
        "title": "التشابه في المثلث القائم",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "إثبات التشابه",
        "durationMinutes": 16,
        "type": "تطبيقي",
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
    "grade": 9,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "متوازي الأضلاع والأشكال الخاصة",
    "lessons": [
      {
        "order": 1,
        "title": "متوازي الأضلاع: تعريف وخصائص",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "شروط كون الشكل متوازي أضلاع",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أعطِ تعريفاً ثم مثّل على متوازي أضلاع ليس مستطيلاً."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "ABCD حيث AB=CD وAD=BC. هل هو متوازي أضلاع؟ هل يكفي هذا الشرط دائماً؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "رباعي أقطاره يتقاطعان عند منتصفيهما. أثبت أنه متوازي أضلاع."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ABCD رباعي. A(0,0), B(4,0), C(6,3), D(2,3). هل هو متوازي أضلاع؟ مستطيل؟ معيّن؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "المستطيل والمعيّن والمربع",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "شبه المنحرف وأنواعه",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "الإثبات بالنظريات",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 6,
        "title": "المساحات والمحيطات لهذه الأشكال",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      }
    ]
  },
  {
    "grade": 9,
    "level": "موحّد",
    "domain": "المجال الهندسي",
    "name": "الإثبات الهندسي",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم الإثبات وهيكله الرسمي",
        "durationMinutes": 11,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الإثبات المباشر بالتطابق",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أثبت أن قطبي المعيّن عمودان على بعضهما."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "في ABCD متوازي أضلاع، E وسط AB وF وسط CD. أثبت أن AEFD متوازي أضلاع."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "في مثلث ABC، D وسط BC. E وسط AD. أثبت أن مساحة ABC = 4 × مساحة ABE."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ABCD مربع وP نقطة على AB. أثبت أن CP² + DP² = AP² + PB² + 2BC²."
          }
        ]
      },
      {
        "order": 3,
        "title": "الإثبات بالتشابه",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "الإثبات بالتناقض",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 5,
        "title": "مسائل إثبات مركّبة",
        "durationMinutes": 18,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "3יח׳",
    "domain": "",
    "name": "الإحصاء التطبيقي",
    "lessons": [
      {
        "order": 1,
        "title": "مقاييس المركز: مراجعة وتعمّق",
        "durationMinutes": 12,
        "type": "مراجعة",
        "questions": []
      },
      {
        "order": 2,
        "title": "الانحراف المعياري: المفهوم والحساب",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد متوسط وانحراف معياري: 2, 4, 4, 4, 5, 5, 7, 9."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "صفّان. متوسط الدرجات كلاهما 75. الانحراف المعياري لـA = 5 ولـB = 15. أي صف أكثر تجانساً؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "5 أعداد متوسطها 10 وانحرافها 2. إذا أضفنا 6 لكل عدد، ما الانحراف الجديد؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ما مجموعة الأعداد ذات الانحراف المعياري = 0؟ لماذا؟"
          }
        ]
      },
      {
        "order": 3,
        "title": "المخطط الصندوقي (Boxplot)",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "المئينيات والربيعيات",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "مقارنة مجموعتين إحصائياً",
        "durationMinutes": 14,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 6,
        "title": "قراءة ونقد الرسوم البيانية",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "3יח׳",
    "domain": "",
    "name": "التوزيع الطبيعي",
    "lessons": [
      {
        "order": 1,
        "title": "منحنى الجرس وخصائصه",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "قاعدة 68-95-99.7",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 3,
        "title": "Z-score والجدول الطبيعي",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "طول متوسط = 170 سم وانحراف معياري 10 سم. ما z-score لشخص طوله 185 سم؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "درجات امتحان توزيعها طبيعي: متوسط 70 وانحراف 8. ما نسبة من حصلوا بين 62 و78؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "في الامتحان أعلاه، ما الدرجة التي تفوق 97.5% من الطلاب؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "مصنع ينتج براغي طولها توزيع طبيعي: متوسط 10 سم وانحراف 0.1. البراغي المقبولة بين 9.8 و10.2 سم. ما نسبة المرفوضات؟"
          }
        ]
      },
      {
        "order": 4,
        "title": "حساب الاحتمالات بالتوزيع الطبيعي",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "مسائل تطبيقية",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "3יח׳",
    "domain": "",
    "name": "الاحتمال التطبيقي",
    "lessons": [
      {
        "order": 1,
        "title": "مراجعة الاحتمال الأساسي",
        "durationMinutes": 10,
        "type": "مراجعة",
        "questions": []
      },
      {
        "order": 2,
        "title": "الاحتمال الشرطي (مقدمة)",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "كيس فيه 3 كرات حمراء و2 زرقاء. سُحبت كرة حمراء ولم تُرجع. ما احتمال سحب حمراء ثانية؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "من 100 طالب: 60 يلعبون كرة قدم و40 يلعبون سلة و20 يلعبان كليهما. سُحب طالب عشوائياً يلعب كرة القدم. ما احتمال أنه يلعب السلة أيضاً؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اختبار طبي: دقة 95%. مرض يصيب 1% من السكان. شخص نتيجته إيجابية. ما احتمال أنه مريض فعلاً؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "بطاقات 1-10. سُحبت بطاقة. A: العدد زوجي. B: العدد أكبر من 5. هل A وB مستقلتان؟ علّل."
          }
        ]
      },
      {
        "order": 3,
        "title": "الحوادث المستقلة والمرتبطة",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 4,
        "title": "مسائل احتمال مركّبة",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "3יח׳",
    "domain": "",
    "name": "التخطيط الخطي",
    "lessons": [
      {
        "order": 1,
        "title": "رسم منطقة حلول متباينتين",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 2,
        "title": "منطقة الحلول المقبولة",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "إيجاد الحد الأقصى والأدنى",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "مسائل الأمثلة الكاملة",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أقصِ Z = 3x+2y بالشروط: x≥0, y≥0, x+y≤6."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مصنع ينتج نوعين A وB. A يحتاج 2 ساعة وB ثلاث ساعات. يومياً 12 ساعة. ربح A = 50 وB = 80 شيكل. كم ينتج من كل لأقصى ربح؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أقصِ Z = 4x+3y بالشروط: x+y≤8, 2x+y≤10, x≥0, y≥0."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "حقل زراعي: قمح (ربح 500 شيكل/دونم، ماء 3 وحدات/دونم) وشعير (ربح 300 شيكل/دونم، ماء 2 وحدات/دونم). المساحة ≤ 10 دونم والماء ≤ 24 وحدة. ما التوزيع الأمثل؟"
          }
        ]
      }
    ]
  },
  {
    "grade": 10,
    "level": "4יח׳",
    "domain": "",
    "name": "الاحتمال الشرطي والانحدار",
    "lessons": [
      {
        "order": 1,
        "title": "الاحتمال الشرطي الكامل: P(A|B)",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "P(A) = 0.4, P(B) = 0.5, P(A∩B) = 0.2. أوجد P(A|B)."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حقيبة فيها 4 كرات حمراء و3 خضراء. سُحبت 2 دون إرجاع. ما احتمال أن تكون الثانية حمراء إذا كانت الأولى خضراء؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "مصنعان A وB ينتجان 60% و40% من قطع معينة على التوالي. نسبة المعيبة من A = 2% ومن B = 5%. سُحبت قطعة معيبة. ما احتمال أنها من A؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "ثلاثة مصانع: نسبة الإنتاج 50%, 30%, 20%. نسبة المعيبة: 1%, 3%, 5%. ما احتمال أن قطعة مسحوبة معيبة؟"
          }
        ]
      },
      {
        "order": 2,
        "title": "قانون الاحتمال الكلي",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "الانحدار الخطي: المعادلة والمعاملات",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "معامل الارتباط r والتفسير",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 5,
        "title": "التنبؤ بالانحدار وحدوده",
        "durationMinutes": 14,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "4יח׳",
    "domain": "",
    "name": "المثلثات في المستوى",
    "lessons": [
      {
        "order": 1,
        "title": "sin وcos وtan لزوايا 0°-360°",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 2,
        "title": "الهوية: sin²α + cos²α = 1",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "قانون الجيب",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "في مثلث ABC: A=30°, B=45°, a=8. أوجد b."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "في مثلث: a=10, A=40°, B=60°. أوجد b وC وc."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "برج يبعد عنه شخصان A وB. الزاوية من A = 60° والزاوية من B = 45°. AB=100م. أوجد ارتفاع البرج."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "في مثلث: a=7, b=8, A=30°. كم حلاً ممكناً للمثلث؟ أوجد كل الحلول."
          }
        ]
      },
      {
        "order": 4,
        "title": "قانون جيب التمام",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "مثلث أضلاعه 5, 7, 8. أوجد أكبر زاوية."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مثلث: a=10, b=12, C=60°. أوجد c."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "متوازي أضلاع أضلاعه 8 و5 والزاوية بينهما 60°. أوجد القطرين."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "طائرة تطير 200 كم باتجاه N30°E ثم 150 كم باتجاه S60°E. ما المسافة الكلية من نقطة الانطلاق؟"
          }
        ]
      },
      {
        "order": 5,
        "title": "مساحة المثلث: (1/2)ab·sinC",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "حل المثلثات كاملاً",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 7,
        "title": "مسائل تطبيقية (ملاحة، بناء)",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "4יח׳",
    "domain": "",
    "name": "الهندسة التحليلية",
    "lessons": [
      {
        "order": 1,
        "title": "المسافة ونقطة المنتصف",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 2,
        "title": "معادلة المستقيم: أشكالها المختلفة",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "المسافة من نقطة لمستقيم",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "الدائرة: معادلتها ومركزها",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد معادلة دائرة مركزها (2,3) ونصف قطرها 5."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حوّل لشكل الدائرة: x²+y²-6x+4y-3=0. أوجد المركز والنصف القطر."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "دائرة مركزها على محور x وتمرّ بـ (3,4) و(9,4). أوجد معادلتها."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أثبت أن النقطة (7,1) على الدائرة x²+y²-4x+2y-20=0. ثم أوجد معادلة المماس عندها."
          }
        ]
      },
      {
        "order": 5,
        "title": "تقاطع مستقيم مع دائرة",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "المماس للدائرة من نقطة",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "مسائل مركّبة هندسية تحليلية",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "4יח׳",
    "domain": "",
    "name": "المشتقة وتطبيقاتها",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم المشتقة كميل المماس",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "قواعد الاشتقاق الأساسية",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "قاعدة الضرب والقسمة",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "المشتقة الثانية ومعناها",
        "durationMinutes": 13,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 5,
        "title": "نقاط القصوى (صغرى وكبرى)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد نقاط القصوى لـ f(x) = x² - 4x + 3. صغرى أم كبرى؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أوجد نقاط القصوى لـ f(x) = 2x³ - 3x² - 12x + 4."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "f(x) = x³ + ax² + bx + 1 لها نقطة قصوى محلية صغرى عند x=2 وكبرى عند x=-2. أوجد a وb."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "شركة ربحها: P(x) = -x³ + 12x² - 36x + 100. أي كمية x تحقق أقصى ربح؟"
          }
        ]
      },
      {
        "order": 6,
        "title": "الاطّراد والتقعّر ونقاط الانعطاف",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "رسم الغراف الدقيق للدالة",
        "durationMinutes": 18,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "مسائل أمثلة (أقصى/أدنى)",
        "durationMinutes": 18,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد مستطيلاً محيطه 24 مساحته أقصى ما يمكن."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "صندوق مكشوف مربعي القاعدة يُصنع من ورقة 12×12 سم بقطع مربعات من الزوايا. ما حجمه الأقصى؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "خط أنابيب يمتد من نقطة A على النهر لمصنع B على البر. طول النهر= 10 كم وB يبعد 6 كم عن النهر عمودياً. تكلفة الأنبوب في الماء = 3× البر. أوجد أقصر مسار اقتصادياً."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "علبة أسطوانية حجمها 1000 سم³. أوجد نصف القطر والارتفاع اللذين يقلّلان مساحة سطحها."
          }
        ]
      }
    ]
  },
  {
    "grade": 10,
    "level": "4יח׳",
    "domain": "",
    "name": "التكامل",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم التكامل: المساحة تحت المنحنى",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "التكامل غير المحدود: القواعد الأساسية",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد: ∫(3x² + 2x - 5) dx"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أوجد: ∫(x³ - 4x + 1/x²) dx"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "f'(x) = 6x² - 4x + 2 وf(1) = 5. أوجد f(x)."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أوجد: ∫(√x + 1/√x)² dx"
          }
        ]
      },
      {
        "order": 3,
        "title": "التكامل المحدود وحساب المساحة",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب: ∫[0 to 2] (x² + 1) dx"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أوجد مساحة المنطقة بين y = x² و المحور الأفقي من x=0 إلى x=3."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أوجد مساحة المنطقة المحصورة بين y=x² وy=4."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أوجد مساحة المنطقة المحصورة بين y=x³-x وy=x."
          }
        ]
      },
      {
        "order": 4,
        "title": "مساحة المحصورة بين منحنيين",
        "durationMinutes": 17,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "مسائل مركّبة على التكامل",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "4יח׳",
    "domain": "",
    "name": "المتتاليات",
    "lessons": [
      {
        "order": 1,
        "title": "المتتالية الحسابية: الصيغة والمجموع",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "متتالية: أولها 3 وأساسها 4. أوجد الحد العاشر ومجموع 10 حدود."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مجموع 20 حداً لمتتالية حسابية = 420. الحد الأول = 1. أوجد الأساس."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "متتالية حسابية: الحد الثالث 7 والحد السابع 15. أوجد الحد الخمسين."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "احسب: 1+3+5+7+...+(2n-1). أثبت أن المجموع = n²."
          }
        ]
      },
      {
        "order": 2,
        "title": "المتتالية الهندسية: الصيغة والمجموع",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "مجموع المتتالية الهندسية اللانهائية",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 4,
        "title": "المتتاليات المتداخلة",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "تطبيقات: الفائدة المركّبة",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "5000 شيكل بفائدة 6% سنوياً. كم يصبح بعد 3 سنوات؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "يُودَع 1000 شيكل سنوياً بفائدة 5%. كم يصبح بعد 10 سنوات؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "قرض 50,000 شيكل بفائدة 8% سنوياً يُسدَّد على 5 أقساط سنوية متساوية. ما القسط السنوي؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "استثمار يتضاعف كل 12 سنة. ما معدل الفائدة السنوي؟"
          }
        ]
      },
      {
        "order": 6,
        "title": "مسائل مركّبة",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "4יח׳",
    "domain": "",
    "name": "المتجهات",
    "lessons": [
      {
        "order": 1,
        "title": "تعريف المتجه وتمثيله",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "جمع وطرح المتجهات",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "ضرب المتجه بعدد حقيقي",
        "durationMinutes": 11,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "طول المتجه والوحدوي",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "الضرب القياسي والزاوية بين متجهين",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "v=(3,4) وu=(1,2). احسب v·u وزاوية بينهما."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "متجهان متعامدان. v=(2,k) وu=(k,8). أوجد k."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "ABCD مستطيل. A(0,0), B(4,0), C(4,3), D(0,3). أثبت أن القطرين متعامدان باستخدام المتجهات."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "مثلث رؤوسه A(1,0), B(5,0), C(3,4). أثبت باستخدام المتجهات أن AM ⊥ BC حيث M مركز BC."
          }
        ]
      },
      {
        "order": 6,
        "title": "المتجهات في الفراغ",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "تطبيقات هندسية للمتجهات",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "4יח׳",
    "domain": "",
    "name": "النمو والاضمحلال والدوال الأسية",
    "lessons": [
      {
        "order": 1,
        "title": "الدالة الأسية y=aˣ وخصائصها",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "اللوغاريتم والعلاقة مع الأسي",
        "durationMinutes": 14,
        "type": "مفاهيمي",
        "questions": []
      },
      {
        "order": 3,
        "title": "قوانين اللوغاريتم",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "بسّط: log₂8 + log₂4"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "حل: log(x) + log(x-3) = 1"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "حل: 2^(x+1) = 5^x (الجواب بـ log)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "بكتيريا تتضاعف كل 3 ساعات. بدأت بـ 1000. بعد كم ساعة تصبح مليوناً؟"
          }
        ]
      },
      {
        "order": 4,
        "title": "الدالة e^x والـ ln",
        "durationMinutes": 13,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "نموذج النمو الأسي",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 6,
        "title": "نموذج الاضمحلال ونصف العمر",
        "durationMinutes": 15,
        "type": "تطبيقي",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "مادة نصف عمرها 10 سنوات. كم يتبقى من 100 جرام بعد 30 سنة؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "مادة تقل لـ 1/8 خلال 60 سنة. ما نصف عمرها؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "كربون-14 نصف عمره 5730 سنة. أثر أثري تبقى فيه 30% من الكربون الأصلي. ما عمر الأثر؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "قهوة حرارتها 90° في غرفة 20°. بعد 5 دقائق تصبح 70°. متى تصبح 40°؟ (قانون نيوتن)"
          }
        ]
      },
      {
        "order": 7,
        "title": "الاشتقاق والتكامل للدوال الأسية",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 8,
        "title": "مسائل مركّبة",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "5יח׳",
    "domain": "",
    "name": "الاحتمال المتقدم",
    "lessons": [
      {
        "order": 1,
        "title": "نظرية بايز الكاملة",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 2,
        "title": "التوزيع ذي الحدين: B(n,p)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "عملة رُميت 6 مرات. ما احتمال ظهور الصورة 4 مرات بالضبط؟"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "نسبة نجاح عملية 80%. من أجرى 5 عمليات، ما احتمال نجاح 4 على الأقل؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "سؤال صواب/خطأ من 10 أسئلة. ما احتمال الحصول على 7 صح أو أكثر بالتخمين؟"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "في B(20, 0.4)، أوجد التوقع الرياضي والانحراف المعياري، ثم احسب P(X > 10)."
          }
        ]
      },
      {
        "order": 3,
        "title": "التوقع الرياضي والتباين",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "مسائل متقدمة جداً",
        "durationMinutes": 18,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "5יח׳",
    "domain": "",
    "name": "الاستقراء الرياضي",
    "lessons": [
      {
        "order": 1,
        "title": "مفهوم الاستقراء وخطواته",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "إثبات صيغ المجاميع",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أثبت بالاستقراء: 1+2+3+...+n = n(n+1)/2"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أثبت: 1²+2²+3²+...+n² = n(n+1)(2n+1)/6"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أثبت: 1+3+5+...+(2n-1) = n²"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أثبت: aⁿ - bⁿ قابل للقسمة على (a-b) لكل n صحيح موجب."
          }
        ]
      },
      {
        "order": 3,
        "title": "إثبات قابلية القسمة",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "إثبات المتباينات",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "مسائل متقدمة",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "5יח׳",
    "domain": "",
    "name": "الأعداد المركّبة",
    "lessons": [
      {
        "order": 1,
        "title": "تعريف i وبنية العدد المركّب",
        "durationMinutes": 12,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "العمليات: جمع وطرح وضرب وقسمة",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب: (3+2i) + (1-4i)"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "احسب: (2+3i)(1-2i)"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "بسّط: (3+i)/(2-3i) (اضرب بالمرافق)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "احسب: i¹ + i² + i³ + ... + i¹⁰⁰"
          }
        ]
      },
      {
        "order": 3,
        "title": "مستوى غاوس والشكل القطبي",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "نظرية دي موافر",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "حوّل z = 1+i للشكل القطبي."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "احسب (1+i)¹⁰ باستخدام دي موافر."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أثبت أن: cos3θ = 4cos³θ - 3cosθ باستخدام دي موافر."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أوجد جذور المعادلة: z³ = 8. (3 جذور مركّبة)"
          }
        ]
      },
      {
        "order": 5,
        "title": "جذور الوحدة",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "جذور المعادلات التربيعية (Δ<0)",
        "durationMinutes": 13,
        "type": "تطبيقي",
        "questions": []
      },
      {
        "order": 7,
        "title": "مسائل مركّبة",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "5יח׳",
    "domain": "",
    "name": "القطوع المخروطية",
    "lessons": [
      {
        "order": 1,
        "title": "القطع المكافئ: البؤرة والقياطر",
        "durationMinutes": 14,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "القطع الناقص: معادلته وخصائصه",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد مركز وبؤرتي: x²/25 + y²/16 = 1"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أوجد معادلة القطع الناقص مركزه الأصل وأطوال نصفي قطريه 5 و3."
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "قطع ناقص: 4x²+9y²=36. أوجد البؤرتين والرسم."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "كوكب يدور حول الشمس في مدار إهليجي. أقرب نقطة 1.47×10⁸ كم وأبعد نقطة 1.52×10⁸ كم. أوجد معادلة المدار (الشمس في بؤرة)."
          }
        ]
      },
      {
        "order": 3,
        "title": "القطع الزائد: معادلته ومقاربيه",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "القطوع المزاحة",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "تطبيقات القطوع المخروطية",
        "durationMinutes": 16,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "5יח׳",
    "domain": "",
    "name": "المتجهات في الفراغ",
    "lessons": [
      {
        "order": 1,
        "title": "الإحداثيات ثلاثية الأبعاد والمتجهات",
        "durationMinutes": 13,
        "type": "تعريفي",
        "questions": []
      },
      {
        "order": 2,
        "title": "الضرب الاتجاهي: v × u",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "معادلة المستوى: ax+by+cz=d",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد معادلة المستوى الذي يمرّ بـ (1,2,3) وعموده n=(2,-1,4)."
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "هل النقطة (3,1,2) على المستوى 2x-y+3z=11؟"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أوجد معادلة المستوى الذي يمرّ بالنقاط (1,0,0), (0,2,0), (0,0,3)."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أوجد المسافة من النقطة (4,2,1) للمستوى 3x-4y+5z=10."
          }
        ]
      },
      {
        "order": 4,
        "title": "معادلة الخط في الفراغ",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "الزاوية بين مستويين والمسافة",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 6,
        "title": "مسائل هندسية فراغية",
        "durationMinutes": 17,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  },
  {
    "grade": 10,
    "level": "5יח׳",
    "domain": "",
    "name": "التفاضل والتكامل المتقدم (5 وحدات)",
    "lessons": [
      {
        "order": 1,
        "title": "اشتقاق الدوال المثلثية",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "اشتق: f(x) = sin(3x)"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "اشتق: g(x) = x²·cos(x)"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "اشتق: h(x) = sin(x²)·cos(2x)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أوجد معادلة المماس لـ y=sinx عند x=π/6."
          }
        ]
      },
      {
        "order": 2,
        "title": "قاعدة السلسلة المتقدمة",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 3,
        "title": "اشتقاق الدوال العكسية",
        "durationMinutes": 14,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 4,
        "title": "التكامل بالتعويض (u-sub)",
        "durationMinutes": 16,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 5,
        "title": "التكامل بالأجزاء",
        "durationMinutes": 17,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "احسب: ∫x·eˣ dx"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "احسب: ∫x·sin(x) dx"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "احسب: ∫x²·eˣ dx (تحتاج تكاملاً بالأجزاء مرتين)"
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "احسب: ∫eˣ·sin(x) dx"
          }
        ]
      },
      {
        "order": 6,
        "title": "تكامل الدوال المثلثية",
        "durationMinutes": 15,
        "type": "مهاري",
        "questions": []
      },
      {
        "order": 7,
        "title": "أحجام أجسام الدوران",
        "durationMinutes": 17,
        "type": "مهاري",
        "questions": [
          {
            "order": 1,
            "difficulty": "easy",
            "text": "أوجد حجم الجسم الناتج من دوران y=2 حول محور x من x=0 إلى x=5. (أسطوانة)"
          },
          {
            "order": 2,
            "difficulty": "medium",
            "text": "أوجد حجم الجسم الناتج من دوران y=x حول محور x من x=0 إلى x=3. (مخروط)"
          },
          {
            "order": 3,
            "difficulty": "hard",
            "text": "أوجد حجم الجسم الناتج من دوران y=√x حول محور x من x=0 إلى x=4."
          },
          {
            "order": 4,
            "difficulty": "hard",
            "text": "أوجد حجم الجسم الناتج من دوران المنطقة بين y=x² وy=x حول محور x."
          }
        ]
      },
      {
        "order": 8,
        "title": "مسائل مركّبة متقدمة",
        "durationMinutes": 18,
        "type": "تطبيقي",
        "questions": []
      }
    ]
  }
];
