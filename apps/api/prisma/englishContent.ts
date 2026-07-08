/**
 * محتوى الإنجليزية — الصف السابع (Israel curriculum, CEFR A2 "Basic User II").
 * مبني كوحدات موضوعية (thematic units) على غرار كتب الإنجليزية الإسرائيلية؛
 * كل وحدة = موضوع (Topic) فيه دروس مهارات: مفردات / قواعد / فهم مقروء / كتابة.
 *
 * أنواع التمارين تُطابق إطار المسائل: mcq/cloze (تصحيح تلقائي عبر /check)،
 * reading/writing (يقيّمها الذكاء الاصطناعي عبر /judge, language='english').
 *
 * قواعد المحتوى:
 *  - mcq: answer يجب أن يساوي أحد choices حرفيًا (الطالب يختار النصّ نفسه).
 *  - cloze: answer كلمة/عبارة تُطابَق بلا حساسية لحالة الأحرف/المسافات.
 *  - reading: passage على مستوى الدرس (يُشارك بين أسئلته)؛ answer إجابة مرجعية سرّية.
 *  - writing: question = نصّ المهمّة كاملًا؛ answer = معايير/نقاط مرجعية سرّية.
 */

export type EnSkill = 'vocab' | 'grammar' | 'reading' | 'writing';

export interface EnExercise {
  kind: 'mcq' | 'cloze' | 'reading' | 'writing';
  question: string;
  choices?: string[]; // mcq فقط — answer لازم يساوي أحدها حرفيًا
  answer: string; // mcq/cloze: الإجابة الصحيحة؛ reading/writing: مرجع سرّي
  passage?: string; // موجز مهمّة كتابة اختياري (قطعة القراءة تُؤخذ من الدرس)
}

export interface EnLesson {
  order: number;
  title: string;
  skill: EnSkill;
  passage?: string; // قطعة مشتركة لدروس الفهم المقروء
  exercises: EnExercise[];
}

export interface EnUnit {
  order: number;
  name: string; // اسم الوحدة (الموضوع)
  description?: string;
  lessons: EnLesson[];
}

