/**
 * Terminal Protocol: Operation Reboot City
 * Data schema for the 2-stage CLI emergency game for Grade 5.
 *
 * Stage 1  : Logic Core Restoration  (Berpikir Komputasional)
 * Stage 2  : Digital Resource Pipeline  (Literasi Digital)
 */

export const TERMINAL_PROTOCOL_META = {
  game_title: 'TERMINAL PROTOCOL: OPERATION REBOOT CITY',
  operator: 'Agent Cyber 5',
  grade_level: 5,
  city: 'K5_CITY',
  ui_style: {
    background_color: '#0D0D0D',
    text_color: '#00FF66',
    accent_color: '#FFB000',
    font_family: 'Courier New, monospace',
  },
  nova_bug_art: [
    '       __        __',
    '      /  \\      /  \\',
    '     |(O)(O)  (O)(O)|',
    '      \\  \\    /  /',
    '       \\  \\/\\/  /',
    '        \\______/',
    '   [ NOVA-BUG DETECTED ]',
  ],
  boot_log: [
    'K5 CITY OUTAGE RESPONSE TERMINAL v4.2.0',
    '[BOOT] GUI CRASHED · VIRUS NOVA-BUG DETECTED',
    '[BOOT] SWITCHING TO EMERGENCY RAW TERMINAL...',
    '[BOOT] SMART GRID STATUS : OFFLINE',
    '[BOOT] ALL SCREENS DOWN — TYPE COMMANDS MANUALLY',
    'AUTHENTICATE OPERATOR CALLSIGN:',
  ],
  story_lines: [
    '[LOG 001] THE CITY IS DARK. NOVA-BUG SHUT DOWN THE K5 SMART GRID.',
    '[LOG 002] THE GRAPHICAL SCREEN CRASHED — THE CITY NEEDS A HERO ON THE RAW TERMINAL.',
    '[LOG 003] HELLO, AGENT CYBER 5 — THAT HERO IS YOU!',
    '[LOG 004] STAGE 1 : RESTORE THE LOGIC CORE USING COMPUTATIONAL THINKING.',
    '[LOG 005] STAGE 2 : PROCESS EMERGENCY DATA AND SEND THE REPORT TO THE MAYOR.',
    'INITIATE PROTOCOL WHEN YOU ARE READY, OPERATOR.',
  ],
}

/**
 * @param {number} totalMistakes  Total mistakes across both stages
 */
export function starsFor(totalMistakes) {
  if (totalMistakes <= 2) return 3
  if (totalMistakes <= 6) return 2
  return 1
}

