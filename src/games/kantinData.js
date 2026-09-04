export const TEAMS = {
  A: { name: 'Tim Alpha', emoji: '🔴', color: 'red', size: 5 },
  B: { name: 'Tim Beta', emoji: '🔵', color: 'blue', size: 5 },
}

export const STUDENTS = [
  { name: 'BEBBI NURDUDU APRILIA LAHAY', team: 'A' },
  { name: 'CHRIS SAMMON SIBURIAN', team: 'A' },
  { name: 'GISELVIN QUEENSHA', team: 'A' },
  { name: 'AVARA SHEELA KETAREN', team: 'B' },
  { name: 'BELVIANIA ALENA SINAGA', team: 'B' },
  { name: 'KARSTEN RAYNELL BRAHMANA', team: 'A' },
  { name: 'JOSE ALVARO RIDENSON SIMBOLON', team: 'B' },
  { name: 'MIKHAULI GRISELDA SIREGAR', team: 'A' },
  { name: 'ADIPATI MUHAMMAD AR RASYID HADININGRAT', team: 'B' },
  { name: 'ABIGAIL SUGIARTO LEE', team: 'B' },
]

export const ROLES = [
  { id: 'analyst', name: 'System Analyst', icon: '📊', module: 'Modul Dekomposisi', desc: 'Menganalisis masalah kantin dan menentukan metrik objektif' },
  { id: 'strategist', name: 'Solution Strategist', icon: '⚙️', module: 'Modul Abstraksi', desc: 'Mengatur aturan antrean dan filter variabel' },
  { id: 'algorist', name: 'Lead Algorist', icon: '🔗', module: 'Modul Algoritma', desc: 'Menyusun flowchart logika pelayanan kantin' },
  { id: 'simulator', name: 'Interface & Data Simulator', icon: '🎨', module: 'Modul Pengenalan Pola', desc: 'Merancang menu dan data pelanggan' },
  { id: 'qa', name: 'Test Evaluator / QA', icon: '🧪', module: 'Modul Debugging & Stress-Test', desc: 'Membuat skenario uji untuk menyerang sistem lawan' },
]

export const MENU_ITEMS = [
  { id: 'nasi-goreng', name: 'Nasi Goreng', price: 8000, prepTime: 45, category: 'berat', stock: 50 },
  { id: 'mie-ayam', name: 'Mie Ayam', price: 7000, prepTime: 40, category: 'berat', stock: 40 },
  { id: 'nasi-pecel', name: 'Nasi Pecel', price: 6000, prepTime: 30, category: 'berat', stock: 45 },
  { id: 'es-teh', name: 'Es Teh Manis', price: 3000, prepTime: 10, category: 'minuman', stock: 100 },
  { id: 'es-jeruk', name: 'Es Jeruk', price: 4000, prepTime: 12, category: 'minuman', stock: 80 },
  { id: 'kopi', name: 'Kopi Susu', price: 5000, prepTime: 15, category: 'minuman', stock: 60 },
  { id: 'roti', name: 'Roti Bakar', price: 4000, prepTime: 20, category: 'snack', stock: 30 },
  { id: 'pisang', name: 'Pisang Goreng', price: 3000, prepTime: 18, category: 'snack', stock: 35 },
]

export const QUEUE_CATEGORIES = [
  { id: 'express', name: 'Express Lane', desc: 'Pembayaran pas, max 1 item', color: 'emerald' },
  { id: 'berat', name: 'Makanan Berat', desc: 'Nasi, Mie, Pecel', color: 'amber' },
  { id: 'minuman', name: 'Minuman', desc: 'Es Teh, Es Jeruk, Kopi', color: 'sky' },
  { id: 'snack', name: 'Snack', desc: 'Roti, Pisang Goreng', color: 'purple' },
]

export const PAYMENT_METHODS = [
  { id: 'tunai', name: 'Tunai', icon: '💵' },
  { id: 'pas', name: 'Uang Pas', icon: '💰' },
  { id: 'transfer', name: 'Transfer', icon: '📱' },
]