export const ENGLISH_GRADE7: EnUnit[] = [
  // ============================================================
  {
    order: 1,
    name: 'الوحدة 1: عن نفسي (All About Me)',
    description: 'المعلومات الشخصية والعائلة + زمن المضارع البسيط (be / have got).',
    lessons: [
      {
        order: 1,
        title: 'مفردات: العائلة والمعلومات الشخصية',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: "My father's mother is my ___.", choices: ['grandmother', 'aunt', 'teacher', 'cousin'], answer: 'grandmother' },
          { kind: 'mcq', question: "My uncle's daughter is my ___.", choices: ['cousin', 'sister', 'aunt', 'niece'], answer: 'cousin' },
          { kind: 'cloze', question: 'My mother and father together are my ___.', answer: 'parents' },
          { kind: 'cloze', question: 'I am twelve years ___.', answer: 'old' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: زمن المضارع البسيط (Present Simple)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'I ___ a student.', choices: ['am', 'is', 'are', 'be'], answer: 'am' },
          { kind: 'mcq', question: 'She ___ two brothers.', choices: ['has', 'have', 'haves', 'having'], answer: 'has' },
          { kind: 'cloze', question: 'They ___ (be) my best friends.', answer: 'are' },
          { kind: 'cloze', question: 'This is my sister. ___ name is Maya. (his/her)', answer: 'Her' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: بطاقة تعريف شخصية',
        skill: 'reading',
        passage:
          'Hi! My name is Sara. I am twelve years old and I live in Nazareth. I have one brother and one sister. My brother’s name is Adam and he is fifteen. My sister, Lana, is eight. My father is a doctor and my mother is a teacher. We have a small dog called Rocky. I like reading books and playing basketball.',
        exercises: [
          { kind: 'mcq', question: 'How old is Sara?', choices: ['twelve', 'fifteen', 'eight', 'ten'], answer: 'twelve' },
          { kind: 'mcq', question: "What is Sara's father's job?", choices: ['a doctor', 'a teacher', 'a driver', 'a nurse'], answer: 'a doctor' },
          { kind: 'reading', question: 'How many brothers and sisters does Sara have? Answer in a full sentence.', answer: 'She has one brother and one sister. (Accept any answer stating one brother and one sister.)' },
          { kind: 'reading', question: 'What does Sara like doing? Give two things.', answer: 'She likes reading books and playing basketball.' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: عرّف عن نفسك',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short paragraph (30–40 words) about yourself. Include your name, your age, where you live, and one thing you like doing.', answer: 'Must include: name, age, place of living, and one hobby. Uses present simple correctly. Capitalizes "I" and names. About 30–40 words.' },
          { kind: 'writing', question: 'Write 3–4 sentences about one member of your family. Include who they are, their name, and one fact about them.', answer: 'Names a family member, gives a name, and at least one fact. Correct third-person -s in present simple. 3–4 sentences.' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 2,
    name: 'الوحدة 2: حياتي المدرسية (My School Life)',
    description: 'المدرسة والصف + المضارع البسيط وظروف التكرار والأسئلة.',
    lessons: [
      {
        order: 1,
        title: 'مفردات: المدرسة والصف',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'In ___ class we learn about numbers and equations.', choices: ['maths', 'history', 'art', 'music'], answer: 'maths' },
          { kind: 'mcq', question: 'We use a ___ to write on the whiteboard.', choices: ['marker', 'spoon', 'plate', 'fork'], answer: 'marker' },
          { kind: 'cloze', question: 'I keep my pens and pencils in my pencil ___.', answer: 'case' },
          { kind: 'cloze', question: 'The teacher writes the homework on the ___.', answer: 'board' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: المضارع البسيط وظروف التكرار (Adverbs of Frequency)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'We ___ English on Mondays.', choices: ['study', 'studies', 'studying', 'studied'], answer: 'study' },
          { kind: 'mcq', question: '___ she like science?', choices: ['Does', 'Do', 'Is', 'Are'], answer: 'Does' },
          { kind: 'cloze', question: 'He ___ (go) to school by bus every day.', answer: 'goes' },
          { kind: 'cloze', question: 'I am ___ late for school; I always come on time. (never/always)', answer: 'never' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: ملاحظة للصف',
        skill: 'reading',
        passage:
          'NOTE TO CLASS 7B: Tomorrow we have a science test in the first lesson. Please bring your textbook, a pencil and a ruler. The test is about animals and plants. After the test, we will watch a short film about the ocean. Do not forget your homework on page 24. — Ms. Levy',
        exercises: [
          { kind: 'mcq', question: 'When is the science test?', choices: ['in the first lesson', 'after lunch', 'next week', 'on Friday'], answer: 'in the first lesson' },
          { kind: 'mcq', question: 'What must students bring?', choices: ['a textbook, a pencil and a ruler', 'a computer', 'a ball', 'food and drinks'], answer: 'a textbook, a pencil and a ruler' },
          { kind: 'reading', question: 'What will the class do after the test?', answer: 'They will watch a short film about the ocean.' },
          { kind: 'reading', question: 'Where is the homework?', answer: 'The homework is on page 24.' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: يومي في المدرسة',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short paragraph (about 40 words) about your school day. Include when school starts, two subjects you study, and your favourite subject.', answer: 'Includes a start time, two subjects, and a favourite subject. Present simple. About 40 words.' },
          { kind: 'writing', question: 'Write 3 sentences about your English lessons. What do you do in English class?', answer: 'Three sentences about English lessons. Present simple with correct verb forms.' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 3,
    name: 'الوحدة 3: وقت الفراغ والهوايات (Free Time & Hobbies)',
    description: 'الهوايات والرياضة + المضارع المستمر ومقارنته بالبسيط و like + -ing.',
    lessons: [
      {
        order: 1,
        title: 'مفردات: الهوايات والرياضة',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'You need a racket to play ___.', choices: ['tennis', 'football', 'swimming', 'chess'], answer: 'tennis' },
          { kind: 'mcq', question: 'Someone who takes photos has the hobby of ___.', choices: ['photography', 'cooking', 'painting', 'dancing'], answer: 'photography' },
          { kind: 'cloze', question: 'I like listening to ___ on my phone.', answer: 'music' },
          { kind: 'cloze', question: 'In summer I like to ___ in the sea.', answer: 'swim' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: المضارع المستمر (Present Progressive)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'Look! The children ___ football now.', choices: ['are playing', 'play', 'plays', 'played'], answer: 'are playing' },
          { kind: 'mcq', question: 'I like ___ books.', choices: ['reading', 'read', 'reads', 'to reads'], answer: 'reading' },
          { kind: 'cloze', question: 'Right now, she ___ (watch) TV.', answer: 'is watching' },
          { kind: 'cloze', question: 'He usually ___ (walk) to school, but today he is taking the bus.', answer: 'walks' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: رسالة عن الهوايات',
        skill: 'reading',
        passage:
          'Hi Tom, How are you? I want to tell you about my free time. After school, I usually play basketball with my friends. On the weekend, I go swimming at the pool near my house. I also love drawing, and I am learning to play the guitar. What do you like doing in your free time? Write back soon! Your friend, Omar',
        exercises: [
          { kind: 'mcq', question: 'What does Omar do after school?', choices: ['plays basketball', 'goes swimming', 'plays the guitar', 'draws'], answer: 'plays basketball' },
          { kind: 'mcq', question: 'What is Omar learning to do?', choices: ['play the guitar', 'swim', 'drive', 'cook'], answer: 'play the guitar' },
          { kind: 'reading', question: 'Where does Omar go swimming?', answer: 'He goes swimming at the pool near his house.' },
          { kind: 'reading', question: 'What question does Omar ask Tom?', answer: 'He asks what Tom likes doing in his free time.' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: رسالة عن وقت فراغك',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short email (about 40 words) to a friend about your hobbies. Tell them two things you like doing and when you do them.', answer: 'Email format (greeting and closing). Mentions two hobbies with a time. Present simple. About 40 words.' },
          { kind: 'writing', question: 'Answer in 3–4 sentences: What do you like doing on the weekend?', answer: 'Three to four sentences. Uses "like + -ing" or present simple. Describes weekend activities.' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 4,
    name: 'الوحدة 4: الطعام وبيتي (Food & My Home)',
    description: 'الطعام والبيت + المعدود وغير المعدود، some/any، much/many، there is/are.',
    lessons: [
      {
        order: 1,
        title: 'مفردات: الطعام والبيت',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'You sleep in a ___.', choices: ['bed', 'chair', 'table', 'fridge'], answer: 'bed' },
          { kind: 'mcq', question: 'We keep milk cold in the ___.', choices: ['fridge', 'oven', 'sink', 'shelf'], answer: 'fridge' },
          { kind: 'cloze', question: 'I eat breakfast in the ___ every morning.', answer: 'kitchen' },
          { kind: 'cloze', question: 'For breakfast I drink a glass of orange ___.', answer: 'juice' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: المعدود وغير المعدود (some/any, much/many, there is/are)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'There ___ some apples on the table.', choices: ['are', 'is', 'has', 'be'], answer: 'are' },
          { kind: 'mcq', question: 'How ___ water do you drink every day?', choices: ['much', 'many', 'some', 'any'], answer: 'much' },
          { kind: 'cloze', question: 'Is there ___ milk in the fridge? (some/any)', answer: 'any' },
          { kind: 'cloze', question: 'There ___ (be) a big sofa in the living room.', answer: 'is' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: قائمة طعام (Menu)',
        skill: 'reading',
        passage:
          'CAFE SUNSHINE — MENU. Sandwiches: cheese sandwich – 12 NIS, chicken sandwich – 18 NIS. Salads: Greek salad – 20 NIS. Drinks: water – 5 NIS, orange juice – 9 NIS, coffee – 10 NIS. Cakes: chocolate cake – 15 NIS. Special: Buy any sandwich and get a free glass of water!',
        exercises: [
          { kind: 'mcq', question: 'How much is a chicken sandwich?', choices: ['18 NIS', '12 NIS', '20 NIS', '9 NIS'], answer: '18 NIS' },
          { kind: 'mcq', question: 'What do you get free when you buy a sandwich?', choices: ['a glass of water', 'a cake', 'a coffee', 'a salad'], answer: 'a glass of water' },
          { kind: 'reading', question: 'How much does a Greek salad cost?', answer: 'A Greek salad costs 20 NIS.' },
          { kind: 'reading', question: 'Name two drinks on the menu.', answer: 'Two drinks are water and orange juice (coffee is also accepted).' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: وجبتي المفضّلة وبيتي',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short paragraph (about 40 words) about your favourite meal. Say what it is, when you eat it, and why you like it.', answer: 'Names a meal, says when it is eaten, and gives a reason. Present simple. About 40 words.' },
          { kind: 'writing', question: 'Write 3–4 sentences describing your home. How many rooms are there? What is your favourite room?', answer: 'Uses there is/are. Describes rooms and names a favourite room.' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 5,
    name: 'الوحدة 5: العالم من حولنا (The World Around Us)',
    description: 'الحيوانات والطبيعة والطقس + الماضي البسيط والمستمر وصيغ المقارنة/التفضيل.',
    lessons: [
      {
        order: 1,
        title: 'مفردات: الحيوانات والطقس',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'An ___ is a very big animal with a long trunk.', choices: ['elephant', 'mouse', 'rabbit', 'cat'], answer: 'elephant' },
          { kind: 'mcq', question: 'In ___ the weather is cold and it sometimes snows.', choices: ['winter', 'summer', 'spring', 'autumn'], answer: 'winter' },
          { kind: 'cloze', question: 'When it ___ (rain), we use an umbrella.', answer: 'rains' },
          { kind: 'cloze', question: 'The sun is hot in the ___ (the warm season).', answer: 'summer' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: الماضي البسيط والمستمر والمقارنة (Past Simple, Past Progressive, Comparatives)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'Yesterday we ___ to the zoo.', choices: ['went', 'go', 'goes', 'going'], answer: 'went' },
          { kind: 'mcq', question: 'While I ___ in the park, I saw a rabbit.', choices: ['was walking', 'walked', 'walk', 'am walking'], answer: 'was walking' },
          { kind: 'cloze', question: 'Last week she ___ (visit) her grandmother. (past simple)', answer: 'visited' },
          { kind: 'cloze', question: 'They ___ (play) football when it started to rain. (past progressive, two words)', answer: 'were playing' },
          { kind: 'mcq', question: 'An elephant is ___ than a dog.', choices: ['bigger', 'big', 'biggest', 'more big'], answer: 'bigger' },
          { kind: 'cloze', question: 'Mount Everest is the ___ (high) mountain in the world.', answer: 'highest' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: نصّ معلوماتي عن الدلفين',
        skill: 'reading',
        passage:
          'The dolphin is a very clever animal. Dolphins live in the sea, but they are not fish — they are mammals, like humans. They breathe air through a hole on the top of their heads. Dolphins live in groups and they talk to each other with special sounds. They eat fish and can swim very fast. Many people love dolphins because they are friendly and playful.',
        exercises: [
          { kind: 'mcq', question: 'Are dolphins fish?', choices: ['No, they are mammals.', 'Yes, they are fish.', 'No, they are birds.', 'Yes, they are reptiles.'], answer: 'No, they are mammals.' },
          { kind: 'mcq', question: 'What do dolphins eat?', choices: ['fish', 'plants', 'bread', 'insects'], answer: 'fish' },
          { kind: 'reading', question: 'How do dolphins talk to each other?', answer: 'They talk to each other with special sounds.' },
          { kind: 'reading', question: 'Why do many people love dolphins?', answer: 'Because they are friendly and playful.' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: حيوان مفضّل ومقارنة',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short paragraph (about 40 words) about your favourite animal. Say what it is, where it lives, and what it eats.', answer: 'Names an animal, its habitat, and its food. Present simple. About 40 words.' },
          { kind: 'writing', question: 'Compare two animals in 3–4 sentences. Use words like bigger, faster, or stronger.', answer: 'Compares two animals using comparative adjectives correctly (e.g., bigger, faster, stronger).' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 6,
    name: 'الوحدة 6: خطط ومغامرات (Plans & Adventures)',
    description: 'السفر والأماكن والملابس + المستقبل (will / going to) والأفعال الناقصة (modals).',
    lessons: [
      {
        order: 1,
        title: 'مفردات: السفر والملابس',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'You keep your clothes in a ___ when you travel.', choices: ['suitcase', 'plate', 'pillow', 'lamp'], answer: 'suitcase' },
          { kind: 'mcq', question: 'You wear ___ on your feet.', choices: ['shoes', 'gloves', 'a scarf', 'a hat'], answer: 'shoes' },
          { kind: 'cloze', question: 'We travelled to Paris by ___ (it flies in the sky).', answer: 'plane' },
          { kind: 'cloze', question: 'A person who visits a new country on holiday is a ___.', answer: 'tourist' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: المستقبل والأفعال الناقصة (Future, Modals)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'Tomorrow I ___ visit my cousins.', choices: ['will', 'am', 'do', 'was'], answer: 'will' },
          { kind: 'mcq', question: "You ___ wear a seatbelt in the car. It's the law.", choices: ['must', 'can', 'might', 'would'], answer: 'must' },
          { kind: 'cloze', question: 'Look at those clouds! It ___ (be going to / rain) soon.', answer: 'is going to rain' },
          { kind: 'cloze', question: 'She ___ (be able to) speak three languages. (one word: can)', answer: 'can' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: مدوّنة سفر',
        skill: 'reading',
        passage:
          'Last summer, my family and I went to Eilat for a holiday. We stayed in a hotel near the beach. Every morning, we swam in the warm sea and looked at the colourful fish. One day, we took a boat trip and saw dolphins! In the evenings, we walked by the sea and ate ice cream. It was the best holiday of my life. Next year, we are going to visit the Galilee.',
        exercises: [
          { kind: 'mcq', question: 'Where did the family go last summer?', choices: ['Eilat', 'the Galilee', 'Paris', 'Nazareth'], answer: 'Eilat' },
          { kind: 'mcq', question: 'What did they see on the boat trip?', choices: ['dolphins', 'whales', 'sharks', 'birds'], answer: 'dolphins' },
          { kind: 'reading', question: 'What did they do in the evenings?', answer: 'They walked by the sea and ate ice cream.' },
          { kind: 'reading', question: 'Where are they going to go next year?', answer: 'They are going to visit the Galilee.' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: عطلتي القادمة',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short paragraph (about 40 words) about your next holiday. Where are you going to go? What are you going to do?', answer: 'Uses "going to" or "will" for the future. Names a place and activities. About 40 words.' },
          { kind: 'writing', question: 'Write 3–4 sentences about a place you visited. Where did you go and what did you do? Use the past simple.', answer: 'Uses past simple correctly. Names a place and describes past activities.' },
        ],
      },
    ],
  },
];

// ================================================================
//  الصف الثامن (Grade 8) — CEFR A2 (mid), يبني على الصف السابع.
//  قواعد جديدة: المضارع التام، الماضي المستمر، الشرط الأول، المبني للمجهول،
//  أفعال ناقصة موسّعة (might/may/have to/able to)، ترسيخ المقارنة/التفضيل.
// ================================================================
export const ENGLISH_GRADE8: EnUnit[] = [
  // ============================================================
  {
    order: 1,
    name: 'الوحدة 1: حياتي الآن (My Life Now)',
    description: 'الشخصية والمشاعر + المضارع التام والمضارع التام المستمر (for/since).',
    lessons: [
      {
        order: 1,
        title: 'مفردات: الشخصية والمشاعر',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'Someone who is not afraid is ___.', choices: ['brave', 'shy', 'lazy', 'rude'], answer: 'brave' },
          { kind: 'mcq', question: 'When you feel happy about a trip tomorrow, you feel ___.', choices: ['excited', 'bored', 'tired', 'angry'], answer: 'excited' },
          { kind: 'cloze', question: "The opposite of 'happy' is ___.", answer: 'sad' },
          { kind: 'cloze', question: 'He never shouts and is always relaxed. He is a very ___ person. (relaxed, starts with c)', answer: 'calm' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: المضارع التام والمضارع التام المستمر (Present Perfect & Present Perfect Progressive)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'I ___ my homework, so I can play now.', choices: ['have finished', 'finish', 'finished', 'am finishing'], answer: 'have finished' },
          { kind: 'mcq', question: 'She ___ lived in Haifa for five years.', choices: ['has', 'have', 'is', 'was'], answer: 'has' },
          { kind: 'mcq', question: 'She is tired because she ___ all day.', choices: ['has been working', 'works', 'worked', 'is working'], answer: 'has been working' },
          { kind: 'cloze', question: 'We have known each other ___ 2019. (for/since)', answer: 'since' },
          { kind: 'cloze', question: 'He has ___ (see) that film before. (past participle)', answer: 'seen' },
          { kind: 'cloze', question: 'They ___ (wait) for the bus for twenty minutes. (present perfect progressive: have been + -ing)', answer: 'have been waiting' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: حياة مايا حتى الآن',
        skill: 'reading',
        passage:
          'Maya is fifteen years old and she lives in Tel Aviv. She has had an interesting life. She was born in Canada, but her family moved to Israel when she was six. Maya has learned three languages: English, Hebrew and French. She has played the violin since she was eight, and last year she won a music prize. She has never been to Europe, but she really wants to visit Italy one day. In the future, she hopes to become a music teacher.',
        exercises: [
          { kind: 'mcq', question: 'Where was Maya born?', choices: ['Canada', 'Israel', 'Italy', 'France'], answer: 'Canada' },
          { kind: 'mcq', question: 'How long has Maya played the violin?', choices: ['since she was eight', 'for two years', 'since last year', 'for five years'], answer: 'since she was eight' },
          { kind: 'reading', question: 'How many languages has Maya learned? Name them.', answer: 'She has learned three languages: English, Hebrew and French.' },
          { kind: 'reading', question: 'What does Maya want to do in the future?', answer: 'She hopes to become a music teacher.' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: ماذا فعلت هذا العام',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short paragraph (about 50 words) about what you have done this year. Use the present perfect (for example: I have learned…, I have visited…). Mention at least three things.', answer: 'Uses present perfect (have/has + past participle) correctly for at least three experiences this year. About 50 words.' },
          { kind: 'writing', question: 'Write 3–4 sentences about a hobby you have done for a long time. How long have you done it? Use for/since.', answer: 'Describes a long-term hobby using present perfect with for/since correctly. 3–4 sentences.' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 2,
    name: 'الوحدة 2: نحكي قصص (Telling Stories)',
    description: 'الأحداث وتعابير الزمن + الماضي التام (Past Perfect) لسرد ما حدث قبل حدث آخر.',
    lessons: [
      {
        order: 1,
        title: 'مفردات: القصص والأحداث',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'A story that is not true and has magic is a ___.', choices: ['fairy tale', 'newspaper', 'recipe', 'timetable'], answer: 'fairy tale' },
          { kind: 'mcq', question: 'The person who writes a book is the ___.', choices: ['author', 'actor', 'reader', 'painter'], answer: 'author' },
          { kind: 'cloze', question: 'The story happened a long time ___. (in the past)', answer: 'ago' },
          { kind: 'cloze', question: '___ upon a time, there was a little girl. (story opening, starts with O)', answer: 'Once' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: الماضي التام (Past Perfect)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'By the time I got home, my mother ___ dinner.', choices: ['had cooked', 'cooks', 'is cooking', 'cook'], answer: 'had cooked' },
          { kind: 'mcq', question: "She couldn't get into her house because she ___ her keys.", choices: ['had lost', 'loses', 'is losing', 'lose'], answer: 'had lost' },
          { kind: 'cloze', question: 'When I arrived at the station, the train had already ___ (leave). (past participle)', answer: 'left' },
          { kind: 'cloze', question: 'By the time the film started, we ___ (buy) our tickets. (past perfect: had + past participle, two words)', answer: 'had bought' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: قصة قصيرة',
        skill: 'reading',
        passage:
          'It was a dark and rainy night. Tom was reading a book in his room when he heard a strange noise. He got up and looked out of the window. While he was looking, he saw a small cat under a tree. The cat was crying because it was cold and wet. Tom ran outside and picked up the cat. He gave it some warm milk and a soft blanket. From that night, the cat lived happily with Tom.',
        exercises: [
          { kind: 'mcq', question: 'What was Tom doing when he heard the noise?', choices: ['reading a book', 'sleeping', 'cooking', 'playing'], answer: 'reading a book' },
          { kind: 'mcq', question: 'Why was the cat crying?', choices: ['it was cold and wet', 'it was hungry', 'it was lost', 'it was afraid of Tom'], answer: 'it was cold and wet' },
          { kind: 'reading', question: 'What did Tom give the cat?', answer: 'He gave it some warm milk and a soft blanket.' },
          { kind: 'reading', question: 'What did Tom see while he was looking out of the window?', answer: 'He saw a small cat under a tree.' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: احكِ حدثاً من الماضي',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short story (about 50 words) about something that happened to you. Use the past simple and past progressive (for example: While I was walking, I saw…).', answer: 'Narrates a past event using both past simple and past progressive correctly. About 50 words.' },
          { kind: 'writing', question: 'Write 3–4 sentences about what you were doing yesterday at 6 p.m. Use the past progressive.', answer: 'Describes an action in progress yesterday at 6 p.m. using past progressive (was/were + -ing). 3–4 sentences.' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 3,
    name: 'الوحدة 3: ابقَ بصحة جيدة (Stay Healthy)',
    description: 'الصحة والجسم + المضارع التام (ever/never/already/yet) و have to/must.',
    lessons: [
      {
        order: 1,
        title: 'مفردات: الصحة والجسم',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'When you are ill, you go to see a ___.', choices: ['doctor', 'teacher', 'driver', 'waiter'], answer: 'doctor' },
          { kind: 'mcq', question: 'You use your ___ to smell things.', choices: ['nose', 'ear', 'hand', 'knee'], answer: 'nose' },
          { kind: 'cloze', question: 'Eating fruit and vegetables is good for your ___. (opposite of illness)', answer: 'health' },
          { kind: 'cloze', question: 'When you are ill and your body is very hot, you have a ___. (high temperature)', answer: 'fever' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: المضارع التام والأفعال الناقصة (ever/never/already/yet, must)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'Have you ___ eaten sushi?', choices: ['ever', 'yet', 'since', 'for'], answer: 'ever' },
          { kind: 'mcq', question: "You ___ wear a helmet when you ride a bike. It's important for safety.", choices: ['must', 'can', 'might', 'would'], answer: 'must' },
          { kind: 'cloze', question: 'I have ___ finished my exercise. (already/yet — affirmative)', answer: 'already' },
          { kind: 'cloze', question: "She hasn't taken her medicine ___. (already/yet — negative)", answer: 'yet' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: مقال عن الصحة',
        skill: 'reading',
        passage:
          'Do you want to stay healthy? Here are some simple tips. First, you must eat a good breakfast every morning. Never skip it! Second, you should drink a lot of water — about eight glasses a day. Third, you have to sleep at least eight hours every night, because sleep helps your body and your brain. Finally, try to exercise for thirty minutes a day. You can walk, run or play a sport. If you follow these tips, you will feel better and have more energy.',
        exercises: [
          { kind: 'mcq', question: 'How many glasses of water should you drink a day?', choices: ['about eight', 'about two', 'about twelve', 'about five'], answer: 'about eight' },
          { kind: 'mcq', question: 'Why is sleep important?', choices: ['it helps your body and brain', 'it makes you hungry', 'it wastes time', 'it makes you tired'], answer: 'it helps your body and brain' },
          { kind: 'reading', question: 'How long should you exercise every day?', answer: 'You should exercise for thirty minutes a day.' },
          { kind: 'reading', question: 'What is the first tip in the article?', answer: 'The first tip is to eat a good breakfast every morning (and never skip it).' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: فقرة نصائح',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Your friend wants to be healthier. Write a short paragraph (about 50 words) giving three pieces of advice. Use should, must or have to.', answer: 'Gives three health tips using should/must/have to correctly. About 50 words.' },
          { kind: 'writing', question: 'Write 3–4 sentences about your eating habits. What healthy or unhealthy food do you eat?', answer: 'Describes eating habits with correct present simple; mentions healthy/unhealthy foods. 3–4 sentences.' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 4,
    name: 'الوحدة 4: التكنولوجيا والتواصل (Tech & Communication)',
    description: 'التكنولوجيا ووسائل الإعلام + الشرط الأول والثاني (Conditionals) و might/may.',
    lessons: [
      {
        order: 1,
        title: 'مفردات: التكنولوجيا',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'You use a ___ to search for information on the internet.', choices: ['search engine', 'fridge', 'hammer', 'blanket'], answer: 'search engine' },
          { kind: 'mcq', question: 'A short message you send from your phone is a ___.', choices: ['text message', 'letter', 'poster', 'newspaper'], answer: 'text message' },
          { kind: 'cloze', question: 'I need to ___ my phone; the battery is empty. (put electricity in it)', answer: 'charge' },
          { kind: 'cloze', question: 'Please ___ (send) me an email when you arrive.', answer: 'send' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: الشرط الأول والثاني و might/may (First & Second Conditional)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'If it rains tomorrow, we ___ at home.', choices: ['will stay', 'stay', 'stayed', 'are staying'], answer: 'will stay' },
          { kind: 'mcq', question: 'If I ___ a million dollars, I would travel the world. (second conditional)', choices: ['had', 'have', 'will have', 'am having'], answer: 'had' },
          { kind: 'cloze', question: 'It is very cloudy. It ___ (might / rain) later. (possibility, two words)', answer: 'might rain' },
          { kind: 'cloze', question: 'If you study hard, you ___ (pass) the test. (first conditional result, two words)', answer: 'will pass' },
          { kind: 'mcq', question: "If you don't hurry, you ___ the bus.", choices: ['will miss', 'miss', 'missed', 'are missing'], answer: 'will miss' },
          { kind: 'cloze', question: 'If I were you, I ___ (buy) that phone. (second conditional: would + verb, two words)', answer: 'would buy' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: رأي حول الشاشات',
        skill: 'reading',
        passage:
          'These days, most young people spend many hours in front of a screen. Some people think this is a big problem. They say that too much screen time is bad for our eyes and our sleep. However, other people believe that phones and computers are very useful. If we use them well, they can help us learn new things and talk to friends far away. In my opinion, technology is neither good nor bad. If we use it carefully, it will help us. But if we use it too much, it may cause problems.',
        exercises: [
          { kind: 'mcq', question: 'What do some people say is bad about screen time?', choices: ['it is bad for our eyes and sleep', 'it is too expensive', 'it is boring', 'it is too slow'], answer: 'it is bad for our eyes and sleep' },
          { kind: 'mcq', question: 'What can technology help us do, according to the text?', choices: ['learn new things and talk to friends', 'cook dinner', 'clean the house', 'drive a car'], answer: 'learn new things and talk to friends' },
          { kind: 'reading', question: "What is the writer's opinion about technology?", answer: 'The writer thinks technology is neither good nor bad; it helps us if we use it carefully but may cause problems if we use it too much.' },
          { kind: 'reading', question: 'What may happen if we use technology too much?', answer: 'It may cause problems.' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: رأي',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short opinion paragraph (about 50 words): Is technology good or bad for students? Give two reasons for your opinion.', answer: 'States a clear opinion and gives two reasons; uses linking words and present simple/modals; about 50 words.' },
          { kind: 'writing', question: 'Write 3–4 sentences: What will you do this weekend if the weather is good? Use the first conditional.', answer: 'Uses first conditional (If + present, will + verb) correctly about weekend plans. 3–4 sentences.' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 5,
    name: 'الوحدة 5: كوكبنا (Our Planet)',
    description: 'البيئة والطبيعة وإعادة التدوير + المبني للمجهول (Passive: present/past simple).',
    lessons: [
      {
        order: 1,
        title: 'مفردات: البيئة',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'We should put plastic bottles in the ___ bin.', choices: ['recycling', 'sleeping', 'cooking', 'shopping'], answer: 'recycling' },
          { kind: 'mcq', question: 'Cutting down too many trees harms the ___.', choices: ['environment', 'homework', 'breakfast', 'timetable'], answer: 'environment' },
          { kind: 'cloze', question: 'We must save water and not ___ it. (opposite of save, starts with w)', answer: 'waste' },
          { kind: 'cloze', question: 'The air in big cities is often dirty because of ___. (dirty air, starts with p)', answer: 'pollution' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: المبني للمجهول (Passive Voice)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'Paper ___ from wood.', choices: ['is made', 'makes', 'made', 'is making'], answer: 'is made' },
          { kind: 'mcq', question: 'The classroom ___ every morning by the cleaner.', choices: ['is cleaned', 'cleans', 'cleaning', 'clean'], answer: 'is cleaned' },
          { kind: 'cloze', question: 'Millions of trees ___ (cut) down every year. (present simple passive, two words)', answer: 'are cut' },
          { kind: 'cloze', question: 'The telephone ___ (invent) by Alexander Graham Bell. (past simple passive, two words)', answer: 'was invented' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: كيف يُعاد تدوير الورق',
        skill: 'reading',
        passage:
          'Have you ever wondered what happens to old paper? Every year, millions of tonnes of paper are used around the world. Luckily, paper can be recycled. First, the old paper is collected from homes and schools. Then it is taken to a factory. At the factory, the paper is mixed with water to make a soft grey material. After that, the material is cleaned and pressed into thin sheets. Finally, the sheets are dried and new paper is made. Recycling paper saves trees and energy, so it is very good for our planet.',
        exercises: [
          { kind: 'mcq', question: 'Where is the old paper taken?', choices: ['to a factory', 'to a school', 'to the sea', 'to a shop'], answer: 'to a factory' },
          { kind: 'mcq', question: 'Why is recycling paper good?', choices: ['it saves trees and energy', 'it makes paper dirty', 'it costs a lot of money', 'it uses more water'], answer: 'it saves trees and energy' },
          { kind: 'reading', question: 'What is the paper mixed with at the factory?', answer: 'The paper is mixed with water.' },
          { kind: 'reading', question: 'Where is the old paper collected from?', answer: 'It is collected from homes and schools.' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: صف عملية أو نصيحة بيئية',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Write a short paragraph (about 50 words) about how you can help the environment. Give three ideas (for example: Water should be saved…). Try to use the passive voice.', answer: 'Gives three ways to help the environment; attempts passive voice correctly; about 50 words.' },
          { kind: 'writing', question: 'Describe how something is made or done in 3–4 sentences (for example, how bread is made). Use the passive voice.', answer: 'Describes a simple process using present simple passive (is/are + past participle) correctly. 3–4 sentences.' },
        ],
      },
    ],
  },
  // ============================================================
  {
    order: 6,
    name: 'الوحدة 6: العالم والثقافة (World & Culture)',
    description: 'الدول والمهرجانات والمهن + الجمل الموصولة (who/which/where) و (be) able to.',
    lessons: [
      {
        order: 1,
        title: 'مفردات: الدول والمهن',
        skill: 'vocab',
        exercises: [
          { kind: 'mcq', question: 'A big celebration with music and food is a ___.', choices: ['festival', 'hospital', 'factory', 'library'], answer: 'festival' },
          { kind: 'mcq', question: 'A person who cooks food in a restaurant is a ___.', choices: ['chef', 'pilot', 'farmer', 'dentist'], answer: 'chef' },
          { kind: 'cloze', question: 'People who live in France speak ___. (the language of France)', answer: 'French' },
          { kind: 'cloze', question: 'The capital ___ of Japan is Tokyo. (a large town)', answer: 'city' },
        ],
      },
      {
        order: 2,
        title: 'قواعد: الجمل الموصولة و able to (Relative Clauses)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'A doctor is a person ___ helps sick people.', choices: ['who', 'which', 'where', 'when'], answer: 'who' },
          { kind: 'mcq', question: 'A museum is a place ___ you can see old objects.', choices: ['where', 'who', 'which', 'when'], answer: 'where' },
          { kind: 'cloze', question: 'The man ___ lives next door is a doctor. (relative pronoun for people)', answer: 'who' },
          { kind: 'cloze', question: 'Japan is a country ___ is famous for its technology. (relative pronoun for things)', answer: 'which' },
          { kind: 'mcq', question: 'This book is ___ than that one.', choices: ['more interesting', 'interesting', 'most interesting', 'interestinger'], answer: 'more interesting' },
          { kind: 'cloze', question: 'After a lot of practice, she was ___ to swim across the lake. (be ___ to, one word)', answer: 'able' },
        ],
      },
      {
        order: 3,
        title: 'فهم مقروء: المدينة مقابل القرية',
        skill: 'reading',
        passage:
          'Dan lives in a big city, and his cousin Noa lives in a small village. Life in the city is busier and noisier than life in the village. In the city, there are more shops, cinemas and restaurants, and the buses run all night. However, the village is quieter and cleaner. The air is fresher, and people are friendlier because everyone knows each other. Dan thinks the city is more exciting, but Noa believes the village is the best place to live. They are both happy in their own homes.',
        exercises: [
          { kind: 'mcq', question: 'How is life in the city compared to the village?', choices: ['busier and noisier', 'quieter and cleaner', 'smaller and slower', 'colder and darker'], answer: 'busier and noisier' },
          { kind: 'mcq', question: 'Why are people in the village friendlier?', choices: ['everyone knows each other', 'there are more shops', 'the buses run all night', 'it is very big'], answer: 'everyone knows each other' },
          { kind: 'reading', question: 'What does Dan think about the city?', answer: 'Dan thinks the city is more exciting.' },
          { kind: 'reading', question: 'Name two things you can find in the city but not in the village.', answer: 'In the city there are more shops, cinemas and restaurants, and buses that run all night (any two).' },
        ],
      },
      {
        order: 4,
        title: 'كتابة: قارن مكانين أو صف مهرجاناً',
        skill: 'writing',
        exercises: [
          { kind: 'writing', question: 'Compare two places you know (for example, two cities, or your town and another) in a short paragraph (about 50 words). Use comparatives and superlatives.', answer: 'Compares two places using comparative and superlative forms correctly; about 50 words.' },
          { kind: 'writing', question: 'Write 3–4 sentences about a festival or holiday you like. What do people do? What do they eat?', answer: 'Describes a festival/holiday with present simple; mentions activities and food. 3–4 sentences.' },
        ],
      },
    ],
  },
];
