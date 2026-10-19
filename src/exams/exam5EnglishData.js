/**
 * @typedef {'mcq' | 'true-false' | 'short-answer'} QuestionType
 */

/**
 * @typedef {object} Question
 * @property {string} id
 * @property {QuestionType} type
 * @property {string} prompt
 * @property {string} [section] Sub-topic label shown on the question card
 * @property {string} [image] Optional image shown next to the prompt
 * @property {string[]} [options] Answer choices (required for mcq / true-false)
 * @property {number} [correctIndex] Index of the correct option (required for mcq / true-false)
 * @property {string[]} [acceptableAnswers] Accepted spellings (required for short-answer)
 */

/**
 * @typedef {object} Exam
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} durationSeconds Countdown length before auto-submit
 * @property {Question[]} questions
 */

/** @type {Question[]} */
export const QUESTION_BANK_5_ENGLISH = [
  {
    id: 'mcq5en-1',
    type: 'mcq',
    section: 'Unit 1: Plants',
    prompt: 'Why do seeds need water, air, light, and warmth?',
    options: [
      'A) To turn into hard rocks',
      'B) To sprout into seedlings and grow into mature plants',
      'C) To make loud sounds in the soil',
      'D) To stay frozen forever',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-2',
    type: 'mcq',
    section: 'Unit 1: Plants',
    prompt: 'Plants grow towards the sunlight __________ they need light to make food.',
    options: ['A) but', 'B) because', 'C) or', 'D) so'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-3',
    type: 'mcq',
    section: 'Unit 1: Plants',
    prompt: "What is the noun form created by adding '-th' to the adjective 'wide'?",
    options: ['A) wideth', 'B) width', 'C) widety', 'D) widening'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-4',
    type: 'mcq',
    section: 'Unit 2: Houses',
    prompt: 'Which type of house is built from solid blocks of ice in Arctic regions?',
    options: ['A) Yurt', 'B) Igloo', 'C) Stilt house', 'D) Apartment'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-5',
    type: 'mcq',
    section: 'Unit 2: Houses',
    prompt: 'My uncle lives __________ Canada and works __________ a bakery on Main Street.',
    options: ['A) at / on', 'B) in / at', 'C) on / in', 'D) at / in'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-6',
    type: 'mcq',
    section: 'Unit 2: Houses',
    prompt: 'What is the nationality term for a person from Korea?',
    options: ['A) Koreanish', 'B) Korean', 'C) Koreand', 'D) Korea'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-7',
    type: 'mcq',
    section: 'Unit 3: Birds',
    prompt: 'Which physical feature distinguishes birds from all other animals?',
    options: ['A) Scales', 'B) Feathers', 'C) Gills', 'D) Fur'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-8',
    type: 'mcq',
    section: 'Unit 3: Birds',
    prompt: 'Flightless birds like kiwis have wings, __________ they cannot fly.',
    options: ['A) and', 'B) but', 'C) or', 'D) because'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-9',
    type: 'mcq',
    section: 'Unit 3: Birds',
    prompt: "Which word uses the prefix 'un-' to mean 'not happy'?",
    options: ['A) Rehappy', 'B) Unhappy', 'C) Inhappy', 'D) Dishappy'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-10',
    type: 'mcq',
    section: 'Unit 4: Money',
    prompt:
      'Before coins and paper money existed, people traded goods directly using the __________ system.',
    options: ['A) banking', 'B) barter', 'C) digital', 'D) credit'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-11',
    type: 'mcq',
    section: 'Unit 4: Money',
    prompt: 'Do you have __________ coins in your piggy bank?',
    options: ['A) some', 'B) any', 'C) little', 'D) much'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-12',
    type: 'mcq',
    section: 'Unit 4: Money',
    prompt: 'Choose the correct homophone: I went to the store to __________ a new book.',
    options: ['A) bye', 'B) buy', 'C) by', 'D) bi'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-13',
    type: 'mcq',
    section: 'Unit 5: Matter',
    prompt: 'Which state of matter has a fixed volume but changes its shape to fit its container?',
    options: ['A) Solid', 'B) Liquid', 'C) Gas', 'D) Plasma'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-14',
    type: 'mcq',
    section: 'Unit 5: Matter',
    prompt:
      "Water is a non-count noun. Choose the correct quantifier: 'There is only __________ juice left in the bottle.'",
    options: ['A) a few', 'B) a little', 'C) many', 'D) few'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-15',
    type: 'mcq',
    section: 'Unit 5: Matter',
    prompt: "What adjective is formed by adding '-y' to the noun 'wind'?",
    options: ['A) windful', 'B) windy', 'C) windish', 'D) windless'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-16',
    type: 'mcq',
    section: 'Unit 6: Viruses',
    prompt: 'How do microscopic viruses like COVID-19 primarily spread between people?',
    options: [
      'A) Through airborne droplets or direct contact',
      'B) By eating cooked vegetables',
      'C) Through sunlight',
      'D) By washing hands frequently',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq5en-17',
    type: 'mcq',
    section: 'Unit 6: Viruses',
    prompt: "Change to Passive Voice: 'Doctors treat sick patients.'",
    options: [
      'A) Sick patients are treated by doctors.',
      'B) Doctors are treating sick patients.',
      'C) Sick patients treated doctors.',
      'D) Sick patients treating by doctors.',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq5en-18',
    type: 'mcq',
    section: 'Unit 6: Viruses',
    prompt:
      "What suffix is added to 'science' to form the occupation noun for a person who studies science?",
    options: ['A) -er (sciencer)', 'B) -ist (scientist)', 'C) -or (sciencor)', 'D) -ian (sciencian)'],
    correctIndex: 1,
  },
  {
    id: 'mcq5en-19',
    type: 'mcq',
    section: 'Unit 6: Viruses',
    prompt: "Change to Passive Voice: 'Face masks block harmful germs.'",
    options: [
      'A) Harmful germs are blocked by face masks.',
      'B) Harmful germs were blocking face masks.',
      'C) Face masks blocked by germs.',
      'D) Harmful germs block face masks.',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq5en-20',
    type: 'mcq',
    section: 'Unit 4: Money',
    prompt: 'Select the correct sentence with proper homophone usage:',
    options: [
      'A) The son shines brightly in the clear sky.',
      'B) The sun shines brightly in the clear sky.',
      'C) I can bye a bird at the pet shop.',
      'D) The sea is flying high above the trees.',
    ],
    correctIndex: 1,
  },
  {
    id: 'tf5en-1',
    type: 'true-false',
    section: 'Unit 1: Plants',
    prompt: "Adding the suffix '-th' to the adjective 'warm' forms the noun 'warmth'.",
    options: ['True', 'False'],
    correctIndex: 0,
  },
  {
    id: 'tf5en-2',
    type: 'true-false',
    section: 'Unit 2: Houses',
    prompt: "We use the preposition 'on' for large countries and cities (e.g., on Canada).",
    options: ['True', 'False'],
    correctIndex: 1,
  },
  {
    id: 'tf5en-3',
    type: 'true-false',
    section: 'Unit 3: Birds',
    prompt:
      "The prefix 'un-' changes a base word into its opposite meaning (e.g., happy -> unhappy).",
    options: ['True', 'False'],
    correctIndex: 0,
  },
  {
    id: 'tf5en-4',
    type: 'true-false',
    section: 'Unit 4: Money',
    prompt: 'Homophones are words that have different pronunciations but identical spellings.',
    options: ['True', 'False'],
    correctIndex: 1,
  },
  {
    id: 'tf5en-5',
    type: 'true-false',
    section: 'Unit 4: Money',
    prompt:
      "We generally use 'any' in negative sentences and questions, and 'some' in positive statements.",
    options: ['True', 'False'],
    correctIndex: 0,
  },
  {
    id: 'tf5en-6',
    type: 'true-false',
    section: 'Unit 5: Matter',
    prompt: 'Liquid has a fixed shape and cannot flow or change form.',
    options: ['True', 'False'],
    correctIndex: 1,
  },
  {
    id: 'tf5en-7',
    type: 'true-false',
    section: 'Unit 5: Matter',
    prompt: "Quantifiers like 'a few' and 'not many' are used with count nouns.",
    options: ['True', 'False'],
    correctIndex: 0,
  },
  {
    id: 'tf5en-8',
    type: 'true-false',
    section: 'Unit 5: Matter',
    prompt: "Adding the suffix '-y' to the verb 'stretch' forms the adjective 'stretchy'.",
    options: ['True', 'False'],
    correctIndex: 0,
  },
  {
    id: 'tf5en-9',
    type: 'true-false',
    section: 'Unit 6: Viruses',
    prompt: 'In passive voice sentences, the focus shifts to the receiver of the action.',
    options: ['True', 'False'],
    correctIndex: 0,
  },
  {
    id: 'tf5en-10',
    type: 'true-false',
    section: 'Unit 6: Viruses',
    prompt: "A person whose profession is cleaning buildings is called a 'cleanist'.",
    options: ['True', 'False'],
    correctIndex: 1,
  },
  {
    id: 'fb5en-1',
    type: 'short-answer',
    section: 'Unit 1: Plants',
    prompt:
      'Plants need air, water, and sunlight ____________________ (because / but) they require energy to grow.',
    acceptableAnswers: ['because'],
  },
  {
    id: 'fb5en-2',
    type: 'short-answer',
    section: 'Unit 1: Plants',
    prompt: "The noun form of the verb 'grow' is ____________________. (Add the suffix '-th')",
    acceptableAnswers: ['growth'],
  },
  {
    id: 'fb5en-3',
    type: 'short-answer',
    section: 'Unit 2: Houses',
    prompt:
      'My friend lives ____________________ (in / on / at) 12 Lake Street in a cozy house.',
    acceptableAnswers: ['at'],
  },
  {
    id: 'fb5en-4',
    type: 'short-answer',
    section: 'Unit 2: Houses',
    prompt: 'A person who belongs to Mongolia is called a ____________________. (Add nationality suffix)',
    acceptableAnswers: ['mongolian'],
  },
  {
    id: 'fb5en-5',
    type: 'short-answer',
    section: 'Unit 4: Money',
    prompt:
      'The word buy (to purchase) and the word ____________________ (a farewell greeting) are homophones.',
    acceptableAnswers: ['bye'],
  },
  {
    id: 'fb5en-6',
    type: 'short-answer',
    section: 'Unit 4: Money',
    prompt:
      'We do not have ____________________ (some / any) flour remaining in the cupboard.',
    acceptableAnswers: ['any'],
  },
  {
    id: 'fb5en-7',
    type: 'short-answer',
    section: 'Unit 5: Matter',
    prompt:
      "Because milk is a non-count noun, we say: 'There is only ____________________ (a little / a few) milk left.'",
    acceptableAnswers: ['a little'],
  },
  {
    id: 'fb5en-8',
    type: 'short-answer',
    section: 'Unit 5: Matter',
    prompt:
      "The weather today is very ____________________ (storm) with dark clouds in the sky. (Add suffix '-y')",
    acceptableAnswers: ['stormy'],
  },
  {
    id: 'fb5en-9',
    type: 'short-answer',
    section: 'Unit 6: Viruses',
    prompt:
      'Important scientific discoveries during the pandemic were made by a famous ____________________ (science + occupation suffix).',
    acceptableAnswers: ['scientist'],
  },
  {
    id: 'fb5en-10',
    type: 'short-answer',
    section: 'Unit 6: Viruses',
    prompt:
      "Active: 'Hygiene prevents sickness.' -> Passive: Sickness is ____________________ by hygiene.",
    acceptableAnswers: ['prevented'],
  },
]

const EXAM_5_ENGLISH_QUESTION_IDS = [
  'mcq5en-1',
  'mcq5en-2',
  'mcq5en-3',
  'mcq5en-4',
  'mcq5en-5',
  'mcq5en-6',
  'mcq5en-7',
  'mcq5en-8',
  'mcq5en-9',
  'mcq5en-10',
  'mcq5en-11',
  'mcq5en-12',
  'mcq5en-13',
  'mcq5en-14',
  'mcq5en-15',
  'mcq5en-16',
  'mcq5en-17',
  'mcq5en-18',
  'mcq5en-19',
  'mcq5en-20',
  'tf5en-1',
  'tf5en-2',
  'tf5en-3',
  'tf5en-4',
  'tf5en-5',
  'tf5en-6',
  'tf5en-7',
  'tf5en-8',
  'tf5en-9',
  'tf5en-10',
  'fb5en-1',
  'fb5en-2',
  'fb5en-3',
  'fb5en-4',
  'fb5en-5',
  'fb5en-6',
  'fb5en-7',
  'fb5en-8',
  'fb5en-9',
  'fb5en-10',
]

/** @type {Exam} */
export const EXAM_5_ENGLISH = {
  id: 'kuis-english-kelas-5',
  title: 'Grade 5 English',
  description:
    'Grade 5 English Comprehensive Exam (Units 1 to 6: Plants, Houses, Birds, Money, Matter & Viruses): 20 multiple choice, 10 true/false, and 10 fill-in-the-blank. Answer every question carefully!',
  durationSeconds: 2400,
  questions: EXAM_5_ENGLISH_QUESTION_IDS.map((id) =>
    QUESTION_BANK_5_ENGLISH.find((question) => question.id === id),
  ),
}
