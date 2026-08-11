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
export const QUESTION_BANK_5 = [
  {
    id: 'mcq5-1',
    type: 'mcq',
    prompt: 'Mengapa kita perlu menerapkan Computational Thinking dalam kehidupan sehari-hari?',
    options: [
      'Agar kita bisa menghafal isi internet.',
      'Untuk membantu menyelesaikan masalah dengan cara yang terstruktur dan efisien.',
      'Supaya semua tugas sekolah bisa dikerjakan oleh komputer.',
      'Agar kita tidak perlu belajar matematika lagi.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq5-2',
    type: 'mcq',
    prompt:
      'Rani ingin membuat acara ulang tahun. Ia membagi persiapan menjadi: menentukan tamu, memesan kue, dan menyiapkan dekorasi. Teknik yang Rani gunakan adalah...',
    options: ['Algoritma', 'Abstraksi', 'Dekomposisi', 'Debugging'],
    correctIndex: 2,
  },
  {
    id: 'mcq5-3',
    type: 'mcq',
    prompt: 'Perhatikan deretan huruf berikut: A, C, E, G, ... Huruf berikutnya sesuai pola adalah...',
    options: ['H', 'I', 'J', 'K'],
    correctIndex: 1,
  },
  {
    id: 'mcq5-4',
    type: 'mcq',
    prompt: 'Menemukan bahwa huruf-huruf pada soal nomor 3 selalu melompati satu huruf adalah contoh dari...',
    options: ['Pengenalan Pola', 'Dekomposisi', 'Abstraksi', 'Pengurutan'],
    correctIndex: 0,
  },
  {
    id: 'mcq5-5',
    type: 'mcq',
    prompt:
      'Aplikasi peta jalan (GPS) menunjukkan jalan ke tujuan tanpa menampilkan warna rumah atau jenis kendaraan di sekitar. Ini adalah contoh dari...',
    options: ['Algoritma', 'Abstraksi', 'Dekomposisi', 'Debugging'],
    correctIndex: 1,
  },
  {
    id: 'mcq5-6',
    type: 'mcq',
    prompt: 'Langkah-langkah menyeduh mi instan yang tertera di belakang bungkus kemasan merupakan contoh dari...',
    options: ['Pola', 'Abstraksi', 'Algoritma', 'Percabangan'],
    correctIndex: 2,
  },
  {
    id: 'mcq5-7',
    type: 'mcq',
    prompt: 'Apa yang terjadi jika satu langkah penting dalam algoritma terlewatkan atau tertukar?',
    options: [
      'Hasil akhirnya pasti akan tetap sama.',
      'Hasil akhirnya bisa salah atau tidak sesuai harapan.',
      'Prosesnya menjadi lebih cepat tanpa masalah.',
      'Komputer akan langsung rusak.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq5-8',
    type: 'mcq',
    prompt:
      'Saat menyusun laporan kunjungan museum, kamu hanya mencatat informasi penting tentang benda sejarah dan mengabaikan menu makanan di kantin museum. Ini penerapan...',
    options: ['Dekomposisi', 'Abstraksi', 'Algoritma', 'Debugging'],
    correctIndex: 1,
  },
  {
    id: 'mcq5-9',
    type: 'mcq',
    prompt:
      'Setiap pagi, lampu lalu lintas menyala dengan urutan: Merah -> Hijau -> Kuning -> Merah. Keteraturan urutan warna ini disebut...',
    options: ['Algoritma', 'Pola', 'Abstraksi', 'Dekomposisi'],
    correctIndex: 1,
  },
  {
    id: 'mcq5-10',
    type: 'mcq',
    prompt:
      'Ketika kamu mencoba menjalankan instruksi permainan tetapi permainannya tidak berjalan dengan benar, lalu kamu mencari langkah yang salah untuk diperbaiki, kamu sedang melakukan...',
    options: ['Coding', 'Abstraksi', 'Debugging', 'Dekomposisi'],
    correctIndex: 2,
  },
  {
    id: 'mcq5-11',
    type: 'mcq',
    prompt: 'Pak Guru ingin merapikan nilai siswa dari yang tertinggi hingga yang terendah. Proses ini dalam berpikir komputasi disebut...',
    options: ['Sorting (Pengurutan)', 'Searching (Pencarian)', 'Dekomposisi', 'Abstraksi'],
    correctIndex: 0,
  },
  {
    id: 'mcq5-12',
    type: 'mcq',
    prompt:
      'Jika kamu memiliki 3 baju (Merah, Biru, Hijau) dan 2 celana (Hitam, Putih), berapa banyak kombinasi pasangan baju dan celana yang bisa kamu pakai?',
    options: ['5', '6', '8', '9'],
    correctIndex: 1,
  },
  {
    id: 'mcq5-13',
    type: 'mcq',
    prompt:
      'Dalam membuat robot pembersih lantai, pembuat robot mengajarkan robot untuk "kembali jika menabrak dinding". Perintah "JIKA menabrak dinding MAKA berbalik arah" adalah logika...',
    options: ['Pengulangan (Looping)', 'Kondisional (Percabangan)', 'Dekomposisi', 'Abstraksi'],
    correctIndex: 1,
  },
  {
    id: 'mcq5-14',
    type: 'mcq',
    prompt: 'Mengulangi suatu langkah dalam algoritma secara terus-menerus sampai kondisi tertentu terpenuhi disebut...',
    options: ['Looping (Pengulangan)', 'Debugging', 'Abstraksi', 'Dekomposisi'],
    correctIndex: 0,
  },
  {
    id: 'mcq5-15',
    type: 'mcq',
    prompt: 'Manakah di bawah ini yang merupakan contoh dari Dekomposisi?',
    options: [
      'Mengabaikan harga barang saat membeli mainan.',
      'Membagi tugas kelompok menjadi bagian riset, menulis, dan menggambar.',
      'Mengikuti petunjuk arah menuju stasiun.',
      'Menebak angka berikutnya dalam deretan angka.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq5-16',
    type: 'mcq',
    prompt:
      'Jika sandi rahasia "BOLA" diubah menjadi "CPMB" (setiap huruf diganti dengan huruf berikutnya dalam abjad), maka kata "BAPAK" akan menjadi...',
    options: ['CBQBL', 'DBQBL', 'CBQAL', 'C B Q B L'],
    correctIndex: 0,
  },
  {
    id: 'mcq5-17',
    type: 'mcq',
    prompt:
      'Mencari nama teman di dalam daftar kontak HP yang tersusun rapi sesuai huruf A-Z lebih cepat dilakukan karena memanfaatkan prinsip...',
    options: ['Pencarian Terstruktur (Searching)', 'Pengulangan (Looping)', 'Dekomposisi', 'Abstraksi'],
    correctIndex: 0,
  },
  {
    id: 'mcq5-18',
    type: 'mcq',
    prompt: 'Mengapa abstraksi sangat penting dalam menyelesaikan masalah?',
    options: [
      'Karena membuat semua detail terlihat rumit.',
      'Karena membantu kita fokus pada informasi yang benar-benar dibutuhkan.',
      'Karena menyuruh kita menghapus seluruh data yang ada.',
      'Karena menggantikan fungsi algoritma.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq5-19',
    type: 'mcq',
    prompt:
      'Ibu melihat bahwa setiap hari Jumat toko baju memberikan diskon. Ibu berencana membeli baju di hari Jumat depan agar mendapat diskon. Ibu menggunakan...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Debugging'],
    correctIndex: 1,
  },
  {
    id: 'mcq5-20',
    type: 'mcq',
    prompt: 'Pernyataan yang benar tentang Algoritma adalah...',
    options: [
      'Harus selalu ditulis dalam bahasa pemrogram komputer.',
      'Boleh dibuat acak tanpa urutan yang jelas.',
      'Adalah serangkaian langkah logis yang jelas untuk menyelesaikan tugas.',
      'Hanya bisa digunakan oleh ilmuwan sains.',
    ],
    correctIndex: 2,
  },
  {
    id: 'tf5-1',
    type: 'true-false',
    prompt: 'Berpikir komputasi berarti kita harus bertindak dan berpikir kaku seperti mesin atau komputer.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf5-2',
    type: 'true-false',
    prompt: 'Membuat jadwal kegiatan harian dari pagi sampai malam adalah contoh penerapan algoritma.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf5-3',
    type: 'true-false',
    prompt: 'Memecah masalah besar menjadi bagian-bagian kecil (dekomposisi) justru membuat masalah semakin rumit.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf5-4',
    type: 'true-false',
    prompt:
      'Pengenalan pola membantu kita memanfaatkan pengalaman masa lalu untuk memprediksi hal di masa depan.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf5-5',
    type: 'true-false',
    prompt: 'Abstraksi menyuruh kita untuk menyimpan dan memikirkan semua rincian kecil yang tidak relevan.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf5-6',
    type: 'true-false',
    prompt:
      'Menemukan dan memperbaiki kesalahan pada rumus matematika yang kita kerjakan adalah contoh dari debugging.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf5-7',
    type: 'true-false',
    prompt:
      'Logika "JIKA - MAKA" (If-Then) digunakan ketika ada pilihan kondisi yang berbeda dalam penyelesaian masalah.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf5-8',
    type: 'true-false',
    prompt:
      'Mengurutkan tinggi badan siswa dari yang terpendek ke tertinggi dinamakan proses searching.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf5-9',
    type: 'true-false',
    prompt: 'Algoritma yang baik harus memberikan hasil atau solusi yang jelas dan pasti.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf5-10',
    type: 'true-false',
    prompt: 'Konsep Computational Thinking hanya berguna dalam pelajaran Informatika atau Komputer saja.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'fb5-1',
    type: 'short-answer',
    prompt:
      'Proses membagi masalah rumit menjadi sub-masalah yang lebih kecil dan mudah dikerjakan disebut ________.',
    acceptableAnswers: ['dekomposisi', 'decomposition'],
  },
  {
    id: 'fb5-2',
    type: 'short-answer',
    prompt:
      'Serangkaian instruksi atau langkah-langkah sistematis untuk menyelesaikan suatu pekerjaan disebut ________.',
    acceptableAnswers: ['algoritma', 'algorithm'],
  },
  {
    id: 'fb5-3',
    type: 'short-answer',
    prompt:
      'Menyaring informasi dengan mengambil hal-hal penting dan membuang detail yang tidak relevan disebut ________.',
    acceptableAnswers: ['abstraksi', 'abstraction'],
  },
  {
    id: 'fb5-4',
    type: 'short-answer',
    prompt:
      'Kemampuan untuk melihat kesamaan, keteraturan, atau tren dalam data dinamakan pengenalan ________.',
    acceptableAnswers: ['pola', 'pattern'],
  },
  {
    id: 'fb5-5',
    type: 'short-answer',
    prompt:
      'Istilah untuk proses mendeteksi, mencari, dan memperbaiki kesalahan dalam suatu instruksi atau program adalah ________.',
    acceptableAnswers: ['debugging'],
  },
]

const EXAM_5_QUESTION_IDS = [
  'mcq5-1',
  'mcq5-2',
  'mcq5-3',
  'mcq5-4',
  'mcq5-5',
  'mcq5-6',
  'mcq5-7',
  'mcq5-8',
  'mcq5-9',
  'mcq5-10',
  'mcq5-11',
  'mcq5-12',
  'mcq5-13',
  'mcq5-14',
  'mcq5-15',
  'mcq5-16',
  'mcq5-17',
  'mcq5-18',
  'mcq5-19',
  'mcq5-20',
  'tf5-1',
  'tf5-2',
  'tf5-3',
  'tf5-4',
  'tf5-5',
  'tf5-6',
  'tf5-7',
  'tf5-8',
  'tf5-9',
  'tf5-10',
  'fb5-1',
  'fb5-2',
  'fb5-3',
  'fb5-4',
  'fb5-5',
]

/** @type {Exam} */
export const EXAM_5 = {
  id: 'kuis-berpikir-komputasional-5',
  title: 'Kuis Berpikir Komputasional Kelas 5',
  description:
    'Soal kuis untuk kelas 5 SD: 20 pilihan ganda, 10 benar/salah, dan 5 isian singkat. Jawab semua soal dengan teliti!',
  durationSeconds: 1800,
  questions: EXAM_5_QUESTION_IDS.map((id) =>
    QUESTION_BANK_5.find((question) => question.id === id),
  ),
}
