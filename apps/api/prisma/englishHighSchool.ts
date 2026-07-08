/**
 * محتوى الإنجليزية للثانوي — مسار 3 وحدات (بجروت، Modules A/B/C).
 * المصدر: 3-point Bagrut Assessment Handbook (Feb 2025) — مستوى A2 (Basic User II).
 *
 * البنية: مادة → مسار 3 وحدات (Level) → موديول (Questionnaire) → موضوع (Topic) → درس → تمرين.
 *  - Module A (016381): فهم مقروء (نصّان 180-200 كلمة، أسئلة اختيار/مفتوحة/إكمال).
 *  - Module C (016382): فهم مقروء (نصّ حتى 300 كلمة) + كتابة (تعبير 70-90 كلمة: رأي/وصف/رسالة).
 *  - Module B (016383): أدب — قصّة قصيرة + قصيدة (نصوص أصلية، لا القائمة المعتمدة) + تقرير كتاب.
 *
 * ملاحظات: الامتحان الشفوي (BOOST) والاستماع غير مشمولين (لا يوجد استماع في 3 وحدات؛ الشفوي منفصل).
 * النصوص الأدبية الرسمية المعتمدة خاصة بكل مدرسة وتُضاف عبر لوحة الإدارة.
 */
import type { EnLesson } from './englishContent';

export interface EnModuleTopic {
  order: number;
  name: string;
  lessons: EnLesson[];
}
export interface EnModule {
  number: number; // رقم الشالون (semel sheelon) — 16381 / 16382 / 16383
  title: string;
  description?: string;
  topics: EnModuleTopic[];
}

