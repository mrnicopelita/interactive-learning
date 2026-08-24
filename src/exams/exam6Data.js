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
    prompt:
      'Berpikir Komputasional (Computational Thinking) pada hakikatnya adalah...',
    options: [
      'Proses berpikir memecahkan masalah dengan merumuskan solusi secara terstruktur, efektif, dan efisien',
      'Kemampuan menghafal seluruh istilah teknis dan pemrograman komputer',
      'Cara menggunakan perangkat lunak komputer untuk membuat dokumen secara cepat',
      'Keterampilan membongkar dan merakit kembali komponen keras komputer',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq6-2',
    type: 'mcq',
    prompt:
      'Seorang ketua kelompok mendapat tugas membuat mading sekolah. Ia membagi tugas: Budi mencari artikel, Siti menggambar ilustrasi, dan Andi mengetik teks. Jika salah satu dari mereka gagal menyelesaikan tugasnya, mading tidak akan selesai tepat waktu. Langkah membagi tugas besar menjadi sub-tugas yang saling mendukung ini menerapkan pilar...',
    options: ['Abstraksi', 'Dekomposisi', 'Pengenalan Pola', 'Otomasi'],
    correctIndex: 1,
  },
  {
    id: 'mcq6-3',
    type: 'mcq',
    prompt:
      'Seorang detektif sedang memecahkan kasus pencurian. Ia mencatat bahwa setiap kali pencurian terjadi, aliran listrik selalu padam pada pukul 22.00 dan pelaku meninggalkan jejak lumpur yang sama. Langkah detektif menemukan keteraturan informasi tersebut menerapkan pilar...',
    options: ['Dekomposisi', 'Abstraksi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-4',
    type: 'mcq',
    prompt:
      'Ketika merancang aplikasi denah lokasi perpustakaan sekolah, perancang hanya menampilkan posisi rak buku, meja baca, dan pintu keluar. Perancang tidak menampilkan detail ubin lantai, posisi lampu, atau warna cat dinding. Alasan utama penerapan pilar Abstraksi dalam kasus ini adalah...',
    options: [
      'Menghemat waktu pembuatan dengan menghapus semua data tanpa sisa',
      'Menghilangkan detail yang tidak relevan agar pengguna fokus pada informasi inti',
      'Membuat denah terlihat lebih rumit dan canggih',
      'Mengganti semua informasi menjadi angka hitungan',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-5',
    type: 'mcq',
    prompt:
      'Perhatikan urutan langkah membuat minuman berikut:\n\n(1) Tuangkan air panas ke dalam cangkir.\n(2) Aduk hingga gula dan teh larut sempurna.\n(3) Masukkan kantong teh dan gula pasir ke dalam cangkir.\n(4) Siapkan cangkir bersih.\n\nAgar menjadi algoritma yang logis dan benar, urutan langkah yang tepat adalah...',
    options: [
      '(4) - (3) - (1) - (2)',
      '(4) - (1) - (2) - (3)',
      '(1) - (3) - (4) - (2)',
      '(3) - (4) - (1) - (2)',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq6-6',
    type: 'mcq',
    prompt:
      'Mengapa penyusunan algoritma harus bersifat logis, runtut, dan tidak ambigu (memiliki arti ganda)?',
    options: [
      'Agar algoritma tersebut bisa diubah-ubah sesuai keinginan kapan saja',
      'Agar siapa pun yang menjalankan instruksi tersebut akan mendapatkan hasil akhir yang sama dan benar',
      'Agar instruksi menjadi sangat panjang dan terlihat sulit',
      'Agar masalah dapat diselesaikan tanpa perlu melakukan evaluasi',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-7',
    type: 'mcq',
    prompt:
      'Andi ingin memperbaiki sepeda yang rantainya sering lepas. Sebelum mulai memperbaiki, ia mengingat kembali pengalaman minggu lalu saat rantai sepedanya lepas dan bagaimana ia berhasil membetulkannya saat itu. Pilar CT yang dimanfaatkan Andi adalah...',
    options: ['Dekomposisi', 'Abstraksi', 'Pengenalan Pola', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-8',
    type: 'mcq',
    prompt:
      'Dalam suatu eksperimen sains, kamu diminta mencatat perubahan suhu air setiap 5 menit selama 30 menit. Setelah melihat data, kamu menyimpulkan bahwa "Suhu air naik sebesar 2 derajat Celsius setiap 5 menit". Proses mengambil kesimpulan kenaikan tetap tersebut merupakan penerapan dari...',
    options: ['Pengenalan Pola', 'Dekomposisi', 'Abstraksi', 'Algoritma'],
    correctIndex: 0,
  },
  {
    id: 'mcq6-9',
    type: 'mcq',
    prompt:
      'Ketika membaca artikel ringkasan buku sepanjang 10 halaman yang diubah menjadi 1 paragraf berisi gagasan utama saja, pilar apakah yang paling dominan digunakan oleh pembuat ringkasan?',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Algoritma'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-10',
    type: 'mcq',
    prompt:
      'Jika suatu masalah yang kompleks langsung dikerjakan tanpa melalui proses Dekomposisi terlebih dahulu, risiko terbesar yang mungkin terjadi adalah...',
    options: [
      'Masalah akan selesai lebih cepat dari yang diperkirakan',
      'Masalah terasa sangat rumit, membingungkan, dan rawan terjadi kesalahan',
      'Solusi yang dihasilkan menjadi terlalu sederhana',
      'Langkah penyelesaian menjadi otomatis dengan sendirinya',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-11',
    type: 'mcq',
    prompt:
      'Perhatikan urutan pola bilangan berikut: 3, 7, 11, 15, X, 23.\n\nMenggunakan pilar Pengenalan Pola, nilai dari X adalah...',
    options: ['17', '18', '19', '20'],
    correctIndex: 2,
  },
  {
    id: 'mcq6-12',
    type: 'mcq',
    prompt:
      'Manakah di bawah ini yang menunjukkan penggunaan pilar Dekomposisi secara tepat dalam kehidupan sehari-hari?',
    options: [
      'Membaca satu bab buku cerita dari awal sampai akhir tanpa berhenti',
      'Memecah rencana liburan keluarga menjadi bagian transportasi, akomodasi, daftar tempat wisata, dan anggaran biaya',
      'Menghafal seluruh nama teman di sekolah berdasarkan urutan abjad',
      'Mengabaikan jenis kendaraan yang lewat saat menyeberang jalan',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-13',
    type: 'mcq',
    prompt:
      'Sebuah komputer mengalami kendala aplikasi yang tiba-tiba berhenti (freeze). Pengguna mencoba menutup aplikasi, lalu membuka kembali, dan jika masih gagal pengguna melakukan restart pada komputer. Proses mengidentifikasi masalah dan melakukan langkah penanganan secara bertahap ini dinamakan...',
    options: [
      'Debugging / Evaluasi Solusi',
      'Abstraksi Data',
      'Dekomposisi Otomatis',
      'Pengenalan Pola Acak',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq6-14',
    type: 'mcq',
    prompt:
      'Dua orang siswa (Rian dan Dina) diminta menyusun rak buku perpustakaan. Rian langsung menumpuk buku secara acak. Dina memilih mengelompokkan buku berdasarkan mata pelajaran terlebih dahulu, lalu menyusunnya berurutan sesuai abjad judul. Keunggulan dari metode Dina yang menerapkan Berpikir Komputasional adalah...',
    options: [
      'Membutuhkan waktu yang lebih lama saat mencari buku di kemudian hari',
      'Menghasilkan sistem pencarian buku yang jauh lebih efisien dan terstruktur',
      'Membuat jumlah buku menjadi bertambah banyak',
      'Menghilangkan kebutuhan akan daftar katalog buku',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-15',
    type: 'mcq',
    prompt:
      'Suatu aturan keselamatan di laboratorium menyatakan: "JIKA terjadi kebocoran gas, MAKA segera buka semua jendela DAN matikan semua sumber api." Struktur logika penyelesaian masalah ini menggunakan konsep...',
    options: [
      'Perulangan tanpa henti (Looping)',
      'Pengambilan Keputusan berdasarkan Kondisi (Conditional / Branching)',
      'Penggabungan data secara acak',
      'Dekomposisi tanpa syarat',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-16',
    type: 'mcq',
    prompt:
      'Diberikan instruksi logika perulangan berikut:\n\n- Masukkan Nilai Awal X = 2\n- Ulangi langkah berikut sebanyak 4 kali:\n  * Hitung X = (X * 2) - 1\n\nBerapakah nilai akhir X setelah seluruh perulangan selesai dilakukan?',
    options: ['9', '17', '33', '65'],
    correctIndex: 1,
  },
  {
    id: 'mcq6-17',
    type: 'mcq',
    prompt:
      'Sebuah kurir harus mengantar 4 paket ke lokasi A, B, C, dan D yang terhubung oleh jalur jalan dengan estimasi waktu perjalanan sebagai berikut:\n\n- Rumah Kurir ke A = 10 menit\n- Rumah Kurir ke B = 15 menit\n- Lokasi A ke C = 5 menit\n- Lokasi B ke C = 8 menit\n- Lokasi C ke D = 12 menit\n- Lokasi A ke B = 20 menit\n\nKurir ingin memulai perjalanan dari Rumah Kurir, mengunjungi SEMUA lokasi paket (A, B, C, D) masing-masing satu kali, lalu berakhir di lokasi D dengan total waktu tersingkat. Rute paling efisien yang harus dipilih adalah...',
    options: [
      'Rumah Kurir → B → C → A → D',
      'Rumah Kurir → A → B → C → D',
      'Rumah Kurir → B → A → C → D',
      'Rumah Kurir → A → C → B → D',
    ],
    correctIndex: 3,
  },
  {
    id: 'mcq6-18',
    type: 'mcq',
    prompt:
      'Perhatikan tabel aturan penyaringan data siswa untuk tim olimpiade:\n\n- Syarat 1: Nilai Matematika >= 85\n- Syarat 2: Nilai IPA >= 80\n- Aturan Kelulusan: (Nilai Matematika >= 85) AND (Nilai IPA >= 80 OR Nilai Bahasa Inggris >= 90)\n\nSiswa Eko memiliki nilai: Matematika = 88, IPA = 75, Bahasa Inggris = 92.\nApakah Eko berhak lolos ke dalam tim olimpiade?',
    options: [
      'Lolos, karena memenuhi Syarat Matematika dan Syarat Bahasa Inggris',
      'Tidak Lolos, karena nilai IPA kurang dari 80',
      'Tidak Lolos, karena nilai Matematika dan IPA harus sama-sama di atas 85',
      'Lolos, hanya jika nilai IPA diperbaiki terlebih dahulu',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq6-19',
    type: 'mcq',
    prompt:
      'Empat buah tumpukan kotak (A, B, C, D) disusun dengan ketinggian awal berbeda: A=8 cm, B=3 cm, C=11 cm, D=6 cm. Kamu diperbolehkan melakukan operasi berikut: "Pindahkan 2 cm ketinggian dari tumpukan yang paling tinggi ke tumpukan yang paling rendah." Berapa kali operasi minimum yang harus dilakukan agar selisih antara tumpukan tertinggi dan terendah menjadi sekecil mungkin?',
    options: ['1 kali', '2 kali', '3 kali', '4 kali'],
    correctIndex: 1,
  },
  {
    id: 'mcq6-20',
    type: 'mcq',
    prompt:
      'Sebuah mesin sandi rahasia mengubah huruf berdasarkan aturan pola:\n\n- Huruf vokal (A, I, U, E, O) diganti dengan huruf vokal berikutnya dalam urutan (A → I → U → E → O → A).\n- Huruf konsonan diganti dengan 1 huruf tepat setelahnya dalam abjad (misal: B → C, D → F, K → L).\n\nMenggunakan algoritma mesin tersebut, kata "B U D I" akan diubah menjadi kata rahasia...',
    options: ['C E F I', 'C E F U', 'C U F I', 'C E E I'],
    correctIndex: 1,
  },
  {
    id: 'mcq6-21',
    type: 'mcq',
    prompt:
      'Lima orang anak (A, B, C, D, E) berdiri dalam satu barisan lurus. Diketahui informasi berikut:\n\n1. C berada tepat di belakang A.\n2. E berada di paling depan barisan.\n3. B berada di antara E dan A.\n4. D berada di paling belakang barisan.\n\nUrutan barisan anak tersebut dari depan ke belakang yang tepat berdasarkan analisis logika adalah...',
    options: [
      'E - A - B - C - D',
      'E - B - A - C - D',
      'E - B - C - A - D',
      'E - C - B - A - D',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq6-22',
    type: 'mcq',
    prompt:
      'Dalam sebuah algoritma pencarian angka pada daftar terurut [4, 9, 12, 17, 23, 28, 35, 42], digunakan metode membagi dua daftar (Binary Search). Jika angka yang dicari adalah 28, berapa kali batas pertengahan daftar diperiksa hingga angka 28 berhasil ditemukan?',
    options: ['1 kali', '2 kali', '3 kali', '4 kali'],
    correctIndex: 1,
  },
  {
    id: 'mcq6-23',
    type: 'mcq',
    prompt:
      'Perhatikan potongan logika berikut:\n\nJIKA (Hari ini Sabtu ATAU Minggu) DAN (Tugas Sekolah Sudah Selesai = Ya) MAKA "Boleh Bermain Game".\n\nKondisi mana di bawah ini yang membuat seseorang TIDAK BOLEH bermain game?',
    options: [
      'Hari Sabtu dan Tugas Sekolah Sudah Selesai',
      'Hari Minggu dan Tugas Sekolah Sudah Selesai',
      'Hari Sabtu dan Tugas Sekolah Belum Selesai',
      'Hari Minggu dan Tugas Sekolah Belum Selesai',
    ],
    correctIndex: 2,
  },
  {
    id: 'mcq6-24',
    type: 'mcq',
    prompt:
      'Sebuah sistem penampungan air memiliki kapasitas maksimal 50 liter. Air masuk melalui kran sebesar 8 liter per menit, namun terdapat kebocoran di dasar tangki sebesar 3 liter per menit. Jika tangki awalnya kosong, berapa menit waktu yang dibutuhkan hingga tangki terisi penuh tepat 50 liter?',
    options: ['6 menit', '10 menit', '12 menit', '15 menit'],
    correctIndex: 1,
  },
  {
    id: 'mcq6-25',
    type: 'mcq',
    prompt:
      'Sebuah algoritma pemilahan angka memproses daftar angka berikut: [14, 7, 22, 19, 8, 31].\n\nAlgoritma bekerja dengan aturan: "Jika angka GENAP, bagilah dengan 2. Jika angka GANJIL, tambahkan dengan 1."\n\nBerapakah jumlah total seluruh angka setelah semua angka pada daftar diproses tepat satu kali?',
    options: ['51', '56', '60', '64'],
    correctIndex: 2,
  },
  {
    id: 'tf6-1',
    type: 'true-false',
    prompt:
      'Berpikir Komputasional adalah metode pemecahan masalah yang hanya dapat diterapkan pada pelajaran Informatika/Komputer.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf6-2',
    type: 'true-false',
    prompt:
      'Memecah proyek pembuatan taman sekolah menjadi sub-tugas seperti penyiapan tanah, pemilihan bibit, dan penanaman merupakan bentuk Dekomposisi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-3',
    type: 'true-false',
    prompt:
      'Abstraksi adalah proses mengumpulkan seluruh informasi sekecil apa pun, baik yang penting maupun yang tidak penting.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf6-4',
    type: 'true-false',
    prompt:
      'Algoritma yang baik harus memiliki langkah-langkah yang berurutan, jelas, dan memiliki akhir (tidak berjalan terus tanpa henti).',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-5',
    type: 'true-false',
    prompt:
      'Memprediksi bahwa harga barang akan naik menjelang hari raya berdasarkan data tahun-tahun sebelumnya merupakan penerapan dari Pengenalan Pola.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-6',
    type: 'true-false',
    prompt:
      'Jika langkah-langkah dalam suatu algoritma diubah urutannya secara acak, hasil akhir yang diperoleh dipastikan akan selalu sama.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf6-7',
    type: 'true-false',
    prompt:
      'Debugging adalah proses mengidentifikasi, menganalisis, dan memperbaiki kesalahan yang ada pada suatu algoritma atau prosedur.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-8',
    type: 'true-false',
    prompt:
      'Berpikir Komputasional bertujuan untuk melatih kita agar bertindak dan berpikir seperti robot tanpa menggunakan perasaan atau pertimbangan lain.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf6-9',
    type: 'true-false',
    prompt:
      'Menentukan ide utama dari setiap paragraf dalam sebuah bacaan panjang adalah contoh penerapan pilar Abstraksi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf6-10',
    type: 'true-false',
    prompt:
      'Penyusunan algoritma yang memiliki pilihan kondisi (JIKA... MAKA...) memungkinkan solusi menyesuaikan dengan situasi yang berbeda.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'fb6-1',
    type: 'short-answer',
    prompt:
      'Pilar Berpikir Komputasional yang dilakukan dengan cara memecah masalah besar dan rumit menjadi bagian-bagian yang lebih kecil dan sederhana dinamakan _______________.',
    acceptableAnswers: ['dekomposisi', 'decomposition'],
  },
  {
    id: 'fb6-2',
    type: 'short-answer',
    prompt:
      'Proses memfokuskan perhatian pada informasi yang penting dan mengabaikan detail yang tidak relevan disebut pilar _______________.',
    acceptableAnswers: ['abstraksi', 'abstraction'],
  },
  {
    id: 'fb6-3',
    type: 'short-answer',
    prompt:
      'Kumpulan langkah-langkah logis dan terstruktur yang disusun secara berurutan untuk menyelesaikan suatu masalah dinamakan _______________.',
    acceptableAnswers: ['algoritma', 'algorithm'],
  },
  {
    id: 'fb6-4',
    type: 'short-answer',
    prompt:
      'Mengamati keteraturan, kemiripan, atau tren berulang dari beberapa permasalahan yang pernah dihadapi sebelumnya merupakan pilar _______________.',
    acceptableAnswers: ['pengenalan pola', 'pola'],
  },
  {
    id: 'fb6-5',
    type: 'short-answer',
    prompt:
      'Proses memeriksa kembali alur penyelesaian masalah untuk menemukan dan membetulkan langkah yang keliru dinamakan proses _______________ (atau Evaluasi/Pembenahan).',
    acceptableAnswers: ['debugging', 'evaluasi', 'pembenahan'],
  },
  {
    id: 'reason6-1',
    type: 'mcq',
    section: 'Penalaran Logis',
    prompt:
      '(Masalah Penyeberangan Sungai)\n\nSeorang petani harus menyeberangkan seekor SERIGALA, seekor KAMBING, dan sekeranjang SAYURAN menyeberangi sungai menggunakan perahu kecil. Perahu hanya cukup untuk petani dan SATU barang/hewan dalam sekali jalan.\n\nAturan Keamanan:\n* Jika Serigala ditinggal bersama Kambing tanpa Petani, Serigala akan memakan Kambing.\n* Jika Kambing ditinggal bersama Sayuran tanpa Petani, Kambing akan memakan Sayuran.\n* Serigala tidak memakan Sayuran.\n\nBerapa jumlah langkah minimal agar Petani berhasil menyeberangkan ketiganya dengan selamat sampai ke seberang?',
    options: ['5 langkah', '7 langkah', '9 langkah', '11 langkah'],
    correctIndex: 1,
  },
  {
    id: 'reason6-2',
    type: 'mcq',
    section: 'Penalaran Logis',
    prompt:
      '(Timbangan Palsu dan Pencarian Biner)\n\nKamu memiliki 9 koin emas yang tampak persis sama. Namun, 1 di antaranya adalah koin palsu yang beratnya LEBIH RINGAN dibanding 8 koin asli lainnya. Kamu dibekali sebuah timbangan jungkat-jungkit dua sisi (tanpa anak timbangan).\n\nBagaimana algoritma membagi koin dan menggunakan timbangan tersebut agar kamu dipastikan dapat menemukan 1 koin palsu? Berapa MAKSIMAL kali PENIMBANGAN yang dibutuhkan?',
    options: ['1 kali penimbangan', '2 kali penimbangan', '3 kali penimbangan', '4 kali penimbangan'],
    correctIndex: 1,
  },
  {
    id: 'reason6-3',
    type: 'mcq',
    section: 'Penalaran Logis',
    prompt:
      '(Aturan Lampu Sakelar dan Logika Kondisi)\n\nTiga orang sahabat (Arya, Bima, dan Cici) menyalakan sakelar lampu rumah berdasarkan aturan logika berikut:\n\n- Arya menyalakan sakelar jika Bima menyalakan sakelar.\n- Cici menyalakan sakelar jika Arya TIDAK menyalakan sakelar.\n- Bima menyalakan sakelar jika hari sudah malam.\n\nJika situasi saat ini menunjukkan bahwa HARI SUDAH MALAM, tentukan status lampu (MENYALA atau MATI) untuk Arya, Bima, dan Cici!',
    options: [
      'Arya MENYALA, Bima MENYALA, Cici MATI',
      'Arya MATI, Bima MENYALA, Cici MENYALA',
      'Arya MENYALA, Bima MATI, Cici MENYALA',
      'Arya MATI, Bima MATI, Cici MATI',
    ],
    correctIndex: 0,
  },
  {
    id: 'reason6-4',
    type: 'mcq',
    section: 'Penalaran Logis',
    prompt:
      '(Lomba Lari dan Analisis Urutan Posisi)\n\nEmpat siswa (Rina, Sinta, Tono, dan Umar) mengikuti lomba lari 100 meter.\nDiketahui fakta-fakta posisi finish berikut:\n\n- Rina finish lebih cepat daripada Sinta.\n- Tono finish tepat di belakang Sinta.\n- Umar finish lebih cepat daripada Rina, tetapi Umar BUKAN di posisi pertama.\n\nTentukan urutan juara lengkap dari Posisi Pertama (Juara 1) hingga Posisi Keempat (Juara 4)! Tunjukkan analisis penalaranmu!',
    options: [
      'Umar - Rina - Sinta - Tono',
      'Rina - Umar - Sinta - Tono',
      'Umar - Sinta - Rina - Tono',
      'Rina - Sinta - Tono - Umar',
    ],
    correctIndex: 0,
  },
  {
    id: 'reason6-5',
    type: 'mcq',
    section: 'Penalaran Logis',
    prompt:
      '(Optimasi Kapasitas Tas / Knapsack Problem)\n\nSeorang petualang memiliki tas ransel dengan kapasitas beban maksimal 10 kg. Ia menemukan 4 barang berharga dengan berat dan nilai keuntungan sebagai berikut:\n\n- Barang 1: Berat = 5 kg, Nilai = Rp 10.000.000\n- Barang 2: Berat = 4 kg, Nilai = Rp 7.000.000\n- Barang 3: Berat = 3 kg, Nilai = Rp 6.000.000\n- Barang 4: Berat = 2 kg, Nilai = Rp 3.000.000\n\nTentukan kombinasi barang mana saja yang harus dimasukkan ke dalam tas agar petualang mendapatkan TOTAL NILAI KEUNTUNGAN MAKSIMAL tanpa melebihi batas kapasitas 10 kg!',
    options: [
      'Barang 1 + Barang 2 (total 9 kg, Rp 17.000.000)',
      'Barang 1 + Barang 3 + Barang 4 (total 10 kg, Rp 19.000.000)',
      'Barang 2 + Barang 3 + Barang 4 (total 9 kg, Rp 16.000.000)',
      'Barang 1 + Barang 2 + Barang 4 (total 11 kg, Rp 20.000.000)',
    ],
    correctIndex: 1,
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
  'mcq6-21',
  'mcq6-22',
  'mcq6-23',
  'mcq6-24',
  'mcq6-25',
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
  'reason6-1',
  'reason6-2',
  'reason6-3',
  'reason6-4',
  'reason6-5',
]

/** @type {Exam} */
export const EXAM_6 = {
  id: 'kuis-berpikir-komputasional-6',
  title: 'Kuis Berpikir Komputasional Kelas 6',
  description:
    'Soal kuis untuk kelas 6 SD: 25 pilihan ganda, 10 benar/salah, 5 isian singkat, dan 5 penalaran logis. Jawab semua soal dengan teliti!',
  durationSeconds: 5400,
  questions: EXAM_6_QUESTION_IDS.map((id) =>
    QUESTION_BANK_6.find((question) => question.id === id),
  ),
}
