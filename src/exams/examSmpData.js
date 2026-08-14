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
export const QUESTION_BANK_SMP = [
  {
    id: 'smp-mcq-1',
    type: 'mcq',
    section: 'Dekomposisi',
    prompt:
      'Sebuah tim siswa ingin membuat web portal sekolah. Agar pengerjaan lebih terstruktur, mereka membagi proyek menjadi modul: Tampilan (UI), Database Siswa, dan Sistem Login. Proses memecah masalah besar menjadi bagian-bagian kecil ini disebut...',
    options: ['Abstraksi', 'Dekomposisi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-2',
    type: 'mcq',
    section: 'Abstraksi',
    prompt:
      'Saat membuat aplikasi peta navigasi (seperti Google Maps), sistem menyembunyikan detail seperti warna cat rumah atau jenis pepohonan di tepi jalan, dan hanya menampilkan nama jalan, jarak, serta estimasi waktu. Prinsip CT yang diterapkan adalah...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Rancangan Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'smp-mcq-3',
    type: 'mcq',
    section: 'Pengenalan Pola',
    prompt:
      'Seorang programmer menyadari bahwa setiap kali sistem mendeteksi input email yang tidak menggunakan karakter \'@\', sistem selalu menampilkan pesan kesalahan yang sama. Menemukan kesamaan dari beberapa masalah ini adalah contoh dari...',
    options: ['Algorithm Design', 'Pattern Recognition', 'Decomposition', 'Abstraction'],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-4',
    type: 'mcq',
    section: 'Flowchart Symbol',
    prompt:
      'Simbol flowchart yang berbentuk Jajaran Genjang (Parallelogram) digunakan untuk menunjukkan fungsi...',
    options: [
      'Proses perhitungan atau manipulasi data',
      'Keputusan (Percabangan / Condition)',
      'Input atau Output data',
      'Mulai (Start) atau Selesai (End)',
    ],
    correctIndex: 2,
  },
  {
    id: 'smp-mcq-5',
    type: 'mcq',
    section: 'Flowchart Symbol',
    prompt:
      'Belah Ketupat (Diamond) dalam flowchart memiliki keluaran (arrow output) bertuliskan...',
    options: [
      'Start dan Stop',
      'Ya (True) dan Tidak (False)',
      'Input dan Output',
      'Process dan Memory',
    ],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-6',
    type: 'mcq',
    section: 'Percabangan',
    prompt:
      'Perhatikan instruksi logika berikut:\nJika Nilai >= 75 maka Keterangan = \'Lulus\', Jika Tidak maka Keterangan = \'Remedial\'\nJika seorang siswa mendapat nilai 75, maka status siswa tersebut adalah...',
    options: ['Remedial', 'Lulus', 'Error', 'Tidak Ada Status'],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-7',
    type: 'mcq',
    section: 'Perulangan',
    prompt:
      'Perhatikan algoritma berikut:\nVariabel total_tabungan = 0\nUlangi selama total_tabungan < 50.000:\n    Tambah tabungan sebesar 10.000\nBerapa kali perulangan (looping) tersebut akan berjalan hingga kondisi bernilai False (selesai)?',
    options: ['4 kali', '5 kali', '6 kali', 'Perulangan berjalan tanpa henti'],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-8',
    type: 'mcq',
    section: 'Algoritma',
    prompt: 'Manakah dari pernyataan berikut yang paling tepat mendefinisikan Algoritma?',
    options: [
      'Bahasa pemrograman yang digunakan untuk membuat program komputer',
      'Urutan langkah-langkah logis dan sistematis untuk menyelesaikan suatu masalah',
      'Gambar bagan alur yang menggambarkan fungsi hardware',
      'Proses menghapus data yang tidak diperlukan dari memori',
    ],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-9',
    type: 'mcq',
    section: 'Flowchart Symbol',
    prompt:
      'Simbol berbentuk Persegi Panjang dengan Garis Ganda di Sisi Kiri dan Kanan (Predefined Process) dalam flowchart digunakan untuk menunjukkan...',
    options: [
      'Deklarasi variabel awal',
      'Memanggil sub-program, fungsi, atau procedure terpisah',
      'Menampilkan hasil ke layar pencetak (printer)',
      'Memasukkan data melalui papan ketik (keyboard)',
    ],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-10',
    type: 'mcq',
    section: 'Computational Thinking',
    prompt:
      'Mengapa Berpikir Komputasional (Computational Thinking) penting dipelajari, bahkan jika kita tidak menjadi seorang programmer?',
    options: [
      'Agar bisa memperbaiki komputer yang rusak secara mandiri',
      'Karena melatih cara berpikir kritis, sistematis, dan efisien dalam memecahkan masalah kehidupan sehari-hari',
      'Agar mampu mengetik dengan 10 jari secara cepat',
      'Agar bisa meretas (hack) aplikasi web',
    ],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-11',
    type: 'mcq',
    section: 'Abstraksi',
    prompt:
      'Saat merancang sistem database siswa SMP, data manakah yang sebaiknya dihapus/diabaikan melalui proses abstraksi karena tidak relevan dengan kebutuhan akademik sekolah?',
    options: [
      'Nomor Induk Siswa Nasional (NISN)',
      'Tanggal Lahir Siswa',
      'Warna Makanan Favorit Siswa',
      'Nama Orang Tua / Wali',
    ],
    correctIndex: 2,
  },
  {
    id: 'smp-mcq-12',
    type: 'mcq',
    section: 'Algoritma',
    prompt:
      'Perhatikan algoritma konversi suhu berikut:\n1. Input nilai suhu dalam Celsius (C)\n2. Hitung F = (9/5 * C) + 32\n3. Cetak nilai F\nBila input C = 30, maka output F yang dihasilkan oleh algoritma tersebut adalah...',
    options: ['86', '76', '62', '54'],
    correctIndex: 0,
  },
  {
    id: 'smp-mcq-13',
    type: 'mcq',
    section: 'Percabangan Bersarang',
    prompt:
      'Perhatikan logika berikut:\nJika Umur >= 17:\n    Jika Memiliki SIM == \'Ya\':\n        Boleh Mengendarai Motor\n    Jika Tidak:\n        Tidak Boleh Mengendarai Motor\nJika Tidak:\n    Tidak Boleh Mengendarai Motor\nBudi berumur 18 tahun tetapi belum memiliki SIM. Hasil keputusan dari algoritma di atas untuk Budi adalah...',
    options: [
      'Boleh Mengendarai Motor',
      'Tidak Boleh Mengendarai Motor',
      'Perlu Ujian Ulang',
      'Terjadi Error pada Sistem',
    ],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-14',
    type: 'mcq',
    section: 'Flowchart Symbol',
    prompt:
      'Simbol Eksagon / Segi Six (Preparation) pada flowchart biasanya digunakan untuk...',
    options: [
      'Menandai akhir dari sebuah flowchart',
      'Inisialisasi atau memberikan nilai awal pada variabel',
      'Menggabungkan dua baris alir yang bersilangan',
      'Membaca file dari memori eksternal',
    ],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-15',
    type: 'mcq',
    section: 'Dekomposisi',
    prompt:
      'Sebuah perpustakaan sekolah ingin membuat katalog digital. Menguraikan masalah dengan membaginya menjadi: (1) Cara mencatat buku baru, (2) Cara mencari buku berdasarkan judul, dan (3) Cara mencatat peminjaman, merupakan penerapan dari...',
    options: ['Abstraksi', 'Dekomposisi', 'Pengenalan Pola', 'Debugging'],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-16',
    type: 'mcq',
    section: 'Pengenalan Pola',
    prompt:
      'Seorang siswa menyadari bahwa semua bilangan bulat yang digit terakhirnya adalah \'0\' atau \'5\' pasti habis dibagi \'5\'. Kemampuan menemukan keteraturan ini adalah contoh penerapan...',
    options: ['Pattern Recognition', 'Algorithm Design', 'Parallel Processing', 'Data Encryption'],
    correctIndex: 0,
  },
  {
    id: 'smp-mcq-17',
    type: 'mcq',
    section: 'Trace Code',
    prompt:
      'Perhatikan instruksi berikut:\nA = 5\nB = 3\nA = A + B\nB = A - B\nA = A - B\nBerapakah nilai akhir variabel A dan B secara berurutan?',
    options: ['A = 5, B = 3', 'A = 3, B = 5', 'A = 8, B = 5', 'A = 8, B = 3'],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-18',
    type: 'mcq',
    section: 'Flowchart Symbol',
    prompt:
      'Jika alur flowchart terlalu panjang dan harus terpotong lalu berpindah ke halaman kertas yang berbeda, simbol konektor yang harus digunakan adalah...',
    options: [
      'Lingkaran Kecil (On-page Connector)',
      'Segi Lima / Rumah Terbalik (Off-page Connector)',
      'Belah Ketupat (Decision)',
      'Jajaran Genjang (Input/Output)',
    ],
    correctIndex: 1,
  },
  {
    id: 'smp-mcq-19',
    type: 'mcq',
    section: 'Logika Boolean',
    prompt:
      'Syarat pada simbol Decision (Belah Ketupat) tertulis: (Nilai_IPA > 80) DAN (Nilai_MTK > 80). Kapan kondisi ini akan menghasilkan jalur keluaran Ya (True)?',
    options: [
      'Jika Nilai IPA = 85 dan Nilai MTK = 75',
      'Jika Nilai IPA = 75 dan Nilai MTK = 85',
      'Jika Nilai IPA = 85 dan Nilai MTK = 90',
      'Jika kedua nilai sama dengan 80',
    ],
    correctIndex: 2,
  },
  {
    id: 'smp-mcq-20',
    type: 'mcq',
    section: 'Algoritma / Efisiensi',
    prompt:
      'Dua orang siswa membuat algoritma untuk mengurutkan 100 data angka. Algoritma A membutuhkan 10 detik, sedangkan Algoritma B membutuhkan 2 detik untuk hasil yang sama persis. Hal ini menunjukkan bahwa Algoritma B lebih...',
    options: ['Abstrak', 'Efisien', 'Kompleks', 'Dekompositif'],
    correctIndex: 1,
  },
  {
    id: 'smp-tf-1',
    type: 'true-false',
    section: 'Flowchart Symbol',
    prompt:
      'Simbol Oval (Terminal) hanya digunakan dua kali dalam satu flowchart standar, yaitu pada awal (Start) dan pada akhir (End).',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'smp-tf-2',
    type: 'true-false',
    section: 'Abstraksi',
    prompt:
      'Abstraksi adalah proses memperjelas masalah dengan menambahkan sebanyak mungkin rincian/detail kecil yang tidak relevan.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'smp-tf-3',
    type: 'true-false',
    section: 'Percabangan',
    prompt:
      'Garis alir (flowline) dari simbol Decision (Belah Ketupat) selalu memiliki lebih dari satu cabang keluaran.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'smp-tf-4',
    type: 'true-false',
    section: 'Algoritma',
    prompt:
      'Algoritma yang baik harus memiliki kepastian (definiteness), artinya setiap langkah harus terdefinisi secara jelas dan tidak ambigu.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'smp-tf-5',
    type: 'true-false',
    section: 'Perulangan',
    prompt:
      'Jika sebuah kondisi perulangan (looping) dalam flowchart tidak pernah bernilai False, maka program akan mengalami Infinite Loop (perulangan tak terbatas).',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'smp-fb-1',
    type: 'short-answer',
    section: 'Flowchart Symbol',
    prompt:
      'Simbol persegi panjang (Rectangle) pada flowchart digunakan untuk menyatakan sebuah proses atau ________.',
    acceptableAnswers: ['perhitungan', 'operasi data', 'instruksi'],
  },
  {
    id: 'smp-fb-2',
    type: 'short-answer',
    section: 'Abstraksi',
    prompt:
      'Menghilangkan informasi yang tidak penting dan memfokuskan perhatian hanya pada inti masalah disebut prinsip ________.',
    acceptableAnswers: ['abstraksi', 'abstraction'],
  },
  {
    id: 'smp-fb-3',
    type: 'short-answer',
    section: 'Percabangan',
    prompt:
      'Struktur algoritma yang digunakan untuk mengambil keputusan berdasarkan kondisi tertentu dinamakan struktur ________.',
    acceptableAnswers: ['percabangan', 'kondisi', 'selection', 'branching'],
  },
  {
    id: 'smp-fb-4',
    type: 'short-answer',
    section: 'Flowchart Symbol',
    prompt:
      'Tanda panah pada flowchart berfungsi sebagai ________ yang menunjukkan arah aliran proses dari satu langkah ke langkah berikutnya.',
    acceptableAnswers: ['flowline', 'garis alir', 'alur'],
  },
  {
    id: 'smp-fb-5',
    type: 'short-answer',
    section: 'Pengenalan Pola',
    prompt:
      'Ketika kamu memprediksi bahwa kemacetan akan terjadi setiap hari Senin jam 07.00 WIB berdasarkan pengamatan minggu-minggu sebelumnya, kamu sedang menggunakan prinsip CT yaitu ________.',
    acceptableAnswers: ['pengenalan pola', 'pattern recognition'],
  },
]

const EXAM_SMP_QUESTION_IDS = [
  'smp-mcq-1',
  'smp-mcq-2',
  'smp-mcq-3',
  'smp-mcq-4',
  'smp-mcq-5',
  'smp-mcq-6',
  'smp-mcq-7',
  'smp-mcq-8',
  'smp-mcq-9',
  'smp-mcq-10',
  'smp-mcq-11',
  'smp-mcq-12',
  'smp-mcq-13',
  'smp-mcq-14',
  'smp-mcq-15',
  'smp-mcq-16',
  'smp-mcq-17',
  'smp-mcq-18',
  'smp-mcq-19',
  'smp-mcq-20',
  'smp-tf-1',
  'smp-tf-2',
  'smp-tf-3',
  'smp-tf-4',
  'smp-tf-5',
  'smp-fb-1',
  'smp-fb-2',
  'smp-fb-3',
  'smp-fb-4',
  'smp-fb-5',
]

/** @type {Exam} */
export const EXAM_SMP = {
  id: 'kuis-berpikir-komputasional-smp',
  title: 'Kuis Berpikir Komputasional SMP',
  description:
    'Soal kuis untuk SMP (Kelas 7-9): 20 pilihan ganda, 5 benar/salah, dan 5 isian singkat. Jawab semua soal dengan teliti!',
  durationSeconds: 1800,
  questions: EXAM_SMP_QUESTION_IDS.map((id) =>
    QUESTION_BANK_SMP.find((question) => question.id === id),
  ),
}