export const DEFAULT_FLOWCHART_NODES = [
  { id: 'start', type: 'start', label: 'START', x: 50, y: 30 },
  { id: 'ambil-pesanan', type: 'process', label: 'Ambil Pesanan', x: 50, y: 90 },
  { id: 'cek-stok', type: 'decision', label: 'Stok Tersedia?', x: 50, y: 150 },
  { id: 'stok-habis', type: 'output', label: 'Tampilkan "HABIS"', x: 120, y: 150 },
  { id: 'hitung-total', type: 'process', label: 'Hitung Total Harga', x: 50, y: 210 },
  { id: 'cek-uang', type: 'decision', label: 'Uang Cukup?', x: 50, y: 270 },
  { id: 'uang-kurang', type: 'output', label: 'Tampilkan "Uang Kurang"', x: 120, y: 270 },
  { id: 'proses-bayar', type: 'process', label: 'Proses Pembayaran', x: 50, y: 330 },
  { id: 'siapkan-pesanan', type: 'process', label: 'Siapkan Pesanan', x: 50, y: 390 },
  { id: 'selesai', type: 'end', label: 'FINISH', x: 50, y: 450 },
]

export const DEFAULT_FLOWCHART_CONNECTIONS = [
  { from: 'start', to: 'ambil-pesanan' },
  { from: 'ambil-pesanan', to: 'cek-stok' },
  { from: 'cek-stok', to: 'hitung-total', label: 'YA' },
  { from: 'cek-stok', to: 'stok-habis', label: 'TIDAK' },
  { from: 'hitung-total', to: 'cek-uang' },
  { from: 'cek-uang', to: 'proses-bayar', label: 'YA' },
  { from: 'cek-uang', to: 'uang-kurang', label: 'TIDAK' },
  { from: 'proses-bayar', to: 'siapkan-pesanan' },
  { from: 'siapkan-pesanan', to: 'selesai' },
]

export const CUSTOMER_PRESETS = [
  { id: 'c1', name: 'Rina', items: ['nasi-goreng', 'es-teh'], payment: 'pas', amount: 11000, desc: 'Siswa A — Beli Nasi Goreng + Es Teh, Uang Pas' },
  { id: 'c2', name: 'Budi', items: ['mie-ayam'], payment: 'tunai', amount: 20000, desc: 'Siswa B — Beli Mie Ayam, Uang Lembaran Besar' },
  { id: 'c3', name: 'Siti', items: ['roti', 'es-jeruk'], payment: 'tunai', amount: 5000, desc: 'Siswa C — Beli Roti + Es Jeruk, Uang Kurang' },
  { id: 'c4', name: 'Andi', items: ['nasi-pecel'], payment: 'transfer', amount: 6000, desc: 'Siswa D — Beli Nasi Pecel, Bayar Transfer' },
  { id: 'c5', name: 'Maya', items: ['es-teh', 'pisang'], payment: 'pas', amount: 6000, desc: 'Siswa E — Beli Es Teh + Pisang, Uang Pas' },
  { id: 'c6', name: 'Riko', items: ['kopi', 'roti'], payment: 'tunai', amount: 10000, desc: 'Siswa F — Beli Kopi + Roti, Uang Pas' },
  { id: 'c7', name: 'Dina', items: ['nasi-goreng', 'es-jeruk', 'roti'], payment: 'tunai', amount: 15000, desc: 'Siswa G — Beli 3 Item, Uang Kurang' },
  { id: 'c8', name: 'Fajar', items: ['mie-ayam', 'es-teh'], payment: 'pas', amount: 10000, desc: 'Siswa H — Beli Mie Ayam + Es Teh, Uang Pas' },
]

