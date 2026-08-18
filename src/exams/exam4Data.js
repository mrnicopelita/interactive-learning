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
      'Ibu ingin membuat sup ayam. Sebelum memasak, Ibu memotong sayuran, menyiapkan bumbu, dan mencuci daging ayam secara terpisah. Proses memecah pekerjaan besar menjadi bagian-bagian kecil ini disebut...',
    options: ['Dekomposisi', 'Abstraksi', 'Algoritma', 'Pengenalan Pola'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-2',
    type: 'mcq',
    prompt:
      'Andi memperhatikan bahwa setiap hari Senin, Selasa, dan Rabu sekolah memakai seragam putih-merah, sedangkan hari Kamis memakai batik. Keterampilan yang digunakan Andi untuk menemukan keteraturan ini adalah...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Algoritma'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-3',
    type: 'mcq',
    prompt:
      'Ketika melihat peta lokasi sekolah, kamu hanya melihat nama jalan utama dan bangunan penting tanpa perlu menggambar setiap pohon atau rumput di jalan. Prinsip menghilangkan detail yang tidak penting ini disebut...',
    options: ['Algoritma', 'Dekomposisi', 'Abstraksi', 'Evaluasi'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-4',
    type: 'mcq',
    prompt: 'Urutan langkah-langkah yang jelas dan terstruktur untuk menyelesaikan suatu masalah dinamakan...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Algoritma'],
    correctIndex: 3,
  },
  {
    id: 'mcq4-5',
    type: 'mcq',
    prompt: 'Perhatikan pola angka berikut: 2, 4, 6, 8, ... Angka berikutnya dalam pola tersebut adalah...',
    options: ['9', '10', '11', '12'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-6',
    type: 'mcq',
    prompt: 'Budi ingin merapikan kamar tidurnya. Langkah pertama yang tepat secara dekomposisi adalah...',
    options: [
      'Membiarkan baju berserakan di lantai',
      'Membagi tugas: merapikan kasur, mengelompokkan buku, dan menyapu lantai',
      'Menonton TV terlebih dahulu',
      'Langsung tidur di kasur',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq4-7',
    type: 'mcq',
    prompt: 'Manakah dari pilihan berikut yang merupakan contoh algoritma dalam kehidupan sehari-hari?',
    options: [
      'Resep langkah-langkah membuat nasi goreng',
      'Melihat warna pelangi di langit',
      'Menggambar pemandangan alam',
      'Memilih warna baju kesukaan',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq4-8',
    type: 'mcq',
    prompt: 'Perhatikan pola simbol berikut:\n\n⭐, 🎈, ⭐, 🎈, ⭐, ...\n\nSimbol berikutnya adalah...',
    options: ['⭐', '🎈', '🌙', '☀️'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-9',
    type: 'mcq',
    prompt:
      'Seseorang yang menerapkan Abstraksi saat menggambar kucing untuk simbol lalu lintas akan...',
    options: [
      'Menggambar jumlah helai bulu kucing secara detail',
      'Menggambar bentuk dasar tubuh dan telinga kucing agar mudah diidentifikasi',
      'Menggambar warna matanya dengan tepat',
      'Menghitung jumlah kumis kucing',
    ],
    correctIndex: 1,
  },
  {
    id: 'mcq4-10',
    type: 'mcq',
    prompt:
      'Jika instruksi algoritma menyuruh robot: "Maju 2 langkah, belok kanan, maju 1 langkah", tetapi robot malah belok kiri. Apa yang perlu diperiksa?',
    options: ['Pengenalan pola', 'Abstraksi', 'Kesalahan (bug) pada algoritma', 'Dekomposisi'],
    correctIndex: 2,
  },
  {
    id: 'mcq4-11',
    type: 'mcq',
    prompt: 'Menemukan dan membetulkan kesalahan dalam suatu algoritma atau langkah kerja disebut proses...',
    options: ['Debugging', 'Coding', 'Dekomposisi', 'Abstraksi'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-12',
    type: 'mcq',
    prompt:
      'Ani mengelompokkan mainannya berdasarkan warna: merah, kuning, dan hijau. Pilar berpikir komputasional yang digunakan Ani adalah...',
    options: ['Pengenalan Pola', 'Algoritma', 'Abstraksi', 'Dekomposisi'],
    correctIndex: 0,
  },
  {
    id: 'mcq4-13',
    type: 'mcq',
    prompt: 'Mengapa urutan dalam membuat algoritma sangat penting?',
    options: [
      'Agar hasil akhir sesuai dengan yang diharapkan dan tidak keliru',
      'Agar pekerjaan menjadi lebih lama',
      'Supaya terlihat rumit',
      'Tidak ada alasan khusus',
    ],
    correctIndex: 0,
  },
  {
    id: 'mcq4-14',
    type: 'mcq',
    prompt:
      'Perhatikan kalimat instruksi berikut:\n\n1. Tuangkan air panas.\n2. Masukkan teh celup ke dalam cangkir.\n3. Tambahkan gula dan aduk hingga larut.\n\nUrutan algoritma membuat teh manis yang tepat adalah...',
    options: ['1 - 2 - 3', '2 - 1 - 3', '3 - 2 - 1', '2 - 3 - 1'],
    correctIndex: 1,
  },
  {
    id: 'mcq4-15',
    type: 'mcq',
    prompt:
      'Kamu diminta menyelesaikan soal cerita matematika yang panjang. Kamu menandai angka-angka penting dan mengabaikan nama tokoh yang tidak memengaruhi hitungan. Pilar yang kamu gunakan adalah...',
    options: ['Dekomposisi', 'Algoritma', 'Abstraksi', 'Pengenalan Pola'],
    correctIndex: 2,
  },
  {
    id: 'tf4-1',
    type: 'true-false',
    prompt: 'Algoritma adalah urutan langkah-langkah yang boleh acak tanpa aturan tertentu.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-2',
    type: 'true-false',
    prompt:
      'Dekomposisi membantu kita menyelesaikan masalah rumit dengan cara memecahnya menjadi bagian-bagian yang lebih mudah.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-3',
    type: 'true-false',
    prompt:
      'Mencari persamaan antara cara menyelesaikan soal matematika hari ini dengan soal kemarin termasuk contoh Pengenalan Pola.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-4',
    type: 'true-false',
    prompt:
      'Abstraksi artinya kita harus mencatat semua detail kecil tanpa ada yang terlewat sedikit pun.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-5',
    type: 'true-false',
    prompt:
      'Jadwal pelajaran sekolah disusun menggunakan konsep pengenalan pola dan pembagian waktu yang terstruktur.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-6',
    type: 'true-false',
    prompt: 'Memperbaiki langkah yang salah dalam instruksi resep kue disebut proses debugging.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-7',
    type: 'true-false',
    prompt: 'Berpikir komputasional hanya bisa digunakan saat kita berada di depan komputer.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-8',
    type: 'true-false',
    prompt: 'Pola urutan huruf A, C, E, G memiliki aturan melompati satu huruf.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'tf4-9',
    type: 'true-false',
    prompt:
      'Saat membuat denah rumah, menggambarkan setiap lemari dan hiasan dinding secara mendetail adalah contoh Abstraksi yang baik.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
  },
  {
    id: 'tf4-10',
    type: 'true-false',
    prompt:
      'Komputer membutuhkan instruksi (algoritma) yang jelas dan pasti untuk dapat menjalankan perintah dengan benar.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
  },
  {
    id: 'fb4-1',
    type: 'short-answer',
    prompt:
      'Proses memecah satu masalah besar menjadi beberapa sub-masalah kecil yang lebih sederhana dinamakan ____________.',
    acceptableAnswers: ['dekomposisi', 'decomposition'],
  },
  {
    id: 'fb4-2',
    type: 'short-answer',
    prompt:
      'Urutan langkah-langkah logis untuk menyelesaikan suatu tugas disebut ____________.',
    acceptableAnswers: ['algoritma', 'algorithm'],
  },
  {
    id: 'fb4-3',
    type: 'short-answer',
    prompt: 'Lanjutan dari pola angka 5, 10, 15, 20, ... adalah angka ____________.',
    acceptableAnswers: ['25'],
  },
  {
    id: 'fb4-4',
    type: 'short-answer',
    prompt:
      'Ketika kamu mengabaikan warna sampul buku dan hanya fokus membaca judulnya untuk mencari buku pelajaran, kamu sedang menerapkan pilar ____________.',
    acceptableAnswers: ['abstraksi', 'abstraction'],
  },
  {
    id: 'fb4-5',
    type: 'short-answer',
    prompt:
      'Istilah untuk menemukan dan membedah kesalahan (error) dalam urutan perintah atau algoritma disebut ____________.',
    acceptableAnswers: ['debugging', 'pembenahan', 'pelacakan kesalahan'],
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
    'Soal kuis untuk kelas 4 SD: 15 pilihan ganda, 10 benar/salah, dan 5 isian singkat. Jawab semua soal dengan teliti!',
  durationSeconds: 1800,
  questions: EXAM_4_QUESTION_IDS.map((id) =>
    QUESTION_BANK_4.find((question) => question.id === id),
  ),
}
