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
    prompt:
      'Menguraikan masalah besar dan kompleks menjadi bagian-bagian kecil yang lebih mudah dikelola disebut...',
    options: ['Abstraksi', 'Dekomposisi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-2',
    type: 'mcq',
    prompt:
      'Ketika kamu memecah langkah-langkah membuat mi instan menjadi: merebus air, memasukkan mi, meracik bumbu, dan menyajikan, kamu sedang menerapkan proses...',
    options: ['Dekomposisi', 'Algoritma', 'Abstraksi', 'Pengenalan Pola'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-3',
    type: 'mcq',
    prompt:
      'Menghilangkan detail-detail yang tidak penting dan hanya fokus pada informasi utama disebut...',
    options: ['Dekomposisi', 'Abstraksi', 'Algoritma', 'Pengenalan Pola'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-4',
    type: 'mcq',
    prompt:
      'Ketika melihat peta rute bus, kita hanya melihat garis jalur dan nama pemberhentian tanpa melihat gambar pohon atau gedung di pinggir jalan. Ini adalah contoh dari...',
    options: ['Algoritma', 'Dekomposisi', 'Abstraksi', 'Pengenalan Pola'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-5',
    type: 'mcq',
    prompt:
      'Mencari kesamaan, kemiripan, atau keteraturan dalam suatu masalah merupakan pengertian dari...',
    options: ['Pengenalan Pola', 'Algoritma', 'Abstraksi', 'Dekomposisi'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-6',
    type: 'mcq',
    prompt:
      'Perhatikan urutan angka berikut: 2, 4, 6, 8, ...\n\nAngka berikutnya adalah 10. Kemampuan menemukan aturan penambahan 2 ini menggunakan pondasi...',
    options: ['Dekomposisi', 'Abstraksi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-7',
    type: 'mcq',
    prompt:
      'Urutan langkah-langkah logis dan sistematis untuk menyelesaikan suatu masalah disebut...',
    options: ['Dekomposisi', 'Algoritma', 'Abstraksi', 'Pengenalan Pola'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-8',
    type: 'mcq',
    prompt: 'Manakah di bawah ini yang merupakan contoh algoritma dalam kehidupan sehari-hari?',
    options: [
      'Gambar denah rumah',
      'Resep masakan yang disusun berurutan',
      'Daftar belanjaan yang acak',
      'Foto pemandangan alam',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq4-9',
    type: 'mcq',
    prompt:
      'Budi ingin membersihkan kamar tidurnya yang sangat berantakan. Ia membaginya menjadi beberapa tugas: merapikan tempat tidur, menyapu lantai, dan menata meja belajar. Langkah Budi ini menerapkan...',
    options: ['Abstraksi', 'Algoritma', 'Pengenalan Pola', 'Dekomposisi'],
    correctIndex: 3,
  },
  {
    id: 'mcq4-10',
    type: 'mcq',
    prompt:
      'Jika suatu algoritma tidak disusun secara berurutan (sistematis), maka kemungkinan yang akan terjadi adalah...',
    options: [
      'Hasilnya akan selalu tepat',
      'Masalah dapat diselesaikan lebih cepat',
      'Terjadi kesalahan (error) atau kegagalan hasil',
      'Komputer akan bekerja otomatis',
    ],
    correctIndex: 2,
  },
  {
    id: 'mcq4-11',
    type: 'mcq',
    prompt:
      'Perhatikan pola warna berikut: Merah, Kuning, Hijau, Merah, Kuning, Hijau, Merah, ...\n\nWarna berikutnya adalah...',
    options: ['Merah', 'Hijau', 'Kuning', 'Biru'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-12',
    type: 'mcq',
    prompt:
      'Dalam membuat algoritma menyikat gigi, langkah manakah yang harus dilakukan sebelum menggosokkan sikat ke gigi?',
    options: [
      'Berkumur dengan air bersih',
      'Menaruh pasta gigi di atas sikat gigi',
      'Menyimpan sikat gigi di tempatnya',
      'Mengeringkan mulut dengan handuk',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq4-13',
    type: 'mcq',
    prompt:
      'Saat menggambar sebuah mobil, kamu hanya fokus pada bentuk roda, kaca, dan badan mobil, tanpa menggambar molekul besi pembentuknya. Hal ini merupakan prinsip...',
    options: ['Abstraksi', 'Dekomposisi', 'Algoritma', 'Pengenalan Pola'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-14',
    type: 'mcq',
    prompt:
      'Robot bergerak dengan perintah: Maju 2 langkah → Belok Kanan → Maju 3 langkah. Perintah ini disebut...',
    options: ['Pengenalan Pola', 'Algoritma', 'Dekomposisi', 'Abstraksi'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-15',
    type: 'mcq',
    prompt: 'Mengapa berpikir komputasional penting untuk dipelajari?',
    options: [
      'Agar kita semua menjadi pemrogram komputer profesional',
      'Untuk membantu menyelesaikan masalah secara terstruktur dan efisien',
      'Agar tidak perlu lagi belajar matematika',
      'Untuk merusak sistem komputer',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq4-16',
    type: 'mcq',
    prompt:
      'Ani selalu bangun jam 05.00, mandi jam 05.15, dan sarapan jam 05.45 setiap hari sekolah. Kebiasaan berulang Ani ini menunjukkan prinsip...',
    options: ['Dekomposisi', 'Abstraksi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-17',
    type: 'mcq',
    prompt:
      'Sebuah instruksi tertulis atau simbolis yang menggambarkan jalurnya suatu algoritma sering digambarkan menggunakan...',
    options: ['Diagram Faktual', 'Bagan Alir (Flowchart)', 'Peta Buta', 'Tabel Perkalian'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-18',
    type: 'mcq',
    prompt:
      'Dalam flowchart, simbol berbentuk jajaran genjang biasanya digunakan untuk...',
    options: [
      'Mulai / Selesai',
      'Proses perhitungan',
      'Input / Output (Masukan / Keluaran)',
      'Keputusan (Decision)',
    ],
    correctIndex: 2,
  },
  {
    id: 'mcq4-19',
    type: 'mcq',
    prompt:
      'Diberikan instruksi: "Jika hujan, bawalah payung. Jika tidak hujan, pakailah topi." Ini adalah contoh struktur algoritma...',
    options: ['Pengulangan (Looping)', 'Percabangan (Condition/Selection)', 'Urutan sederhana (Sequence)', 'Dekomposisi'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-20',
    type: 'mcq',
    prompt:
      'Menemukan dan memperbaiki kesalahan dalam sebuah langkah algoritma atau program komputer disebut...',
    options: ['Debugging', 'Coding', 'Browsing', 'Downloading'],
    correctIndex: 0,
  },
  {
    id: 'tf4-1',
    type: 'true-false',
    prompt: 'Berpikir komputasional hanya bisa digunakan saat kita berada di depan komputer.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-2',
    type: 'true-false',
    prompt: 'Dekomposisi membuat masalah kompleks menjadi lebih rumit untuk diselesaikan.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-3',
    type: 'true-false',
    prompt:
      'Menyusun urutan langkah-langkah dalam membuat teh manis adalah penerapan algoritma.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-4',
    type: 'true-false',
    prompt: 'Abstraksi membantu kita fokus pada detail-detail kecil yang tidak penting.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-5',
    type: 'true-false',
    prompt:
      'Mengamati pola cuaca harian untuk memprediksi besok akan hujan atau cerah adalah contoh pengenalan pola.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-6',
    type: 'true-false',
    prompt:
      'Dalam algoritma, urutan langkah boleh dibolak-balik secara acak tanpa mempengaruhi hasil.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-7',
    type: 'true-false',
    prompt:
      'Debugging adalah proses mencari dan membetulkan kesalahan dalam langkah-langkah instruksi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-8',
    type: 'true-false',
    prompt:
      'Empat pilar utama berpikir komputasional adalah Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-9',
    type: 'true-false',
    prompt:
      'Simbol berbentuk elips/oval dalam flowchart digunakan untuk menunjukkan arah aliran proses.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-10',
    type: 'true-false',
    prompt:
      'Berpikir komputasional melatih kita untuk menyelesaikan masalah secara logis dan terstruktur.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'fb4-1',
    type: 'short-answer',
    prompt:
      'Empat pilar berpikir komputasional adalah Dekomposisi, Pengenalan Pola, Abstraksi, dan _______________.',
    acceptableAnswers: ['algoritma', 'algorithm'],
  },
  {
    id: 'fb4-2',
    type: 'short-answer',
    prompt:
      'Membagi tugas kelompok membuat kliping menjadi: mencari materi, menggunting gambar, dan menempel gambar dinamakan proses _______________.',
    acceptableAnswers: ['dekomposisi', 'decomposition'],
  },
  {
    id: 'fb4-3',
    type: 'short-answer',
    prompt:
      'Gambar bagan yang menunjukkan urutan langkah-langkah penyelesaian masalah dengan simbol-simbol tertentu disebut _______________.',
    acceptableAnswers: ['flowchart', 'bagan alir', 'flowchart / bagan alir'],
  },
  {
    id: 'fb4-4',
    type: 'short-answer',
    prompt:
      'Saat membuat ringkasan buku cerita, kamu hanya mencatat bagian-bagian pentingnya saja dan mengabaikan bagian hiasan. Hal ini menggunakan pilar _______________.',
    acceptableAnswers: ['abstraksi', 'abstraction'],
  },
  {
    id: 'fb4-5',
    type: 'short-answer',
    prompt:
      'Proses mengulang suatu perintah atau langkah secara terus-menerus sampai kondisi tertentu terpenuhi dalam algoritma disebut _______________ (looping).',
    acceptableAnswers: ['pengulangan'],
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