export const TEST_SCRIPTS = [
  { id: 't1', name: 'Stok Habis', desc: 'Siswa pesan saat stok = 0', type: 'edge-case', input: { itemId: 'nasi-goreng', stockOverride: 0 } },
  { id: 't2', name: 'Uang Kurang', desc: 'Uang pembayar < total harga', type: 'edge-case', input: { amount: 3000, total: 8000 } },
  { id: 't3', name: 'Pembatalan Tengah Jalan', desc: 'Siswa membatalkan pesanan di tengah proses', type: 'edge-case', input: { cancelAt: 'proses-bayar' } },
  { id: 't4', name: 'Pesanan Kosong', desc: 'Siswa tidak memesan apa-apa', type: 'edge-case', input: { items: [] } },
  { id: 't5', name: 'Item Tidak Valid', desc: 'Siswa memesan item yang tidak ada di menu', type: 'edge-case', input: { itemId: 'nasi-ube' } },
  { id: 't6', name: 'Bayar Lebih', desc: 'Uang pembayar > total harga (kembalian)', type: 'edge-case', input: { amount: 50000, total: 8000 } },
  { id: 't7', name: 'Pesanan Ganda Item Sama', desc: 'Siswa pesan 5x Es Teh sekaligus', type: 'stress', input: { items: ['es-teh','es-teh','es-teh','es-teh','es-teh'] } },
  { id: 't8', name: 'Transfer Gagal', desc: 'Metode transfer tapi gagal verifikasi', type: 'edge-case', input: { payment: 'transfer', verify: false } },
  { id: 't9', name: 'Stok Minus', desc: 'Sistem mengizinkan pesanan saat stok sudah 0', type: 'bug', input: { stockOverride: -1 } },
  { id: 't10', name: 'Input Null', desc: 'Sistem menerima input null/undefined', type: 'bug', input: { items: null } },
]

/* ─── COMPLEX SCENARIO DATA ─── */

// Log data simulated dari kantin selama 1 jam
export const LOG_DATA = [
  { time: '10:00', queue: 3, serving: 1, item: 'nasi-goreng', wait: 50, status: 'selesai' },
  { time: '10:02', queue: 5, serving: 1, item: 'mie-ayam', wait: 65, status: 'selesai' },
  { time: '10:03', queue: 8, serving: 1, item: 'es-teh', wait: 12, status: 'selesai' },
  { time: '10:05', queue: 12, serving: 1, item: 'nasi-pecel', wait: 45, status: 'selesai' },
  { time: '10:06', queue: 15, serving: 1, item: 'roti', wait: 22, status: 'selesai' },
  { time: '10:08', queue: 18, serving: 1, item: 'nasi-goreng', wait: 70, status: 'selesai' },
  { time: '10:09', queue: 20, serving: 1, item: 'es-jeruk', wait: 15, status: 'selesai' },
  { time: '10:11', queue: 22, serving: 1, item: 'mie-ayam', wait: 80, status: 'selesai' },
  { time: '10:12', queue: 25, serving: 1, item: 'kopi', wait: 18, status: 'selesai' },
  { time: '10:14', queue: 28, serving: 1, item: 'nasi-goreng', wait: 90, status: 'selesai' },
  { time: '10:15', queue: 30, serving: 1, item: 'pisang', wait: 20, status: 'selesai' },
  { time: '10:17', queue: 32, serving: 1, item: 'nasi-pecel', wait: 55, status: 'selesai' },
  { time: '10:18', queue: 35, serving: 1, item: 'es-teh', wait: 14, status: 'selesai' },
  { time: '10:20', queue: 38, serving: 1, item: 'mie-ayam', wait: 100, status: 'timeout' },
  { time: '10:21', queue: 40, serving: 1, item: 'roti', wait: 25, status: 'selesai' },
  { time: '10:23', queue: 42, serving: 1, item: 'nasi-goreng', wait: 110, status: 'timeout' },
  { time: '10:24', queue: 45, serving: 1, item: 'es-jeruk', wait: 16, status: 'selesai' },
  { time: '10:26', queue: 48, serving: 1, item: 'kopi', wait: 20, status: 'selesai' },
  { time: '10:27', queue: 50, serving: 1, item: 'mie-ayam', wait: 120, status: 'timeout' },
  { time: '10:29', queue: 52, serving: 1, item: 'nasi-pecel', wait: 60, status: 'selesai' },
]