export const ENGLISH_3UNIT: EnModule[] = [
  // ============================================================
  //  Module A (016381) — Reading Comprehension (27%)
  // ============================================================
  {
    number: 16381,
    title: 'Module A — الفهم المقروء (016381)',
    description: 'موديول الفهم المقروء: نصّان (180-200 كلمة) وأسئلة اختيار/مفتوحة/إكمال. لا خصم على القواعد/الإملاء.',
    topics: [
      {
        order: 1,
        name: 'مهارات ومفردات (Skills & Vocabulary)',
        lessons: [
          {
            order: 1,
            title: 'مفردات: أنواع النصوص والربط',
            skill: 'vocab',
            exercises: [
              { kind: 'mcq', question: "An 'advertisement' is a text that ___.", choices: ['tries to sell or promote something', 'tells a personal story', 'gives exam results', 'reports the news only'], answer: 'tries to sell or promote something' },
              { kind: 'mcq', question: "If a text is 'informative', it mainly ___.", choices: ['gives facts and information', 'tells a funny joke', 'asks for money', 'describes feelings only'], answer: 'gives facts and information' },
              { kind: 'cloze', question: 'The main idea of a paragraph is often in the ___ sentence. (topic ___)', answer: 'topic' },
              { kind: 'cloze', question: "Words like 'however', 'because' and 'so' are called ___ words; they connect ideas. (one word starting with l)", answer: 'linking' },
            ],
          },
          {
            order: 2,
            title: 'مهارات: استراتيجيات الفهم المقروء',
            skill: 'vocab',
            exercises: [
              { kind: 'mcq', question: 'To find specific information quickly, you should ___ the text.', choices: ['scan', 'ignore', 'copy', 'translate'], answer: 'scan' },
              { kind: 'mcq', question: 'Reading the title and first sentences to get a general idea is called ___.', choices: ['skimming', 'scanning', 'spelling', 'writing'], answer: 'skimming' },
              { kind: 'cloze', question: 'Before you answer, read the ___ carefully to know what is asked. (one word starting with q)', answer: 'question' },
              { kind: 'cloze', question: "If you don't know a word, use the ___ of the sentence to guess its meaning. (surrounding words; one word starting with c)", answer: 'context' },
            ],
          },
        ],
      },
      {
        order: 2,
        name: 'نصوص الفهم المقروء (Reading Texts)',
        lessons: [
          {
            order: 1,
            title: 'نصّ (مقال): Teenagers and Sleep',
            skill: 'reading',
            passage:
              'TEENAGERS AND SLEEP. Many teenagers do not get enough sleep. Doctors say that young people between 13 and 18 need about nine hours of sleep every night, but most sleep only six or seven hours. There are several reasons for this. First, many teens use their phones late at night. The bright light from the screen makes it harder to fall asleep. Second, teenagers often have a lot of homework and after-school activities, so they go to bed late. When students do not sleep enough, they feel tired and find it difficult to concentrate in class. Some even fall asleep during lessons. Experts give simple advice to help. They suggest turning off phones at least one hour before bed and going to sleep at the same time every night. A short walk or a warm shower in the evening can also help the body relax. Schools in some countries now start lessons later in the morning, and teachers report that students are more awake and learn better. Getting enough sleep is not a luxury — it is an important part of staying healthy.',
            exercises: [
              { kind: 'mcq', question: 'How many hours of sleep do teenagers need, according to doctors?', choices: ['about nine hours', 'about six hours', 'about seven hours', 'about twelve hours'], answer: 'about nine hours' },
              { kind: 'mcq', question: "What is one reason teenagers don't sleep enough?", choices: ['they use their phones late at night', 'they wake up too late', 'they eat too much', 'they exercise at night'], answer: 'they use their phones late at night' },
              { kind: 'reading', question: 'What happens to students who do not sleep enough? Give one example.', answer: 'They feel tired and find it hard to concentrate; some even fall asleep during lessons.' },
              { kind: 'cloze', question: 'Complete from the text: Experts suggest turning off phones at least one hour before ___.', answer: 'bed' },
              { kind: 'reading', question: 'Why do some schools now start lessons later?', answer: 'Because students are more awake and learn better when lessons start later.' },
            ],
          },
          {
            order: 2,
            title: 'نصّ (رسالة/إيميل): A Letter to a Friend',
            skill: 'reading',
            passage:
              'Dear Maya, Thank you so much for your email! I was very happy to hear that you are coming to visit our city next month. I have already started planning what we can do together. On the first day, I want to take you to the old market in the city centre. It is full of colourful shops where you can buy sweets, spices and small gifts. The next day, if the weather is nice, we can go to the beach and have a picnic. I know how much you love swimming! In the evening, my family would like to invite you for dinner. My mother makes the best traditional food, and she is already excited to meet you. Please remember to bring comfortable shoes, because we will walk a lot. Also, don’t forget your camera — there are many beautiful places to photograph. Let me know what time your bus arrives, and I will come to meet you at the station. I can’t wait to see you! Write back soon. Love, Nour',
            exercises: [
              { kind: 'mcq', question: 'Why is Nour writing to Maya?', choices: ["to plan Maya's visit", 'to ask for money', 'to say goodbye', 'to complain about the weather'], answer: "to plan Maya's visit" },
              { kind: 'mcq', question: 'What does Nour ask Maya to bring?', choices: ['comfortable shoes and a camera', 'food and drinks', 'books and pens', 'a tent'], answer: 'comfortable shoes and a camera' },
              { kind: 'reading', question: 'What will they do on the first day?', answer: 'They will go to the old market in the city centre.' },
              { kind: 'cloze', question: 'Complete from the text: Nour will meet Maya at the ___.', answer: 'station' },
              { kind: 'reading', question: 'Why does Nour tell Maya to bring comfortable shoes?', answer: 'Because they will walk a lot.' },
            ],
          },
          {
            order: 3,
            title: 'نصّ (إعلان): Summer Sports Camp',
            skill: 'reading',
            passage:
              'SUMMER SPORTS CAMP — JOIN THE FUN! Are you between 10 and 15 years old? Do you love sports and making new friends? Then the Green Valley Summer Sports Camp is perfect for you! Our camp runs for two weeks, from 1st to 14th July, every day from 9 a.m. to 3 p.m. Each day, you can choose from many activities, including football, basketball, swimming, tennis and cycling. Our friendly, trained coaches will help you learn new skills and improve your game. Lunch and a healthy snack are included in the price. The cost is 600 shekels for the whole two weeks, but if you sign up before 15th June, you pay only 500 shekels. Places are limited, so book early to avoid disappointment! To register, call 04-555-1234 or visit our website. Please note: campers must bring sports clothes, a hat and a water bottle every day. Come and make this summer your best one yet!',
            exercises: [
              { kind: 'mcq', question: 'How much does the camp cost if you sign up before 15th June?', choices: ['500 shekels', '600 shekels', '300 shekels', '1000 shekels'], answer: '500 shekels' },
              { kind: 'mcq', question: 'Who is the camp for?', choices: ['young people aged 10 to 15', 'adults only', 'children under 8', 'teachers'], answer: 'young people aged 10 to 15' },
              { kind: 'reading', question: 'Name two activities offered at the camp.', answer: 'Any two of: football, basketball, swimming, tennis, cycling.' },
              { kind: 'cloze', question: 'Complete from the text: The camp runs from 1st to 14th ___.', answer: 'July' },
              { kind: 'reading', question: 'What must campers bring every day?', answer: 'Sports clothes, a hat and a water bottle.' },
            ],
          },
          {
            order: 4,
            title: 'نصّ (وصف): The Dead Sea',
            skill: 'reading',
            passage:
              'THE DEAD SEA. The Dead Sea is one of the most amazing places in Israel. It is a large salt lake, and its surface is the lowest point on Earth — about 430 metres below sea level. The Dead Sea is famous because the water is so salty that people can float on it easily without trying. In fact, it is almost impossible to sink! The salt and minerals in the water are also very good for the skin, so many people come to relax and cover themselves in the black mud from the shore. Every year, thousands of tourists from all over the world visit the Dead Sea. They enjoy floating in the warm water, taking photos and staying in the comfortable hotels nearby. However, the Dead Sea has a serious problem: it is getting smaller every year. The water level is falling because less water flows into it from the Jordan River. Scientists and governments are looking for ways to save this special place, so that future generations can enjoy it too.',
            exercises: [
              { kind: 'mcq', question: 'Why can people float easily on the Dead Sea?', choices: ['the water is very salty', 'the water is very cold', 'the water is very deep', 'there are many boats'], answer: 'the water is very salty' },
              { kind: 'mcq', question: 'What is the serious problem with the Dead Sea?', choices: ['it is getting smaller every year', 'it is too crowded', 'it is too cold', 'it has too many fish'], answer: 'it is getting smaller every year' },
              { kind: 'reading', question: 'Why is the Dead Sea good for the skin?', answer: 'Because of the salt and minerals in the water (and the black mud).' },
              { kind: 'cloze', question: 'Complete from the text: The Dead Sea is the lowest point on ___.', answer: 'Earth' },
              { kind: 'reading', question: 'Why is the water level of the Dead Sea falling?', answer: 'Because less water flows into it from the Jordan River.' },
            ],
          },
        ],
      },
    ],
  },
  // ============================================================
  //  Module C (016382) — Reading (70%) + Writing (30%)
  // ============================================================
  {
    number: 16382,
    title: 'Module C — فهم مقروء وكتابة (016382)',
    description: 'فهم مقروء (نصّ حتى 300 كلمة، 8-10 أسئلة) + تعبير كتابيّ (70-90 كلمة: رأي/وصف/رسالة غير رسمية).',
    topics: [
      {
        order: 1,
        name: 'الفهم المقروء (Reading Comprehension)',
        lessons: [
          {
            order: 1,
            title: 'نصّ: A Young Hero',
            skill: 'reading',
            passage:
              'A YOUNG HERO. Not all heroes are famous adults. Sometimes, a hero can be an ordinary child. This is the story of Ahmad, a twelve-year-old boy from a small village in the north of Israel. One cold winter afternoon, Ahmad was walking home from school along the river. Suddenly, he heard shouting. A little girl, who had been playing near the water, had fallen into the cold, fast river. Her friends were frightened and did not know what to do. Ahmad did not think twice. He quickly took off his heavy schoolbag and jumped into the water. The river was freezing and strong, but Ahmad was a good swimmer. He reached the girl, held her tightly, and pulled her slowly to the riverbank. Some adults who were passing by helped them both out of the water. The girl was cold and afraid, but she was safe. Later, the girl’s parents came to Ahmad’s house to thank him. They said he was very brave. The mayor of the village also gave Ahmad a special prize for his courage. But Ahmad was modest. "I only did what anyone would do," he said. "I am just happy that she is safe." Ahmad’s story teaches us an important lesson: you do not have to be big or strong to make a difference. Sometimes, all you need is a brave heart and the will to help others.',
            exercises: [
              { kind: 'mcq', question: 'How old is Ahmad?', choices: ['twelve', 'ten', 'fourteen', 'eight'], answer: 'twelve' },
              { kind: 'mcq', question: 'What happened to the little girl?', choices: ['she fell into the river', 'she got lost in the forest', 'she fell off her bike', 'she was ill'], answer: 'she fell into the river' },
              { kind: 'mcq', question: 'How did Ahmad save the girl?', choices: ['he jumped into the water and pulled her out', 'he called the police', 'he ran to get help', 'he threw her a rope'], answer: 'he jumped into the water and pulled her out' },
              { kind: 'reading', question: 'Why was Ahmad able to save the girl?', answer: 'Because he was a good swimmer (and he was brave).' },
              { kind: 'reading', question: 'How did the village thank Ahmad?', answer: "The girl's parents thanked him, and the mayor gave him a special prize for his courage." },
              { kind: 'cloze', question: 'Complete from the text: Ahmad said he was just happy that the girl was ___.', answer: 'safe' },
              { kind: 'mcq', question: 'Which word best describes Ahmad?', choices: ['brave', 'lazy', 'selfish', 'afraid'], answer: 'brave' },
              { kind: 'reading', question: "What lesson does Ahmad's story teach us?", answer: 'You do not have to be big or strong to make a difference; all you need is a brave heart and the will to help others.' },
            ],
          },
          {
            order: 2,
            title: 'نصّ (مراجعة كتاب): The Secret Garden',
            skill: 'reading',
            passage:
              "BOOK REVIEW: 'THE SECRET GARDEN'. Last month, I read a wonderful classic novel called 'The Secret Garden' by Frances Hodgson Burnett, and I would like to tell you about it. The story is about a young girl named Mary Lennox. At the beginning of the book, Mary is a lonely and unfriendly child. After her parents die, she is sent to live with her uncle in a big, old house in the English countryside. The house has many rooms and many secrets. One day, Mary discovers a hidden garden that has been locked and forgotten for ten years. With the help of two boys, Dickon and Colin, Mary brings the garden back to life. As the garden grows and becomes beautiful again, the children also change. Mary becomes kinder and happier, and Colin, who was weak and always sad, becomes strong and healthy. What I liked most about this book is its message: nature and friendship can heal people and make them better. The characters feel real, and the descriptions of the garden are beautiful. The only small problem is that the beginning is a little slow. However, if you continue reading, the story becomes very interesting. I would recommend this book to anyone who enjoys stories about nature, friendship and change. I give it five stars out of five.",
            exercises: [
              { kind: 'mcq', question: 'Who is the main character of the book?', choices: ['Mary Lennox', 'Dickon', 'Frances Burnett', 'Colin'], answer: 'Mary Lennox' },
              { kind: 'mcq', question: 'What does Mary discover?', choices: ['a hidden garden', 'a treasure box', 'a secret door to another country', 'an old photograph'], answer: 'a hidden garden' },
              { kind: 'reading', question: 'How does Mary change during the story?', answer: 'She becomes kinder and happier (from a lonely, unfriendly child).' },
              { kind: 'mcq', question: 'What is the message of the book, according to the writer?', choices: ['nature and friendship can heal people', 'money brings happiness', 'school is important', 'gardens are dangerous'], answer: 'nature and friendship can heal people' },
              { kind: 'cloze', question: 'Complete from the text: The only small problem is that the beginning is a little ___.', answer: 'slow' },
              { kind: 'reading', question: 'Would the writer recommend the book? To whom?', answer: 'Yes, to anyone who enjoys stories about nature, friendship and change.' },
            ],
          },
        ],
      },
      {
        order: 2,
        name: 'الكتابة (Writing — 70-90 words)',
        lessons: [
          {
            order: 1,
            title: 'كتابة: رأي (Opinion)',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: 'Write an opinion composition (70-90 words): Should students wear a school uniform? Give your opinion and at least two reasons.', answer: 'Module C rubric (A2): on topic; a clear opinion with at least two reasons; relevant, organized content (intro/body/conclusion); Band I-II vocabulary; correct basic tenses, word order, pronouns and prepositions; correct spelling and punctuation; 70-90 words.' },
              { kind: 'writing', question: 'Write an opinion composition (70-90 words): Is it better to live in a city or in a village? Give reasons for your opinion.', answer: 'Clear opinion (city or village) with at least two reasons; organized; A2 vocabulary and accuracy; 70-90 words.' },
            ],
          },
          {
            order: 2,
            title: 'كتابة: وصف (Description)',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: 'Write a description (70-90 words) of your favourite place. Say where it is, what it looks like, and why you like it.', answer: 'Describes a place: location, appearance, and reason for liking it; organized; descriptive vocabulary; present simple; 70-90 words.' },
              { kind: 'writing', question: 'Write a description (70-90 words) of a person you admire. Describe their appearance and their character.', answer: 'Describes a person: appearance and character, with adjectives; organized; 70-90 words.' },
            ],
          },
          {
            order: 3,
            title: 'كتابة: رسالة غير رسمية (Informal Letter)',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: 'Write an informal letter (70-90 words) to a friend inviting them to your birthday party. Include the date, the place and what you will do.', answer: 'Informal letter format (Dear …, + closing such as Love/Best wishes); includes date, place and activities; friendly tone; 70-90 words.' },
              { kind: 'writing', question: 'Write an informal letter (70-90 words) to a friend telling them about a trip you went on. Say where you went and what you did.', answer: 'Informal letter format; uses past simple; says where they went and what they did; 70-90 words.' },
            ],
          },
        ],
      },
    ],
  },
  // ============================================================
  //  Module B (016383) — Literature (internal)
  // ============================================================
  {
    number: 16383,
    title: 'Module B — الأدب (016383)',
    description: 'الأدب (تقييم داخلي): قصّة قصيرة + قصيدة + تقرير كتاب. النصوص هنا أصلية للتدريب — النصوص المعتمدة رسميًا تُضاف من المعلّم.',
    topics: [
      {
        order: 1,
        name: 'قراءة الأدب (Reading Literature)',
        lessons: [
          {
            order: 1,
            title: 'قصّة قصيرة: The Old Fisherman',
            skill: 'reading',
            passage:
              "THE OLD FISHERMAN (a short story). Every morning, before the sun rose, an old fisherman named Yusuf took his small wooden boat out to sea. He was poor, but he was happy, because he loved the quiet water and the sound of the waves. One day, Yusuf caught a very large and beautiful fish — the biggest he had ever seen. 'I can sell this fish for a lot of money,' he thought. But when he looked into the fish's eyes, he felt sorry for it. The fish was old, like him. After a long moment, Yusuf smiled and gently put the fish back into the sea. 'Go,' he said. 'You deserve to live.' That evening, Yusuf returned home with an empty net and no money. His neighbour laughed at him. 'You are a foolish old man,' he said. But Yusuf did not mind. He knew he had done the right thing. Years later, people in the village still told the story of the kind fisherman who set the great fish free. They said that a good heart is worth more than gold. And Yusuf, though he never became rich, was remembered as the happiest man in the village.",
            exercises: [
              { kind: 'mcq', question: 'What did Yusuf catch?', choices: ['a very large fish', 'an old boat', 'a golden ring', 'a small bird'], answer: 'a very large fish' },
              { kind: 'mcq', question: 'What did Yusuf do with the fish?', choices: ['he put it back into the sea', 'he sold it for money', 'he ate it', 'he gave it to his neighbour'], answer: 'he put it back into the sea' },
              { kind: 'reading', question: 'Why did Yusuf feel sorry for the fish?', answer: 'Because the fish was old, like him, and he felt it deserved to live.' },
              { kind: 'reading', question: 'What is the message (theme) of the story?', answer: 'A good heart is worth more than gold — kindness matters more than money.' },
              { kind: 'mcq', question: 'How is Yusuf described at the end of the story?', choices: ['the happiest man in the village', 'the richest man', 'a sad old man', 'a famous fisherman'], answer: 'the happiest man in the village' },
              { kind: 'cloze', question: 'The main message or lesson of a story is its main ___. (one word starting with i)', answer: 'idea' },
            ],
          },
          {
            order: 2,
            title: 'قصيدة: My Tree',
            skill: 'reading',
            passage:
              'MY TREE\n\nOutside my window stands a tree,\nAs tall and old as tall can be.\nIn spring it wears a coat of green,\nThe finest coat I have ever seen.\n\nIn summer birds come there to rest,\nAnd build their little homes and nest.\nIn autumn, leaves of gold and red\nFall softly on the flower bed.\n\nIn winter, when the cold winds blow,\nIts branches wear a hat of snow.\nThrough every season, rain or sun,\nMy tree and I are friends — as one.',
            exercises: [
              { kind: 'mcq', question: 'What is the poem about?', choices: ['a tree through the seasons', "a bird's journey", 'a winter storm', 'a garden of flowers'], answer: 'a tree through the seasons' },
              { kind: 'mcq', question: "In the poem, what does the tree 'wear' in winter?", choices: ['a hat of snow', 'a coat of green', 'leaves of gold', 'a nest of birds'], answer: 'a hat of snow' },
              { kind: 'reading', question: 'What happens to the tree in autumn?', answer: 'Its leaves turn gold and red and fall softly on the flower bed.' },
              { kind: 'cloze', question: "'Tree' and 'be' sound the same at the end of the lines; this is called ___. (one word starting with r)", answer: 'rhyme' },
              { kind: 'reading', question: 'How does the poet feel about the tree?', answer: 'The poet feels the tree is a friend (“My tree and I are friends — as one”).' },
            ],
          },
          {
            order: 3,
            title: 'مصطلحات أدبية (Literary Terms)',
            skill: 'vocab',
            exercises: [
              { kind: 'mcq', question: 'The people in a story are called the ___.', choices: ['characters', 'chapters', 'covers', 'titles'], answer: 'characters' },
              { kind: 'mcq', question: "The 'plot' of a story is ___.", choices: ['the series of events that happen', 'the name of the writer', 'the last page', 'the price of the book'], answer: 'the series of events that happen' },
              { kind: 'cloze', question: 'The place and time where a story happens is called the ___. (one word starting with s)', answer: 'setting' },
              { kind: 'cloze', question: 'The main message or idea of a story is its ___. (one word starting with t)', answer: 'theme' },
            ],
          },
        ],
      },
      {
        order: 2,
        name: 'تقرير عن كتاب (Book Report)',
        lessons: [
          {
            order: 1,
            title: 'كتابة: تقرير عن كتاب',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: 'Write a short book report (about 80 words) about a book you have read. Include the title, the author, what the book is about, and your opinion.', answer: 'Book report: includes title and author, a short summary of the book, and a personal opinion; organized; A2 vocabulary and accuracy; about 80 words.' },
              { kind: 'writing', question: 'Write about your favourite character from a book or story (about 70 words). Describe the character and say why you like them.', answer: 'Describes a character (appearance/personality) and gives a reason for liking them; organized; about 70 words.' },
            ],
          },
        ],
      },
    ],
  },
];
