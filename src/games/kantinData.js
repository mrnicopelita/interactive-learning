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