// Pola error yang terjadi
export const ERROR_PATTERNS = [
  { id: 'e1', type: 'stok', desc: 'Stok nasi goreng habis di menit ke-15, tapi masih menerima pesanan', freq: 3, impact: 'Tinggi — siswa sudah antre lama, pesanan ditolak' },
  { id: 'e2', type: 'bayar', desc: 'Siswa bayar Rp 5.000 untuk nasi goreng (Rp 8.000), tidak dicek', freq: 2, impact: 'Tinggi — kerugian Rp 3.000 per transaksi' },
  { id: 'e3', type: 'antrian', desc: 'Siswa express (1 item) harus antri di belakang siswa yang beli 5 item', freq: 5, impact: 'Sedang — waktu antrean tidak adil' },
  { id: 'e4', type: 'transfer', desc: 'Pembayaran transfer tidak diverifikasi, langsung diproses', freq: 1, impact: 'Kritis — bisa scam/fraud' },
  { id: 'e5', type: 'kembalian', desc: 'Sistem tidak menghitung kembalian saat bayar lebih', freq: 4, impact: 'Sedang — siswa rugi' },
]

// Metrik kinerja yang harus dianalisis
export const PERFORMANCE_METRICS = {
  avgWait: 52, // detik
  maxWait: 120, // detik
  avgPrep: 35, // detik
  totalOrders: 52,
  successOrders: 47,
  failedOrders: 3, // timeout
  cancelledOrders: 2, // stok habis
  peakQueue: 52, // siswa
  avgQueue: 25,
  revenue: 410000, // Rp
  lostRevenue: 24000, // Rp dari pesanan yang gagal
}

// Data pelanggan yang lebih kompleks dengan pola
export const CUSTOMER_SCENARIOS = [
  { id: 's1', name: 'Rina', type: 'regular', items: ['nasi-goreng', 'es-teh'], payment: 'pas', amount: 11000, pattern: 'Uang pas, 2 item, cepat' },
  { id: 's2', name: 'Budi', type: 'regular', items: ['mie-ayam'], payment: 'tunai', amount: 20000, pattern: 'Uang besar, 1 item, kembalian' },
  { id: 's3', name: 'Siti', type: 'problem', items: ['roti', 'es-jeruk'], payment: 'tunai', amount: 5000, pattern: 'Uang kurang, 2 item' },
  { id: 's4', name: 'Andi', type: 'digital', items: ['nasi-pecel'], payment: 'transfer', amount: 6000, pattern: 'Transfer, 1 item, perlu verifikasi' },
  { id: 's5', name: 'Maya', type: 'regular', items: ['es-teh', 'pisang'], payment: 'pas', amount: 6000, pattern: 'Uang pas, 2 item, cepat' },
  { id: 's6', name: 'Riko', type: 'regular', items: ['kopi', 'roti'], payment: 'tunai', amount: 10000, pattern: 'Uang pas, 2 item' },
  { id: 's7', name: 'Dina', type: 'problem', items: ['nasi-goreng', 'es-jeruk', 'roti'], payment: 'tunai', amount: 15000, pattern: '3 item, uang kurang Rp 1.000' },
  { id: 's8', name: 'Fajar', type: 'regular', items: ['mie-ayam', 'es-teh'], payment: 'pas', amount: 10000, pattern: 'Uang pas, 2 item' },
  { id: 's9', name: 'Hana', type: 'vip', items: ['nasi-goreng', 'nasi-pecel', 'es-teh', 'es-jeruk'], payment: 'tunai', amount: 25000, pattern: '4 item, uang besar, langganan' },
  { id: 's10', name: 'Eko', type: 'problem', items: ['pisang'], payment: 'tunai', amount: 2000, pattern: '1 item, uang kurang Rp 1.000' },
  { id: 's11', name: 'Sari', type: 'digital', items: ['nasi-goreng', 'kopi'], payment: 'transfer', amount: 13000, pattern: 'Transfer, 2 item, perlu verifikasi' },
  { id: 's12', name: 'Doni', type: 'whale', items: ['nasi-goreng', 'mie-ayam', 'nasi-pecel', 'es-teh', 'es-jeruk'], payment: 'tunai', amount: 30000, pattern: '5 item semua menu, uang cukup' },
]

