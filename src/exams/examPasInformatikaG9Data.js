/**
 * @typedef {'mcq' | 'true-false' | 'short-answer'} QuestionType
 */

/**
 * @typedef {object} Question
 * @property {string} id
 * @property {QuestionType} type
 * @property {string} prompt
 * @property {string} [image]
 * @property {string[]} [options]
 * @property {number} [correctIndex]
 * @property {string[]} [acceptableAnswers]
 */

/**
 * @typedef {object} Exam
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} durationSeconds
 * @property {Question[]} questions
 */

/** @type {Question[]} */
export const QUESTION_BANK_PAS_INFORMATIKA_G9 = [
  {
    id: 'pas-g9-mcq-1',
    type: 'mcq',
    prompt:
      'Kerangka kerja atau alur tahapan terstruktur yang digunakan tim pengembang untuk merencanakan, merancang, membangun, menguji, meluncurkan, dan merawat sebuah perangkat lunak disebut...',
    options: [
      'Hardware Lifecycle',
      'Software Development Life Cycle (SDLC)',
      'Artificial Intelligence Framework',
      'Data Processing Cycle',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-2',
    type: 'mcq',
    prompt:
      'Dalam analogi pembangunan, proses rekayasa perangkat lunak diibaratkan seperti membangun rumah yang memerlukan cetak biru dan denah sebelum menyusun batu bata. Hal ini bertujuan untuk...',
    options: [
      'Menghabiskan anggaran proyek di awal',
      'Menghindari kesalahan sasaran, kerusakan fatal, dan kegagalan aplikasi saat dipakai',
      'Mengganti peran seluruh anggota tim menjadi pekerja bangunan',
      'Mempercepat penulisan kode program tanpa pengujian',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-3',
    type: 'mcq',
    prompt:
      'Mengapa metodologi Blueprint-First (Cetak Biru) sangat penting dalam pengembangan perangkat lunak modern?',
    options: [
      'Karena penulisan kode kini dapat dibantu AI, sehingga penentu sukses utama adalah ketajaman perencanaan arsitektur manusia',
      'Karena cetak biru membuat aplikasi otomatis selesai tanpa perlu diprogram',
      'Karena pengguna hanya ingin melihat gambar sketsa tanpa menggunakan aplikasi',
      'Karena cetak biru menghapus kebutuhan pemeliharaan sistem',
    ],
    correctIndex: 0,
  },
  {
    id: 'pas-g9-mcq-4',
    type: 'mcq',
    prompt:
      'Tiga pilar utama yang wajib dijawab secara konkret dalam dokumen spesifikasi cetak biru (blueprint) adalah...',
    options: [
      'Biaya server, jumlah komputer, dan merek laptop',
      'Aturan logika keputusan, relasi tabel data nyata, dan rancangan layar yang ergonomis',
      'Kecepatan internet, jumlah tim, dan nama domain',
      'Iklan media sosial, naskah video, dan harga aplikasi',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-5',
    type: 'mcq',
    prompt:
      'Aturan emas gerbang fase (phase gate) dalam metodologi pengembangan perangkat lunak menegaskan bahwa tim dilarang...',
    options: [
      'Melakukan evaluasi di akhir proyek',
      'Melompat langsung ke fase Desain atau Bangun sebelum masalah nyata di fase Riset (Discovery) dipahami dan tervalidasi',
      'Menuliskan laporan bug pada saat uji coba',
      'Menggunakan kecerdasan buatan dalam membantu penulisan kode',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-6',
    type: 'mcq',
    prompt:
      'Tahapan awal di mana tim mengidentifikasi masalah nyata di sekitar siswa, mewawancarai calon pengguna, dan merumuskan nilai manfaat aplikasi adalah...',
    options: [
      'Fase 1: Riset (Discovery)',
      'Fase 3: Desain (Design)',
      'Fase 5: Bangun (Development)',
      'Fase 7: Luncurkan (Publish)',
    ],
    correctIndex: 0,
  },
  {
    id: 'pas-g9-mcq-7',
    type: 'mcq',
    prompt:
      'Dokumen artefak kerja yang dihasilkan pada Fase 1 — Riset (Discovery) meliputi...',
    options: [
      'Source code HTML dan CSS',
      'Problem Statement Canvas, Profil Persona Pengguna, dan Peta Empati Siswa',
      'Release Notes dan Pitch Deck presentasi',
      'Diagram Relasi Entitas (ERD) dan Kamus Data',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-8',
    type: 'mcq',
    prompt:
      'Pada Fase 2 — Rencana (Planning), fokus utama kegiatan tim pengembang adalah...',
    options: [
      'Menulis naskah video profil sekolah',
      'Membatasi ruang lingkup fitur agar tidak melebar, menyusun prioritas kerja, dan menetapkan target sprint',
      'Menghapus database lama yang tersimpan di server',
      'Mengunggah aplikasi ke server publik',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-9',
    type: 'mcq',
    prompt:
      'Artefak kerja berupa User Stories ("As a user..."), Product Backlog berbasis skala MoSCoW, dan jadwal sprint mingguan disusun pada...',
    options: [
      'Fase Riset',
      'Fase Rencana (Planning)',
      'Fase Uji QA',
      'Fase Rawat',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-10',
    type: 'mcq',
    prompt:
      'Fase di mana tim merancang navigasi visual antarlayar, tata letak tombol, palet warna kontras, serta prototipe interaktif adalah...',
    options: [
      'Fase Desain (Design)',
      'Fase Konten (Content)',
      'Fase Bangun (Development)',
      'Fase Rawat (Maintenance)',
    ],
    correctIndex: 0,
  },
  {
    id: 'pas-g9-mcq-11',
    type: 'mcq',
    prompt:
      'Sketsa kertas wireframe, komponen Figma, dan panduan token desain (ukuran dan warna) merupakan artefak bukti kerja nyata pada...',
    options: [
      'Fase Rencana',
      'Fase Desain',
      'Fase Uji QA',
      'Fase Luncurkan',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-12',
    type: 'mcq',
    prompt:
      'Tugas menyusun struktur tabel data relasional, format data JSON, kamus mikro-teks (copywriting), dan pesan notifikasi ramah pengguna dikerjakan pada...',
    options: [
      'Fase 1: Riset',
      'Fase 4: Konten (Content)',
      'Fase 7: Luncurkan',
      'Fase 8: Rawat',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-13',
    type: 'mcq',
    prompt:
      'Bukti kerja berupa Diagram Hubungan Entitas (Entity Relationship Diagram / ERD), Kamus Data, dan Dataset Dummy (Seed JSON) dihasilkan pada fase...',
    options: [
      'Konten',
      'Desain',
      'Rencana',
      'Uji QA',
    ],
    correctIndex: 0,
  },
  {
    id: 'pas-g9-mcq-14',
    type: 'mcq',
    prompt:
      'Pada Fase 5 — Bangun (Development), kegiatan utama yang dilakukan oleh tim pengembang adalah...',
    options: [
      'Mewawancarai calon pengguna untuk mencari masalah baru',
      'Menerjemahkan aturan logika bisnis menjadi alur komputasi, pohon percabangan keputusan, dan validasi formulir',
      'Mencari kesalahan warna pada logo sekolah',
      'Menghitung biaya operasional tahunan aplikasi',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-15',
    type: 'mcq',
    prompt:
      'Pohon Logika Percabangan IF/THEN, Panduan Validasi Data Form, dan Matriks Transisi Layar merupakan artefak utama dari fase...',
    options: [
      'Riset',
      'Rencana',
      'Bangun (Development)',
      'Rawat',
    ],
    correctIndex: 2,
  },
  {
    id: 'pas-g9-mcq-16',
    type: 'mcq',
    prompt:
      'Fase yang berfokus memburu celah kesalahan sistem (bug), menguji input ekstrem atau tidak wajar (chaos testing), dan memverifikasi aksesibilitas adalah...',
    options: [
      'Fase Desain',
      'Fase Konten',
      'Fase Uji QA (Testing)',
      'Fase Luncurkan',
    ],
    correctIndex: 2,
  },
  {
    id: 'pas-g9-mcq-17',
    type: 'mcq',
    prompt:
      'Tingkat keparahan kesalahan sistem (bug) dalam pengujian perangkat lunak dicatat dalam lembar laporan prioritas...',
    options: [
      'Level A sampai Z',
      'Prioritas P1 hingga P4',
      'Skala 1 sampai 100',
      'Kategori Ringan dan Berat saja',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-18',
    type: 'mcq',
    prompt:
      'Mempresentasikan proyek di depan guru/penguji, menyiapkan Pitch Deck, menyusun Catatan Rilis (Release Notes), dan melakukan demo langsung dilakukan pada...',
    options: [
      'Fase 2: Rencana',
      'Fase 4: Konten',
      'Fase 7: Luncurkan (Publish)',
      'Fase 8: Rawat',
    ],
    correctIndex: 2,
  },
  {
    id: 'pas-g9-mcq-19',
    type: 'mcq',
    prompt:
      'Pada Fase 8 — Rawat (Maintenance), kegiatan tim meliputi...',
    options: [
      'Mengumpulkan ulasan nyata pascademo, evaluasi kendala tim, dan merancang usulan fitur pembaruan versi 2 (v2)',
      'Menghapus seluruh kode program dan membuat ulang dari awal',
      'Menggambar ulang sketsa wireframe di kertas baru',
      'Mengganti semua anggota tim pengembang',
    ],
    correctIndex: 0,
  },
  {
    id: 'pas-g9-mcq-20',
    type: 'mcq',
    prompt:
      'Peran pengembang yang bertanggung jawab memimpin 3 fase logika dan arsitektur (Fase 1 Riset, Fase 2 Rencana, dan Fase 5 Bangun) adalah...',
    options: [
      'Desainer UI/UX',
      'Analis Sistem (System Analyst)',
      'Insinyur Konten/DB',
      'Komunikasi & Penguji QA',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-21',
    type: 'mcq',
    prompt:
      'Anggota tim yang memegang kendali penuh atas keindahan visual, estetika warna, kejelasan ikon (UI), serta kenyamanan psikologis pengguna agar tidak tersesat (UX) adalah...',
    options: [
      'Analis Sistem',
      'Desainer UI/UX',
      'Insinyur Basis Data',
      'Penguji Mutu (Tester)',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-22',
    type: 'mcq',
    prompt:
      'Dalam perumpamaan sebuah restoran, peran Analis Sistem (System Analyst & Logic Architect) setara dengan...',
    options: [
      'Desainer interior yang memilih warna cat dinding dan bentuk kursi',
      'Manajer operasional restoran yang mengatur alur pesanan dari meja ke dapur hingga kasir mencetak tagihan',
      'Petugas kebersihan yang membersihkan piring kotor',
      'Tamu yang datang untuk mencicipi makanan',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-23',
    type: 'mcq',
    prompt:
      'Peran yang diibaratkan seperti petugas logistik dan penyusun katalog produk di supermarket, yang memastikan rak terisi penuh, berlabel jelas, dan tercatat rapi di inventaris gudang adalah...',
    options: [
      'Desainer UI/UX',
      'Spesialis Konten & Basis Data (Content & Database Specialist)',
      'Penguji QA',
      'Analis Sistem',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-24',
    type: 'mcq',
    prompt:
      'Anggota tim yang bertindak sebagai jembatan komunikasi dengan pengguna sekaligus pengawas mutu yang menguji keandalan sistem agar bebas dari bug diibaratkan seperti...',
    options: [
      'Koki yang memasak di dapur',
      'Tim Pengawas Kualitas dan Pencicip Makanan (Food Quality Control) di pabrik makanan',
      'Pelukis spanduk restoran',
      'Kasir penghitung uang tunai',
    ],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-mcq-25',
    type: 'mcq',
    prompt:
      'Peran Komunikasi & Penguji QA (Comm & Tester) bertanggung jawab memimpin 3 fase penjaminan mutu pada siklus SDLC, yaitu...',
    options: [
      'Fase 1 (Riset), Fase 2 (Rencana), dan Fase 3 (Desain)',
      'Fase 3 (Desain), Fase 4 (Konten), dan Fase 5 (Bangun)',
      'Fase 6 (Uji QA), Fase 7 (Luncurkan), dan Fase 8 (Rawat)',
      'Fase 1 (Riset), Fase 4 (Konten), dan Fase 8 (Rawat)',
    ],
    correctIndex: 2,
  },
  {
    id: 'pas-g9-tf-1',
    type: 'true-false',
    prompt:
      'SDLC (Software Development Life Cycle) memiliki sifat siklus berulang, di mana masukan dan evaluasi pada tahap Pemeliharaan (Rawat) akan menjadi bahan riset baru untuk pengembangan aplikasi versi berikutnya (v2).',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'pas-g9-tf-2',
    type: 'true-false',
    prompt:
      'Dalam prinsip Blueprint-First, seorang desainer UI/UX diperbolehkan langsung menggambar antarmuka layar di Figma meskipun masalah calon pengguna pada fase Riset (Discovery) belum divalidasi.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-tf-3',
    type: 'true-false',
    prompt:
      'Desainer UI/UX bertanggung jawab memimpin Fase 3 (Desain) dan menghasilkan artefak berupa sketsa wireframe, komponen Figma, dan panduan token desain.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'pas-g9-tf-4',
    type: 'true-false',
    prompt:
      'Pembuatan aturan logika percabangan IF/THEN dan validasi masukan formulir merupakan tanggung jawab utama Insinyur Konten/DB pada Fase Konten.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'pas-g9-tf-5',
    type: 'true-false',
    prompt:
      'Peran Kom & Penguji QA memimpin pengujian skenario ekstrem (happy/chaos testing), penyusunan laporan bug P1–P4, serta memimpin fase peluncuran dan perawatan aplikasi.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'pas-g9-essay-1',
    type: 'short-answer',
    prompt:
      '(Uraian) Jelaskan pengertian dari SDLC (Software Development Life Cycle) dan sebutkan mengapa pendekatan ini diibaratkan seperti membangun sebuah gedung atau rumah!',
    acceptableAnswers: ['(dinilai manual)'],
  },
  {
    id: 'pas-g9-essay-2',
    type: 'short-answer',
    prompt:
      '(Uraian) Apa yang dimaksud dengan prinsip Blueprint-First, dan mengapa ketajaman perencanaan manusia jauh lebih menentukan keberhasilan proyek dibandingkan sekadar memiliki ide yang menarik?',
    acceptableAnswers: ['(dinilai manual)'],
  },
  {
    id: 'pas-g9-essay-3',
    type: 'short-answer',
    prompt:
      '(Uraian) Sebutkan secara berurutan 8 Fase SDLC dari awal hingga akhir beserta satu contoh artefak (bukti kerja fisik/dokumen) yang dihasilkan pada masing-masing fase!',
    acceptableAnswers: ['(dinilai manual)'],
  },
  {
    id: 'pas-g9-essay-4',
    type: 'short-answer',
    prompt:
      '(Uraian) Jelaskan perbedaan mendasar antara tugas seorang UI/UX Designer dengan seorang System Analyst & Logic Architect dalam tim pengembang perangkat lunak!',
    acceptableAnswers: ['(dinilai manual)'],
  },
  {
    id: 'pas-g9-essay-5',
    type: 'short-answer',
    prompt:
      '(Uraian) Mengapa peran Comm & Tester / Quality Assurance (QA) sangat krusial sebelum sebuah aplikasi diluncurkan ke publik, dan apa saja yang mereka uji dalam skenario pengujian?',
    acceptableAnswers: ['(dinilai manual)'],
  },
]

/** @type {Exam} */
export const EXAM_PAS_INFORMATIKA_G9 = {
  id: 'pas-informatika-g9',
  title: 'PAS Informatika Kelas 9',
  description:
    'Penilaian Akhir Semester Ganjil Informatika Kelas IX (Fase D) - SDLC, Blueprint-First, dan peran tim pengembang. Soal uraian dinilai manual.',
  durationSeconds: 90 * 60,
  questions: QUESTION_BANK_PAS_INFORMATIKA_G9,
}