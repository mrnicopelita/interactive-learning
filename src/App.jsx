import { useState } from 'react'
import CpuMonitorGame from './games/CpuMonitorGame.jsx'

const GAMES = [
  {
    id: 'cpu-monitor',
    title: 'CPU & Monitor',
    tagline: 'Look at the picture, then tap to see another one!',
    images: ['/images/cpu.svg', '/images/monitor.svg'],
    Component: CpuMonitorGame,
  },
]

function Catalog({ onPlay }) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
      <header className="z-10 flex w-full items-center justify-center bg-white/85 px-5 py-4 text-center shadow-md backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-slate-700 sm:text-5xl">
          Interactive <span className="text-sky-600">Learning</span>
        </h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-6">
        <p className="text-xl font-bold text-slate-600 sm:text-2xl">
          Pick a game to play!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {GAMES.map((game) => (
            <div key={game.id} className="animate-pop-in">
              <button
                type="button"
                onClick={() => onPlay(game.id)}
                className="group flex min-w-72 flex-col items-center gap-5 rounded-3xl bg-white/95 px-10 py-8 shadow-lg transition hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  {game.images.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="h-28 w-28 object-contain drop-shadow-md transition group-hover:scale-105 sm:h-32 sm:w-32"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-slate-700">
                    {game.title}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
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
  const [activeGameId, setActiveGameId] = useState(null)
  const activeGame = GAMES.find((game) => game.id === activeGameId)

  if (activeGame) {
    const GameComponent = activeGame.Component
    return <GameComponent onExit={() => setActiveGameId(null)} />
  }

  return <Catalog onPlay={(gameId) => setActiveGameId(gameId)} />
}

export default App