// Test script yang harus dibuat QA ( jawaban yang benar )
export const QA_TEST_CASES = [
  { id: 'q1', name: 'Stok Habis', desc: 'Pesanan saat stok = 0, sistem harus tolak', input: { itemId: 'nasi-goreng', stockOverride: 0 }, expected: 'FAIL', category: 'edge-case' },
  { id: 'q2', name: 'Uang Kurang', desc: 'Uang dibawa < total harga, sistem harus tolak', input: { amount: 3000, total: 8000 }, expected: 'FAIL', category: 'edge-case' },
  { id: 'q3', name: 'Pembatalan Tengah', desc: 'Siswa cancel di tengah proses', input: { cancelAt: 'proses-bayar' }, expected: 'FAIL', category: 'edge-case' },
  { id: 'q4', name: 'Pesanan Kosong', desc: 'Siswa tidak pilih item apapun', input: { items: [] }, expected: 'FAIL', category: 'edge-case' },
  { id: 'q5', name: 'Item Tidak Ada', desc: 'Pesanan item yang tidak ada di menu', input: { itemId: 'nasi-ube' }, expected: 'FAIL', category: 'edge-case' },
  { id: 'q6', name: 'Bayar Lebih', desc: 'Uang lebih, harus hitung kembalian', input: { amount: 50000, total: 8000 }, expected: 'PASS', category: 'edge-case' },
  { id: 'q7', name: 'Pesanan 5x Item Sama', desc: 'Stress test: 5x Es Teh sekaligus', input: { items: ['es-teh','es-teh','es-teh','es-teh','es-teh'] }, expected: 'FAIL', category: 'stress' },
  { id: 'q8', name: 'Transfer Gagal', desc: 'Transfer tapi verifikasi gagal', input: { payment: 'transfer', verify: false }, expected: 'FAIL', category: 'bug' },
  { id: 'q9', name: 'Stok Minus', desc: 'Sistem terima pesanan saat stok negatif', input: { stockOverride: -1 }, expected: 'FAIL', category: 'bug' },
  { id: 'q10', name: 'Input Null', desc: 'Sistem terima input kosong/null', input: { items: null }, expected: 'FAIL', category: 'bug' },
]

export const PROBLEMS_TEMPLATE = [
  { id: 'p1', problem: 'Antrean panjang dan kacau', impact: 'Siswa antre > 10 menit, waktu istirahat habis', solution: 'Sistem antrean berbasis kategori (Express, Berat, Minuman)' },
  { id: 'p2', problem: 'Transaksi lambat karena pembayaran tunai', impact: 'Kembalian memakan waktu, antrian mandek', solution: 'Prioritaskan uang pas dan transfer digital' },
  { id: 'p3', problem: 'Pesanan sering salah', impact: 'Siswa komplain, pesanan diulang', solution: 'Validasi otomatis item sebelum konfirmasi' },
]

export const OBJECTIVE_METRICS = [
  { id: 'm1', label: 'Target Waktu Pelayanan', unit: 'detik/siswa', target: 45 },
  { id: 'm2', label: 'Akurasi Pesanan', unit: '%', target: 95 },
  { id: 'm3', label: 'Kepuasan Siswa', unit: 'skor 1-10', target: 8 },
]

export const SCORING_WEIGHTS = {
  completion: 0.20,
  stability: 0.40,
  agility: 0.30,
  rigor: 0.10,
}

export const PHASE_DURATIONS = {
  brief: 5 * 60,
  develop: 20 * 60,
  build: 3 * 60,
  test: 15 * 60,
}
