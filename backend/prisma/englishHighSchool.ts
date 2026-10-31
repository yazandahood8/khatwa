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

// ================================================================
//  مسار 4 وحدات (بجروت، Modules C/D/E) — مستوى B1 (Independent User I).
//  المصدر: 4-point Bagrut Handbook (Feb 2025). Module C (016382) قراءة+كتابة،
//  Module D (016483) أدب (3 قصص + 3 قصائد + 4 تقارير)، Module E (016471) قراءة (حتى 400 كلمة) + مفردات.
//  الشفوي (COBE) والاستماع مؤجّلان (يحتاجان صوت/فيديو). النصوص الأدبية أصلية للتدريب.
// ================================================================
export const ENGLISH_4UNIT: EnModule[] = [
  // ============================================================
  //  Module C (016382) — Reading (70%) + Writing (30%)  [B1]
  // ============================================================
  {
    number: 16382,
    title: 'Module C — فهم مقروء وكتابة (016382)',
    description: 'فهم مقروء (نصّ حتى 300 كلمة، 8-10 أسئلة) + تعبير كتابيّ (70-90 كلمة). مستوى B1.',
    topics: [
      {
        order: 1,
        name: 'الفهم المقروء (Reading Comprehension)',
        lessons: [
          {
            order: 1,
            title: 'نصّ: The Power of Volunteering',
            skill: 'reading',
            passage:
              "THE POWER OF VOLUNTEERING. In recent years, more and more young people around the world have started to volunteer their free time to help others. Volunteering means working without payment to support a good cause, and it can take many forms. Some teenagers help elderly people in their neighbourhood, others clean beaches and parks, and some read to young children at the local library. At first, many students volunteer because their school asks them to, or because it looks good on a university application. However, most of them soon discover that volunteering gives them much more than they expected. Studies have shown that people who volunteer regularly feel happier and less stressed. When we help others, our brains release chemicals that improve our mood, so it is good for our mental health. Volunteering also helps young people develop useful skills, such as teamwork, communication and problem-solving. These skills are valuable in almost any future job. In addition, volunteers often make new friends and feel more connected to their community. Of course, volunteering is not always easy. It takes time and energy, and sometimes the work is difficult or even boring. But most volunteers agree that the rewards are worth the effort. As one seventeen-year-old volunteer said, 'When I see the smile on an old man's face, I know that my time was not wasted.' Perhaps that is the greatest reward of all: knowing that you have made a real difference in someone's life.",
            exercises: [
              { kind: 'mcq', question: "What does 'volunteering' mean, according to the text?", choices: ['working without payment to support a good cause', 'working to earn extra money', 'studying for university', 'playing sports with friends'], answer: 'working without payment to support a good cause' },
              { kind: 'mcq', question: 'Why do many students start volunteering?', choices: ['because their school asks them to or it looks good for university', 'because they are paid well', 'because they have nothing else to do', 'because they want to travel'], answer: 'because their school asks them to or it looks good for university' },
              { kind: 'reading', question: 'According to the text, why is volunteering good for our mental health?', answer: 'Because helping others makes our brains release chemicals that improve our mood, so we feel happier and less stressed.' },
              { kind: 'reading', question: 'Name two useful skills that volunteering helps young people develop.', answer: 'Any two of: teamwork, communication, problem-solving.' },
              { kind: 'mcq', question: 'What is one disadvantage of volunteering mentioned in the text?', choices: ['it takes time and energy and can be difficult or boring', 'it costs a lot of money', 'it is dangerous', 'it is illegal'], answer: 'it takes time and energy and can be difficult or boring' },
              { kind: 'cloze', question: 'Complete from the text: The greatest reward is knowing you have made a real ___ in someone’s life.', answer: 'difference' },
              { kind: 'mcq', question: 'What is the main idea of the text?', choices: ['volunteering has many benefits for young people and their communities', 'volunteering is a waste of time', 'only adults should volunteer', 'volunteering is only about money'], answer: 'volunteering has many benefits for young people and their communities' },
            ],
          },
          {
            order: 2,
            title: 'نصّ: From Refugee to Doctor',
            skill: 'reading',
            passage:
              "FROM REFUGEE TO DOCTOR. Dr. Lena Haddad still remembers the day she arrived in a new country as a ten-year-old girl. She spoke no English, had no friends, and missed her old home terribly. Her family had left their country because of war, carrying only a few small bags. 'Those first months were the hardest of my life,' she says. 'I sat at the back of the classroom and understood nothing. I felt invisible.' But Lena was determined not to give up. Every evening, she studied English for hours, watching cartoons and copying words into a notebook. Slowly, she began to understand her teachers and make friends. Her science teacher, Mr. Cohen, noticed how hard she worked and encouraged her to dream big. 'He told me that one day I could become anything I wanted,' Lena recalls. 'I never forgot his words.' Twenty years later, Lena is now a respected doctor who helps sick children in a large hospital. In her free time, she volunteers at a centre for young refugees, teaching them English and giving them hope. 'I know exactly how they feel,' she explains. 'I want them to understand that their difficult start does not decide their future.' Lena's story is a powerful reminder that with hard work, courage and a little kindness from others, even the most difficult beginnings can lead to a bright future.",
            exercises: [
              { kind: 'mcq', question: "Why did Lena's family leave their country?", choices: ['because of war', 'to find a better job', 'to study abroad', 'for a holiday'], answer: 'because of war' },
              { kind: 'mcq', question: 'How did Lena learn English?', choices: ['by studying every evening and watching cartoons', 'by taking private lessons', 'by travelling abroad', 'she already knew it'], answer: 'by studying every evening and watching cartoons' },
              { kind: 'reading', question: 'How did Mr. Cohen help Lena?', answer: 'He noticed how hard she worked and encouraged her to dream big, telling her she could become anything she wanted.' },
              { kind: 'mcq', question: "What is Lena's job now?", choices: ['a doctor', 'a teacher', 'a lawyer', 'a scientist'], answer: 'a doctor' },
              { kind: 'reading', question: 'What does Lena do in her free time, and why?', answer: 'She volunteers at a centre for young refugees, teaching them English and giving them hope, because she knows how they feel.' },
              { kind: 'cloze', question: 'Complete from the text: Lena wants the young refugees to understand that their difficult start does not decide their ___.', answer: 'future' },
              { kind: 'mcq', question: "What is the message of Lena's story?", choices: ['difficult beginnings can lead to a bright future with hard work and kindness', 'it is impossible to succeed after a hard start', 'only rich people can become doctors', 'war has no effect on children'], answer: 'difficult beginnings can lead to a bright future with hard work and kindness' },
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
              { kind: 'writing', question: 'Write an opinion composition (70-90 words): Do you think social media has a positive or negative effect on teenagers? Give your opinion and two reasons.', answer: 'Module C rubric (B1): on topic; a clear opinion with two reasons; relevant, organized content; appropriate vocabulary and language chunks; correct tenses, word order, pronouns and prepositions; correct mechanics; 70-90 words.' },
              { kind: 'writing', question: 'Write an opinion composition (70-90 words): Should students be allowed to use mobile phones in school? Explain your opinion with reasons.', answer: 'Clear opinion with reasons; organized (intro/body/conclusion); B1 vocabulary and accuracy; 70-90 words.' },
            ],
          },
          {
            order: 2,
            title: 'كتابة: وصف (Description)',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: 'Write a description (70-90 words) of a person who has influenced you (a role model). Describe who they are and why they are important to you.', answer: 'Describes a role model: who they are and why they matter; organized; descriptive vocabulary; 70-90 words.' },
            ],
          },
          {
            order: 3,
            title: 'كتابة: رسالة غير رسمية (Informal Letter)',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: 'Write an informal letter (70-90 words) to a friend who is visiting your country for the first time. Tell them what to see and do.', answer: 'Informal letter format (greeting + closing); suggests places and activities; friendly tone; 70-90 words.' },
            ],
          },
        ],
      },
    ],
  },
  // ============================================================
  //  Module D (016483) — Literature (internal)  [B1]
  // ============================================================
  {
    number: 16483,
    title: 'Module D — الأدب (016483)',
    description: 'الأدب (تقييم داخلي): 3 قصص + 3 قصائد + 4 تقارير كتب. النصوص هنا أصلية للتدريب على المهارات؛ النصوص المعتمدة رسميًا يضيفها المعلّم.',
    topics: [
      {
        order: 1,
        name: 'قراءة الأدب (Reading Literature)',
        lessons: [
          {
            order: 1,
            title: 'قصّة قصيرة: The Painting',
            skill: 'reading',
            passage:
              "THE PAINTING (a short story). Sara had always loved to paint, but she kept her paintings hidden under her bed. She was afraid that people would laugh at them. 'They are not good enough,' she told herself. One day, her art teacher, Mrs. Barak, asked the class to enter a painting in the school competition. Sara wanted to run away. That night, she looked at her favourite painting — a picture of the sea at sunset — and made a brave decision. The next morning, with shaking hands, she gave it to Mrs. Barak. For a whole week, Sara could not sleep. She was sure everyone would laugh. When the day of the results came, she almost stayed at home. But when she walked into the hall, she saw her painting hanging on the wall, with a golden ribbon beside it. She had won first prize. Around her, students were smiling and pointing. 'It's beautiful,' one girl whispered. Sara felt her cheeks turn red, but this time it was from happiness, not fear. Mrs. Barak walked over and put a hand on her shoulder. 'You had this talent all along,' she said gently. 'You just needed the courage to share it.' From that day on, Sara never hid her paintings again. She had learned that the biggest risk is sometimes not trying at all.",
            exercises: [
              { kind: 'mcq', question: 'Why did Sara hide her paintings?', choices: ['she was afraid people would laugh at them', 'she wanted to sell them', 'they were too big', 'she had lost them'], answer: 'she was afraid people would laugh at them' },
              { kind: 'mcq', question: 'What did Sara win?', choices: ['first prize', 'a new set of paints', 'a trip abroad', 'nothing'], answer: 'first prize' },
              { kind: 'reading', question: 'How did Sara feel before the results, and how did she feel after? Describe the change.', answer: 'Before, she felt afraid and could not sleep, sure everyone would laugh; after, she felt happy and proud when she saw she had won.' },
              { kind: 'reading', question: 'What lesson did Sara learn? Do you agree with it? (personal response)', answer: 'She learned that the biggest risk is sometimes not trying at all / that you need courage to share your talent. Accept any reasoned personal opinion.' },
              { kind: 'mcq', question: "Which word best describes Sara's decision to enter the competition?", choices: ['brave', 'lazy', 'cruel', 'foolish'], answer: 'brave' },
              { kind: 'cloze', question: 'The message or lesson of a literary work is its main ___. (one word starting with i)', answer: 'idea' },
            ],
          },
          {
            order: 2,
            title: 'قصيدة: The Bridge',
            skill: 'reading',
            passage:
              "THE BRIDGE\n\nBetween two lands there stands a bridge,\nAcross a river deep and wide.\nOne side is where I used to live,\nAnd new dreams wait on the other side.\n\nI stand upon the bridge and pause,\nMy old life calling me to stay.\nBut something stronger pulls me on —\nA quiet voice that says, 'This way.'\n\nSo step by step I cross the stones,\nWith fear and hope inside my chest.\nFor those who never cross the bridge\nWill never find what lies ahead.",
            exercises: [
              { kind: 'mcq', question: 'What does the bridge in the poem most likely represent?', choices: ['a change or a new beginning in life', 'a real river crossing only', 'a school building', 'a holiday trip'], answer: 'a change or a new beginning in life' },
              { kind: 'reading', question: 'How does the speaker feel as they cross the bridge?', answer: "The speaker feels both fear and hope ('with fear and hope inside my chest')." },
              { kind: 'mcq', question: 'What message does the last verse give?', choices: ['those who never take a chance will never find what lies ahead', 'bridges are dangerous', 'it is better to stay at home', 'rivers are beautiful'], answer: 'those who never take a chance will never find what lies ahead' },
              { kind: 'cloze', question: "In poetry, a comparison that says one thing IS another (e.g. 'the bridge is a new life') is called a ___. (one word starting with m)", answer: 'metaphor' },
              { kind: 'reading', question: "Have you ever had to make a big change (cross a 'bridge') in your life? (personal response)", answer: "Personal response — accept any relevant, reasoned answer that connects to the poem's theme of change or taking a chance." },
            ],
          },
          {
            order: 3,
            title: 'مصطلحات أدبية (Literary Terms)',
            skill: 'vocab',
            exercises: [
              { kind: 'mcq', question: "A comparison using 'like' or 'as' (e.g. 'brave as a lion') is called a ___.", choices: ['simile', 'metaphor', 'setting', 'plot'], answer: 'simile' },
              { kind: 'mcq', question: 'The feeling or atmosphere a literary work creates is called the ___.', choices: ['mood', 'author', 'title', 'page'], answer: 'mood' },
              { kind: 'cloze', question: 'The main character that a story is mostly about is called the ___. (the main hero; one word starting with p)', answer: 'protagonist' },
              { kind: 'mcq', question: 'When we say what a character feels and why, we give a ___ response.', choices: ['personal', 'financial', 'grammatical', 'musical'], answer: 'personal' },
            ],
          },
        ],
      },
      {
        order: 2,
        name: 'تقرير كتاب واستجابة شخصية (Book Report & Personal Response)',
        lessons: [
          {
            order: 1,
            title: 'كتابة: تقرير كتاب واستجابة',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: 'Write a book report (about 90 words) about a book you have read. Include the title, the author, a short summary, and your personal opinion with a reason.', answer: 'Book report (B1): title + author + short summary + personal opinion with a reason; organized; about 90 words.' },
              { kind: 'writing', question: "Choose a character from a story you know. Write about 80 words describing the character's feelings at an important moment and explain the reasons for them.", answer: "Describes a character's feelings at a key moment and explains the reasons (Module D can-do statement); organized; about 80 words." },
            ],
          },
        ],
      },
    ],
  },
  // ============================================================
  //  Module E (016471) — Reading (70%, ≤400 words) + Vocabulary (30%)  [B1]
  // ============================================================
  {
    number: 16471,
    title: 'Module E — فهم مقروء ومفردات (016471)',
    description: 'فهم مقروء أصعب (نصّ حتى 400 كلمة، بلا قاموس، يشمل صح/خطأ مع تعليل) + مهمّة مفردات (Band I/II/III).',
    topics: [
      {
        order: 1,
        name: 'الفهم المقروء (Reading Comprehension — up to 400 words)',
        lessons: [
          {
            order: 1,
            title: 'نصّ: Should We Still Learn to Write by Hand?',
            skill: 'reading',
            passage:
              "SHOULD WE STILL LEARN TO WRITE BY HAND? In a world full of computers, tablets and smartphones, some people ask whether children still need to learn to write by hand. After all, most adults now type far more than they write, and some schools have already reduced the number of handwriting lessons. However, many scientists believe that handwriting is still very important, especially for young learners. Research suggests that writing by hand helps the brain in ways that typing does not. When we form letters by hand, several areas of the brain work together, which helps us remember information better. In one well-known study, students who took notes by hand during a lecture remembered more than those who typed their notes on a laptop. This is because writing is slower, so students have to listen carefully and put ideas into their own words, instead of simply copying everything. Handwriting also helps young children learn to read. As they practise forming each letter, they begin to recognise letters more easily and understand how words are built. In addition, handwriting develops fine motor skills — the small, careful movements of the fingers — which are useful for many other tasks. Of course, typing has its advantages too. It is faster, easier to correct, and necessary in the modern workplace. Nobody is suggesting that we should stop using computers. The point is that handwriting and typing are different skills, and both are valuable. Most experts agree that children should learn both. So, the next time you pick up a pen, remember: you are not just writing words on paper — you are also giving your brain a healthy workout.",
            exercises: [
              { kind: 'mcq', question: 'Why do some people think children no longer need to learn handwriting?', choices: ['because most adults now type more than they write', 'because pens are too expensive', 'because handwriting is dangerous', 'because teachers are too busy'], answer: 'because most adults now type more than they write' },
              { kind: 'reading', question: 'According to the text, how does writing by hand help the brain?', answer: 'Several areas of the brain work together when we form letters by hand, which helps us remember information better.' },
              { kind: 'mcq', question: 'In the study mentioned, who remembered more?', choices: ['those who wrote notes by hand', 'those who typed their notes', 'both the same', 'neither remembered anything'], answer: 'those who wrote notes by hand' },
              { kind: 'reading', question: 'TRUE or FALSE? The writer thinks we should stop using computers. Justify your answer from the text.', answer: "False. The text says 'Nobody is suggesting that we should stop using computers' and that both handwriting and typing are valuable." },
              { kind: 'reading', question: 'Name one way handwriting helps young children, according to the text.', answer: 'It helps them learn to read (recognise letters and understand how words are built), or it develops fine motor skills.' },
              { kind: 'mcq', question: "What are 'fine motor skills'?", choices: ['the small, careful movements of the fingers', 'the ability to run fast', 'a type of computer', 'a school subject'], answer: 'the small, careful movements of the fingers' },
              { kind: 'cloze', question: 'Complete from the text: Most experts agree that children should learn ___ handwriting and typing.', answer: 'both' },
              { kind: 'mcq', question: "What is the writer's main opinion?", choices: ['both handwriting and typing are valuable skills', 'handwriting is useless today', 'typing is bad for children', 'computers should be banned in schools'], answer: 'both handwriting and typing are valuable skills' },
            ],
          },
          {
            order: 2,
            title: 'نصّ (رسالة للمحرّر): Save Our Library',
            skill: 'reading',
            passage:
              "LETTER TO THE EDITOR: SAVE OUR LIBRARY. Dear Editor, I am writing to express my concern about the town council's plan to close our local library next year. As a student, I believe this would be a serious mistake that would harm our whole community. First of all, the library is much more than a room full of books. For many students like me, it is a quiet, comfortable place to study, especially for those who do not have space at home. Every afternoon, the reading room is full of young people doing their homework. Where will they go if it closes? Secondly, the library offers free access to computers and the internet. Not every family can afford these at home, so the library helps to make sure that all children have equal opportunities. Closing it would increase the gap between rich and poor families. Some council members argue that the library is too expensive to run and that people can find everything online. However, this is simply not true for everyone. Elderly people, in particular, often depend on the library's help and friendly staff. I understand that the council must save money, but there are surely better ways to do this. Instead of closing the library, why not open it to volunteers, or organise events to raise funds? I urge the council to think again and to listen to the people who use this valuable service every day. Our library is the heart of our community, and once it is gone, we will never get it back. Yours sincerely, Rania Khoury",
            exercises: [
              { kind: 'mcq', question: 'Why is Rania writing this letter?', choices: ['to protest against the plan to close the library', 'to praise the town council', 'to ask for a new library', 'to sell books'], answer: 'to protest against the plan to close the library' },
              { kind: 'mcq', question: 'According to Rania, why is the library important for students without space at home?', choices: ['it is a quiet, comfortable place to study', 'it sells cheap food', 'it is open all night', 'it gives out free money'], answer: 'it is a quiet, comfortable place to study' },
              { kind: 'reading', question: 'How does the library help make opportunities more equal, according to the letter?', answer: 'It offers free access to computers and the internet, so children whose families cannot afford these at home still have access.' },
              { kind: 'reading', question: 'What solutions does Rania suggest instead of closing the library?', answer: 'Opening it to volunteers, or organising events to raise funds.' },
              { kind: 'mcq', question: "What does Rania mean by 'our library is the heart of our community'?", choices: ['it is very important and central to community life', 'it is in the town centre', 'it is shaped like a heart', 'it is a hospital'], answer: 'it is very important and central to community life' },
            ],
          },
        ],
      },
      {
        order: 2,
        name: 'المفردات (Vocabulary — Band I/II/III)',
        lessons: [
          {
            order: 1,
            title: 'مفردات: كلمات في سياق',
            skill: 'vocab',
            exercises: [
              { kind: 'mcq', question: 'The scientists made an important ___ about how the brain works. (a new fact found through research)', choices: ['discovery', 'mistake', 'holiday', 'argument'], answer: 'discovery' },
              { kind: 'mcq', question: 'She gave a clear ___ for her decision, so everyone understood why. (a reason)', choices: ['explanation', 'invitation', 'celebration', 'decoration'], answer: 'explanation' },
              { kind: 'mcq', question: 'The new law will have a big ___ on the environment. (an effect)', choices: ['impact', 'insect', 'island', 'income'], answer: 'impact' },
              { kind: 'cloze', question: 'The evidence was so ___ that nobody could argue against it. (very strong/persuasive; adjective starting with c)', answer: 'convincing' },
              { kind: 'mcq', question: "A synonym for 'important' is ___.", choices: ['significant', 'silent', 'similar', 'simple'], answer: 'significant' },
            ],
          },
          {
            order: 2,
            title: 'مفردات: مرادفات وأضداد واشتقاق',
            skill: 'vocab',
            exercises: [
              { kind: 'mcq', question: "A person who is 'reliable' is someone you can ___.", choices: ['trust', 'ignore', 'fear', 'forget'], answer: 'trust' },
              { kind: 'cloze', question: "Complete with the correct form: Success requires patience and ___. (noun form of 'determined')", answer: 'determination' },
              { kind: 'mcq', question: "The opposite of 'increase' is ___.", choices: ['decrease', 'improve', 'continue', 'repeat'], answer: 'decrease' },
              { kind: 'cloze', question: 'If you do not understand a word, you can look it up in a ___. (a book of word meanings)', answer: 'dictionary' },
              { kind: 'mcq', question: "A synonym for 'happy' is ___.", choices: ['pleased', 'painful', 'patient', 'polite'], answer: 'pleased' },
            ],
          },
        ],
      },
    ],
  },
];

