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
export const QUESTION_BANK_4 = [
  {
    id: 'mcq4-1',
    type: 'mcq',
    prompt: 'Apa itu Computational Thinking?',
    options: [
      'Cara berpikir cepat saat mengetik di komputer.',
      'Cara menyelesaikan masalah secara teratur dan logis.',
      'Cara memperbaiki komputer yang rusak.',
      'Cara bermain game hingga menang.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq4-2',
    type: 'mcq',
    prompt: 'Memecah tugas besar menjadi bagian-bagian yang lebih kecil disebut...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Algoritma'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-3',
    type: 'mcq',
    prompt:
      'Sebelum menggambar rumah, Budi membuat daftar bagian yang harus digambar: atap, dinding, pintu, dan jendela. Kegiatan Budi ini menggunakan teknik...',
    options: ['Algoritma', 'Abstraksi', 'Dekomposisi', 'Pola'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-4',
    type: 'mcq',
    prompt:
      'Perhatikan urutan warna balon ini: Merah, Kuning, Hijau, Merah, Kuning, Hijau, Merah, ... Warna balon berikutnya adalah...',
    options: ['Merah', 'Kuning', 'Hijau', 'Biru'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-5',
    type: 'mcq',
    prompt: 'Menemukan kesamaan dari urutan warna balon di atas adalah contoh dari...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Debugging'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-6',
    type: 'mcq',
    prompt: 'Urutan langkah-langkah untuk menggosok gigi yang benar disebut...',
    options: ['Pola', 'Abstraksi', 'Algoritma', 'Dekomposisi'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-7',
    type: 'mcq',
    prompt: 'Mengabaikan informasi yang tidak penting dan hanya fokus pada hal utama disebut...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-8',
    type: 'mcq',
    prompt:
      'Saat menggambar peta dari rumah ke sekolah, kamu tidak menggambar setiap rumput di pinggir jalan. Kamu menerapkan...',
    options: ['Abstraksi', 'Dekomposisi', 'Algoritma', 'Koding'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-9',
    type: 'mcq',
    prompt:
      'Ibu membuat es sirup dengan urutan: Masukkan es batu -> Tuang sirup -> Tuang air -> Aduk. Urutan ini disebut...',
    options: ['Pola', 'Algoritma', 'Dekomposisi', 'Abstraksi'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-10',
    type: 'mcq',
    prompt:
      'Ketika kamu membuat kesalahan saat mengikat tali sepatu dan mencobanya lagi sampai berhasil, kamu sedang melakukan...',
    options: ['Debugging (Memperbaiki kesalahan)', 'Dekomposisi', 'Abstraksi', 'Pengenalan Pola'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-11',
    type: 'mcq',
    prompt:
      'Kamu ingin membereskan mainan. Kamu memisahkan mainan menjadi 3 kotak: Mobil-mobilan, Balok LEGO, dan Boneka. Kamu sedang melakukan...',
    options: ['Abstraksi', 'Pengelompokan (Sorting)', 'Algoritma', 'Debugging'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-12',
    type: 'mcq',
    prompt:
      'Kucing, Anjing, dan Kelinci sama-sama memiliki 4 kaki dan berbulu. Mengenali kesamaan ini disebut...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Algoritma'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-13',
    type: 'mcq',
    prompt:
      'Jika urutan memakai sepatu diubah menjadi: Memakai sepatu dulu baru memakai kaus kaki, apa yang terjadi?',
    options: [
      'Sepatu makin bersih.',
      'Urutannya salah dan sulit dilakukan.',
      'Tidak ada masalah.',
      'Kaus kaki makin rapi.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq4-14',
    type: 'mcq',
    prompt: 'Mana yang merupakan contoh "Algoritma" di sekolah?',
    options: [
      'Warna cat dinding kelas.',
      'Jadwal dan urutan piket kelas.',
      'Jumlah meja di kelas.',
      'Nama guru kelas.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq4-15',
    type: 'mcq',
    prompt: 'Mana di bawah ini yang BUKAN merupakan bagian dari Computational Thinking?',
    options: ['Dekomposisi', 'Algoritma', 'Menghafal lagu', 'Abstraksi'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-16',
    type: 'mcq',
    prompt:
      'Jika "A = Bintang", "B = Bulan", "C = Matahari", maka urutan "Matahari - Bintang - Bulan" dapat ditulis...',
    options: ['A - B - C', 'C - A - B', 'B - C - A', 'C - B - A'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-17',
    type: 'mcq',
    prompt:
      'Mencari buku cerita di perpustakaan yang disusun rapi berdasarkan abjad judulnya (A sampai Z) menggunakan prinsip...',
    options: ['Searching (Pencarian teratur)', 'Abstraksi', 'Dekomposisi', 'Random (Acak)'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-18',
    type: 'mcq',
    prompt: '"JIKA hujan, MAKA pakai jas hujan." Kalimat ini menunjukkan contoh aturan...',
    options: ['Pengulangan', 'Kondisional (Pilihan)', 'Dekomposisi', 'Abstraksi'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-19',
    type: 'mcq',
    prompt:
      'Setiap hari Senin sekolah mengadakan upacara bendera. Memprediksi bahwa Senin depan juga ada upacara adalah bentuk dari...',
    options: ['Pengenalan Pola', 'Abstraksi', 'Dekomposisi', 'Debugging'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-20',
    type: 'mcq',
    prompt: 'Siapa yang bisa menggunakan cara berpikir Computational Thinking?',
    options: [
      'Hanya komputer.',
      'Hanya guru matematika.',
      'Siapa saja untuk menyelesaikan masalah sehari-hari.',
      'Hanya pembuat game.',
    ],
    correctIndex: 2,
  },
  {
    id: 'tf4-1',
    type: 'true-false',
    prompt: 'Computational Thinking hanya dipakai saat kita menyalakan laptop atau komputer.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-2',
    type: 'true-false',
    prompt: 'Resep cara membuat mi instan adalah contoh dari algoritma.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-3',
    type: 'true-false',
    prompt: 'Dekomposisi membuat tugas sekolah yang sulit terasa lebih mudah dicicil.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-4',
    type: 'true-false',
    prompt: 'Dalam algoritma, urutan langkah-langkah boleh diacak sesuka hati tanpa mengubah hasil.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-5',
    type: 'true-false',
    prompt:
      'Saat menggambar wajah manusia, kita tidak perlu menggambar setiap pori-pori kulit. Ini adalah contoh abstraksi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-6',
    type: 'true-false',
    prompt:
      'Mengetahui bahwa roda sepeda, roda mobil, dan roda sepatu roda semuanya berbentuk lingkaran adalah contoh pengenalan pola.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-7',
    type: 'true-false',
    prompt: 'Debugging artinya membuang mainan yang rusak ke tempat sampah.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-8',
    type: 'true-false',
    prompt: 'Memilih jalan terpintas menuju kantin sekolah adalah contoh mencari solusi yang efektif.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-9',
    type: 'true-false',
    prompt: 'Abstraksi artinya memikirkan hal-hal yang tidak penting sebanyak mungkin.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-10',
    type: 'true-false',
    prompt: 'Berpikir komputasi membantu kita menjadi pemecah masalah (problem solver) yang baik.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'fb4-1',
    type: 'short-answer',
    prompt: 'Memecah masalah besar menjadi bagian-bagian kecil disebut ________.',
    acceptableAnswers: ['dekomposisi', 'decomposition'],
  },
  {
    id: 'fb4-2',
    type: 'short-answer',
    prompt:
      'Langkah-langkah berurutan untuk menyelesaikan suatu pekerjaan disebut ________.',
    acceptableAnswers: ['algoritma', 'algorithm'],
  },
  {
    id: 'fb4-3',
    type: 'short-answer',
    prompt:
      'Menghilangkan detail yang tidak penting dan hanya mengambil informasi utama disebut ________.',
    acceptableAnswers: ['abstraksi', 'abstraction'],
  },
  {
    id: 'fb4-4',
    type: 'short-answer',
    prompt:
      'Melihat keteraturan atau kesamaan bentuk, warna, atau kejadian disebut pengenalan ________.',
    acceptableAnswers: ['pola', 'pattern'],
  },
  {
    id: 'fb4-5',
    type: 'short-answer',
    prompt:
      'Proses mencari letak kesalahan pada suatu langkah dan memperbaikinya disebut ________.',
    acceptableAnswers: ['debugging'],
  },
]

const EXAM_4_QUESTION_IDS = [
  'mcq4-1',
  'mcq4-2',
  'mcq4-3',
  'mcq4-4',
  'mcq4-5',
  'mcq4-6',
  'mcq4-7',
  'mcq4-8',
  'mcq4-9',
  'mcq4-10',
  'mcq4-11',
  'mcq4-12',
  'mcq4-13',
  'mcq4-14',
  'mcq4-15',
  'mcq4-16',
  'mcq4-17',
  'mcq4-18',
  'mcq4-19',
  'mcq4-20',
  'tf4-1',
  'tf4-2',
  'tf4-3',
  'tf4-4',
  'tf4-5',
  'tf4-6',
  'tf4-7',
  'tf4-8',
  'tf4-9',
  'tf4-10',
  'fb4-1',
  'fb4-2',
  'fb4-3',
  'fb4-4',
  'fb4-5',
]

/** @type {Exam} */
export const EXAM_4 = {
  id: 'kuis-berpikir-komputasional-4',
  title: 'Kuis Berpikir Komputasional Kelas 4',
  description:
    'Soal kuis untuk kelas 4 SD: 20 pilihan ganda, 10 benar/salah, dan 5 isian singkat. Jawab semua soal dengan teliti!',
  durationSeconds: 1800,
  questions: EXAM_4_QUESTION_IDS.map((id) =>
    QUESTION_BANK_4.find((question) => question.id === id),
  ),
}
