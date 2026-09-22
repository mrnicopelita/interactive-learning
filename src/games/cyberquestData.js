/**
 * CyberQuest: Computational World
 * Data schema for the 10-stage educational adventure for Grade 5.
 */

export const CYBERQUEST_META = {
  game_title: 'CyberQuest: Computational World',
  grade_level: 5,
  total_stages: 10,
  player: 'Kiki the Cyber-Bot',
  story_lines: [
    'SALAM DARI DUNIA DIGITAL! Aku Kiki si Cyber-Bot.',
    'Virus DoomGlitch telah mengacaukan dunia digitalku. Semua sistem rusak!',
    'Aku butuh bantuanmu, pahlawan cilik! Selesaikan 10 misi untuk memulihkannya.',
    'Setiap misi melatih berpikir komputasional dan literasi digital. Lewat misi, dapatkan Bintang dan Lencana Digital Master!',
  ],
}

/**
 * @param {number} quizCorrect
 * @param {number} quizTotal
 * @param {number} mistakes  Minigame mistakes
 */
export function starsFor(quizCorrect, quizTotal, mistakes) {
  if (quizCorrect === quizTotal && mistakes <= 2) return 3
  if (quizCorrect >= Math.ceil(quizTotal * 0.66)) return 2
  return 1
}

