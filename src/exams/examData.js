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

/**
 * @typedef {object} StudentSubmission
 * @property {Record<string, string | number | null | undefined>} answers questionId -> option index (mcq / true-false) or text (short-answer)
 * @property {string[]} flaggedQuestionIds
 * @property {number} timeTakenSeconds
 */

/**
 * @typedef {object} QuestionResult
 * @property {string} questionId
 * @property {string} prompt
 * @property {string} [image]
 * @property {QuestionType} type
 * @property {string | null} givenAnswer
 * @property {string} correctAnswer
 * @property {boolean} correct
 */

/**
 * @typedef {object} ExamResult
 * @property {number} score
 * @property {number} total
 * @property {number} percentage
 * @property {number} timeTakenSeconds
 * @property {QuestionResult[]} results
 */

/** @type {Question[]} */
export const QUESTION_BANK = [
  {
    id: 'mcq-1',
    type: 'mcq',
    prompt: 'Urutan yang benar saat mau memakai sepatu adalah...',
    options: [
      'Pakai sepatu → Pakai kaos kaki',
      'Pakai kaos kaki → Pakai sepatu',
      'Pakai sepatu → Jalan-jalan',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq-2',
    type: 'mcq',
    prompt:
      'Lihat pola warna ini: Merah, Biru, Merah, Biru, ...\n\nWarna selanjutnya adalah...',
    options: ['Merah', 'Biru', 'Kuning'],
    correctIndex: 0,
  },
  {
    id: 'mcq-3',
    type: 'mcq',
    prompt:
      'Ani ingin membuat rumah dari balok mainan. Langkah pertama yang harus Ani buat adalah...',
    options: ['Atap rumah', 'Fondasi / alas bagian bawah', 'Jendela rumah'],
    correctIndex: 1,
  },
  {
    id: 'mcq-4',
    type: 'mcq',
    prompt:
      'Perhatikan pola buah berikut: Apel, Pisang, Apel, Pisang, ...\n\nBuah berikutnya adalah...',
    options: ['Jeruk', 'Pisang', 'Apel'],
    correctIndex: 2,
  },
  {
    id: 'mcq-5',
    type: 'mcq',
    prompt:
      'Ibu guru berkata: "JIKA hujan, MAKA kita main di dalam kelas."\n\nSekarang di luar sedang hujan deras. Di mana kita bermain?',
    options: ['Di lapangan', 'Di dalam kelas', 'Di taman'],
    correctIndex: 1,
  },
  {
    id: 'mcq-6',
    type: 'mcq',
    prompt:
      'Budi mengelompokkan benda: Pensil, Penghapus, dan Penggaris.\nBenda-benda ini termasuk kelompok...',
    options: ['Mainan', 'Alat tulis', 'Pakaian'],
    correctIndex: 1,
  },
  {
    id: 'mcq-7',
    type: 'mcq',
    prompt:
      'Robot berjalan: 1 langkah ke depan, lalu 1 langkah ke depan lagi.\nBerapa total langkah robot ke depan?',
    options: ['1 langkah', '2 langkah', '3 langkah'],
    correctIndex: 1,
  },
  {
    id: 'mcq-8',
    type: 'mcq',
    prompt: 'Urutkan benda dari yang paling KECIL ke yang paling BESAR:',
    options: [
      'Semut → Kucing → Gajah',
      'Gajah → Kucing → Semut',
      'Kucing → Semut → Gajah',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq-9',
    type: 'mcq',
    prompt:
      'Kamu mencari buku bergambar kucing di dalam tas. Benda apa yang kamu cari?',
    options: ['Tempat pensil', 'Buku gambar kucing', 'Botol minum'],
    correctIndex: 1,
  },
  {
    id: 'mcq-10',
    type: 'mcq',
    prompt: 'Langkah menggosok gigi yang benar adalah...',
    options: [
      'Oleskan pasta gigi → Sikat gigi → Kumur-kumur dengan air',
      'Kumur-kumur → Pakai sepatu → Sikat gigi',
      'Sikat gigi → Oleskan pasta gigi → Tidur',
    ],
    correctIndex: 0,
  },
  {
    id: 'tf-1',
    type: 'true-false',
    prompt:
      'Urutan mencuci tangan adalah basahi tangan dulu, lalu pakai sabun.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf-2',
    type: 'true-false',
    prompt:
      'Pola gambar "Bintang, Lingkaran, Bintang, Lingkaran" adalah pola yang berulang.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf-3',
    type: 'true-false',
    prompt:
      'Membagi mainan yang banyak menjadi kelompok-kelompok kecil membuat mainan lebih mudah dirapikan.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf-4',
    type: 'true-false',
    prompt:
      'Jika kita mengikuti resep masakan dengan urutan terbalik, hasilnya pasti tetap sama.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf-5',
    type: 'true-false',
    prompt:
      'Mengurutkan benda dari yang paling pendek ke paling panjang disebut sorting (pengurutan).',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf-6',
    type: 'true-false',
    prompt:
      'Bola basket dan bola sepak termasuk dalam kelompok alat mainan olahraga.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf-7',
    type: 'true-false',
    prompt:
      'Mengabaikan gambar awan saat menghitung jumlah mobil di kertas adalah contoh fokus pada hal penting.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf-8',
    type: 'true-false',
    prompt:
      'Jika perintah untuk robot salah, robot tetap bisa jalan dengan benar sendiri.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf-9',
    type: 'true-false',
    prompt: 'Pola angka: 1, 2, 3, 4 adalah angka yang makin lama makin kecil.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf-10',
    type: 'true-false',
    prompt:
      'Mencari baju merah di dalam lemari pakaian adalah contoh kegiatan searching (pencarian).',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'match-1',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nURUTAN LANGKAH (ALGORITMA)',
    options: [
      'Menyusun baju dari ukuran S, M, hingga L.',
      'Mencari boneka kesayangan di bawah tempat tidur.',
      'Langkah-langkah membuat susu: tuang air → masukkan susu → aduk.',
      'Membagi tugas membersihkan rumah bersama ayah dan ibu.',
      'Tahu bahwa setelah siang hari pasti datang malam hari.',
    ],
    correctIndex: 2,
  },
  {
    id: 'match-2',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nPENGENALAN POLA',
    options: [
      'Menyusun baju dari ukuran S, M, hingga L.',
      'Mencari boneka kesayangan di bawah tempat tidur.',
      'Langkah-langkah membuat susu: tuang air → masukkan susu → aduk.',
      'Membagi tugas membersihkan rumah bersama ayah dan ibu.',
      'Tahu bahwa setelah siang hari pasti datang malam hari.',
    ],
    correctIndex: 4,
  },
  {
    id: 'match-3',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nPENGURUTAN (SORTING)',
    options: [
      'Menyusun baju dari ukuran S, M, hingga L.',
      'Mencari boneka kesayangan di bawah tempat tidur.',
      'Langkah-langkah membuat susu: tuang air → masukkan susu → aduk.',
      'Membagi tugas membersihkan rumah bersama ayah dan ibu.',
      'Tahu bahwa setelah siang hari pasti datang malam hari.',
    ],
    correctIndex: 0,
  },
  {
    id: 'match-4',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nPENCARIAN (SEARCHING)',
    options: [
      'Menyusun baju dari ukuran S, M, hingga L.',
      'Mencari boneka kesayangan di bawah tempat tidur.',
      'Langkah-langkah membuat susu: tuang air → masukkan susu → aduk.',
      'Membagi tugas membersihkan rumah bersama ayah dan ibu.',
      'Tahu bahwa setelah siang hari pasti datang malam hari.',
    ],
    correctIndex: 1,
  },
  {
    id: 'match-5',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nDEKOMPOSISI',
    options: [
      'Menyusun baju dari ukuran S, M, hingga L.',
      'Mencari boneka kesayangan di bawah tempat tidur.',
      'Langkah-langkah membuat susu: tuang air → masukkan susu → aduk.',
      'Membagi tugas membersihkan rumah bersama ayah dan ibu.',
      'Tahu bahwa setelah siang hari pasti datang malam hari.',
    ],
    correctIndex: 3,
  },
]

const EXAM_QUESTION_IDS = [
  'mcq-1',
  'mcq-2',
  'mcq-3',
  'mcq-4',
  'mcq-5',
  'mcq-6',
  'mcq-7',
  'mcq-8',
  'mcq-9',
  'mcq-10',
  'tf-1',
  'tf-2',
  'tf-3',
  'tf-4',
  'tf-5',
  'tf-6',
  'tf-7',
  'tf-8',
  'tf-9',
  'tf-10',
  'match-1',
  'match-2',
  'match-3',
  'match-4',
  'match-5',
]

/** @type {Exam} */
export const EXAM = {
  id: 'kuis-berpikir-komputasional',
  title: 'Kuis Berpikir Komputasional Kelas 1',
  description:
    'Soal kuis untuk kelas 1 SD: 10 pilihan ganda, 10 benar/salah, dan 5 menjodohkan. Jawab semua soal dengan teliti!',
  durationSeconds: 1800,
  questions: EXAM_QUESTION_IDS.map((id) =>
    QUESTION_BANK.find((question) => question.id === id),
  ),
}
