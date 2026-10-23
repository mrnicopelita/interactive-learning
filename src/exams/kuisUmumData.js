/**
 * @typedef {'mcq' | 'true-false' | 'short-answer'} QuestionType
 */

/**
 * @typedef {object} Question
 * @property {string} id
 * @property {QuestionType} type
 * @property {string} prompt
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
export const QUESTION_BANK_KUIS_UMUM = [
  {
    id: 'umum-mcq-1',
    type: 'mcq',
    prompt:
      'Siapakah tokoh dunia yang dikenal sebagai pendiri perusahaan Microsoft dan pernah menjadi orang terkaya di dunia?',
    options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Elon Musk'],
    correctIndex: 1,
  },
  {
    id: 'umum-mcq-2',
    type: 'mcq',
    prompt:
      'Perusahaan teknologi Apple Inc. terkenal dengan produk smartphone miliknya yang bernama...',
    options: ['Galaxy', 'Xperia', 'iPhone', 'Redmi'],
    correctIndex: 2,
  },
  {
    id: 'umum-mcq-3',
    type: 'mcq',
    prompt:
      'Istilah "Bug" dalam dunia komputer pertama kali muncul karena ada masalah yang disebabkan oleh...',
    options: [
      'Serangan virus komputer',
      'Kabel listrik yang putus',
      'Serangga sungguhan yang masuk ke dalam mesin',
      'Disk yang berdebu',
    ],
    correctIndex: 2,
  },
  {
    id: 'umum-mcq-4',
    type: 'mcq',
    prompt:
      'Sistem operasi smartphone yang paling banyak digunakan di dunia saat ini dan dikembangkan oleh Google adalah...',
    options: ['iOS', 'Android', 'Windows Phone', 'Symbian'],
    correctIndex: 1,
  },
  {
    id: 'umum-mcq-5',
    type: 'mcq',
    prompt:
      'Apakah kepanjangan dari istilah WWW yang sering kita ketik saat membuka situs web?',
    options: [
      'World Wide Web',
      'World Wide Wifi',
      'Web World Wide',
      'World Web Wireless',
    ],
    correctIndex: 0,
  },
  {
    id: 'umum-mcq-6',
    type: 'mcq',
    prompt:
      'Tokoh penemu jejaring sosial Facebook yang kini memimpin perusahaan Meta adalah...',
    options: ['Jeff Bezos', 'Mark Zuckerberg', 'Sundar Pichai', 'Larry Page'],
    correctIndex: 1,
  },
  {
    id: 'umum-mcq-7',
    type: 'mcq',
    prompt:
      'Mesin pencari (Search Engine) yang paling populer dan paling banyak digunakan di seluruh dunia adalah...',
    options: ['Yahoo', 'Bing', 'Google', 'DuckDuckGo'],
    correctIndex: 2,
  },
  {
    id: 'umum-mcq-8',
    type: 'mcq',
    prompt:
      'Jenis kecerdasan buatan yang sedang populer saat ini karena mampu menjawab pertanyaan dan membuat teks seperti manusia dinamakan...',
    options: [
      'Artificial Intelligence (AI)',
      'Augmented Reality (AR)',
      'Virtual Reality (VR)',
      'Internet of Things (IoT)',
    ],
    correctIndex: 0,
  },
  {
    id: 'umum-mcq-9',
    type: 'mcq',
    prompt:
      'Perangkat keras (hardware) komputer yang berfungsi sebagai "otak" untuk memproses seluruh data dan perintah dinamakan...',
    options: ['RAM', 'Harddisk', 'CPU (Processor)', 'Monitor'],
    correctIndex: 2,
  },
  {
    id: 'umum-mcq-10',
    type: 'mcq',
    prompt:
      'Istilah yang merujuk pada upaya kejahatan berupa pencurian data pribadi melalui pesan atau link palsu dinamakan...',
    options: ['Spamming', 'Phishing', 'Debugging', 'Browsing'],
    correctIndex: 1,
  },
  {
    id: 'umum-mcq-11',
    type: 'mcq',
    prompt:
      'Aplikasi media sosial yang terkenal dengan fitur berbagi video pendek dan menggunakan algoritma rekomendasi musik sangat populer adalah...',
    options: ['LinkedIn', 'Twitter / X', 'TikTok', 'Pinterest'],
    correctIndex: 2,
  },
  {
    id: 'umum-mcq-12',
    type: 'mcq',
    prompt:
      'Teknologi penyimpanan data modern yang tersimpan di internet tanpa perlu menggunakan flashdisk fisik dinamakan...',
    options: ['Cloud Storage', 'Harddisk External', 'Memory Card', 'Floppy Disk'],
    correctIndex: 0,
  },
  {
    id: 'umum-mcq-13',
    type: 'mcq',
    prompt:
      'Bahasa pemrograman visual berbentuk blok warna-warna yang diciptakan khusus untuk pemula dan anak-anak adalah...',
    options: ['Python', 'Java', 'Scratch', 'C++'],
    correctIndex: 2,
  },
  {
    id: 'umum-mcq-14',
    type: 'mcq',
    prompt:
      'Siapakah pendiri perusahaan Tesla dan SpaceX yang juga mengandalkan AI serta teknologi tinggi?',
    options: ['Satya Nadella', 'Elon Musk', 'Tim Cook', 'Jack Ma'],
    correctIndex: 1,
  },
  {
    id: 'umum-mcq-15',
    type: 'mcq',
    prompt:
      'Satuan kapasitas penyimpanan data komputer yang paling besar di antara pilihan berikut adalah...',
    options: ['Megabyte (MB)', 'Gigabyte (GB)', 'Terabyte (TB)', 'Kilobyte (KB)'],
    correctIndex: 2,
  },
  {
    id: 'umum-mcq-16',
    type: 'mcq',
    prompt:
      'Aplikasi kecerdasan buatan (AI) berbasis obrolan (chat) buatan OpenAI yang mampu menjawab pertanyaan, membuat esai, hingga membantu coding adalah...',
    options: ['ChatGPT', 'Gemini', 'Claude', 'Midjourney'],
    correctIndex: 0,
  },
  {
    id: 'umum-mcq-17',
    type: 'mcq',
    prompt:
      'Aplikasi kecerdasan buatan buatan Google yang terintegrasi dengan berbagai layanan Google seperti Drive, Docs, dan Search adalah...',
    options: ['ChatGPT', 'Gemini', 'Copilot', 'DeepSeek'],
    correctIndex: 1,
  },
  {
    id: 'umum-mcq-18',
    type: 'mcq',
    prompt:
      'Aplikasi generator gambar berbasis AI yang memungkinkan pengguna membuat karya seni digital hanya dengan mengetikkan deskripsi teks adalah...',
    options: ['Canva', 'Midjourney', 'Photoshop', 'Figma'],
    correctIndex: 1,
  },
  {
    id: 'umum-mcq-19',
    type: 'mcq',
    prompt:
      'Aplikasi desain grafis berbasis web yang sangat populer karena menyediakan ribuan template siap pakai untuk presentasi, poster, hingga konten media sosial adalah...',
    options: ['Canva', 'CorelDraw', 'Paint', 'Illustrator'],
    correctIndex: 0,
  },
  {
    id: 'umum-mcq-20',
    type: 'mcq',
    prompt:
      'Aplikasi media sosial berbasis teks yang diluncurkan oleh Meta sebagai pesaing utama dari platform X (Twitter) adalah...',
    options: ['Threads', 'Discord', 'Telegram', 'Snapchat'],
    correctIndex: 0,
  },
  {
    id: 'umum-mcq-21',
    type: 'mcq',
    prompt:
      'Aplikasi komunikasi yang sangat populer di kalangan gamer dan komunitas untuk berkomunikasi via suara, teks, dan video melalui peladen (server) adalah...',
    options: ['WhatsApp', 'Discord', 'Zoom', 'Line'],
    correctIndex: 1,
  },
  {
    id: 'umum-mcq-22',
    type: 'mcq',
    prompt:
      'Aplikasi asisten kecerdasan buatan buatan Microsoft yang terintegrasi langsung ke dalam sistem operasi Windows 11 dan Microsoft 365 adalah...',
    options: ['Siri', 'Alexa', 'Copilot', 'Cortana'],
    correctIndex: 2,
  },
  {
    id: 'umum-mcq-23',
    type: 'mcq',
    prompt:
      'Aplikasi perpesanan instan berbasis enkripsi yang terkenal dengan fitur "Channel/Saluran" dan kapasitas berbagi file grup yang sangat besar adalah...',
    options: ['Telegram', 'Messenger', 'iMessage', 'SMS'],
    correctIndex: 0,
  },
  {
    id: 'umum-mcq-24',
    type: 'mcq',
    prompt:
      'Alat (tool) desain antarmuka aplikasi (UI/UX) berbasis kolaborasi real-time di web yang banyak digunakan oleh perancang aplikasi modern adalah...',
    options: ['Figma', 'Scratch', 'Blender', 'Word'],
    correctIndex: 0,
  },
  {
    id: 'umum-mcq-25',
    type: 'mcq',
    prompt:
      'Platform kecerdasan buatan (AI) asal Tiongkok yang belakangan ini sangat populer karena mampu memproses penalaran logis dan koding dengan cepat dan efisien adalah...',
    options: ['DeepSeek', 'Gemini', 'Copilot', 'ChatGPT'],
    correctIndex: 0,
  },
]

const KUIS_UMUM_QUESTION_IDS = [
  'umum-mcq-1',
  'umum-mcq-2',
  'umum-mcq-3',
  'umum-mcq-4',
  'umum-mcq-5',
  'umum-mcq-6',
  'umum-mcq-7',
  'umum-mcq-8',
  'umum-mcq-9',
  'umum-mcq-10',
  'umum-mcq-11',
  'umum-mcq-12',
  'umum-mcq-13',
  'umum-mcq-14',
  'umum-mcq-15',
  'umum-mcq-16',
  'umum-mcq-17',
  'umum-mcq-18',
  'umum-mcq-19',
  'umum-mcq-20',
  'umum-mcq-21',
  'umum-mcq-22',
  'umum-mcq-23',
  'umum-mcq-24',
  'umum-mcq-25',
]

/** @type {Exam} */
export const EXAM_KUIS_UMUM = {
  id: 'kuis-umum-smp',
  title: 'Kuis Umum',
  description:
    'Kuis Pengetahuan Umum Dunia IT untuk Kelas 7 SMP: 25 soal pilihan ganda. Waktu 45 menit. Pilihlah satu jawaban yang paling tepat!',
  durationSeconds: 2700,
  questions: KUIS_UMUM_QUESTION_IDS.map((id) =>
    QUESTION_BANK_KUIS_UMUM.find((question) => question.id === id),
  ),
}
