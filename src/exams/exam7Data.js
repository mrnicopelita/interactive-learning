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
export const QUESTION_BANK_7 = [
  {
    id: 'mcq7-1',
    type: 'mcq',
    prompt: 'Empat pilar utama dalam Berpikir Komputasional adalah...',
    options: [
      'Dekomposisi, Abstraksi, Algoritma, dan Coding',
      'Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma',
      'Logika, Matematika, Pemrograman, dan Desain',
      'Pengenalan Pola, Input, Proses, dan Output',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq7-2',
    type: 'mcq',
    prompt:
      'Proses memecah masalah kompleks menjadi bagian-bagian kecil yang lebih mudah dikelola disebut...',
    options: ['Abstraksi', 'Dekomposisi', 'Algoritma', 'Pengenalan Pola'],
    correctIndex: 1,
  },
  {
    id: 'mcq7-3',
    type: 'mcq',
    prompt:
      'Saat menyusun jadwal pelajaran harian, kamu hanya mencatat nama mata pelajaran tanpa mencatat warna sampul buku. Proses mengabaikan detail yang tidak penting ini disebut...',
    options: ['Abstraksi', 'Dekomposisi', 'Algoritma', 'Pengenalan Pola'],
    correctIndex: 0,
  },
  {
    id: 'mcq7-4',
    type: 'mcq',
    prompt:
      'Mengenali persamaan atau kemiripan antara suatu masalah dengan masalah yang pernah diselesaikan sebelumnya adalah proses...',
    options: ['Dekomposisi', 'Abstraksi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq7-5',
    type: 'mcq',
    prompt:
      'Urutan langkah-langkah logis dan sistematis untuk menyelesaikan suatu masalah disebut...',
    options: ['Abstraksi', 'Algoritma', 'Dekomposisi', 'Diagram'],
    correctIndex: 1,
  },
  {
    id: 'mcq7-6',
    type: 'mcq',
    prompt:
      'Simbol flowchart yang digunakan untuk menandai awal (Start) atau akhir (End) dari suatu aliran proses dinamakan...',
    options: ['Process', 'Input/Output', 'Terminal', 'Decision'],
    correctIndex: 2,
  },
  {
    id: 'mcq7-7',
    type: 'mcq',
    prompt:
      'Simbol flowchart berbentuk belah ketupat (Diamond) berfungsi untuk...',
    options: [
      'Memulai program',
      'Memasukkan input data',
      'Mengambil keputusan / kondisi (Decision)',
      'Menampilkan hasil output',
    ],
    correctIndex: 2,
  },
  {
    id: 'mcq7-8',
    type: 'mcq',
    prompt:
      'Jika sebuah alur flowchart memerlukan masukan berupa nama siswa dari pengguna, simbol yang digunakan berbentuk...',
    options: ['Oval', 'Jajaran Genjang', 'Persegi Panjang', 'Belah Ketupat'],
    correctIndex: 1,
  },
  {
    id: 'mcq7-9',
    type: 'mcq',
    prompt:
      'Simbol flowchart berbentuk persegi panjang digunakan untuk menggambarkan...',
    options: [
      'Proses penghitungan atau pengolahan data',
      'Keputusan kondisi (Ya/Tidak)',
      'Titik mulai dan selesai',
      'Arah aliran data',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq7-10',
    type: 'mcq',
    prompt:
      'Garis panah (Flow Line) pada flowchart berfungsi untuk...',
    options: [
      'Menghubungkan teks dengan gambar',
      'Menunjukkan arah aliran proses',
      'Menghentikan program',
      'Mengulang proses yang salah',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq7-11',
    type: 'mcq',
    prompt:
      'Seorang koki yang mengikuti urutan resep masakan langkah demi langkah sedang menerapkan pilar...',
    options: ['Abstraksi', 'Algoritma', 'Pengenalan Pola', 'Dekomposisi'],
    correctIndex: 1,
  },
  {
    id: 'mcq7-12',
    type: 'mcq',
    prompt:
      'Dokter melihat gejala batuk dan demam pada pasien, lalu teringat pasien minggu lalu yang mengalami penyakit flu. Dokter tersebut menerapkan pilar...',
    options: ['Dekomposisi', 'Abstraksi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq7-13',
    type: 'mcq',
    prompt: 'Tujuan utama dari menerapkan Berpikir Komputasional adalah...',
    options: [
      'Agar bisa mengetik komputer dengan cepat',
      'Menyelesaikan masalah secara efisien, efektif, dan optimal',
      'Memperbaiki komponen fisik komputer yang rusak',
      'Membuat aplikasi game yang mahal',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq7-14',
    type: 'mcq',
    prompt:
      'Jika dalam flowchart terdapat pertanyaan "Apakah Nilai >= 75?", maka alur keluaran dari simbol belah ketupat tersebut akan terbagi menjadi dua jalur, yaitu...',
    options: [
      'Input dan Output',
      'Ya (True) dan Tidak (False)',
      'Start dan Stop',
      'Proses 1 dan Proses 2',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq7-15',
    type: 'mcq',
    prompt:
      'Simbol connector berbentuk lingkaran kecil pada flowchart digunakan untuk...',
    options: [
      'Menyambung alur pada halaman yang sama',
      'Mengakhiri program secara mendadak',
      'Memasukkan data angka',
      'Menampilkan hasil cetak di kertas',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq7-16',
    type: 'mcq',
    prompt:
      'Langkah pertama yang tepat saat kamu ingin merancang solusi menggunakan Computational Thinking adalah...',
    options: [
      'Langsung menulis kode program',
      'Memahami dan mengidentifikasi masalah',
      'Menggambar diagram warna-warni',
      'Membeli perangkat keras baru',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq7-17',
    type: 'mcq',
    prompt:
      'Manakah di bawah ini yang merupakan contoh algoritma dalam kehidupan sehari-hari?',
    options: [
      'Denah lokasi rumah',
      'Langkah-langkah menyeduh mie instan',
      'Foto pemandangan alam',
      'Daftar harga barang di toko',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq7-18',
    type: 'mcq',
    prompt:
      'Apa akibatnya jika urutan langkah dalam sebuah algoritma diacak secara sembarangan?',
    options: [
      'Hasil akhir akan tetap sama',
      'Solusi menjadi lebih cepat ditemukan',
      'Hasil akhir menjadi salah atau proses gagal',
      'Komputer akan langsung rusak',
    ],
    correctIndex: 2,
  },
  {
    id: 'mcq7-19',
    type: 'mcq',
    prompt:
      'Di bawah ini yang bukan merupakan ciri-ciri algoritma yang baik adalah...',
    options: [
      'Langkah-langkahnya jelas dan tidak menimbulkan keraguan',
      'Memiliki titik awal dan titik akhir',
      'Langkahnya berjalan terus-menerus tanpa pernah berhenti',
      'Menghasilkan solusi yang benar dan tepat',
    ],
    correctIndex: 2,
  },
  {
    id: 'mcq7-20',
    type: 'mcq',
    prompt:
      'Saat membuat es teh manis, tindakan "Memasukkan gula dan air ke dalam gelas" termasuk ke dalam tahap...',
    options: ['Input', 'Proses', 'Output', 'Decision'],
    correctIndex: 0,
  },
  {
    id: 'tf7-1',
    type: 'true-false',
    prompt:
      'Berpikir Komputasional hanya bisa digunakan saat kita berhadapan langsung dengan komputer.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf7-2',
    type: 'true-false',
    prompt:
      'Pilar Dekomposisi membantu kita agar tidak panik saat menghadapi masalah yang besar dan rumit.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf7-3',
    type: 'true-false',
    prompt:
      'Abstraksi adalah proses mencatat seluruh detail informasi sekecil apa pun tanpa ada yang terlewat.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf7-4',
    type: 'true-false',
    prompt:
      'Simbol flowchart untuk membaca data (Input) dan mencetak data (Output) memiliki bentuk jajaran genjang.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf7-5',
    type: 'true-false',
    prompt:
      'Simbol Decision (belah ketupat) pada flowchart memiliki lebih dari satu garis arah keluaran.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf7-6',
    type: 'true-false',
    prompt:
      'Algoritma yang baik harus berhenti setelah melakukan sejumlah langkah tertentu.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf7-7',
    type: 'true-false',
    prompt:
      'Arah panah dalam flowchart boleh digambar secara acak tanpa mengikuti alur logika.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf7-8',
    type: 'true-false',
    prompt:
      'Mengelompokkan jenis-jenis hewan berdasarkan jenis makanannya adalah contoh penerapan Pengenalan Pola.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf7-9',
    type: 'true-false',
    prompt:
      'Bentuk persegi panjang pada flowchart digunakan untuk menentukan kondisi Ya atau Tidak.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf7-10',
    type: 'true-false',
    prompt:
      'Berpikir Komputasional melatih otak kita untuk menyelesaikan masalah secara terstruktur dan logis.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'fb7-1',
    type: 'short-answer',
    prompt:
      'Pilar Berpikir Komputasional yang menyusun langkah-langkah penyelesaian masalah secara berurutan dinamakan ______________.',
    acceptableAnswers: ['algoritma', 'algorithm'],
  },
  {
    id: 'fb7-2',
    type: 'short-answer',
    prompt:
      'Simbol flowchart yang berbentuk oval berfungsi sebagai titik ______________.',
    acceptableAnswers: ['terminal', 'start', 'stop', 'awal', 'akhir', 'start / stop', 'start atau stop'],
  },
  {
    id: 'fb7-3',
    type: 'short-answer',
    prompt:
      'Proses menyaring dan membuang informasi yang tidak penting agar fokus pada informasi utama disebut ______________.',
    acceptableAnswers: ['abstraksi', 'abstraction'],
  },
  {
    id: 'fb7-4',
    type: 'short-answer',
    prompt:
      'Simbol berbentuk persegi panjang pada flowchart menunjukkan adanya kegiatan ______________.',
    acceptableAnswers: ['proses', 'pengolahan', 'proses / pengolahan', 'proses atau pengolahan data'],
  },
  {
    id: 'fb7-5',
    type: 'short-answer',
    prompt:
      'Bentuk bangun datar yang digunakan untuk simbol pengambilan keputusan (Decision) pada flowchart adalah ______________.',
    acceptableAnswers: ['belah ketupat', 'diamond', 'belah ketupat (diamond)'],
  },
  {
    id: 'reason7-1',
    type: 'mcq',
    section: 'Logika & Penalaran',
    prompt:
      '(Logika Pembagian Kerja — Dekomposisi)\n\nKelompokmu mendapatkan tugas proyek membuat laporan Informatika sebanyak 10 halaman dalam waktu 2 hari. Manakah cara pembagian tugas yang paling tepat menggunakan pilar Dekomposisi agar pekerjaan selesai tepat waktu?',
    options: [
      'Seluruh anggota mengerjakan semua 10 halaman secara bersamaan di satu komputer',
      'Setiap anggota mendapat bagian spesifik: A mencari referensi, B mengetik Bab 1-2, C mengetik Bab 3-4, D editing/tata letak',
      'Tugas dikerjakan satu per satu secara bergantian oleh satu orang saja',
      'Tugas 10 halaman dikerjakan tanpa pembagian karena terlalu sedikit',
    ],
    correctIndex: 1,
  },
  {
    id: 'reason7-2',
    type: 'mcq',
    section: 'Logika & Penalaran',
    prompt:
      '(Penalaran Urutan Algoritma)\n\nBudi membuat algoritma bersiap-siap pergi ke sekolah:\nLangkah 1: Pakai kemeja seragam\nLangkah 2: Pakai celana sekolah\nLangkah 3: Pakai kaus kaki\nLangkah 4: Pakai sepatu\n\nJika Budi menukar urutan dan melakukan Langkah 4 (Pakai sepatu) sebelum Langkah 2 (Pakai celana sekolah), masalah logis apa yang akan dialami Budi?',
    options: [
      'Budi akan kepanasan karena sudah memakai sepatu lebih dulu',
      'Budi tidak bisa memakai celana sekolah karena terhalang sepatu yang sudah terpasang',
      'Budi akan kehilangan kaus kakinya',
      'Tidak ada masalah karena urutan tidak penting',
    ],
    correctIndex: 1,
  },
  {
    id: 'reason7-3',
    type: 'mcq',
    section: 'Logika & Penalaran',
    prompt:
      '(Pelacakan Alur Flowchart — Tracing)\n\nAmati alur logika flowchart berikut:\nMulai\nMasukkan Angka = 8\nPeriksa kondisi: Apakah Angka > 10?\nJika Ya -> Cetak "Besar"\nJika Tidak -> Cetak "Kecil"\nSelesai\n\nTuliskan teks apa yang akan muncul pada layar berdasarkan alur logika di atas!',
    options: ['"Besar"', '"Kecil"', '"Angka"', '"Error"'],
    correctIndex: 1,
  },
  {
    id: 'reason7-4',
    type: 'mcq',
    section: 'Logika & Penalaran',
    prompt:
      '(Pengenalan Pola — Deret)\n\nPerhatikan urutan deret angka berikut: 3, 6, 12, 24, ...\n\nBerdasarkan pengenalan pola yang kamu temukan, berapakah angka berikutnya?',
    options: ['36', '48', '30', '50'],
    correctIndex: 1,
  },
  {
    id: 'reason7-5',
    type: 'mcq',
    section: 'Logika & Penalaran',
    prompt:
      '(Kasus Algoritma Percabangan)\n\nBuatlah rancangan algoritma sederhana untuk memeriksa syarat masuk wahana Roller Coaster. Syarat: Tinggi badan minimal 140 cm.\n\nManakah alur algoritma yang paling tepat?',
    options: [
      'Input Tinggi -> Selalu cetak "Boleh Naik" -> Selesai',
      'Input Tinggi -> Cek Tinggi >= 140 -> Jika Ya: "Boleh Naik" -> Jika Tidak: "Tidak Boleh Naik" -> Selesai',
      'Input Tinggi -> Cek Tinggi < 140 -> Jika Ya: "Boleh Naik" -> Jika Tidak: "Tidak Boleh Naik" -> Selesai',
      'Input Tinggi -> Cek Tinggi == 140 -> Jika Ya: "Boleh Naik" -> Jika Tidak: "Tidak Boleh Naik" -> Selesai',
    ],
    correctIndex: 1,
  },
]

const EXAM_7_QUESTION_IDS = [
  'mcq7-1',
  'mcq7-2',
  'mcq7-3',
  'mcq7-4',
  'mcq7-5',
  'mcq7-6',
  'mcq7-7',
  'mcq7-8',
  'mcq7-9',
  'mcq7-10',
  'mcq7-11',
  'mcq7-12',
  'mcq7-13',
  'mcq7-14',
  'mcq7-15',
  'mcq7-16',
  'mcq7-17',
  'mcq7-18',
  'mcq7-19',
  'mcq7-20',
  'tf7-1',
  'tf7-2',
  'tf7-3',
  'tf7-4',
  'tf7-5',
  'tf7-6',
  'tf7-7',
  'tf7-8',
  'tf7-9',
  'tf7-10',
  'fb7-1',
  'fb7-2',
  'fb7-3',
  'fb7-4',
  'fb7-5',
  'reason7-1',
  'reason7-2',
  'reason7-3',
  'reason7-4',
  'reason7-5',
]

/** @type {Exam} */
export const EXAM_7 = {
  id: 'kuis-informatika-kelas-7',
  title: 'Kuis Berpikir Komputasional & Flowchart Kelas 7',
  description:
    'Soal kuis untuk kelas 7 SMP: 20 pilihan ganda, 10 benar/salah, 5 isian singkat, dan 5 logika & penalaran. Jawab semua soal dengan teliti!',
  durationSeconds: 3600,
  questions: EXAM_7_QUESTION_IDS.map((id) =>
    QUESTION_BANK_7.find((question) => question.id === id),
  ),
}
