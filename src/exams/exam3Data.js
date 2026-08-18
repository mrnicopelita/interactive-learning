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
export const QUESTION_BANK_3 = [
  {
    id: 'mcq3-1',
    type: 'mcq',
    prompt: 'Menguraikan masalah besar menjadi bagian-bagian yang lebih kecil dan mudah diselesaikan disebut...',
    options: ['Abstraksi', 'Dekomposisi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 1,
  },
  {
    id: 'mcq3-2',
    type: 'mcq',
    prompt:
      'Ani ingin membuat teh manis. Urutan langkah-langkah yang tepat untuk membuat teh dinamakan...',
    options: ['Algoritma', 'Pola', 'Kode', 'Abstraksi'],
    correctIndex: 0,
  },
  {
    id: 'mcq3-3',
    type: 'mcq',
    prompt:
      'Perhatikan urutan gambar berikut: [Segitiga, Persegi, Segitiga, Persegi, Segitiga, ...]\n\nBentuk selanjutnya yang benar adalah...',
    options: ['Lingkaran', 'Segitiga', 'Persegi', 'Bintang'],
    correctIndex: 2,
  },
  {
    id: 'mcq3-4',
    type: 'mcq',
    prompt:
      'Menghilangkan detail yang tidak penting dan hanya fokus pada informasi utama disebut...',
    options: ['Algoritma', 'Dekomposisi', 'Abstraksi', 'Pemrograman'],
    correctIndex: 2,
  },
  {
    id: 'mcq3-5',
    type: 'mcq',
    prompt: 'Budi mencari kaus kaki yang hilang di kamar. Langkah dekomposisi yang tepat adalah...',
    options: [
      'Membeli kaus kaki baru di toko',
      'Memeriksa tempat tidur, lemari, lalu bawah meja satu per satu',
      'Menangis karena tidak menemukan kaus kaki',
      'Langsung pergi ke sekolah tanpa kaus kaki',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq3-6',
    type: 'mcq',
    prompt:
      'Mengamati bahwa setiap hari Senin sekolah selalu mengadakan upacara bendera merupakan contoh dari...',
    options: ['Pengenalan Pola', 'Dekomposisi', 'Algoritma', 'Abstraksi'],
    correctIndex: 0,
  },
  {
    id: 'mcq3-7',
    type: 'mcq',
    prompt:
      'Saat menggambar peta rumah dari sekolah, kamu tidak perlu menggambar setiap daun di pohon jalanan. Ini adalah penerapan...',
    options: ['Algoritma', 'Abstraksi', 'Dekomposisi', 'Pengulangan'],
    correctIndex: 1,
  },
  {
    id: 'mcq3-8',
    type: 'mcq',
    prompt:
      'Jika robot diperintah: Maju 2 langkah → Belok kanan → Maju 1 langkah, maka robot akan sampai di tujuan. Instruksi berurutan ini disebut...',
    options: ['Pola', 'Algoritma', 'Abstraksi', 'Masalah'],
    correctIndex: 1,
  },
  {
    id: 'mcq3-9',
    type: 'mcq',
    prompt:
      'Membagi tugas membersihkan rumah (Adik menyapu, Kakak mengepel, Ibu memasak) adalah contoh...',
    options: ['Dekomposisi', 'Pola', 'Abstraksi', 'Algoritma'],
    correctIndex: 0,
  },
  {
    id: 'mcq3-10',
    type: 'mcq',
    prompt: 'Perhatikan urutan angka berikut: 2, 4, 6, 8, ...\n\nPola dari urutan angka di atas adalah...',
    options: ['Ditambah 1', 'Ditambah 2', 'Dikurangi 2', 'Dikali 2'],
    correctIndex: 1,
  },
  {
    id: 'mcq3-11',
    type: 'mcq',
    prompt: 'Apa yang terjadi jika urutan langkah dalam sebuah algoritma acak-acakan?',
    options: [
      'Hasilnya tetap sama',
      'Pekerjaan jadi lebih cepat',
      'Hasilnya bisa salah atau gagal',
      'Pekerjaan jadi lebih mudah',
    ],
    correctIndex: 2,
  },
  {
    id: 'mcq3-12',
    type: 'mcq',
    prompt:
      'Ketika kamu melihat kucing, harimau, dan singa sama-sama memiliki taring dan berkaki empat, kamu sedang melakukan...',
    options: ['Dekomposisi', 'Abstraksi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq3-13',
    type: 'mcq',
    prompt:
      'Langkah pertama dalam menyelesaikan masalah menggunakan berpikir komputasional adalah...',
    options: [
      'Membuang masalah',
      'Memahami dan membagi masalah menjadi lebih kecil',
      'Langsung menebak jawabannya',
      'Menulis kode komputer',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq3-14',
    type: 'mcq',
    prompt:
      'Ibu ingin membuat kue dadar gulung. Ibu mencatat bahan utama: tepung, telur, dan santan, tanpa mencatat warna wadah adonan. Hal ini termasuk...',
    options: ['Abstraksi', 'Algoritma', 'Dekomposisi', 'Pengulangan'],
    correctIndex: 0,
  },
  {
    id: 'mcq3-15',
    type: 'mcq',
    prompt: 'Manakah di bawah ini yang merupakan contoh algoritma dalam kehidupan sehari-hari?',
    options: [
      'Melipat baju secara asal-asalan',
      'Langkah-langkah mencuci tangan dengan benar',
      'Melamun di kelas',
      'Memilih warna pensil kesukaan',
    ],
    correctIndex: 1,
  },
  {
    id: 'tf3-1',
    type: 'true-false',
    prompt: 'Berpikir komputasional hanya bisa digunakan saat kita memakai komputer.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf3-2',
    type: 'true-false',
    prompt: 'Algoritma adalah urutan langkah-langkah logis untuk menyelesaikan masalah.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf3-3',
    type: 'true-false',
    prompt: 'Dekomposisi membantu kita menyelesaikan masalah rumit menjadi lebih mudah.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf3-4',
    type: 'true-false',
    prompt:
      'Mengetahui bahwa roda semua sepeda berbentuk lingkaran adalah contoh pengenalan pola.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf3-5',
    type: 'true-false',
    prompt:
      'Mengabaikan warna baju saat menghitung jumlah siswa di kelas adalah contoh dari abstraksi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf3-6',
    type: 'true-false',
    prompt: 'Urutan dalam algoritma boleh dibalik-balik tanpa mengubah hasil akhirnya.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf3-7',
    type: 'true-false',
    prompt: 'Resep makanan adalah salah satu contoh penerapan algoritma.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf3-8',
    type: 'true-false',
    prompt: 'Pengenalan pola membantu kita memprediksi apa yang akan terjadi selanjutnya.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf3-9',
    type: 'true-false',
    prompt: 'Abstraksi berarti kita harus mencatat semua detail sekecil apa pun.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf3-10',
    type: 'true-false',
    prompt:
      'Memecah mainan balok susun (Lego) yang besar menjadi tumpukan kecil berdasarkan warna adalah contoh dekomposisi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'fb3-1',
    type: 'short-answer',
    prompt:
      'Urutan langkah-langkah yang jelas dan sistematis untuk menyelesaikan suatu masalah disebut _______________.',
    acceptableAnswers: ['algoritma', 'algorithm'],
  },
  {
    id: 'fb3-2',
    type: 'short-answer',
    prompt:
      'Memecah masalah besar menjadi bagian-bagian kecil yang lebih sederhana disebut _______________.',
    acceptableAnswers: ['dekomposisi', 'decomposition'],
  },
  {
    id: 'fb3-3',
    type: 'short-answer',
    prompt:
      'Mencari kesamaan atau kemiripan bentuk, sifat, dan kejadian dari suatu hal disebut pengenalan _______________.',
    acceptableAnswers: ['pola', 'pattern'],
  },
  {
    id: 'fb3-4',
    type: 'short-answer',
    prompt:
      'Mengambil informasi yang penting dan membuang informasi yang tidak penting dinamakan _______________.',
    acceptableAnswers: ['abstraksi', 'abstraction'],
  },
  {
    id: 'fb3-5',
    type: 'short-answer',
    prompt: 'Lengkapilah pola berikut: Merah, Kuning, Hijau, Merah, Kuning, _______________.',
    acceptableAnswers: ['hijau'],
  },
]

const EXAM_3_QUESTION_IDS = [
  'mcq3-1',
  'mcq3-2',
  'mcq3-3',
  'mcq3-4',
  'mcq3-5',
  'mcq3-6',
  'mcq3-7',
  'mcq3-8',
  'mcq3-9',
  'mcq3-10',
  'mcq3-11',
  'mcq3-12',
  'mcq3-13',
  'mcq3-14',
  'mcq3-15',
  'tf3-1',
  'tf3-2',
  'tf3-3',
  'tf3-4',
  'tf3-5',
  'tf3-6',
  'tf3-7',
  'tf3-8',
  'tf3-9',
  'tf3-10',
  'fb3-1',
  'fb3-2',
  'fb3-3',
  'fb3-4',
  'fb3-5',
]

/** @type {Exam} */
export const EXAM_3 = {
  id: 'kuis-berpikir-komputasional-3',
  title: 'Kuis Berpikir Komputasional Kelas 3',
  description:
    'Soal kuis untuk kelas 3 SD: 15 pilihan ganda, 10 benar/salah, dan 5 isian singkat. Jawab semua soal dengan teliti!',
  durationSeconds: 1800,
  questions: EXAM_3_QUESTION_IDS.map((id) =>
    QUESTION_BANK_3.find((question) => question.id === id),
  ),
}