export const TERMINAL_PROTOCOL_STAGES = [
  {
    id: 1,
    codename: 'STAGE_1_LOGIC_CORE',
    name: 'Stage 1: Logic Core Restoration',
    objective: 'SYSTEM CRASH DETECTED. Restore the logic core using Computational Thinking commands.',
    short: 'RESTORE LOGIC CORE',
    tasks: [
      {
        id: 'dec',
        step: 'DECOMPOSITION',
        kisi_kisi: 'Point 3 · Dekomposisi',
        command: 'decom task_crash.sys',
        type: 'decomposition',
        title: 'Pecah Tugas Besar',
        instruction:
          'Log crash terlalu besar untuk diproses sekaligus! Ketuk 3 sub-tugas yang benar untuk memecah tugas besar "Fix City Power Grid".',
        logs: [
          '[CRASH LOG] task_crash.sys',
          '[ALERT] Master task "Fix City Power Grid" is too large for one pass!',
          '[STATUS] Divide master task into 3 manageable sub-tasks.',
          '[INPUT] Select the 3 sub-tasks. Wrong picks will corrupt the buffer.',
        ],
        chips: [
          { id: 'c1', label: 'Isolate Substation', correct: true },
          { id: 'c2', label: 'Repair Logic Gates', correct: true },
          { id: 'c3', label: 'Restore Feeder', correct: true },
          { id: 'w1', label: 'Water the Plants', correct: false },
          { id: 'w2', label: 'Bake a Cake', correct: false },
          { id: 'w3', label: 'Paint a Mural', correct: false },
        ],
        success: 'TASK DECOMPOSED.',
      },
      {
        id: 'pat',
        step: 'PATTERN_RECOGNITION',
        kisi_kisi: 'Point 4 · Pengenalan Pola',
        command: 'analyze --pattern memory_buffer.log',
        type: 'pattern',
        title: 'Buka Memory Bank',
        instruction:
          'Aliran kode memori rusak memiliki pola. Temukan aturannya, lalu masukkan nilai yang hilang untuk membuka memory bank!',
        logs: [
          '[BUFFER STREAM] corrupted memory codes detected:',
          '   [VAL_02] -> [VAL_04] -> [VAL_06] -> [VAL_08] -> [VAL_??]',
          '[HINT] Each step grows by the same amount.',
          '[INPUT] Enter the missing value to unlock the memory bank.',
        ],
        sequence: ['VAL_02', 'VAL_04', 'VAL_06', 'VAL_08', 'VAL_??'],
        accepts: ['10', 'val_10', 'sepuluh'],
        options: ['VAL_09', 'VAL_10', 'VAL_12'],
        hint: 'Pola: tambah +2 setiap langkah, jadi 8 + 2 = ...',
        success: 'MEMORY BANK UNLOCKED.',
      },
      {
        id: 'abs',
        step: 'ABSTRACTION',
        kisi_kisi: 'Point 5 · Abstraksi',
        command: 'filter --abstract log_dump.txt',
        type: 'abstraction',
        title: 'Filter Keramaian Log',
        instruction:
          'Layar dibanjiri 50 baris sampah (cuaca, ukuran huruf, warna latar). Nyalakan filter abstraksi, lalu ketuk SATU baris yang penting saja!',
        logs: [
          '[DUMP] 50 lines of clutter flooding the screen...',
          '[HINT] Keep only the critical line: the virus address.',
          '[INPUT] Use the abstraction filter, then tap the virus line.',
        ],
        filter_label: 'NYALAKAN FILTER ABSTRAKSI',
        filter_on_label: 'FILTER AKTIF — ABRAKSI DITERAPKAN',
        lines: [
          { id: 'n1', text: 'weather.log: sky_color=blue', critical: false },
          { id: 'n2', text: 'font_size=14px', critical: false },
          { id: 'n3', text: 'background_color=#FFFFFF', critical: false },
          { id: 'c1', text: 'VIRUS_ADDRESS: 0x994F', critical: true },
          { id: 'n4', text: 'cookie=chocolate_chip', critical: false },
          { id: 'n5', text: 'text_color=#000000', critical: false },
          { id: 'n6', text: 'music_volume=35%', critical: false },
          { id: 'n7', text: 'weather.log: wind_speed=14kph', critical: false },
          { id: 'n8', text: 'border_style=solid', critical: false },
          { id: 'n9', text: 'battery_level=87%', critical: false },
        ],
        success: 'VIRUS ADDRESS ISOLATED.',
      },
      {
        id: 'seq',
        step: 'ALGORITHM_SEQUENCE',
        kisi_kisi: 'Point 2 · Algoritma & Urutan',
        command: 'execute repair_script.sh',
        type: 'sequence',
        title: 'Urutkan Script Perbaikan',
        instruction:
          'Script perbaikan gagal karena perintahnya salah urutan! Susun 3 perintah ke urutan yang benar: Scan Virus dulu, lalu Apply Patch, baru Reboot System.',
        logs: [
          '[ERROR] repair_script.sh FAILED — commands out of order!',
          '[OUTPUT] [1. Apply Patch] -> [2. Reboot System] -> [3. Scan Virus]',
          '[HINT] A virus must be scanned BEFORE a patch can fix the damage.',
          '[INPUT] Rearrange the commands into the correct order.',
        ],
        chips: [
          { id: 's', label: 'Scan Virus', broken: '3' },
          { id: 'a', label: 'Apply Patch', broken: '1' },
          { id: 'r', label: 'Reboot System', broken: '2' },
        ],
        correct: ['s', 'a', 'r'],
        success: 'REPAIR SCRIPT EXECUTED.',
      },
      {
        id: 'check',
        step: 'COMPUTATIONAL_THINKING',
        kisi_kisi: 'Point 1 · Berpikir Komputasional',
        command: 'status_check',
        type: 'diagnostic',
        title: 'Diagnostik Sistem',
        instruction:
          'Terminal menampilkan pemeriksaan diagnostik cepat. Jawab untuk memverifikasi mengapa pendekatan langkah demi langkah berhasil!',
        logs: [
          '[DIAGNOSTIC] running status_check...',
          '[QUESTION] Verify: why did the step-by-step logical approach succeed?',
          '[INPUT] Answer the diagnostic questions below.',
        ],
        questions: [
          {
            id: 'q1',
            prompt: 'Mengapa cara berpikir langkah demi langkah berhasil memulihkan sistem kota?',
            options: [
              'Karena setiap langkah dikerjakan terstruktur dan sesuai urutan',
              'Karena sistem sebenarnya tidak rusak',
              'Karena jawabannya ditebak secara acak',
            ],
            correctIndex: 0,
          },
          {
            id: 'q2',
            prompt: 'Memecah tugas besar "Perbaiki Grid Kota" menjadi sub-tugas kecil disebut...',
            options: ['Dekomposisi', 'Abstraksi', 'Konversi'],
            correctIndex: 0,
          },
          {
            id: 'q3',
            prompt: 'Fokus pada baris VIRUS_ADDRESS dan mengabaikan log yang tidak penting adalah contoh...',
            options: ['Abstraksi', 'Pengenalan Pola', 'Pengolah Gambar'],
            correctIndex: 0,
          },
          {
            id: 'q4',
            prompt: 'Urutan 2, 4, 6, 8, 10 memperlihatkan aturan pola yang sama. Ini contoh...',
            options: ['Pengenalan Pola', 'Konversi Berkas', 'Membaca Digital'],
            correctIndex: 0,
          },
        ],
        success: 'LOGIC CORE DIAGNOSTIC CLEAR.',
      },
    ],
  },
  {
    id: 2,
    codename: 'STAGE_2_RESOURCE_PIPELINE',
    name: 'Stage 2: Digital Resource Pipeline',
    objective: 'KERNEL ONLINE. Process emergency data, edit map imagery, and convert final files.',
    short: 'BUILD EMERGENCY REPORT',
    tasks: [
      {
        id: 'word',
        step: 'WORD_PROCESSING',
        kisi_kisi: 'Point 6 & 10 · Pengolah Teks & Membaca Digital',
        command: 'open_editor report_draft.txt',
        type: 'word',
        title: 'Format Catatan Laporan',
        instruction:
          'Baca draf laporan di layar, identifikasi judul utamanya, lalu terapkan perintah format agar laporannya terbaca jelas.',
        logs: [
          '[DATA] report_draft.txt opened in editor.',
          '[TASK 1] Identify the MAIN TITLE and apply --set-heading.',
          '[TASK 2] Apply --bold to the phrase "EMERGENCY WARNING".',
          '[INPUT] Tap the correct text on the document below.',
        ],
        cmdHeading: '--set-heading',
        cmdBold: '--bold',
        docTitle: 'EMERGENCY WARNING',
        body: [
          { text: 'Attention all citizens: ', target: null },
          { text: 'EMERGENCY WARNING', target: 'warning_phrase' },
          { text: ' — the smart grid of K5 City has failed.', target: null },
          { text: 'Please stay calm and conserve power.', target: 'decoys' },
        ],
        rounds: [
          {
            target: 'title',
            label: 'Terapkan --set-heading ke JUDUL utama laporan.',
            cmd: '--set-heading',
          },
          {
            target: 'warning_phrase',
            label: 'Terapkan --bold pada teks "EMERGENCY WARNING".',
            cmd: '--bold',
          },
        ],
        success: 'REPORT FORMATTED AND READABLE.',
      },
      {
        id: 'calc',
        step: 'SPREADSHEET_CALC',
        kisi_kisi: 'Point 7 · Aplikasi Berhitung',
        command: 'calc_grid damage_stats.csv',
        type: 'spreadsheet',
        title: 'Hitung Data Kerusakan',
        instruction:
          'Terminal menampilkan tabel data kerusakan. Pilih rumus yang benar untuk menghitung TOTAL sektor rusak dan RATA-RATA biaya perbaikan.',
        logs: [
          '[TABLE] damage_stats.csv loaded. Rows represent sectors.',
          '[TASK A] Sum the DAMAGED column = total damaged sectors.',
          '[TASK B] Average the COST column = average repair cost.',
          '[INPUT] Pick the correct formula for each task.',
        ],
        table: {
          headers: ['Sector', 'Damaged', 'Cost'],
          rows: [
            { label: 'North', a: 1, b: 12, c: 50 },
            { label: 'Central', a: 2, b: 8, c: 80 },
            { label: 'South', a: 3, b: 10, c: 60 },
            { label: 'East', a: 4, b: 6, c: 90 },
          ],
        },
        rounds: [
          {
            id: 'sum',
            label: 'Hitung TOTAL sektor rusak. (Kolom B, baris 2–5)',
            chips: [
              { id: 's1', cmd: '=SUM(B2:B5)', result: '36', good: true },
              { id: 's2', cmd: '=SUM(A2:A5)', result: '10', good: false },
              { id: 's3', cmd: '=AVERAGE(C2:C5)', result: '70', good: false },
            ],
            out: 'TOTAL DAMAGED SECTORS = 36',
          },
          {
            id: 'avg',
            label: 'Hitung RATA-RATA biaya perbaikan. (Kolom C, baris 2–5)',
            chips: [
              { id: 'a1', cmd: '=AVERAGE(C2:C5)', result: '70', good: true },
              { id: 'a2', cmd: '=AVERAGE(B2:B5)', result: '9', good: false },
              { id: 'a3', cmd: '=SUM(C2:C5)', result: '280', good: false },
            ],
            out: 'AVERAGE REPAIR COST = 70',
          },
        ],
        success: 'DAMAGE STATS CALCULATED.',
      },
      {
        id: 'img',
        step: 'IMAGE_EDITING',
        kisi_kisi: 'Point 8 · Aplikasi Pengolah Gambar',
        command: 'img_tool satellite_map.jpg',
        type: 'image',
        title: 'Edit Peta Satelit',
        instruction:
          'Peta satelit berisi border dan area yang tidak perlu. Pilih perintah pengeditan yang tepat: potong peta ke "Sector 5" lalu perkuat kontrasnya!',
        logs: [
          '[DATA] satellite_map.jpg loaded.',
          '[TASK A] The map contains unnecessary borders. Crop to Sector 5.',
          '[TASK B] The damage colors are too faint. Recolor with high contrast.',
          '[INPUT] Apply the correct image tool for each task.',
        ],
        map_original: [
          '   +-------------------------------------+',
          '   |   K5 CITY DAMAGE MAP (SATELLITE)    |',
          '   |                                     |',
          '   |      ##  ..   **    ..   ##         |',
          '   |    ..###! **!!..!**##     ...       |',
          '   |      ....**!!..   ##...  ..         |',
          '   |   +======== SECTOR 5 ========+      |',
          '   |   |  ## ** .. ** ##   !! ..  |      |',
          '   |   |  ** .. ## ** ..   ## **  |      |',
          '   |   +==========================+      |',
          '   +-------------------------------------+',
        ],
        map_cropped: [
          '   +====================================+',
          '   |        SECTOR 5 · ZOOM             |',
          '   |                                    |',
          '   |   ## ** .. ** ##   !! ..  **       |',
          '   |   ** .. ## ** ..   ## **   ..      |',
          '   |   .. ** !! ** .. ** ..   ## ##     |',
          '   |   ** .. ## .. ** ## ** .. **       |',
          '   +====================================+',
        ],
        rounds: [
          {
            id: 'crop',
            label: 'Potong peta ke beberapa bagian yang penting saja: --crop "Sector 5".',
            chips: [
              { id: 'crop', cmd: '--crop "Sector 5"', good: true },
              { id: 'rotate', cmd: '--rotate 180deg', good: false },
              { id: 'blur', cmd: '--blur heavy', good: false },
            ],
          },
          {
            id: 'contrast',
            label: 'Perjelas peta kerusakan: --recolor --contrast-high.',
            chips: [
              { id: 'hi', cmd: '--recolor --contrast-high', good: true },
              { id: 'lo', cmd: '--recolor --saturation-low', good: false },
              { id: 'flip', cmd: '--flip horizontal', good: false },
            ],
          },
        ],
        success: 'DAMAGE MAP CLEAR.',
      },
      {
        id: 'conv',
        step: 'FILE_CONVERSION',
        kisi_kisi: 'Point 9 & 10 · Berkas Digital & Konversi',
        command: 'file_manager --status',
        type: 'convert',
        title: 'Konversi & Kirim Laporan',
        instruction:
          'Sistem walikota hanya bisa membuka dokumen PDF yang aman. Pilih berkas laporan yang benar dan format tujuannya, lalu transmisikan!',
        logs: [
          '[LIST] Digital files detected:',
          '   report_final.docx   128 KB   text document',
          '   damage_stats.csv     12 KB   spreadsheet',
          '   satellite_map.jpg   980 KB   image',
          '   report_draft.txt      3 KB   plain text',
          '[HINT] The mayor\'s system opens secure PDF documents only.',
          '[INPUT] Choose the report file, then choose the target format.',
        ],
        step0: {
          label: 'Pilih berkas laporan resmi yang harus dikonversi.',
          options: [
            { id: 'doc', label: 'report_final.docx', good: true },
            { id: 'csv', label: 'damage_stats.csv', good: false },
            { id: 'jpg', label: 'satellite_map.jpg', good: false },
          ],
        },
        step1: {
          label: 'Pilih format tujuan yang bisa dibuka sistem walikota.',
          options: [
            { id: 'pdf', label: '--to pdf', good: true },
            { id: 'mp3', label: '--to mp3', good: false },
            { id: 'jpg', label: '--to jpg', good: false },
          ],
        },
        final_lines: [
          '$ convert report_final.docx --to pdf',
          '[WORKING] Converting document...',
          '[SUCCESS] report_final.pdf created. Transmission Complete!',
        ],
        success: 'TRANSMISSION COMPLETE.',
      },
    ],
  },
]