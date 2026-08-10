import { useState } from 'react'
import CpuMonitorGame from './games/CpuMonitorGame.jsx'
import BerKomGame from './games/BerKomGame.jsx'
import ExamRunner from './games/ExamRunner.jsx'

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
    title: 'Exam',
    tagline: 'Answer questions and test what you know!',
    images: ['/images/quiz.svg', '/images/cpu.svg'],
    Component: ExamRunner,
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
    </div>
  )
}

function App() {
  const [activeGameId, setActiveGameId] = useState(
    () => window.location.hash.replace('#', '') || null,
  )
  const activeGame = GAMES.find((game) => game.id === activeGameId)

  if (activeGame) {
    const GameComponent = activeGame.Component
    return <GameComponent onExit={() => setActiveGameId(null)} />
  }

  return <Catalog onPlay={(gameId) => setActiveGameId(gameId)} />
}

export default App
