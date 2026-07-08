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
    description: 'الحيوانات والطبيعة والطقس + الماضي البسيط وصيغ التفضيل والمقارنة.',
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
        title: 'قواعد: الماضي البسيط والمقارنة (Past Simple, Comparatives)',
        skill: 'grammar',
        exercises: [
          { kind: 'mcq', question: 'Yesterday we ___ to the zoo.', choices: ['went', 'go', 'goes', 'going'], answer: 'went' },
          { kind: 'mcq', question: 'An elephant is ___ than a dog.', choices: ['bigger', 'big', 'biggest', 'more big'], answer: 'bigger' },
          { kind: 'cloze', question: 'Last week she ___ (visit) her grandmother.', answer: 'visited' },
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
