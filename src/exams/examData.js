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
    prompt: 'Budi ingin memakai sepatu ke sekolah. Apa yang harus Budi lakukan pertama kali?',
    options: ['Mengikat tali sepatu', 'Memakai kaus kaki', 'Langsung berjalan ke luar rumah'],
    correctIndex: 1,
  },
  {
    id: 'mcq-2',
    type: 'mcq',
    prompt: 'Ibu ingin membuat teh manis hangat. Urutan langkah yang benar adalah...',
    options: [
      'Masukkan teh → Tuang air hangat → Masukkan gula → Aduk',
      'Aduk → Tuang air hangat → Masukkan teh → Masukkan gula',
      'Tuang air hangat → Aduk → Masukkan gula → Masukkan teh',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq-3',
    type: 'mcq',
    prompt: 'Sebelum makan siang, Siti harus melakukan apa agar tangannya bersih?',
    options: ['Mengeringkan tangan dengan lap', 'Mencuci tangan memakai sabun dan air', 'Menggosok tangan ke baju'],
    correctIndex: 1,
  },
  {
    id: 'mcq-4',
    type: 'mcq',
    prompt:
      'Perhatikan urutan kegiatan di pagi hari: (1) Bangun tidur, (2) Mandi pagi, (3) Sarapan, (4) Berangkat ke sekolah. Apa yang kita lakukan setelah mandi pagi?',
    options: ['Bangun tidur', 'Sarapan', 'Berangkat ke sekolah'],
    correctIndex: 1,
  },
  {
    id: 'mcq-5',
    type: 'mcq',
    prompt:
      'Dini sedang belajar menggosok gigi. Lihat urutannya: (1) Ambil sikat gigi dan pasta gigi, (2) [...], (3) Berkumur dengan air bersih. Langkah nomor 2 yang hilang adalah...',
    options: ['Menggosok gigi sampai bersih', 'Memakai sepatu', 'Cuci muka'],
    correctIndex: 0,
  },
  {
    id: 'mcq-6',
    type: 'mcq',
    prompt:
      'Ayam bertelur, lalu telur menetas menjadi anak ayam, lalu anak ayam tumbuh menjadi ayam dewasa. Apa yang terjadi sebelum telur menetas?',
    options: ['Ayam menjadi tua', 'Ayam bertelur', 'Anak ayam terbang'],
    correctIndex: 1,
  },
  {
    id: 'mcq-7',
    type: 'mcq',
    prompt: 'Deno ingin merapikan tempat tidurnya sendiri. Tugas kecil apa saja yang harus Deno lakukan?',
    options: ['Melipat selimut dan menata bantal', 'Memasak air dan mencuci piring', 'Menyapu halaman dan menyiram bunga'],
    correctIndex: 0,
  },
  {
    id: 'mcq-8',
    type: 'mcq',
    prompt: 'Jika kamu ingin menyiapkan tas sekolah untuk besok, langkah kecil yang tidak perlu dilakukan adalah...',
    options: ['Memasukkan buku pelajaran sesuai jadwal', 'Memasukkan tempat pensil', 'Memasukkan mainan yang banyak'],
    correctIndex: 2,
  },
  {
    id: 'mcq-9',
    type: 'mcq',
    prompt: 'Ibu meminta Budi membersihkan kamar mandi. Mengurai tugas artinya...',
    options: [
      'Langsung menyerah karena tugasnya besar',
      'Membagi tugas menjadi menyapu lantai, menyikat bak, dan membuang sampah',
      'Menunggu kakak yang mengerjakan semuanya',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq-10',
    type: 'mcq',
    prompt: 'Perhatikan susunan buah berikut: Apel - Pisang - Apel - Pisang - Apel - ... Buah apakah yang selanjutnya?',
    options: ['Apel', 'Pisang', 'Jeruk'],
    correctIndex: 1,
  },
  {
    id: 'mcq-11',
    type: 'mcq',
    prompt: 'Perhatikan pola warna balon berikut: Merah - Kuning - Hijau - Merah - Kuning - ... Warna balon berikutnya adalah...',
    options: ['Hijau', 'Merah', 'Biru'],
    correctIndex: 0,
  },
  {
    id: 'mcq-12',
    type: 'mcq',
    prompt: 'Perhatikan bentuk bangun berikut: Segitiga - Lingkaran - Kotak - Segitiga - Lingkaran - ... Bangun apa yang harus diisi berikutnya?',
    options: ['Segitiga', 'Lingkaran', 'Kotak'],
    correctIndex: 2,
  },
  {
    id: 'mcq-13',
    type: 'mcq',
    prompt: 'Ani ingin menggambar pemandangan. Langkah pertama yang paling tepat sebelum mewarnai adalah...',
    options: ['Meraut pensil warna', 'Membuat sketsa gambar dengan pensil', 'Menghapus seluruh kertas'],
    correctIndex: 1,
  },
  {
    id: 'mcq-14',
    type: 'mcq',
    prompt: 'Menyiapkan sarapan roti bakar terdiri dari beberapa langkah kecil. Langkah mana yang salah urutannya?',
    options: ['Mengoles mentega sebelum memanggang roti', 'Memakan roti sebelum memanggangnya', 'Menaruh selai setelah roti matang'],
    correctIndex: 1,
  },
  {
    id: 'mcq-15',
    type: 'mcq',
    prompt: 'Perhatikan susunan angka berikut: 2 - 4 - 6 - 2 - 4 - 6 - 2 - ... Angka berapa yang muncul berikutnya?',
    options: ['4', '6', '2'],
    correctIndex: 0,
  },
  {
    id: 'mcq-16',
    type: 'mcq',
    prompt:
      'Instruksi untuk robot penyiram tanaman: (1) Jalan ke arah pot bunga, (2) Tuang air, (3) [ ? ]. Langkah nomor 3 yang paling tepat adalah...',
    options: ['Matikan keran dan berhenti', 'Petik bunganya', 'Injak tanamannya'],
    correctIndex: 0,
  },
  {
    id: 'tf-1',
    type: 'true-false',
    prompt: 'Algoritma adalah urutan langkah-langkah yang teratur untuk menyelesaikan suatu kegiatan.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf-2',
    type: 'true-false',
    prompt: 'Saat mencuci tangan, kita harus mengeringkan tangan dulu dengan lap sebelum memakai sabun.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf-3',
    type: 'true-false',
    prompt: 'Mengurai tugas artinya mengerjakan semua pekerjaan sekaligus tanpa dibagi-bagi.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf-4',
    type: 'true-false',
    prompt: 'Pada susunan Bintang - Bulan - Bintang - Bulan, gambar berikutnya adalah Bulan.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf-5',
    type: 'true-false',
    prompt: 'Mengikuti urutan langkah yang benar membantu kita menyelesaikan pekerjaan tanpa ada yang terlewat.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'fb-1',
    type: 'short-answer',
    prompt: 'Langkah pertama saat hendak masuk ke rumah setelah bermain di luar adalah melepas ________.',
    acceptableAnswers: ['sepatu', 'sandal', 'alas kaki'],
  },
  {
    id: 'fb-2',
    type: 'short-answer',
    prompt: 'Sebelum minum obat, kita harus ________ terlebih dahulu agar perut tidak sakit.',
    acceptableAnswers: ['makan', 'sarapan'],
  },
  {
    id: 'fb-3',
    type: 'short-answer',
    prompt: 'Jika ibu meminta merapikan mainan, tugas kecilnya adalah memasukkan mainan ke dalam ________ mainan.',
    acceptableAnswers: ['kotak', 'wadah', 'tempat'],
  },
  {
    id: 'fb-4',
    type: 'short-answer',
    prompt: 'Isilah bagian yang kosong: Topi - Sepatu - Topi - Sepatu - ________.',
    acceptableAnswers: ['topi'],
  },
  {
    id: 'fb-5',
    type: 'short-answer',
    prompt: 'Perhatikan pola gerakan: Tepuk Tangan - Hentak Kaki - Tepuk Tangan - ________.',
    acceptableAnswers: ['hentak kaki'],
  },
]

const EXAM_QUESTION_IDS = [
  'mcq-1',
  'mcq-2',
  'mcq-16',
  'mcq-4',
  'mcq-5',
  'mcq-6',
  'mcq-13',
  'mcq-14',
  'mcq-15',
  'mcq-10',
  'tf-1',
  'tf-2',
  'tf-3',
  'tf-4',
  'tf-5',
  'fb-1',
  'fb-2',
  'fb-3',
  'fb-4',
  'fb-5',
]

/** @type {Exam} */
export const EXAM = {
  id: 'kuis-berpikir-komputasional',
  title: 'Kuis Berpikir Komputasional',
  description: 'Soal kuis untuk kelas 1 & 2 SD. Jawab semua soal dengan teliti!',
  durationSeconds: 900,
  questions: EXAM_QUESTION_IDS.map((id) =>
    QUESTION_BANK.find((question) => question.id === id),
  ),
}