// ================================================================
//  مسار 5 وحدات (بجروت، Modules E/F/G) — مستوى B2 (Independent User II).
//  المصدر: 5-point Bagrut Handbook (Feb 2025). Module E (016471) قراءة+مفردات (نفس 4 وحدات، B1)،
//  Module F (016583) أدب (رواية/مسرحية + 3 قصص + قصيدتان + 4 تقارير)،
//  Module G (016582) قراءة (450-500 كلمة، B2) + كتابة (120-140 كلمة).
//  الشفوي (COBE) مؤجّل. النصوص الأدبية أصلية للتدريب.
// ================================================================
export const ENGLISH_5UNIT: EnModule[] = [
  // ============================================================
  //  Module E (016471) — Reading (70%) + Vocabulary (30%)  [B1]
  // ============================================================
  {
    number: 16471,
    title: 'Module E — فهم مقروء ومفردات (016471)',
    description: 'فهم مقروء (نصّ حتى 400 كلمة، بلا قاموس، يشمل صح/خطأ مع تعليل) + مهمّة مفردات (Band I/II/III).',
    topics: [
      {
        order: 1,
        name: 'الفهم المقروء (Reading Comprehension)',
        lessons: [
          {
            order: 1,
            title: 'نصّ: The Rise of Electric Cars',
            skill: 'reading',
            passage:
              'THE RISE OF ELECTRIC CARS. Only a few years ago, electric cars were quite rare on our roads. Today, however, they are becoming a common sight, and many experts believe that they will soon replace petrol cars completely. But what has caused this change, and is it really good news? One of the main reasons for the growth of electric cars is concern about the environment. Petrol and diesel cars release harmful gases that pollute the air and contribute to climate change. Electric cars, on the other hand, produce no exhaust gases at all. In cities where thousands of cars drive every day, switching to electric vehicles could greatly improve the quality of the air we breathe. Another reason is cost. Although electric cars are often more expensive to buy, they are much cheaper to run. Electricity costs less than petrol, and electric cars have fewer moving parts, so they need less repair. Over several years, a driver can save a large amount of money. Of course, electric cars are not perfect. One common complaint is that they cannot travel very far before their batteries need charging. In addition, there are still not enough charging stations, especially in the countryside. However, technology is improving quickly. Newer models can travel further on a single charge, and governments around the world are building more charging stations every year. Some countries have even announced that they will ban the sale of new petrol cars in the near future. It seems clear that the age of the electric car has arrived. While there are still problems to solve, the benefits for our health, our environment and our wallets are simply too great to ignore.',
            exercises: [
              { kind: 'mcq', question: 'What is one of the main reasons for the growth of electric cars?', choices: ['concern about the environment', 'they are cheaper to buy', 'they are faster', 'they look better'], answer: 'concern about the environment' },
              { kind: 'reading', question: 'According to the text, why are electric cars cheaper to run than petrol cars?', answer: 'Electricity costs less than petrol, and electric cars have fewer moving parts, so they need less repair.' },
              { kind: 'mcq', question: 'What is one disadvantage of electric cars mentioned in the text?', choices: ['they cannot travel far before charging', 'they pollute the air', 'they are very cheap', 'they are too fast'], answer: 'they cannot travel far before charging' },
              { kind: 'reading', question: 'TRUE or FALSE? There are enough charging stations everywhere. Justify your answer from the text.', answer: "False. The text says 'there are still not enough charging stations, especially in the countryside.'" },
              { kind: 'mcq', question: 'How is technology changing electric cars, according to the text?', choices: ['newer models can travel further on a single charge', 'they are becoming more expensive', 'they produce more gases', 'they are getting slower'], answer: 'newer models can travel further on a single charge' },
              { kind: 'reading', question: 'What have some countries announced about petrol cars?', answer: 'They will ban the sale of new petrol cars in the near future.' },
              { kind: 'cloze', question: 'Complete from the text: Switching to electric vehicles could greatly improve the quality of the ___ we breathe.', answer: 'air' },
              { kind: 'mcq', question: "What is the writer's overall opinion of electric cars?", choices: ['their benefits are too great to ignore', 'they are a bad idea', 'they should be banned', 'they make no difference'], answer: 'their benefits are too great to ignore' },
            ],
          },
        ],
      },
      {
        order: 2,
        name: 'المفردات (Vocabulary — Band I/II/III)',
        lessons: [
          {
            order: 1,
            title: 'مفردات: كلمات في سياق',
            skill: 'vocab',
            exercises: [
              { kind: 'mcq', question: 'The government introduced a new ___ to reduce pollution. (an official plan or rule)', choices: ['policy', 'picnic', 'planet', 'parade'], answer: 'policy' },
              { kind: 'mcq', question: 'Solar and wind power are examples of ___ energy. (energy that will not run out)', choices: ['renewable', 'removable', 'reasonable', 'responsible'], answer: 'renewable' },
              { kind: 'cloze', question: 'We must reduce the ___ of plastic we use. (how much of something; noun starting with a)', answer: 'amount' },
              { kind: 'mcq', question: "A synonym for 'harmful' is ___.", choices: ['damaging', 'helpful', 'healthy', 'harmless'], answer: 'damaging' },
              { kind: 'cloze', question: 'Complete with the correct form: The company is trying to ___ its carbon emissions. (make lower; verb starting with r)', answer: 'reduce' },
            ],
          },
        ],
      },
    ],
  },
  // ============================================================
  //  Module F (016583) — Literature (internal)  [B2]
  // ============================================================
  {
    number: 16583,
    title: 'Module F — الأدب (016583)',
    description: 'الأدب (تقييم داخلي): رواية/مسرحية + 3 قصص + قصيدتان + 4 تقارير كتب. النصوص هنا أصلية للتدريب؛ النصوص المعتمدة رسميًا يضيفها المعلّم.',
    topics: [
      {
        order: 1,
        name: 'قراءة الأدب (Reading Literature)',
        lessons: [
          {
            order: 1,
            title: 'قصّة قصيرة: The Lighthouse Keeper',
            skill: 'reading',
            passage:
              "THE LIGHTHOUSE KEEPER (a short story). For thirty years, Elias had lived alone in the lighthouse on the edge of the cliffs. Every night, he climbed the two hundred steps to light the great lamp, so that ships could find their way safely home. The villagers rarely saw him, and some of the children believed he was a ghost. But Elias was not lonely. He had the sea, the wind, and the stars for company, and he was proud of his important work. One stormy winter night, the wind howled like a wild animal. Through the rain, Elias saw a small fishing boat struggling against the enormous waves. He knew at once that the men would drown unless someone helped them. Without hesitating, he ran down to the shore, pushed out his own tiny boat, and rowed into the darkness. The sea threw him up and down, and more than once he thought he would not survive. But at last he reached the fishermen and pulled them, one by one, into his boat. When the exhausted men reached the shore, the whole village was waiting. The next morning, the mayor came to thank Elias, but the old keeper only shook his head. 'A lighthouse is not just a lamp,' he said quietly. 'It is a promise. And I have never broken a promise in my life.' From that day on, the children no longer spoke of ghosts. Instead, they spoke of the brave old man who guarded their village from the top of the cliffs.",
            exercises: [
              { kind: 'mcq', question: "What was Elias's job?", choices: ['a lighthouse keeper', 'a fisherman', 'the village mayor', 'a teacher'], answer: 'a lighthouse keeper' },
              { kind: 'mcq', question: 'What did Elias do on the stormy night?', choices: ['he rowed out to rescue fishermen', 'he stayed inside the lighthouse', 'he called the police', 'he lit a bigger lamp'], answer: 'he rowed out to rescue fishermen' },
              { kind: 'reading', question: 'Why did the children stop speaking of ghosts?', answer: 'Because after the rescue they saw Elias as a brave old man who guarded their village, not a ghost.' },
              { kind: 'reading', question: "What did Elias mean when he said 'a lighthouse is a promise'? (personal response)", answer: "He meant that keeping the light on to protect ships is a duty he must never break. Accept any reasoned interpretation about duty, responsibility or keeping one's word." },
              { kind: 'mcq', question: 'Which word best describes Elias?', choices: ['brave', 'cruel', 'lazy', 'dishonest'], answer: 'brave' },
              { kind: 'cloze', question: 'The struggle in a story between opposing forces (e.g. Elias against the storm) is called the ___. (one word starting with c)', answer: 'conflict' },
            ],
          },
          {
            order: 2,
            title: 'قصيدة: The Old Oak',
            skill: 'reading',
            passage:
              "THE OLD OAK\n\nI have stood a hundred years or more,\nBeside this quiet country lane.\nI've watched the children of the past\nGrow old, and young ones come again.\n\nI've given shade in summer's heat,\nAnd shelter from the winter storm.\nBeneath my arms the lovers met;\nWithin my leaves the birds kept warm.\n\nThey say that soon a road will come,\nAnd I must fall so cars can pass.\nBut will they miss my whispered song,\nWhen all that's left is stone and glass?",
            exercises: [
              { kind: 'mcq', question: 'Who is the speaker of the poem?', choices: ['an old oak tree', 'a child', 'a farmer', 'a bird'], answer: 'an old oak tree' },
              { kind: 'reading', question: 'What has the tree given to people over the years?', answer: 'It has given shade in summer, shelter from winter storms, a meeting place for lovers and a home for birds.' },
              { kind: 'mcq', question: 'What is going to happen to the tree?', choices: ['it must fall to make way for a road', 'it will grow taller', 'it will be moved to a park', 'nothing will change'], answer: 'it must fall to make way for a road' },
              { kind: 'cloze', question: "Giving human qualities to a tree (letting it 'speak' and 'sing') is called ___. (one word starting with p)", answer: 'personification' },
              { kind: 'reading', question: 'What question does the tree ask at the end, and what does it suggest? (personal response)', answer: "It asks whether people will miss its song when only 'stone and glass' remain — suggesting that progress can destroy nature and something valuable may be lost. Accept any reasoned personal response." },
            ],
          },
          {
            order: 3,
            title: 'مصطلحات أدبية (Literary Terms)',
            skill: 'vocab',
            exercises: [
              { kind: 'mcq', question: 'A long story in book form, usually with many characters and events, is a ___.', choices: ['novel', 'poem', 'letter', 'review'], answer: 'novel' },
              { kind: 'mcq', question: 'A play is a story written to be ___.', choices: ['performed on a stage', 'sung', 'painted', 'eaten'], answer: 'performed on a stage' },
              { kind: 'cloze', question: 'The turning point of a story, its moment of highest tension, is called the ___. (one word starting with c)', answer: 'climax' },
              { kind: 'mcq', question: "The narrator who says 'I' and takes part in the story uses the ___ point of view.", choices: ['first-person', 'third-person', 'future', 'passive'], answer: 'first-person' },
            ],
          },
        ],
      },
      {
        order: 2,
        name: 'تقرير كتاب واستجابة شخصية (Book Report & Personal Response)',
        lessons: [
          {
            order: 1,
            title: 'كتابة: تقرير كتاب واستجابة',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: 'Write a book report (about 100 words) about a novel or story you have read. Include the title, the author, a summary, and explain which character you most identified with and why.', answer: 'Book report (B2): title + author + summary + which character the student identified with and why (Module F can-do); organized; about 100 words.' },
              { kind: 'writing', question: 'Choose a literary work you know. In about 90 words, describe the emotions a character experiences at an important moment and relate them to something in your own life.', answer: "Describes a character's emotions and relates them to the student's own experience (Module F personal response / bridging); about 90 words." },
            ],
          },
        ],
      },
    ],
  },
  // ============================================================
  //  Module G (016582) — Reading (60%, 450-500 words) + Writing (40%)  [B2]
  // ============================================================
  {
    number: 16582,
    title: 'Module G — فهم مقروء وكتابة (016582)',
    description: 'فهم مقروء متقدّم (نصّ 450-500 كلمة، B2) + تعبير كتابيّ (120-140 كلمة: رأي/مع وضدّ/قصّة/رسالة رسمية).',
    topics: [
      {
        order: 1,
        name: 'الفهم المقروء (Reading Comprehension — 450-500 words)',
        lessons: [
          {
            order: 1,
            title: 'نصّ: Should Zoos Exist?',
            skill: 'reading',
            passage:
              'SHOULD ZOOS EXIST? Few places attract families more than a zoo. Children press their faces against the glass to watch a sleeping tiger or laugh at the tricks of a clever monkey. Yet in recent years, more and more people have begun to question whether zoos should exist at all. The debate is not a simple one, and there are strong arguments on both sides. Those who support zoos point out that modern zoos are very different from the cruel animal prisons of the past. Today, good zoos play an important role in protecting endangered species. When an animal is close to extinction in the wild, zoos can breed it safely and, in some cases, return its young to their natural habitat. Zoos also carry out valuable scientific research and teach millions of visitors to care about wildlife. For many children who live in cities, a zoo is the only place where they will ever see a real elephant or lion, and this experience may inspire them to protect nature in the future. Critics, however, argue that no cage, however large, can replace the freedom of the wild. Many animals, they say, suffer from boredom and stress when they are kept in enclosures far smaller than their natural territory. Large animals such as elephants and polar bears, which naturally travel great distances, are particularly affected. Some critics also claim that zoos exist mainly to make money, and that education and conservation are simply excuses. They believe that the money spent on keeping animals in captivity would be better used to protect them in their natural homes. So who is right? Perhaps the answer lies not in closing all zoos, but in improving them. A well-run zoo that puts the welfare of its animals first, supports genuine conservation projects and educates the public can do a great deal of good. A badly run zoo that treats animals as mere entertainment cannot be defended. In the end, the question may not be whether zoos should exist, but what kind of zoos we are willing to accept.',
            exercises: [
              { kind: 'mcq', question: 'What is one argument in favour of zoos?', choices: ['they help protect endangered species', 'they make animals unhappy', 'they are cheap to run', 'they have no visitors'], answer: 'they help protect endangered species' },
              { kind: 'reading', question: 'According to the text, why might a zoo be especially valuable for children who live in cities?', answer: 'Because a zoo may be the only place where they will ever see a real elephant or lion, which may inspire them to protect nature.' },
              { kind: 'mcq', question: 'What is the main argument AGAINST zoos?', choices: ['no cage can replace the freedom of the wild', 'zoos are too small for visitors', 'animals live too long in zoos', 'zoos are boring for children'], answer: 'no cage can replace the freedom of the wild' },
              { kind: 'reading', question: 'TRUE or FALSE? The writer believes all zoos should be closed. Justify your answer from the text.', answer: "False. The writer says the answer 'lies not in closing all zoos, but in improving them.'" },
              { kind: 'mcq', question: 'Which animals do critics say are particularly affected by life in a zoo?', choices: ['large animals such as elephants and polar bears', 'small birds', 'fish', 'insects'], answer: 'large animals such as elephants and polar bears' },
              { kind: 'reading', question: 'According to the writer, what is the difference between a good zoo and a bad zoo?', answer: 'A good zoo puts animal welfare first, supports genuine conservation and educates the public; a bad zoo treats animals as mere entertainment.' },
              { kind: 'cloze', question: 'Complete from the text: The real question is not whether zoos should exist, but what ___ of zoos we are willing to accept.', answer: 'kind' },
              { kind: 'mcq', question: "How would you describe the writer's approach to the topic?", choices: ['balanced — he presents both sides', 'completely against zoos', 'completely in favour of zoos', 'not interested in the topic'], answer: 'balanced — he presents both sides' },
            ],
          },
          {
            order: 2,
            title: 'نصّ: The Woman Who Planted a Forest',
            skill: 'reading',
            passage:
              "THE WOMAN WHO PLANTED A FOREST. When Aisha first returned to her home village after many years in the city, she could hardly believe her eyes. The green hills she remembered from her childhood had turned into a dry, brown desert. The trees had been cut down for firewood and to make space for farming, and without them, the soil had blown away in the wind. The wells had dried up, and many families had left, unable to grow enough food to survive. Most people would have shaken their heads sadly and returned to the city. Aisha, however, decided to act. She had read that trees could bring life back to damaged land, and she was determined to try. With almost no money, she began to collect seeds and plant them, one by one, on the empty hillsides. At first, the villagers laughed at her. 'One woman cannot grow a forest,' they said. But Aisha did not give up. Every morning, before the sun grew too hot, she watered her young trees and protected them from hungry goats. Slowly, the tiny plants grew stronger. As the years passed, something remarkable happened. The first few trees became hundreds, and then thousands. Their roots held the soil in place, and their leaves gave shade and shelter. Birds and insects returned, and the water slowly came back to the wells. Seeing the change, the villagers stopped laughing and began to help. Together, they planted even more trees, until the brown hills were green once again. Today, Aisha's forest covers the land where nothing once grew, and families who had left have started to return. Scientists come from far away to study how one determined person brought a dead landscape back to life. When they ask Aisha for the secret of her success, she simply smiles. 'I did not plant a forest,' she tells them. 'I planted one tree, and then I planted another. That is all anyone can ever do.'",
            exercises: [
              { kind: 'mcq', question: 'What had happened to Aisha’s village while she was away?', choices: ['the green hills had turned into a dry desert', 'it had become a big city', 'it had been flooded', 'nothing had changed'], answer: 'the green hills had turned into a dry desert' },
              { kind: 'reading', question: 'Why had the soil blown away, according to the text?', answer: 'Because the trees had been cut down (for firewood and farming), and without them the soil blew away in the wind.' },
              { kind: 'mcq', question: 'How did the villagers react to Aisha at first?', choices: ['they laughed at her', 'they immediately helped her', 'they were angry with her', 'they paid her'], answer: 'they laughed at her' },
              { kind: 'reading', question: 'What remarkable change happened as the years passed?', answer: 'The few trees became thousands; their roots held the soil, birds and insects returned, and water came back to the wells, turning the brown hills green again.' },
              { kind: 'mcq', question: 'What is the main message of Aisha’s story?', choices: ['one determined person can make a huge difference', 'it is impossible to change nature', 'cities are better than villages', 'money is the key to success'], answer: 'one determined person can make a huge difference' },
              { kind: 'reading', question: "Explain what Aisha means by 'I planted one tree, and then I planted another.' (personal response)", answer: 'She means big change comes from small, patient, repeated actions — anyone can start by doing one small thing. Accept any reasoned personal response.' },
            ],
          },
        ],
      },
      {
        order: 2,
        name: 'الكتابة (Writing — 120-140 words)',
        lessons: [
          {
            order: 1,
            title: 'كتابة: رأي / مع وضدّ (Opinion / For and Against)',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: "Write a 'for and against' composition (120-140 words): the advantages and disadvantages of studying online. Present both sides and give your own conclusion.", answer: 'Module G rubric (B2): fully on topic; presents advantages AND disadvantages with a conclusion; well-organized and coherent; varied vocabulary, connecting words and appropriate register; correct basic and advanced structures; correct mechanics; 120-140 words.' },
              { kind: 'writing', question: "Write an opinion composition (120-140 words): 'Money is the most important thing in life.' Do you agree or disagree? Give reasons and examples.", answer: 'Clear opinion with reasons and examples; fully developed and organized; B2 vocabulary and structures; 120-140 words.' },
            ],
          },
          {
            order: 2,
            title: 'كتابة: قصّة / رسالة رسمية (Story / Formal Letter)',
            skill: 'writing',
            exercises: [
              { kind: 'writing', question: "Write a story (120-140 words) that begins with the sentence: 'I will never forget the day everything changed.'", answer: 'A coherent narrative (past tenses) developing from the given opening, with a clear beginning, middle and end; descriptive B2 vocabulary; 120-140 words.' },
              { kind: 'writing', question: 'Write a formal letter (120-140 words) to the mayor of your town suggesting a change that would improve your community. Explain the problem and your suggestion.', answer: 'Formal letter conventions (formal greeting and closing, formal register); explains a problem and a suggestion with reasons; organized; 120-140 words.' },
            ],
          },
        ],
      },
    ],
  },
];
