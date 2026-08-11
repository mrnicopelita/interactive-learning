import { useState } from 'react'
import CpuMonitorGame from './games/CpuMonitorGame.jsx'
import BerKomGame from './games/BerKomGame.jsx'
import ExamRunner from './games/ExamRunner.jsx'
import Dashboard from './dashboard/Dashboard.jsx'
import { EXAM } from './exams/examData.js'
import { EXAM_4 } from './exams/exam4Data.js'
import { EXAM_5 } from './exams/exam5Data.js'
import { EXAM_6 } from './exams/exam6Data.js'

const GAMES = [
  {
    id: 'cpu-monitor',
    title: 'CPU & Monitor',
    tagline: 'Look at the picture, then tap to see another one!',
    images: ['/images/cpu.svg', '/images/monitor.svg'],
    Component: CpuMonitorGame,
  },
  {
    id: 'berkom',
    title: 'BerKom',
    tagline: 'Drag the computer parts into the right order!',
    images: ['/images/keyboard.svg', '/images/mouse.svg'],
    Component: BerKomGame,
  },
  {
    id: 'exam',
    title: 'Quiz Primary A',
    tagline: 'Answer questions and test what you know!',
    images: ['/images/quiz.svg', '/images/cpu.svg'],
    Component: (props) => <ExamRunner exam={EXAM} {...props} />,
  },
  {
    id: 'exam-4',
    title: 'Quiz Grade 4',
    tagline: 'Tough questions for grade 4 learners!',
    images: ['/images/quiz.svg', '/images/cpu.svg'],
    Component: (props) => <ExamRunner exam={EXAM_4} {...props} />,
  },
  {
    id: 'exam-5',
    title: 'Quiz Grade 5',
    tagline: 'Tough questions for grade 5 learners!',
    images: ['/images/quiz.svg', '/images/cpu.svg'],
    Component: (props) => <ExamRunner exam={EXAM_5} {...props} />,
  },
  {
    id: 'exam-6',
    title: 'Quiz Grade 6',
    tagline: 'Tough questions for grade 6 learners!',
    images: ['/images/quiz.svg', '/images/monitor.svg'],
    Component: (props) => <ExamRunner exam={EXAM_6} {...props} />,
  },
]

function Catalog({ onPlay }) {
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
      <header className="z-10 flex w-full shrink-0 items-center justify-center bg-white/85 px-4 py-3 text-center shadow-md backdrop-blur-sm sm:py-4">
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-none text-slate-700">
          Interactive <span className="text-sky-600">Learning</span>
        </h1>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-4 py-4 sm:gap-8 sm:px-6 sm:py-6">
        <p className="text-lg font-bold text-slate-600 sm:text-2xl">
          Pick a game to play!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {GAMES.map((game) => (
            <div key={game.id} className="animate-pop-in">
              <button
                type="button"
                onClick={() => onPlay(game.id)}
                className="group flex w-[min(90vw,22rem)] flex-col items-center gap-4 rounded-3xl bg-white/95 px-8 py-6 shadow-lg transition hover:scale-105 hover:shadow-xl sm:gap-5 sm:px-10 sm:py-8"
              >
                <div className="flex items-center gap-4">
                  {game.images.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="h-24 w-24 object-contain drop-shadow-md transition group-hover:scale-105 sm:h-32 sm:w-32"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold text-slate-700 sm:text-3xl">
                    {game.title}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500 sm:mt-2 sm:text-sm">
                    {game.tagline}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="z-10 flex w-full shrink-0 items-center justify-center pb-4 sm:pb-5">
        <button
          type="button"
          onClick={() => onPlay('dashboard')}
          className="rounded-full bg-white/60 px-4 py-2 text-xs font-extrabold text-slate-500 shadow transition hover:scale-105 hover:bg-white/95 hover:text-sky-700 sm:px-5 sm:text-sm"
        >
          <span aria-hidden="true">🔑</span> Admin Dashboard
        </button>
      </footer>
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState(
    () => window.location.hash.replace('#', '') || null,
  )

  if (activeView === 'dashboard') {
    return <Dashboard onExit={() => setActiveView(null)} />
  }

  const activeGame = GAMES.find((game) => game.id === activeView)
  if (activeGame) {
    const GameComponent = activeGame.Component
    return <GameComponent onExit={() => setActiveView(null)} />
  }

  return <Catalog onPlay={(gameId) => setActiveView(gameId)} />
}

export default App
