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
export const QUESTION_BANK_SMP_AUG3 = [
  {
    id: 'smpa3-mcq-1',
    type: 'mcq',
    prompt:
      'Berpikir Komputasional (Computational Thinking) pada dasarnya adalah...',
    options: [
      'Cara berpikir untuk merakit komponen komputer hardware',
      'Metode memecahkan masalah secara terstruktur, logis, dan efisien',
      'Kemampuan mengetik dan mengoperasikan perangkat lunak dengan cepat',
      'Cara menghitung angka-angka rumit tanpa bantuan kalkulator',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-2',
    type: 'mcq',
    prompt:
      'Ketika kamu ingin merencanakan acara pentas seni sekolah yang besar, kamu membaginya menjadi tugas-tugas kecil seperti tim konsumsi, tim acara, dan tim dekorasi. Pilar CT yang sedang kamu gunakan adalah...',
    options: ['Abstraksi', 'Dekomposisi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-3',
    type: 'mcq',
    prompt:
      'Seorang dokter mendiagnosis penyakit pasien dengan cara melihat gejala-gejala seperti demam dan batuk, lalu membandingkannya dengan gejala pasien-pasien sebelumnya. Dokter tersebut menerapkan...',
    options: ['Pengenalan Pola', 'Abstraksi', 'Dekomposisi', 'Algoritma'],
    correctIndex: 0,
  },
  {
    id: 'smpa3-mcq-4',
    type: 'mcq',
    prompt:
      'Saat kamu membuat denah lokasi rumah untuk undangan pesta, kamu hanya menggambar jalan utama dan patokan penting tanpa menggambar setiap rumah tetangga secara detail. Hal ini merupakan contoh...',
    options: ['Dekomposisi', 'Algoritma', 'Abstraksi', 'Pengenalan Pola'],
    correctIndex: 2,
  },
  {
    id: 'smpa3-mcq-5',
    type: 'mcq',
    prompt:
      'Ibu memberikan petunjuk tertulis langkah demi langkah dari awal sampai akhir tentang cara membuat kue bolu agar rasanya tidak gagal. Petunjuk terstruktur ini disebut...',
    options: ['Abstraksi', 'Algoritma', 'Dekomposisi', 'Pola'],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-6',
    type: 'mcq',
    prompt:
      'Mengapa pilar Abstraksi sangat penting saat kita menghadapi masalah yang sangat rumit?',
    options: [
      'Agar kita bisa membuang semua informasi tanpa sisa',
      'Agar kita bisa fokus pada informasi penting dan mengabaikan detail yang membingungkan',
      'Agar masalah tersebut berubah menjadi masalah matematika',
      'Agar kita bisa menyelesaikan masalah tanpa perlu berpikir',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-7',
    type: 'mcq',
    prompt: 'Manakah yang BUKAN merupakan empat pilar utama dalam Berpikir Komputasional adalah...',
    options: ['Dekomposisi', 'Otomatisasi Pabrik', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-8',
    type: 'mcq',
    prompt:
      'Seorang siswa selalu terlambat tiba di sekolah. Ia kemudian mencatat jam bangun tidur, durasi mandi, dan waktu perjalanan selama seminggu untuk mencari tahu penyebab utamanya. Tindakan siswa ini mencerminkan pendekatan...',
    options: ['Berpikir Komputasional', 'Teori Komputer Hardware', 'Pemrograman Komputer', 'Hafalan Rute Jalan'],
    correctIndex: 0,
  },
  {
    id: 'smpa3-mcq-9',
    type: 'mcq',
    prompt:
      'Jika sebuah langkah dalam susunan resep masakan terbalik urutannya, kemungkinan besar hasil masakan akan gagal. Hal ini menunjukkan pentingnya sifat algoritma yaitu...',
    options: [
      'Harus rumit',
      'Harus menggunakan bahasa komputer',
      'Harus logis dan runtut',
      'Harus panjang dan detail',
    ],
    correctIndex: 2,
  },
  {
    id: 'smpa3-mcq-10',
    type: 'mcq',
    prompt:
      'Budi mengamati bahwa setiap kali langit mendung gelap dan angin bertiup kencang, tidak lama kemudian hujan akan turun. Kemampuan Budi memprediksi hujan ini berdasarkan...',
    options: ['Dekomposisi', 'Abstraksi', 'Pengenalan Pola', 'Pembagian Tugas'],
    correctIndex: 2,
  },
  {
    id: 'smpa3-mcq-11',
    type: 'mcq',
    prompt:
      'Manakah dari situasi berikut yang menunjukkan penggunaan pilar Dekomposisi?',
    options: [
      'Merangkum buku cerita 100 halaman menjadi 1 halaman utama',
      'Membongkar sepeda rusak menjadi rantai, roda, dan rem untuk mengecek kerusakan satu per satu',
      'Memilih baju berdasarkan warna yang sering dipakai minggu lalu',
      'Mengikuti petunjuk arah peta digital',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-12',
    type: 'mcq',
    prompt:
      'Konsep Berpikir Komputasional hanya dapat diterapkan ketika kita...',
    options: [
      'Sedang berada di depan komputer atau laptop',
      'Menggunakan HP berbasis Android atau iOS',
      'Menghadapi masalah apa saja dalam kehidupan sehari-hari',
      'Sedang belajar bahasa pemrograman saja',
    ],
    correctIndex: 2,
  },
  {
    id: 'smpa3-mcq-13',
    type: 'mcq',
    prompt:
      'Ketika menyusun jadwal pelajaran mingguan agar tidak ada mata pelajaran yang bentrok, kamu sedang menerapkan pemikiran terstruktur untuk mencapai...',
    options: [
      'Solusi yang efisien dan optimal',
      'Hasil yang paling mahal',
      'Tampilan jadwal yang paling berwarna',
      'Jumlah jam belajar yang lebih sedikit',
    ],
    correctIndex: 0,
  },
  {
    id: 'smpa3-mcq-14',
    type: 'mcq',
    prompt:
      'Roni ingin merapikan rak bukunya yang berantakan. Ia mengelompokkan buku berdasarkan jenisnya: komik, novel, dan buku pelajaran. Pilar CT yang dilakukan Roni saat mengelompokkan adalah...',
    options: ['Pengenalan Pola', 'Dekomposisi', 'Algoritma', 'Otomasi'],
    correctIndex: 0,
  },
  {
    id: 'smpa3-mcq-15',
    type: 'mcq',
    prompt:
      'Mengidentifikasi masalah, mencari penyebabnya, dan mencoba perbaikan langkah demi langkah sampai masalah selesai dalam CT disebut proses...',
    options: ['Abstraksi', 'Evaluasi dan Debugging (Pembenahan)', 'Pengulangan Tanpa Henti', 'Penyimpanan Data'],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-16',
    type: 'mcq',
    prompt:
      'Saat kamu membaca komik, kamu fokus membaca jalan cerita dan dialog tokohnya, tanpa memikirkan jenis kertas atau ketebalan tinta yang digunakan cetakan komik tersebut. Sikap ini adalah bentuk...',
    options: ['Abstraksi', 'Dekomposisi', 'Algoritma', 'Desain Grafis'],
    correctIndex: 0,
  },
  {
    id: 'smpa3-mcq-17',
    type: 'mcq',
    prompt:
      'Apa manfaat utama membiasakan diri berpikir komputasional sejak sekolah?',
    options: [
      'Kita tidak perlu lagi berinteraksi dengan orang lain',
      'Melatih otak untuk memecahkan masalah dengan kritis, logis, dan sistematis',
      'Menjamin kita pasti menjadi pengusaha teknologi kaya raya',
      'Membuat kita tidak perlu mengerjakan tugas sekolah',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-18',
    type: 'mcq',
    prompt:
      'Sebuah instruksi berbunyi: "Jika hari hujan, pakailah jas hujan. Jika tidak, pakailah jaket biasa." Dalam logika penyelesaian masalah, instruksi ini mengandung...',
    options: [
      'Pengulangan proses',
      'Percabangan kondisi (Pengambilan Keputusan)',
      'Penghentian program secara paksa',
      'Kesalahan logika',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-19',
    type: 'mcq',
    prompt:
      'Urutan pilar CT yang paling ideal ketika kamu pertama kali menghadapi masalah besar yang rumit adalah...',
    options: [
      'Langsung buat Algoritma tanpa melihat pola',
      'Dekomposisi masalah -> Kenali Polanya -> Lakukan Abstraksi -> Susun Algoritma',
      'Abstraksi dulu -> Abaikan semua hal -> Selesai',
      'Buat Algoritma -> Dekomposisi -> Hapus Pola',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-20',
    type: 'mcq',
    prompt:
      'Jika kamu diminta menjelaskan cara pergi dari rumah ke sekolah kepada adikmu yang kecil, kamu akan memberikan instruksi yang singkat, jelas, dan mudah dipahami. Ini adalah kombinasi dari...',
    options: [
      'Dekomposisi dan Hardware',
      'Abstraksi dan Algoritma',
      'Pengenalan Pola dan Rumus',
      'Coding dan Internet',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-21',
    type: 'mcq',
    prompt:
      'Dalam menggambarkan urutan langkah (algoritma) secara visual menggunakan gambar diagram, kita menggunakan bentuk diagram yang disebut...',
    options: ['Grafik Batang', 'Diagram Ven', 'Flowchart (Bagan Alir)', 'Peta Pikiran (Mind Map)'],
    correctIndex: 2,
  },
  {
    id: 'smpa3-mcq-22',
    type: 'mcq',
    prompt:
      'Pada sebuah Flowchart, bentuk OVAL (Terminator) digunakan untuk menandai...',
    options: [
      'Proses perhitungan angka',
      'Titik Mulai (Start) atau Titik Selesai (End) dari suatu alur',
      'Tempat memasukkan data dari pengguna',
      'Pertanyaan atau keputusan yang harus dipilih',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-23',
    type: 'mcq',
    prompt:
      'Saat kamu membuat Flowchart untuk mengecek apakah lampu belajar menyala atau mati, bentuk BELAH KETUPAT (Decision) digunakan untuk...',
    options: [
      'Menuliskan judul Flowchart',
      'Mengajukan pertanyaan kondisi (Contoh: "Apakah kabel terpasang?")',
      'Menggambar bentuk fisik lampu',
      'Menghubungkan kertas halaman satu ke halaman dua',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-24',
    type: 'mcq',
    prompt:
      'Bentuk PERSEGI PANJANG pada Flowchart menunjukkan bahwa pada tahap tersebut terjadi sebuah...',
    options: [
      'Keputusan dua arah',
      'Proses atau tindakan yang dilakukan',
      'Masukkan data teks',
      'Penghentian arus logika',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-mcq-25',
    type: 'mcq',
    prompt:
      'Apa fungsi utama dari simbol PANAH (Garis Alir) pada sebuah Flowchart?',
    options: [
      'Sebagai hiasan agar diagram terlihat menarik',
      'Menunjukkan arah jalurnya urutan proses dari satu langkah ke langkah berikutnya',
      'Menandakan bahwa proses telah gagal',
      'Menggantikan peran tulisan teks',
    ],
    correctIndex: 1,
  },
  {
    id: 'smpa3-tf-1',
    type: 'true-false',
    prompt:
      'Berpikir Komputasional adalah keterampilan berpikir yang hanya berguna bagi orang yang bekerja sebagai pemrogram komputer (programmer).',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'smpa3-tf-2',
    type: 'true-false',
    prompt:
      'Memecah masalah kompleks menjadi bagian-bagian kecil yang lebih mudah dikelola adalah inti dari pilar Dekomposisi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'smpa3-tf-3',
    type: 'true-false',
    prompt:
      'Abstraksi berarti kita harus mencatat seluruh detail masalah sekecil apapun tanpa ada yang terlewat.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'smpa3-tf-4',
    type: 'true-false',
    prompt:
      'Dalam Flowchart, simbol belah ketupat selalu memiliki lebih dari satu garis panah keluar karena mewakili pilihan jawaban (misal: Ya / Tidak).',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'smpa3-tf-5',
    type: 'true-false',
    prompt:
      'Algoritma yang baik adalah algoritma yang urutan langkahnya jelas dan dapat menyelesaikan masalah sampai tuntas.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'smpa3-fb-1',
    type: 'short-answer',
    prompt:
      'Proses memecah satu tugas besar menjadi beberapa tugas kecil yang sederhana dinamakan pilar _______________.',
    acceptableAnswers: ['dekomposisi', 'decomposition'],
  },
  {
    id: 'smpa3-fb-2',
    type: 'short-answer',
    prompt:
      'Menemukan kesamaan cara penyelesaian antara masalah yang sedang dihadapi dengan masalah yang pernah dialami sebelumnya dinamakan pilar _______________.',
    acceptableAnswers: ['pengenalan pola', 'pattern recognition'],
  },
  {
    id: 'smpa3-fb-3',
    type: 'short-answer',
    prompt:
      'Diagram visual yang menggambarkan alur langkah-langkah penyelesaian masalah menggunakan simbol-simbol standar disebut _______________.',
    acceptableAnswers: ['flowchart', 'bagan alir', 'bagan alur'],
  },
  {
    id: 'smpa3-fb-4',
    type: 'short-answer',
    prompt:
      'Pada simbol flowchart belah ketupat (Decision), logika decision digunakan untuk menentukan pilihan berdasarkan suatu _______________.',
    acceptableAnswers: ['kondisi', 'syarat', 'condition'],
  },
  {
    id: 'smpa3-fb-5',
    type: 'short-answer',
    prompt:
      'Tahap menyusun langkah-langkah penyelesaian masalah secara berurutan dari awal sampai akhir disebut penyusunan _______________.',
    acceptableAnswers: ['algoritma', 'algorithm'],
  },
]

const EXAM_SMP_AUG3_QUESTION_IDS = [
  'smpa3-mcq-1',
  'smpa3-mcq-2',
  'smpa3-mcq-3',
  'smpa3-mcq-4',
  'smpa3-mcq-5',
  'smpa3-mcq-6',
  'smpa3-mcq-7',
  'smpa3-mcq-8',
  'smpa3-mcq-9',
  'smpa3-mcq-10',
  'smpa3-mcq-11',
  'smpa3-mcq-12',
  'smpa3-mcq-13',
  'smpa3-mcq-14',
  'smpa3-mcq-15',
  'smpa3-mcq-16',
  'smpa3-mcq-17',
  'smpa3-mcq-18',
  'smpa3-mcq-19',
  'smpa3-mcq-20',
  'smpa3-mcq-21',
  'smpa3-mcq-22',
  'smpa3-mcq-23',
  'smpa3-mcq-24',
  'smpa3-mcq-25',
  'smpa3-tf-1',
  'smpa3-tf-2',
  'smpa3-tf-3',
  'smpa3-tf-4',
  'smpa3-tf-5',
  'smpa3-fb-1',
  'smpa3-fb-2',
  'smpa3-fb-3',
  'smpa3-fb-4',
  'smpa3-fb-5',
]

/** @type {Exam} */
export const EXAM_SMP_AUG3 = {
  id: 'kuis-ct-smp-agustus-minggu-3',
  title: 'CT SMP — Agustus Minggu 3',
  description:
    'Ujian Evaluasi Konsep Berpikir Komputasional: 25 pilihan ganda, 5 benar/salah, 5 isian singkat. Waktu 90 menit. Jawab semua soal dengan teliti!',
  durationSeconds: 5400,
  questions: EXAM_SMP_AUG3_QUESTION_IDS.map((id) =>
    QUESTION_BANK_SMP_AUG3.find((question) => question.id === id),
  ),
}
