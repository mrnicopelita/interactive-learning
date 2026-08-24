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
export const QUESTION_BANK_2 = [
  {
    id: 'mcq2-1',
    type: 'mcq',
    prompt: 'Urutan langkah-langkah yang teratur untuk menyelesaikan suatu pekerjaan disebut...',
    options: ['Dekomposisi', 'Algoritma', 'Abstraksi'],
    correctIndex: 1,
  },
  {
    id: 'mcq2-2',
    type: 'mcq',
    prompt:
      'Budi ingin merapikan kamar. Ia membagi tugasnya menjadi: merapikan tempat tidur, menyapu lantai, dan menata meja belajar. Cara Budi membagi tugas besar menjadi bagian-bagian kecil disebut...',
    options: ['Dekomposisi', 'Algoritma', 'Pengenalan Pola'],
    correctIndex: 0,
  },
  {
    id: 'mcq2-3',
    type: 'mcq',
    prompt:
      'Siti memperhatikan urutan warna lampu lalu lintas: Merah, Kuning, Hijau, Merah, Kuning, ...\n\nWarna selanjutnya yang akan menyala adalah...',
    options: ['Merah', 'Kuning', 'Hijau'],
    correctIndex: 2,
  },
  {
    id: 'mcq2-4',
    type: 'mcq',
    prompt:
      'Saat menggambar kucing di kertas, Rani hanya menggambar telinga, mata, kumis, dan ekor. Rani tidak menggambar kuman atau sel darah kucing. Tindakan fokus pada hal penting dan mengabaikan detail yang tidak penting disebut...',
    options: ['Abstraksi', 'Dekomposisi', 'Algoritma'],
    correctIndex: 0,
  },
  {
    id: 'mcq2-5',
    type: 'mcq',
    prompt:
      'Ibu memberi perintah: "JIKA hujan, MAKA pakai payung. JIKA TIDAK, pakai topi."\n\nSaat ini cuaca cerah (tidak hujan). Apa yang harus kamu pakai?',
    options: ['Payung', 'Topi', 'Jas hujan'],
    correctIndex: 1,
  },
  {
    id: 'mcq2-6',
    type: 'mcq',
    prompt:
      'Perhatikan pola bangun berikut: Lingkaran, Persegi, Lingkaran, Persegi, ...\n\nBangun berikutnya adalah...',
    options: ['Segitiga', 'Lingkaran', 'Persegi'],
    correctIndex: 1,
  },
  {
    id: 'mcq2-7',
    type: 'mcq',
    prompt:
      'Mengurutkan pensil dari yang paling pendek ke yang paling panjang adalah contoh kegiatan...',
    options: ['Searching (Pencarian)', 'Sorting (Pengurutan)', 'Debugging (Perbaikan)'],
    correctIndex: 1,
  },
  {
    id: 'mcq2-8',
    type: 'mcq',
    prompt:
      'Robot berada di kotak A1. Buah apel ada di kotak A4. Berapa langkah robot harus maju ke depan untuk sampai di buah apel?',
    options: ['2 langkah', '3 langkah', '4 langkah'],
    correctIndex: 1,
  },
  {
    id: 'mcq2-9',
    type: 'mcq',
    prompt:
      'Kamu mencari buku matematika di dalam tas sekolah yang penuh. Kegiatan menemukan benda yang dicari disebut...',
    options: ['Searching', 'Sorting', 'Coding'],
    correctIndex: 0,
  },
  {
    id: 'mcq2-10',
    type: 'mcq',
    prompt:
      'Perintah: "Melompatlah sebanyak 3 kali!"\nMelakukan tindakan yang sama berulang-ulang dalam komputer/algoritma disebut...',
    options: ['Pengulangan (Loop)', 'Percabangan (Condition)', 'Kesalahan (Bug)'],
    correctIndex: 0,
  },
  {
    id: 'mcq2-11',
    type: 'mcq',
    prompt: 'Langkah pertama yang paling tepat saat akan mencuci tangan adalah...',
    options: [
      'Mengeringkan tangan dengan lap',
      'Membasahi tangan dengan air mengalir',
      'Memakai sabun',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq2-12',
    type: 'mcq',
    prompt:
      'Jika petunjuk jalan mengarahkan kamu masuk ke jalan buntu, maka petunjuk tersebut mengalami kesalahan. Kesalahan dalam urutan perintah/program disebut...',
    options: ['Loop', 'Bug', 'Pattern'],
    correctIndex: 1,
  },
  {
    id: 'mcq2-13',
    type: 'mcq',
    prompt: 'Proses menemukan dan memperbaiki kesalahan pada perintah/program disebut...',
    options: ['Debugging', 'Coding', 'Matching'],
    correctIndex: 0,
  },
  {
    id: 'mcq2-14',
    type: 'mcq',
    prompt: 'Manakah di bawah ini yang menunjukkan pola berulang?',
    options: [
      'Merah, Biru, Hijau, Kuning',
      'Segitiga, Segitiga, Segitiga',
      'Bintang, Bulan, Bintang, Bulan',
    ],
    correctIndex: 2,
  },
  {
    id: 'mcq2-15',
    type: 'mcq',
    prompt:
      'Dino ingin membuat teh manis. Manakah urutan langkah (algoritma) yang benar?',
    options: [
      'Tuang air panas → Masukkan teh dan gula → Aduk hingga larut',
      'Aduk hingga larut → Tuang air panas → Masukkan teh',
      'Masukkan gula → Minum teh → Tuang air panas',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq2-16',
    type: 'mcq',
    prompt:
      'Saat mengelompokkan hewan: Kucing, Anjing, dan Kelinci dimasukkan ke dalam kelompok "Hewan Peliharaan". Tindakan mencari kesamaan ini disebut...',
    options: ['Pengenalan Pola', 'Dekomposisi', 'Abstraksi'],
    correctIndex: 0,
  },
  {
    id: 'mcq2-17',
    type: 'mcq',
    prompt:
      'Ibu berkata: "JIKA nilai ujianmu 100, MAKA kamu mendapat hadiah."\n\nDito mendapat nilai 90. Apakah Dito mendapat hadiah?',
    options: ['Ya', 'Tidak', 'Mungkin'],
    correctIndex: 1,
  },
  {
    id: 'mcq2-18',
    type: 'mcq',
    prompt: 'Mengapa urutan langkah dalam algoritma harus jelas dan runtut?',
    options: [
      'Agar hasilnya sesuai dengan yang diinginkan',
      'Agar pekerjaan menjadi lebih lambat',
      'Agar membingungkan orang lain',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq2-19',
    type: 'mcq',
    prompt: 'Manakah contoh kegiatan sorting (pengurutan) di kehidupan sehari-hari?',
    options: [
      'Menyusun sepatu berdasarkan ukurannya dari kecil ke besar',
      'Mencari kaos kaki warna putih di lemari',
      'Membagi tugas piket kelas',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq2-20',
    type: 'mcq',
    prompt:
      'Gambar peta menunjukkan petunjuk arah dari rumah ke sekolah. Peta menggambarkan jalan utama dan menghilangkan gambar pohon atau rumah warga. Peta adalah contoh dari...',
    options: ['Abstraksi', 'Loop', 'Bug'],
    correctIndex: 0,
  },
  {
    id: 'tf2-1',
    type: 'true-false',
    prompt: 'Algoritma adalah urutan langkah-langkah yang acak dan tidak berurutan.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf2-2',
    type: 'true-false',
    prompt: 'Memecah masalah besar menjadi bagian-bagian kecil disebut Dekomposisi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf2-3',
    type: 'true-false',
    prompt:
      'Mengabaikan informasi yang tidak penting saat menyelesaikan masalah disebut Abstraksi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf2-4',
    type: 'true-false',
    prompt: 'Pengulangan (Loop) digunakan untuk menjalankan perintah yang sama berkali-kali.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf2-5',
    type: 'true-false',
    prompt: 'Kesalahan dalam urutan perintah komputer disebut dengan istilah "Feature".',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf2-6',
    type: 'true-false',
    prompt:
      'Menyusun buku dari yang paling tebal ke paling tipis adalah contoh dari Sorting.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf2-7',
    type: 'true-false',
    prompt:
      'Mengikuti resep kue adalah salah satu contoh penerapan algoritma di kehidupan nyata.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf2-8',
    type: 'true-false',
    prompt:
      'Mencari nama teman pada daftar hadir kelas merupakan contoh kegiatan Searching.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf2-9',
    type: 'true-false',
    prompt:
      'Jika instruksi robot salah, robot akan tetap jalan dan membetulkan dirinya sendiri secara otomatis.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf2-10',
    type: 'true-false',
    prompt: 'Pola "1, 3, 5, 7" memiliki aturan bertambah 2 untuk setiap langkah berikutnya.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'match2-1',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nDEKOMPOSISI',
    options: [
      'Menggambar rumah hanya dengan garis dasar tanpa menggambar debu di dinding.',
      'Memperbaiki perintah robot yang menabrak tembok agar berjalan ke arah yang benar.',
      'Membagi tugas membuat mading menjadi: menulis artikel, menggambar, dan menempel hiasan.',
      'Mencari pensil warna merah di dalam kotak pensil.',
      'Mengetahui bahwa setiap hari Minggu sekolah selalu libur.',
    ],
    correctIndex: 2,
  },
  {
    id: 'match2-2',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nPENGENALAN POLA',
    options: [
      'Menggambar rumah hanya dengan garis dasar tanpa menggambar debu di dinding.',
      'Memperbaiki perintah robot yang menabrak tembok agar berjalan ke arah yang benar.',
      'Membagi tugas membuat mading menjadi: menulis artikel, menggambar, dan menempel hiasan.',
      'Mencari pensil warna merah di dalam kotak pensil.',
      'Mengetahui bahwa setiap hari Minggu sekolah selalu libur.',
    ],
    correctIndex: 4,
  },
  {
    id: 'match2-3',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nABSTRAKSI',
    options: [
      'Menggambar rumah hanya dengan garis dasar tanpa menggambar debu di dinding.',
      'Memperbaiki perintah robot yang menabrak tembok agar berjalan ke arah yang benar.',
      'Membagi tugas membuat mading menjadi: menulis artikel, menggambar, dan menempel hiasan.',
      'Mencari pensil warna merah di dalam kotak pensil.',
      'Mengetahui bahwa setiap hari Minggu sekolah selalu libur.',
    ],
    correctIndex: 0,
  },
  {
    id: 'match2-4',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nDEBUGGING',
    options: [
      'Menggambar rumah hanya dengan garis dasar tanpa menggambar debu di dinding.',
      'Memperbaiki perintah robot yang menabrak tembok agar berjalan ke arah yang benar.',
      'Membagi tugas membuat mading menjadi: menulis artikel, menggambar, dan menempel hiasan.',
      'Mencari pensil warna merah di dalam kotak pensil.',
      'Mengetahui bahwa setiap hari Minggu sekolah selalu libur.',
    ],
    correctIndex: 1,
  },
  {
    id: 'match2-5',
    type: 'mcq',
    section: 'Menjodohkan',
    prompt:
      'Jodohkan istilah berikut dengan arti/contoh yang tepat:\n\nSEARCHING',
    options: [
      'Menggambar rumah hanya dengan garis dasar tanpa menggambar debu di dinding.',
      'Memperbaiki perintah robot yang menabrak tembok agar berjalan ke arah yang benar.',
      'Membagi tugas membuat mading menjadi: menulis artikel, menggambar, dan menempel hiasan.',
      'Mencari pensil warna merah di dalam kotak pensil.',
      'Mengetahui bahwa setiap hari Minggu sekolah selalu libur.',
    ],
    correctIndex: 3,
  },
]

const EXAM_2_QUESTION_IDS = [
  'mcq2-1',
  'mcq2-2',
  'mcq2-3',
  'mcq2-4',
  'mcq2-5',
  'mcq2-6',
  'mcq2-7',
  'mcq2-8',
  'mcq2-9',
  'mcq2-10',
  'mcq2-11',
  'mcq2-12',
  'mcq2-13',
  'mcq2-14',
  'mcq2-15',
  'mcq2-16',
  'mcq2-17',
  'mcq2-18',
  'mcq2-19',
  'mcq2-20',
  'tf2-1',
  'tf2-2',
  'tf2-3',
  'tf2-4',
  'tf2-5',
  'tf2-6',
  'tf2-7',
  'tf2-8',
  'tf2-9',
  'tf2-10',
  'match2-1',
  'match2-2',
  'match2-3',
  'match2-4',
  'match2-5',
]

/** @type {Exam} */
export const EXAM_2 = {
  id: 'kuis-berpikir-komputasional-2',
  title: 'Kuis Berpikir Komputasional Kelas 2',
  description:
    'Soal kuis untuk kelas 2 SD: 20 pilihan ganda, 10 benar/salah, dan 5 menjodohkan. Jawab semua soal dengan teliti!',
  durationSeconds: 1800,
  questions: EXAM_2_QUESTION_IDS.map((id) =>
    QUESTION_BANK_2.find((question) => question.id === id),
  ),
}
