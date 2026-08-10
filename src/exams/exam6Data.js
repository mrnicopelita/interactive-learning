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
export const QUESTION_BANK_6 = [
  {
    id: 'mcq6-1',
    type: 'mcq',
    section: 'Dekomposisi',
    prompt: 'Apa yang dimaksud dengan Decomposition (Dekomposisi) dalam Computational Thinking?',
    options: [
      'Menyembunyikan informasi yang tidak penting.',
      'Memecah masalah besar menjadi bagian-bagian yang lebih kecil dan mudah dikelola.',
      'Mencari kesamaan di antara beberapa masalah.',
      'Membuat langkah-langkah urutan penyelesaian masalah.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-2',
    type: 'mcq',
    section: 'Dekomposisi',
    prompt:
      'Saat kamu ingin membersihkan seluruh rumah, kamu membaginya menjadi tugas kecil: menyapu kamar, mengepel ruang tamu, dan mencuci piring. Teknik ini disebut...',
    options: ['Abstraksi', 'Algoritma', 'Dekomposisi', 'Pengenalan Pola'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-3',
    type: 'mcq',
    section: 'Pengenalan Pola',
    prompt:
      'Perhatikan deretan angka berikut: 3, 6, 9, 12, ... Angka berikutnya adalah 15. Proses menemukan aturan "+3" ini disebut...',
    options: ['Pengenalan Pola', 'Abstraksi', 'Pemrograman', 'Dekomposisi'],
    correctIndex: 0,
  },
  {
    id: 'mcq6-4',
    type: 'mcq',
    section: 'Abstraksi',
    prompt:
      'Dalam membuat peta jalan dari rumah ke sekolah, kita hanya menggambar jalan utama dan mengabaikan warna cat rumah orang atau jenis pohon di pinggir jalan. Ini adalah contoh...',
    options: ['Algoritma', 'Abstraksi', 'Dekomposisi', 'Evaluasi'],
    correctIndex: 1,
  },
  {
    id: 'mcq6-5',
    type: 'mcq',
    section: 'Algoritma',
    prompt: 'Urutan instruksi yang tepat untuk membuat segelas teh manis adalah contoh dari...',
    options: ['Pola', 'Abstraksi', 'Algoritma', 'Debugging'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-6',
    type: 'mcq',
    section: 'Algoritma',
    prompt:
      'Seorang koki sedang menulis resep masakan baru. Bagian resep yang berisi "Langkah-langkah memasak" merupakan penerapan dari...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Algoritma', 'Abstraksi'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-7',
    type: 'mcq',
    section: 'Pengenalan Pola',
    prompt:
      'Jika kamu melihat bahwa setiap kali mendung gelap maka akan turun hujan, kamu sedang melakukan...',
    options: ['Pengenalan Pola', 'Abstraksi', 'Dekomposisi', 'Koding'],
    correctIndex: 0,
  },
  {
    id: 'mcq6-8',
    type: 'mcq',
    section: 'Abstraksi',
    prompt: 'Apa tujuan utama dari Abstraksi?',
    options: [
      'Membuat masalah menjadi lebih rumit.',
      'Fokus pada informasi penting dan mengabaikan detail yang tidak relevan.',
      'Menemukan kesalahan dalam kode.',
      'Membagi tugas kepada teman kelompok.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-9',
    type: 'mcq',
    section: 'Algoritma',
    prompt: 'Manakah di bawah ini yang merupakan contoh algoritma di kehidupan sehari-hari?',
    options: [
      'Melihat pelangi di langit.',
      'Cara mencuci tangan yang benar menurut petunjuk kesehatan.',
      'Merasakan suhu udara yang panas.',
      'Membayangkan warna baju yang bagus.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-10',
    type: 'mcq',
    section: 'Debugging',
    prompt:
      '"Mencari kesalahan dalam sebuah langkah-langkah dan memperbaikinya" disebut dengan istilah...',
    options: ['Patterning', 'Coding', 'Debugging', 'Sorting'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-11',
    type: 'mcq',
    section: 'Dekomposisi',
    prompt:
      'Kamu ingin membangun mobil dari balok LEGO. Kamu memisahkan bagian roda, bagian badan, dan bagian mesin. Ini adalah proses...',
    options: ['Dekomposisi', 'Abstraksi', 'Algoritma', 'Pengenalan Pola'],
    correctIndex: 0,
  },
  {
    id: 'mcq6-12',
    type: 'mcq',
    section: 'Abstraksi',
    prompt:
      'Ada 4 kucing: Anggora, Persi, Maine Coon, dan Siam. Semuanya memiliki kesamaan: berkaki empat, berbulu, dan mengeong. Mengabaikan jenis rasnya dan menyebut mereka semua "Kucing" adalah...',
    options: ['Algoritma', 'Abstraksi', 'Dekomposisi', 'Pengenalan Pola'],
    correctIndex: 1,
  },
  {
    id: 'mcq6-13',
    type: 'mcq',
    section: 'Algoritma',
    prompt:
      'Perhatikan urutan ini: Bangun tidur -> Mandi -> Sarapan -> Berangkat sekolah. Jika urutan ini diubah menjadi: Berangkat sekolah -> Mandi -> Bangun tidur, maka hasilnya akan kacau. Ini menunjukkan pentingnya urutan yang benar dalam...',
    options: ['Pola', 'Abstraksi', 'Algoritma', 'Data'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-14',
    type: 'mcq',
    section: 'Pengenalan Pola',
    prompt:
      'Dalam Computational Thinking, "Pola" membantu kita untuk...',
    options: [
      'Membuat masalah jadi lebih sulit.',
      'Memprediksi apa yang akan terjadi selanjutnya atau mencari solusi yang serupa.',
      'Menghapus semua data.',
      'Menulis kode komputer.',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-15',
    type: 'mcq',
    section: 'Computational Thinking',
    prompt: 'Manakah yang BUKAN merupakan pilar dari Computational Thinking?',
    options: ['Dekomposisi', 'Abstraksi', 'Menghafal seluruh isi buku', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-16',
    type: 'mcq',
    section: 'Pengodean',
    prompt: 'Jika "A = 1", "B = 2", "C = 3", maka kode untuk kata "CAB" adalah...',
    options: ['123', '321', '312', '213'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-17',
    type: 'mcq',
    section: 'Sorting',
    prompt:
      'Kamu harus menyusun buku di perpustakaan berdasarkan abjad nama pengarang dari A sampai Z. Proses ini dalam berpikir komputasi disebut...',
    options: ['Sorting (Pengurutan)', 'Searching (Pencarian)', 'Abstraksi', 'Dekomposisi'],
    correctIndex: 0,
  },
  {
    id: 'mcq6-18',
    type: 'mcq',
    section: 'Logika',
    prompt:
      'Jika "Jika hari hujan, maka saya memakai payung. Jika tidak hujan, saya tidak memakai payung." Pernyataan ini merupakan logika dasar...',
    options: ['Pengulangan (Loop)', 'Percabangan (Kondisional)', 'Dekomposisi', 'Abstraksi'],
    correctIndex: 1,
  },
  {
    id: 'mcq6-19',
    type: 'mcq',
    section: 'Pengenalan Pola',
    prompt:
      'Seorang animator ingin menggambar karakter manusia berjalan. Ia memperhatikan bahwa setiap langkah melibatkan gerakan kaki dan tangan yang berulang. Ia menggunakan prinsip...',
    options: ['Pengenalan Pola', 'Abstraksi', 'Algoritma', 'Dekomposisi'],
    correctIndex: 0,
  },
  {
    id: 'mcq6-20',
    type: 'mcq',
    section: 'Computational Thinking',
    prompt: 'Computational Thinking adalah cara berpikir untuk...',
    options: [
      'Menjadi robot.',
      'Menyelesaikan masalah secara logis dan terstruktur seperti cara kerja komputer.',
      'Bermain game seharian.',
      'Memperbaiki komputer yang rusak secara fisik.',
    ],
    correctIndex: 1,
  },
  {
    id: 'tf6-1',
    type: 'true-false',
    section: 'Computational Thinking',
    prompt: 'Computational Thinking hanya bisa digunakan saat kita sedang menggunakan komputer.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf6-2',
    type: 'true-false',
    section: 'Algoritma',
    prompt: 'Algoritma harus disusun secara berurutan agar mencapai tujuan yang diinginkan.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-3',
    type: 'true-false',
    section: 'Dekomposisi',
    prompt:
      'Dekomposisi membuat sebuah masalah besar terlihat lebih menakutkan dan sulit diselesaikan.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf6-4',
    type: 'true-false',
    section: 'Logika',
    prompt:
      'Memilih baju yang akan dipakai berdasarkan cuaca (cerah atau hujan) adalah contoh berpikir logis.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-5',
    type: 'true-false',
    section: 'Abstraksi',
    prompt:
      'Dalam abstraksi, kita harus memasukkan semua detail sekecil apa pun agar informasi lengkap.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf6-6',
    type: 'true-false',
    section: 'Pengenalan Pola',
    prompt:
      'Menemukan kesamaan antara cara membuat kue donat dan kue bolu adalah contoh pengenalan pola.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-7',
    type: 'true-false',
    section: 'Debugging',
    prompt:
      'Debugging adalah proses untuk mencari dan memperbaiki kesalahan dalam suatu prosedur.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-8',
    type: 'true-false',
    section: 'Algoritma',
    prompt:
      'Langkah-langkah untuk melakukan pembagian kurung dalam matematika adalah sebuah algoritma.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-9',
    type: 'true-false',
    section: 'Abstraksi',
    prompt:
      'Abstraksi membantu kita untuk tidak membuang waktu pada hal-hal yang tidak penting bagi solusi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-10',
    type: 'true-false',
    section: 'Computational Thinking',
    prompt:
      'Computational Thinking hanya bermanfaat bagi orang yang ingin menjadi pemrogram (programmer).',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'fb6-1',
    type: 'short-answer',
    section: 'Dekomposisi',
    prompt:
      'Metode memecah masalah kompleks menjadi bagian-bagian kecil yang lebih sederhana disebut ________.',
    acceptableAnswers: ['dekomposisi', 'decomposition'],
  },
  {
    id: 'fb6-2',
    type: 'short-answer',
    section: 'Algoritma',
    prompt:
      'Langkah-langkah logis dan sistematis yang disusun untuk menyelesaikan sebuah masalah disebut ________.',
    acceptableAnswers: ['algoritma', 'algorithm'],
  },
  {
    id: 'fb6-3',
    type: 'short-answer',
    section: 'Abstraksi',
    prompt:
      'Proses mengenali karakteristik umum dari suatu benda dan mengabaikan detail yang tidak relevan disebut ________.',
    acceptableAnswers: ['abstraksi', 'abstraction'],
  },
  {
    id: 'fb6-4',
    type: 'short-answer',
    section: 'Pengenalan Pola',
    prompt:
      'Jika kamu melihat seekor burung mempunyai sayap dan bisa terbang, lalu kamu menyimpulkan burung lain juga punya sayap dan bisa terbang, kamu menggunakan teknik ________.',
    acceptableAnswers: ['pengenalan pola', 'pattern recognition'],
  },
  {
    id: 'fb6-5',
    type: 'short-answer',
    section: 'Debugging',
    prompt:
      'Saat sebuah program atau rencana tidak berjalan sesuai harapan, kita perlu melakukan ________ untuk menemukan di mana letak kesalahannya.',
    acceptableAnswers: ['debugging'],
  },
]

const EXAM_6_QUESTION_IDS = [
  'mcq6-1',
  'mcq6-2',
  'mcq6-3',
  'mcq6-4',
  'mcq6-5',
  'mcq6-6',
  'mcq6-7',
  'mcq6-8',
  'mcq6-9',
  'mcq6-10',
  'mcq6-11',
  'mcq6-12',
  'mcq6-13',
  'mcq6-14',
  'mcq6-15',
  'mcq6-16',
  'mcq6-17',
  'mcq6-18',
  'mcq6-19',
  'mcq6-20',
  'tf6-1',
  'tf6-2',
  'tf6-3',
  'tf6-4',
  'tf6-5',
  'tf6-6',
  'tf6-7',
  'tf6-8',
  'tf6-9',
  'tf6-10',
  'fb6-1',
  'fb6-2',
  'fb6-3',
  'fb6-4',
  'fb6-5',
]

/** @type {Exam} */
export const EXAM_6 = {
  id: 'kuis-berpikir-komputasional-6',
  title: 'Kuis Berpikir Komputasional Kelas 6',
  description:
    'Soal kuis untuk kelas 6 SD: 20 pilihan ganda, 10 benar/salah, dan 5 isian singkat. Jawab semua soal dengan teliti!',
  durationSeconds: 1800,
  questions: EXAM_6_QUESTION_IDS.map((id) =>
    QUESTION_BANK_6.find((question) => question.id === id),
  ),
}