export const CYBERQUEST_STAGES = [
  {
    id: 1,
    title: 'Basecamp of Logic',
    subtitle: 'Berpikir Komputasional',
    kisi_kisi_ref: 'Point 1: Berpikir Komputasional',
    theme: 'Memperbaiki inti pemrosesan Kiki yang rusak',
    icon: '🧠',
    badge: 'Lencana Master Logika',
    color: {
      grad: 'from-sky-500 to-blue-700',
      text: 'text-sky-600',
      chip: 'bg-sky-500',
      ring: 'ring-sky-400',
      dark: 'bg-sky-700',
    },
    briefing:
      'Inti pemrosesan Kiki rusak! Pilih hanya kartu-kartu yang menggambarkan berpikir komputasional agar inti Kiki menyala kembali.',
    minigame: {
      type: 'node_connector',
      title: 'Perbaiki Inti Pemrosesan',
      instruction:
        'Ketuk kartu yang BENAR untuk mengisi inti Kiki. Kartu yang salah akan dibuang!',
      coreLabel: 'Inti Pemrosesan Kiki',
      cards: [
        { id: 'c1', text: 'Menyusun langkah yang logis', correct: true },
        { id: 'c2', text: 'Memecahkan masalah dengan cara pikir komputer', correct: true },
        { id: 'c3', text: 'Membantu menyelesaikan masalah sehari-hari', correct: true },
        { id: 'c4', text: 'Membuat masalah semakin sulit', correct: false },
        { id: 'c5', text: 'Menebak jawaban tanpa berpikir', correct: false },
        { id: 'c6', text: 'Menghafal tanpa memahami', correct: false },
      ],
    },
    questions: [
      {
        id: 's1q1',
        type: 'mcq',
        prompt: 'Cara berpikir untuk memecahkan masalah menggunakan konsep dasar ilmu komputer disebut...',
        options: ['Berpikir Komputasional', 'Berpikir Naratif', 'Mengolah Teks', 'Konversi Berkas'],
        correctIndex: 0,
      },
      {
        id: 's1q2',
        type: 'true-false',
        prompt: 'Tujuan utama berpikir komputasional adalah membuat masalah sehari-hari menjadi lebih sulit.',
        options: ['Benar', 'Salah'],
        correctIndex: 1,
      },
      {
        id: 's1q3',
        type: 'mcq',
        prompt: 'Jika kamu menyusun langkah-langkah menyelesaikan PR dengan rapi, berarti kamu sedang...',
        options: ['Berpikir komputasional', 'Memasak', 'Menebak soalnya', 'Berlari cepat'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 2,
    title: 'The Sequence Path',
    subtitle: 'Algoritma & Urutan',
    kisi_kisi_ref: 'Point 2: Algoritma & Urutan',
    theme: 'Membangun jembatan di atas Sungai Digital',
    icon: '🌉',
    badge: 'Lencana Arsitek Algoritma',
    color: {
      grad: 'from-cyan-500 to-blue-600',
      text: 'text-cyan-600',
      chip: 'bg-cyan-500',
      ring: 'ring-cyan-400',
      dark: 'bg-cyan-700',
    },
    briefing:
      'Jembatan di Sungai Digital runtuh! Susun langkah-langkah dalam urutan yang benar agar jembatan Kokoh kembali.',
    minigame: {
      type: 'sequence',
      title: 'Jembatan Urutan',
      instruction: 'Seret langkah-langkah ke urutan yang benar! Salah urutan, jembatan runtuh!',
      sequences: [
        {
          label: 'Mencuci Tangan yang Benar',
          items: [
            { id: 'a', text: 'Basahi tangan dengan sabun' },
            { id: 'b', text: 'Bilas dengan air bersih' },
            { id: 'c', text: 'Keringkan dengan handuk' },
          ],
        },
        {
          label: 'Membuat Teh Manis',
          items: [
            { id: 'd', text: 'Siapkan gelas dan teh celup' },
            { id: 'e', text: 'Tuang air panas ke gelas' },
            { id: 'f', text: 'Masukkan gula lalu aduk' },
          ],
        },
        {
          label: 'Menyikat Gigi',
          items: [
            { id: 'g', text: 'Oleskan pasta gigi pada sikat' },
            { id: 'h', text: 'Sikat gigi dengan gerakan memutar' },
            { id: 'i', text: 'Berkumur sampai bersih' },
          ],
        },
      ],
    },
    questions: [
      {
        id: 's2q1',
        type: 'fill',
        prompt: 'Langkah-langkah logis dan terstruktur untuk menyelesaikan masalah disebut...',
        acceptable: ['algoritma'],
      },
      {
        id: 's2q2',
        type: 'mcq',
        prompt: 'Mengapa urutan langkah sangat penting dalam algoritma?',
        options: [
          'Agar pekerjaan berjalan lancar dan hasilnya benar',
          'Agar pekerjaan menjadi lebih sulit',
          'Urutan tidak penting sama sekali',
          'Agar langkah menjadi acak',
        ],
        correctIndex: 0,
      },
      {
        id: 's2q3',
        type: 'true-false',
        prompt: 'Membuat mie instan yang benar harus dimulai dengan merebus air terlebih dahulu.',
        options: ['Benar', 'Salah'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 3,
    title: 'The Decomposition Lab',
    subtitle: 'Dekomposisi',
    kisi_kisi_ref: 'Point 3: Dekomposisi',
    theme: 'Merapikan ruang cyber yang berantakan',
    icon: '🧩',
    badge: 'Lencana Ahli Dekomposisi',
    color: {
      grad: 'from-emerald-500 to-green-700',
      text: 'text-emerald-600',
      chip: 'bg-emerald-500',
      ring: 'ring-emerald-400',
      dark: 'bg-emerald-700',
    },
    briefing:
      'Tujuan besar "Membersihkan Rumah" terlalu rumit! Pecah menjadi bagian-bagian kecil yang lebih mudah dikerjakan.',
    minigame: {
      type: 'decomposition',
      title: 'Ruang Cyber Berantakan',
      instruction:
        'Pecahkan tujuan besar ke dalam 3 kotak tugas kecil! Seret kartu ke kotak yang benar.',
      goal: 'Membersihkan Rumah',
      bins: [
        { id: 'sapu', label: 'Menyapu Lantai', emoji: '🧹' },
        { id: 'pel', label: 'Mengelap Lantai', emoji: '🧽' },
        { id: 'meja', label: 'Merapikan Meja', emoji: '📚' },
      ],
      items: [
        { id: 'i1', label: 'Sapu lantai ruang tamu', bin: 'sapu' },
        { id: 'i2', label: 'Menyapu serpihan di depan pintu', bin: 'sapu' },
        { id: 'i3', label: 'Lap lantai dapur dengan pel', bin: 'pel' },
        { id: 'i4', label: 'Mengelap lantai kamar mandi', bin: 'pel' },
        { id: 'i5', label: 'Rapikan buku di atas meja', bin: 'meja' },
        { id: 'i6', label: 'Susun pensil ke tempat pensil', bin: 'meja' },
        { id: 'i7', label: 'Menonton TV', bin: null },
        { id: 'i8', label: 'Bermain game sepanjang hari', bin: null },
        { id: 'i9', label: 'Makan camilan', bin: null },
      ],
    },
    questions: [
      {
        id: 's3q1',
        type: 'mcq',
        prompt: 'Apa yang dimaksud dengan dekomposisi?',
        options: [
          'Memecah masalah besar menjadi bagian-bagian kecil',
          'Menghafal semua langkah sekaligus',
          'Mengabaikan semua detail',
          'Menggabungkan masalah menjadi satu',
        ],
        correctIndex: 0,
      },
      {
        id: 's3q2',
        type: 'mcq',
        prompt: 'Contoh dekomposisi yang benar adalah...',
        options: [
          'Membagi tugas kelompok menjadi ketua, pencatat, dan pembuat',
          'Mengerjakan semua tugas sendiri',
          'Menunda-nunda pekerjaan',
          'Menebak jawaban tanpa bekerja',
        ],
        correctIndex: 0,
      },
      {
        id: 's3q3',
        type: 'fill',
        prompt: 'Memecah masalah besar menjadi bagian-bagian kecil disebut...',
        acceptable: ['dekomposisi', 'penguraian'],
      },
    ],
  },
  {
    id: 4,
    title: 'Pattern Matrix',
    subtitle: 'Pengenalan Pola',
    kisi_kisi_ref: 'Point 4: Pengenalan Pola',
    theme: 'Membuka pintu keamanan dunia digital',
    icon: '🔢',
    badge: 'Lencana Detektif Pola',
    color: {
      grad: 'from-amber-500 to-orange-600',
      text: 'text-amber-600',
      chip: 'bg-amber-500',
      ring: 'ring-amber-400',
      dark: 'bg-amber-600',
    },
    briefing:
      'Pintu keamanan terkunci dengan pola! Lengkapi pola angka dan bentuk untuk membuka kuncinya.',
    minigame: {
      type: 'pattern',
      title: 'Matriks Pola',
      instruction: 'Lengkapi pola untuk membuka kunci pintu!',
      solves: [
        {
          id: 'p1',
          display: ['2', '4', '6', '8', '?'],
          options: ['10', '9', '12'],
          answer: 0,
          hint: 'Tambah 2 setiap langkah',
        },
        {
          id: 'p2',
          display: ['5', '10', '15', '20', '?'],
          options: ['25', '23', '30'],
          answer: 0,
          hint: 'Tambah 5 setiap langkah',
        },
        {
          id: 'p3',
          display: ['▲', '▲▲', '▲▲▲', '?'],
          options: ['▲▲▲▲', '▲▲', '▲▲▲▲▲'],
          answer: 0,
          hint: 'Jumlah segitiga makin banyak',
        },
      ],
    },
    questions: [
      {
        id: 's4q1',
        type: 'mcq',
        prompt: 'Apa itu pengenalan pola?',
        options: [
          'Mencari kesamaan atau pengulangan pada data/benda',
          'Membuang semua data',
          'Menghitung tanpa melihat',
          'Mengubah format berkas',
        ],
        correctIndex: 0,
      },
      {
        id: 's4q2',
        type: 'fill',
        prompt: 'Lengkapi pola berikut: 5, 10, 15, 20, ?',
        acceptable: ['25', 'dua puluh lima'],
      },
      {
        id: 's4q3',
        type: 'true-false',
        prompt: 'Pada pola 1, 2, 1, 2, 1, ... bilangan berikutnya adalah 2.',
        options: ['Benar', 'Salah'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 5,
    title: 'Tower of Abstraction',
    subtitle: 'Abstraksi',
    kisi_kisi_ref: 'Point 5: Abstraksi',
    theme: 'Penyaring peta navigasi Kiki',
    icon: '🗺️',
    badge: 'Lencana Kacamata Abstraksi',
    color: {
      grad: 'from-violet-500 to-purple-700',
      text: 'text-violet-600',
      chip: 'bg-violet-500',
      ring: 'ring-violet-400',
      dark: 'bg-violet-700',
    },
    briefing:
      'Peta kota Kiki penuh detail: banyak pohon, rumah, dan batu. Nyalakan kacamata filter untuk fokus pada hal penting saja: halte bus!',
    minigame: {
      type: 'abstraction',
      title: 'Peta Navigasi Kiki',
      instruction:
        'Nyalakan kacamata filter untuk menyembunyikan detail tidak penting, lalu ketuk semua halte bus!',
      mission: 'Temukan 3 Halte Bus',
      filterLabel: 'Nyalakan Kacamata Filter',
      totalTargets: 3,
      items: [
        { id: 'p1', kind: 'bus', label: 'Halte Bus', emoji: '🚏' },
        { id: 'p2', kind: 'noise', label: 'Pohon', emoji: '🌳' },
        { id: 'p3', kind: 'bus', label: 'Halte Bus', emoji: '🚏' },
        { id: 'p4', kind: 'noise', label: 'Rumah', emoji: '🏠' },
        { id: 'p5', kind: 'bus', label: 'Halte Bus', emoji: '🚏' },
        { id: 'p6', kind: 'noise', label: 'Batu Besar', emoji: '🪨' },
        { id: 'p7', kind: 'noise', label: 'Toko', emoji: '🏪' },
        { id: 'p8', kind: 'noise', label: 'Pohon', emoji: '🌳' },
      ],
    },
    questions: [
      {
        id: 's5q1',
        type: 'mcq',
        prompt: 'Apa fungsi dari abstraksi?',
        options: [
          'Fokus pada informasi penting dan mengabaikan yang tidak penting',
          'Menghafal semua detail',
          'Membuat masalah semakin rumit',
          'Menyembunyikan semua informasi',
        ],
        correctIndex: 0,
      },
      {
        id: 's5q2',
        type: 'mcq',
        prompt: 'Contoh abstraksi dalam kehidupan sehari-hari adalah...',
        options: [
          'Peta hanya menampilkan nama stasiun dan jalurnya',
          'Menghafal nama semua pohon di kota',
          'Melihat semua iklan TV',
          'Menulis laporan setebal 1000 halaman',
        ],
        correctIndex: 0,
      },
      {
        id: 's5q3',
        type: 'true-false',
        prompt:
          'Saat kita fokus pada hal yang penting dan mengabaikan hal yang tidak penting, kita sedang melakukan abstraksi.',
        options: ['Benar', 'Salah'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 6,
    title: 'Word Processor Workshop',
    subtitle: 'Aplikasi Pengolah Teks',
    kisi_kisi_ref: 'Point 6: Aplikasi Pengolah Teks',
    theme: 'Mencetak koran sekolah',
    icon: '📝',
    badge: 'Lencana Pengolah Kata',
    color: {
      grad: 'from-rose-500 to-red-600',
      text: 'text-rose-600',
      chip: 'bg-rose-500',
      ring: 'ring-rose-400',
      dark: 'bg-rose-700',
    },
    briefing:
      'Koran sekolah harus dicetak! Gunakan alat pemformatan yang tepat: buat judul tebal, ratakan teks, dan perbesar hurufnya.',
    minigame: {
      type: 'formatting',
      title: 'Bengkel Kata',
      instruction: 'Perbaiki koran sekolah dengan memilih alat yang tepat untuk setiap tugas!',
      paper: {
        title: 'KIKI MENERBITKAN KORAN SEKOLAH',
        body: 'Halo siswa kelas 5! Hari ini sekolah mengadakan lomba memilah sampah elektronik. Semua siswa diharapkan ikut serta dan menjaga bumi digital tetap hijau.',
      },
      tasks: [
        { id: 't1', label: 'Buat JUDUL menjadi tebal (Bold)!', target: 'title', tool: 'bold' },
        { id: 't2', label: 'Ratakan paragraf isi di tengah (Align Center)!', target: 'body', tool: 'align' },
        { id: 't3', label: 'Perbesar ukuran huruf paragraf isi!', target: 'body', tool: 'font' },
      ],
      tools: [
        { id: 'bold', label: 'Bold', icon: 'B' },
        { id: 'align', label: 'Rata Tengah', icon: '≡' },
        { id: 'font', label: 'Perbesar Huruf', icon: 'A+' },
      ],
    },
    questions: [
      {
        id: 's6q1',
        type: 'mcq',
        prompt: 'Apa fungsi utama aplikasi pengolah kata?',
        options: [
          'Menulis cerita, laporan, dan karangan',
          'Menghitung angka otomatis',
          'Mengedit foto',
          'Memutar video',
        ],
        correctIndex: 0,
      },
      {
        id: 's6q2',
        type: 'true-false',
        prompt: 'Fitur Bold digunakan untuk membuat teks menjadi lebih kecil.',
        options: ['Benar', 'Salah'],
        correctIndex: 1,
      },
      {
        id: 's6q3',
        type: 'mcq',
        prompt: 'Contoh perangkat lunak pengolah kata adalah...',
        options: ['Microsoft Word', 'Paint', 'Calculator', 'Game di HP'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 7,
    title: 'Spreadsheet Grid',
    subtitle: 'Aplikasi Berhitung',
    kisi_kisi_ref: 'Point 7: Aplikasi Berhitung',
    theme: 'Kalkulator harta karun',
    icon: '🧮',
    badge: 'Lencana Ahli Spreadsheet',
    color: {
      grad: 'from-teal-500 to-emerald-600',
      text: 'text-teal-600',
      chip: 'bg-teal-500',
      ring: 'ring-teal-400',
      dark: 'bg-teal-700',
    },
    briefing:
      'Kiki mengumpulkan koin: 5, 10, 15, dan 20. Masukkan 3 angka ke dalam kotak spreadsheet lalu tekan SUM agar totalnya menjadi 30!',
    minigame: {
      type: 'spreadsheet',
      title: 'Kalkulator Tabungan',
      instruction:
        'Masukkan 3 koin ke kotak, lalu tekan tombol SUM (+) agar total tabungan Kiki = 30!',
      cells: 3,
      chips: [
        { id: 'k5', value: 5 },
        { id: 'k10', value: 10 },
        { id: 'k15', value: 15 },
        { id: 'k20', value: 20 },
      ],
      targetTotal: 30,
      success: 'Total tabungan Kiki adalah 30! Mesin spreadsheet menyala sempurna!',
    },
    questions: [
      {
        id: 's7q1',
        type: 'mcq',
        prompt:
          'Aplikasi yang paling tepat untuk menghitung nilai rata-rata dan menyusun angka dalam tabel adalah...',
        options: ['Aplikasi Berhitung (Spreadsheet)', 'Aplikasi Pengolah Kata', 'Aplikasi Pengolah Gambar', 'Aplikasi Musik'],
        correctIndex: 0,
      },
      {
        id: 's7q2',
        type: 'fill',
        prompt: 'Lembar kerja aplikasi berhitung disusun atas ... dan kolom.',
        acceptable: ['baris', 'rows', 'deret'],
      },
      {
        id: 's7q3',
        type: 'true-false',
        prompt: 'Tombol SUM (+) pada spreadsheet berfungsi untuk menjumlahkan angka.',
        options: ['Benar', 'Salah'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 8,
    title: 'Image Studio',
    subtitle: 'Aplikasi Pengolah Gambar',
    kisi_kisi_ref: 'Point 8: Aplikasi Pengolah Gambar',
    theme: 'Pembuat poster sekolah',
    icon: '🎨',
    badge: 'Lencana Studio Gambar',
    color: {
      grad: 'from-fuchsia-500 to-pink-600',
      text: 'text-fuchsia-600',
      chip: 'bg-fuchsia-500',
      ring: 'ring-fuchsia-400',
      dark: 'bg-fuchsia-700',
    },
    briefing:
      'Poster pentas seni rusak! Gunakan alat yang tepat untuk memperbaikinya: potong, warnai, dan perbesar.',
    minigame: {
      type: 'image_studio',
      title: 'Studio Gambar',
      instruction: 'Perbaiki poster dengan memilih alat yang tepat untuk setiap kerusakan!',
      posterTitle: 'PENTAS SENI SEKOLAH',
      defects: [
        { id: 'd1', label: 'Poster terpotong di tepi kiri', tool: 'crop' },
        { id: 'd2', label: 'Latar poster abu-abu kusam', tool: 'bucket' },
        { id: 'd3', label: 'Poster terlalu kecil di layar', tool: 'resize' },
      ],
      tools: [
        { id: 'crop', label: 'Potong (Crop)', icon: '✂️' },
        { id: 'bucket', label: 'Bak Cat (Bucket Fill)', icon: '🪣' },
        { id: 'resize', label: 'Ubah Ukuran (Resize)', icon: '↗️' },
      ],
    },
    questions: [
      {
        id: 's8q1',
        type: 'mcq',
        prompt: 'Kegiatan yang dilakukan dalam aplikasi pengolah gambar adalah...',
        options: [
          'Memotong dan mewarnai foto',
          'Mengetik surat',
          'Menghitung angka',
          'Mendengarkan lagu',
        ],
        correctIndex: 0,
      },
      {
        id: 's8q2',
        type: 'true-false',
        prompt: 'Aplikasi pengolah gambar digunakan untuk menghitung rata-rata nilai secara otomatis.',
        options: ['Benar', 'Salah'],
        correctIndex: 1,
      },
      {
        id: 's8q3',
        type: 'mcq',
        prompt: 'Alat untuk mewarnai seluruh area secara otomatis disebut...',
        options: ['Bucket Fill', 'CPU', 'Speaker', 'Router'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 9,
    title: 'Digital File Vault',
    subtitle: 'Berkas Digital',
    kisi_kisi_ref: 'Point 9: Berkas Digital & Format',
    theme: 'Ban berjalan penyortir berkas',
    icon: '🗄️',
    badge: 'Lencana Penjaga Brankas Berkas',
    color: {
      grad: 'from-indigo-500 to-blue-700',
      text: 'text-indigo-600',
      chip: 'bg-indigo-500',
      ring: 'ring-indigo-400',
      dark: 'bg-indigo-700',
    },
    briefing:
      'Ban berjalan penuh berkas! Sortir setiap berkas digital ke brankas yang benar: Teks, Angka, atau Gambar.',
    minigame: {
      type: 'file_sorting',
      title: 'Brankas Berkas',
      instruction: 'Seret berkas di ban berjalan ke brankas yang benar!',
      vaults: [
        { id: 'text', label: 'Brankas Teks', emoji: '📝', accept: ['text'] },
        { id: 'number', label: 'Brankas Angka', emoji: '🔢', accept: ['number'] },
        { id: 'image', label: 'Brankas Gambar', emoji: '🖼️', accept: ['image'] },
      ],
      items: [
        { id: 'f1', label: 'Surat.docx', kind: 'text' },
        { id: 'f2', label: 'Cerita.docx', kind: 'text' },
        { id: 'f3', label: 'Nilai.xlsx', kind: 'number' },
        { id: 'f4', label: 'Anggaran.xlsx', kind: 'number' },
        { id: 'f5', label: 'Foto.jpg', kind: 'image' },
        { id: 'f6', label: 'Undangan.png', kind: 'image' },
      ],
    },
    questions: [
      {
        id: 's9q1',
        type: 'mcq',
        prompt: 'Apa yang dimaksud dengan berkas digital?',
        options: [
          'Data elektronik yang disimpan di komputer atau perangkat lain',
          'Tumpukan kertas di meja',
          'Buku di perpustakaan',
          'Gambar di majalah cetak',
        ],
        correctIndex: 0,
      },
      {
        id: 's9q2',
        type: 'true-false',
        prompt: 'Semua berkas digital memiliki format yang persis sama.',
        options: ['Benar', 'Salah'],
        correctIndex: 1,
      },
      {
        id: 's9q3',
        type: 'mcq',
        prompt: 'Contoh berkas berformat gambar adalah...',
        options: ['foto.jpg', 'surat.docx', 'daftar.xlsx', 'musik.mp3'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 10,
    title: 'File Converter Portal',
    subtitle: 'Konversi Berkas',
    kisi_kisi_ref: 'Point 10: Konversi Berkas & Membaca Digital',
    theme: 'Portal transformer Kiki',
    icon: '🔁',
    badge: 'Lencana Master Konversi',
    color: {
      grad: 'from-orange-500 to-red-600',
      text: 'text-orange-600',
      chip: 'bg-orange-500',
      ring: 'ring-orange-400',
      dark: 'bg-orange-700',
    },
    briefing:
      'Berkas belum siap dicetak! Masukkan berkas ke Portal Transformasi lalu pilih format output yang benar.',
    minigame: {
      type: 'conversion',
      title: 'Portal Transformasi',
      instruction: 'Masukkan berkas ke portal, lalu pilih format output yang benar!',
      portalName: 'Portal Transformasi',
      rounds: [
        {
          id: 'r1',
          from: 'Dokumen.docx',
          fromEmoji: '📄',
          options: [
            { id: 'pdf', label: 'PDF', emoji: '📕' },
            { id: 'jpg', label: 'JPG', emoji: '🖼️' },
            { id: 'mp3', label: 'MP3', emoji: '🎵' },
          ],
          answer: 'pdf',
          outLabel: 'dokumen siap cetak (PDF)',
        },
        {
          id: 'r2',
          from: 'Foto.png',
          fromEmoji: '🖼️',
          options: [
            { id: 'jpg', label: 'JPG', emoji: '🖼️' },
            { id: 'txt', label: 'TXT', emoji: '📝' },
            { id: 'exe', label: 'EXE', emoji: '💿' },
          ],
          answer: 'jpg',
          outLabel: 'foto dengan ukuran ringan (JPG)',
        },
      ],
    },
    questions: [
      {
        id: 's10q1',
        type: 'mcq',
        prompt: 'Apa yang dimaksud dengan konversi berkas?',
        options: [
          'Mengubah dokumen elektronik dari satu format ke format lain',
          'Menghapus semua berkas di komputer',
          'Mencetak dokumen di kertas',
          'Mematikan komputer',
        ],
        correctIndex: 0,
      },
      {
        id: 's10q2',
        type: 'mcq',
        prompt: 'Apa yang dimaksud dengan membaca digital?',
        options: [
          'Membuka, melihat, dan memahami dokumen elektronik di layar',
          'Membaca buku cetak yang tebal',
          'Menghafal tanpa melihat layar',
          'Menutup aplikasi komputer',
        ],
        correctIndex: 0,
      },
      {
        id: 's10q3',
        type: 'true-false',
        prompt: 'Mengubah file .docx menjadi .pdf merupakan contoh konversi berkas.',
        options: ['Benar', 'Salah'],
        correctIndex: 0,
      },
    ],
  },
]