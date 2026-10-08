export const CATEGORIES = [
  { id: 'quizzes', label: 'Quizzes', color: 'bg-sky-500', order: 1 },
  { id: 'preschool', label: 'Preschool', color: 'bg-pink-500', order: 2 },
  { id: 'primary', label: 'Primary', color: 'bg-emerald-500', order: 3 },
  { id: 'junior-high', label: 'Junior High', color: 'bg-amber-500', order: 4 },
]

export const QUIZ_REGISTRY = [
  { id: 'cpu-monitor', title: 'CPU & Monitor', tagline: 'Look at the picture, then tap to see another one!', images: ['/images/cpu.svg', '/images/monitor.svg'], category: 'preschool' },
  { id: 'berkom', title: 'BerKom', tagline: 'Drag the computer parts into the right order!', images: ['/images/keyboard.svg', '/images/mouse.svg'], category: 'preschool' },
  { id: 'sinyal-lab', title: 'Sinyal Lab', tagline: 'Sort the hardware into their signal ports!', images: ['/images/smartphone.svg', '/images/tv.svg'], category: 'preschool' },
  { id: 'keyboard', title: 'Keyboard', tagline: 'Learn the magic keys on your keyboard!', images: ['/images/keyboard.svg', '/images/mouse.svg'], category: 'preschool' },
  { id: 'typing', title: 'Typing Rescue', tagline: 'Save the floating letters in space!', images: ['/images/keyboard.svg', '/images/cpu.svg'], category: 'preschool' },
  { id: 'artemis', title: 'Operation Artemis', tagline: 'Mission Control: relay the numbers that launch Artemis 3 to the Moon!', images: ['/images/rocket.svg', '/images/monitor.svg'], category: 'primary' },
  { id: 'artemis-g8', title: 'Operation Artemis G8', tagline: 'Grade 8 Mission Control: relay the numbers that launch Artemis 3 to the Moon!', images: ['/images/rocket.svg', '/images/monitor.svg'], category: 'junior-high' },
  { id: 'polisi-warna', title: 'Polisi Warna', tagline: 'Drag the car to its matching color police station!', images: ['/images/polisi.svg', '/images/palette.svg'], category: 'preschool' },
  { id: 'polisi-patroli', title: 'Polisi Patroli Lintasan', tagline: 'Glide your cursor along the road to reach the Police Station!', images: ['/images/polisi.svg', '/images/policecar.jpg'], category: 'preschool' },
  { id: 'polisi-lintasan-pov', title: 'Polisi Lintasan POV', tagline: 'Miringkan tubuhmu untuk menikung! POV dari dalam mobil polisi!', images: ['/images/polisi.svg', '/images/policecar.jpg'], category: 'preschool' },
  { id: 'pesta-puzzle', title: 'Pesta Puzzle Polisi', tagline: 'Ayo susun potongan gambar polisi yang tersebar!', images: ['/images/polisi.svg', '/images/policecar.jpg'], category: 'preschool' },
  { id: 'kantin-crisis', title: 'Krisis 15 Menit', tagline: 'Build a canteen automation system under 15 minutes!', images: ['/images/kantin.svg', '/images/robot.svg'], category: 'primary' },
  { id: 'kelinci-lompat', title: 'Kelinci Lompat Space', tagline: 'Press SPACE to jump! Collect carrots and reach the golden carrot!', images: ['/images/kelinci.svg', '/images/golden-carrot.svg'], category: 'preschool' },
  { id: 'kelinci-berlari', title: 'POV Kelinci Berlari', tagline: 'GoPro di kepala kelinci! Lompat bareng si kelinci di ladang!', images: ['/images/kelinci.svg', '/images/golden-carrot.svg'], category: 'preschool' },
  { id: 'cyberquest', title: 'CyberQuest: Computational World', tagline: 'Bantu Kiki si Cyber-Bot pulihkan dunia digital! 10 misi berpikir komputasional.', images: ['/images/robot.svg', '/images/cpu.svg'], category: 'primary' },
  { id: 'tik-quest', title: 'Detective Bity: TIK Quest', tagline: 'Selesaikan 9 kasus TIK, kumpulkan lencana, dan raih sertifikat Master Detective!', images: ['/images/laptop.svg', '/images/smartphone.svg'], category: 'primary' },
  { id: 'terminal-protocol', title: 'Terminal Protocol', tagline: 'Ketik perintah terminal darurat untuk memulihkan kota dari virus NOVA-BUG!', images: ['/images/monitor.svg', '/images/keyboard.svg'], category: 'junior-high' },
  { id: 'misi-roket-bintang', title: 'Misi Roket Bintang', tagline: 'Tekan F J D K S L A untuk mengumpulkan bintang dan melepas roketnya!', images: ['/images/rocket.svg', '/images/keyboard.svg'], category: 'primary' },
  { id: 'jembatan-bintang', title: 'P12 Misi Roket', tagline: 'Bangun jembatan bintang F G H J menuju stasiun luar angkasa!', images: ['/images/rocket.svg', '/images/keyboard.svg'], category: 'preschool' },
  { id: 'exam', title: 'Quiz Grade 1', tagline: 'Answer questions and test what you know!', images: ['/images/quiz.svg', '/images/cpu.svg'], examKey: 'kuis-berpikir-komputasional', category: 'quizzes' },
  { id: 'exam-2', title: 'Quiz Grade 2', tagline: 'Fun questions for grade 2 learners!', images: ['/images/quiz.svg', '/images/monitor.svg'], examKey: 'kuis-berpikir-komputasional-2', category: 'quizzes' },
  { id: 'exam-3', title: 'Quiz Grade 3', tagline: 'Fun questions for grade 3 learners!', images: ['/images/quiz.svg', '/images/monitor.svg'], examKey: 'kuis-berpikir-komputasional-3', category: 'quizzes' },
  { id: 'exam-4', title: 'Quiz Grade 4', tagline: 'Tough questions for grade 4 learners!', images: ['/images/quiz.svg', '/images/cpu.svg'], examKey: 'kuis-berpikir-komputasional-4', category: 'quizzes' },
  { id: 'exam-5', title: 'Quiz Grade 5', tagline: 'Tough questions for grade 5 learners!', images: ['/images/quiz.svg', '/images/cpu.svg'], examKey: 'kuis-berpikir-komputasional-5', category: 'quizzes' },
  { id: 'exam-6', title: 'Quiz Grade 6', tagline: 'Tough questions for grade 6 learners!', images: ['/images/quiz.svg', '/images/monitor.svg'], examKey: 'kuis-berpikir-komputasional-6', category: 'quizzes' },
  { id: 'exam-7', title: 'Quiz Grade 7', tagline: 'CT questions for Grade 7 learners!', images: ['/images/quiz.svg', '/images/cpu.svg'], examKey: 'kuis-informatika-kelas-7', category: 'quizzes' },
  { id: 'exam-smp', title: 'Quiz SMP', tagline: 'Advanced questions for junior high learners!', images: ['/images/quiz.svg', '/images/cpu.svg'], examKey: 'kuis-berpikir-komputasional-smp', category: 'quizzes' },
  { id: 'exam-smp-aug3', title: 'Quiz SMP Grade 9', tagline: 'CT & Flowchart — August Week 3!', images: ['/images/quiz.svg', '/images/monitor.svg'], examKey: 'kuis-ct-smp-agustus-minggu-3', category: 'quizzes' },
  { id: 'exam-smp-g8', title: 'Quiz SMP Grade 8', tagline: 'CT & Flowchart for Grade 8!', images: ['/images/quiz.svg', '/images/cpu.svg'], examKey: 'kuis-ct-smp-grade-8', category: 'quizzes' },
]

export const EXAM_NAME_MAP = Object.fromEntries(
  QUIZ_REGISTRY.filter((q) => q.examKey).map((q) => [q.examKey, q.title]),
)

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id)
}

export function getQuizzesByCategory(categoryId) {
  return QUIZ_REGISTRY.filter((q) => q.category === categoryId)
}