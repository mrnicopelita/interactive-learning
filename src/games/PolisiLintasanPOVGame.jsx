import { useRef, useEffect, useState, useCallback } from 'react'
import confetti from 'canvas-confetti'

const ROAD_SPEED = 3.5
const TURN_DURATION = 1.2
const STRAIGHT_MIN = 2.5
const STRAIGHT_MAX = 5.0
const DISTANCE_TO_WIN = 500

function playSiren() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const t0 = ctx.currentTime
  const o1 = ctx.createOscillator()
  const o2 = ctx.createOscillator()
  const g = ctx.createGain()
  o1.type = 'square'
  o2.type = 'square'
  g.gain.setValueAtTime(0.1, t0)
  g.gain.linearRampToValueAtTime(0, t0 + 1.5)
  o1.frequency.setValueAtTime(600, t0)
  o1.frequency.linearRampToValueAtTime(900, t0 + 0.2)
  o1.frequency.linearRampToValueAtTime(600, t0 + 0.4)
  o2.frequency.setValueAtTime(500, t0)
  o2.frequency.linearRampToValueAtTime(800, t0 + 0.2)
  o2.frequency.linearRampToValueAtTime(500, t0 + 0.4)
  o1.connect(g)
  o2.connect(g)
  g.connect(ctx.destination)
  o1.start(t0)
  o2.start(t0)
  o1.stop(t0 + 1.5)
  o2.stop(t0 + 1.5)
}

function playTurnChime(direction) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const t = ctx.currentTime
  const notes = direction === 'left' ? [523.25, 440, 349.23] : [349.23, 440, 523.25]
  notes.forEach((freq, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = freq
    g.gain.setValueAtTime(0.18, t + i * 0.12)
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.25)
    o.connect(g)
    g.connect(ctx.destination)
    o.start(t + i * 0.12)
    o.stop(t + i * 0.12 + 0.28)
  })
}

function playFanfare() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  ;[523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.12
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'triangle'
    o.frequency.value = freq
    g.gain.setValueAtTime(0.2, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    o.connect(g)
    g.connect(ctx.destination)
    o.start(t)
    o.stop(t + 0.42)
  })
}

function generateRoadEvents() {
  const events = []
  let z = 8
  while (z < DISTANCE_TO_WIN) {
    const straight = STRAIGHT_MIN + Math.random() * (STRAIGHT_MAX - STRAIGHT_MIN)
    z += straight
    if (z >= DISTANCE_TO_WIN) break
    const dir = Math.random() > 0.5 ? 'left' : 'right'
    const intensity = 0.3 + Math.random() * 0.7
    events.push({ z, direction: dir, intensity, active: false })
    z += TURN_DURATION * ROAD_SPEED
  }
  return events
}

function DashboardInterior() {
  return (
    <svg viewBox="0 0 800 120" className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="dash-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0f0f1a" />
        </linearGradient>
        <linearGradient id="windshield-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(135,206,235,0.15)" />
          <stop offset="100%" stopColor="rgba(135,206,235,0.02)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="120" fill="url(#dash-grad)" />

      <rect x="0" y="0" width="800" height="40" fill="url(#windshield-grad)" />

      <rect x="50" y="15" width="160" height="95" rx="8" fill="#0d0d1a" stroke="#333" strokeWidth="2" />
      <circle cx="130" cy="62" r="35" fill="#111" stroke="#444" strokeWidth="2" />
      <circle cx="130" cy="62" r="28" fill="#0a0a12" />
      <text x="130" y="58" textAnchor="middle" fill="#22c55e" fontSize="14" fontFamily="monospace" fontWeight="bold">80</text>
      <text x="130" y="72" textAnchor="middle" fill="#666" fontSize="8" fontFamily="monospace">KM/H</text>

      <rect x="320" y="10" width="160" height="100" rx="10" fill="#111" stroke="#333" strokeWidth="2" />
      <rect x="330" y="20" width="140" height="60" rx="4" fill="#0a1628" />
      <text x="400" y="45" textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="monospace">PATROLI ROUTE</text>
      <rect x="340" y="55" width="120" height="2" fill="#1e3a5f" />
      <circle cx="360" cy="56" r="3" fill="#22c55e" />
      <rect x="340" y="75" width="120" height="2" fill="#1e3a5f" />
      <circle cx="440" cy="76" r="3" fill="#f59e0b" />
      <rect x="340" y="95" width="120" height="2" fill="#1e3a5f" />
      <circle cx="400" cy="96" r="3" fill="#ef4444" />

      <rect x="600" y="15" width="150" height="95" rx="8" fill="#0d0d1a" stroke="#333" strokeWidth="2" />
      <rect x="615" y="30" width="40" height="25" rx="3" fill="#1a0a0a" />
      <circle cx="635" cy="42" r="6" fill="#ef4444" opacity="0.3" />
      <rect x="665" y="30" width="40" height="25" rx="3" fill="#0a0a1a" />
      <circle cx="685" cy="42" r="6" fill="#3b82f6" opacity="0.3" />
      <rect x="615" y="65" width="90" height="30" rx="4" fill="#111" />
      <text x="660" y="84" textAnchor="middle" fill="#888" fontSize="8" fontFamily="monospace">RADIO CH</text>

      <rect x="240" y="90" width="320" height="30" rx="6" fill="#0d0d1a" stroke="#444" strokeWidth="1" />
      <rect x="260" y="98" width="30" height="14" rx="3" fill="#22c55e" />
      <rect x="300" y="98" width="30" height="14" rx="3" fill="#ef4444" />
      <rect x="340" y="98" width="50" height="14" rx="3" fill="#3b82f6" />
      <rect x="400" y="98" width="40" height="14" rx="3" fill="#f59e0b" />
      <rect x="450" y="98" width="30" height="14" rx="3" fill="#8b5cf6" />
      <rect x="490" y="98" width="60" height="14" rx="3" fill="#6b7280" />
    </svg>
  )
}

function PoliceSteeringWheel() {
  return (
    <svg viewBox="0 0 200 200" className="w-[min(18vw,120px)] h-auto drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]" aria-hidden="true">
      <circle cx="100" cy="100" r="85" fill="none" stroke="#1a1a2e" strokeWidth="18" />
      <circle cx="100" cy="100" r="85" fill="none" stroke="#2d2d44" strokeWidth="14" />
      <circle cx="100" cy="100" r="35" fill="#1a1a2e" stroke="#3d3d55" strokeWidth="3" />
      <rect x="88" y="15" width="24" height="50" rx="6" fill="#1a1a2e" />
      <rect x="88" y="135" width="24" height="50" rx="6" fill="#1a1a2e" />
      <rect x="15" y="88" width="50" height="24" rx="6" fill="#1a1a2e" />
      <rect x="135" y="88" width="50" height="24" rx="6" fill="#1a1a2e" />
      <circle cx="100" cy="100" r="12" fill="#fbbf24" />
      <text x="100" y="104" textAnchor="middle" fill="#1a1a2e" fontSize="10" fontWeight="bold">⭐</text>
    </svg>
  )
}

export default function PolisiLintasanPOVGame({ onExit }) {
  const [phase, setPhase] = useState('start')
  const [distance, setDistance] = useState(0)
  const [turnCount, setTurnCount] = useState(0)
  const [currentCue, setCurrentCue] = useState(null)
  const [steerAngle, setSteerAngle] = useState(0)
  const [roadTilt, setRoadTilt] = useState(0)

  const worldZRef = useRef(0)
  const eventsRef = useRef(generateRoadEvents())
  const cueFiredRef = useRef(new Set())
  const lastTimeRef = useRef(0)
  const phaseRef = useRef('start')
  const stageRef = useRef(null)

  useEffect(() => { phaseRef.current = phase }, [phase])

  const restart = useCallback(() => {
    worldZRef.current = 0
    eventsRef.current = generateRoadEvents()
    cueFiredRef.current.clear()
    lastTimeRef.current = performance.now()
    setDistance(0)
    setTurnCount(0)
    setCurrentCue(null)
    setSteerAngle(0)
    setRoadTilt(0)
    setPhase('run')
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    let raf = 0
    const tick = (ts) => {
      const dt = Math.min(0.05, (ts - lastTimeRef.current) / 1000)
      lastTimeRef.current = ts

      if (phaseRef.current !== 'run') {
        raf = requestAnimationFrame(tick)
        return
      }

      worldZRef.current += ROAD_SPEED * dt
      setDistance(Math.floor(worldZRef.current))

      const z = worldZRef.current
      const events = eventsRef.current

      for (const ev of events) {
        const distToTurn = ev.z - z

        if (distToTurn > 0 && distToTurn < 6 && !cueFiredRef.current.has(ev.z)) {
          cueFiredRef.current.add(ev.z)
          setCurrentCue({ direction: ev.direction, intensity: ev.intensity })
          setTurnCount((c) => c + 1)
          playTurnChime(ev.direction)

          setTimeout(() => {
            setSteerAngle(ev.direction === 'left' ? -0.6 * ev.intensity : 0.6 * ev.intensity)
            setRoadTilt(ev.direction === 'left' ? -4 * ev.intensity : 4 * ev.intensity)
          }, 200)

          setTimeout(() => {
            setSteerAngle(0)
            setRoadTilt(0)
          }, 1200)

          setTimeout(() => setCurrentCue(null), 1800)
        }
      }

      if (z >= DISTANCE_TO_WIN && phaseRef.current === 'run') {
        setPhase('win')
        playSiren()
        setTimeout(playFanfare, 400)
      }

      raf = requestAnimationFrame(tick)
    }

    lastTimeRef.current = performance.now()
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (phase !== 'win') return
    const colors = ['#3b82f6', '#facc15', '#ef4444', '#22c55e', '#ffffff']
    const star = confetti.shapeFromText({ text: '⭐', scalar: 1.5 })
    const burst = (angle, origin, count) =>
      confetti({ particleCount: count, angle, spread: 140, startVelocity: 50, gravity: 0.9, ticks: 260, origin, colors, shapes: [star, 'circle'], scalar: 1.2 })
    const timers = [
      setTimeout(() => burst(90, { x: 0.5, y: 0.45 }, 140), 200),
      setTimeout(() => burst(60, { x: 0.1, y: 0.9 }, 100), 500),
      setTimeout(() => burst(120, { x: 0.9, y: 0.9 }, 100), 700),
      setTimeout(() => burst(90, { x: 0.5, y: 0.15 }, 120), 950),
    ]
    return () => timers.forEach(clearTimeout)
  }, [phase])

  const progressPct = Math.min(100, (distance / DISTANCE_TO_WIN) * 100)

  return (
    <div className="flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden bg-slate-900">
      <header className="z-30 flex w-full shrink-0 flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-5 sm:py-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-white/85 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base"
        >
          ‹ Keluar
        </button>
        <h1 className="text-[clamp(1.35rem,4.5vw,2.5rem)] font-black leading-none text-white drop-shadow-sm">
          <span aria-hidden="true">🚔</span> Polisi Lintasan POV
        </h1>
        <button
          type="button"
          onClick={restart}
          className="rounded-full bg-amber-500/90 px-4 py-2 text-sm font-extrabold text-white shadow-[0_4px_0_rgba(180,83,9,0.8)] transition hover:scale-105 hover:bg-amber-500 sm:px-5 sm:text-base"
        >
          🔁 Ulangi
        </button>
      </header>

      <div className="z-30 flex w-full shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-1 px-2 py-1 sm:py-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-extrabold tracking-wide text-blue-300 uppercase sm:text-sm">Jarak</span>
          <span className="text-xl font-black text-white sm:text-2xl">
            🚗 {distance}m
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-extrabold tracking-wide text-amber-300 uppercase sm:text-sm">Tikungan</span>
          <span className="text-xl font-black text-amber-400 sm:text-2xl">
            ↩️ {turnCount}
          </span>
        </div>
        <div className="w-[min(40vw,200px)]">
          <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-center text-[10px] font-bold text-slate-400 mt-0.5">{Math.floor(progressPct)}%</p>
        </div>
      </div>

      <div ref={stageRef} className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className="absolute inset-0 will-change-transform transition-transform duration-300"
          style={{ transform: `rotate(${roadTilt}deg) scale(1.02)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400" />

          <div className="absolute top-[5%] right-[8%] text-6xl opacity-90 drop-shadow-[0_0_16px_rgba(250,204,21,0.8)] sm:text-8xl">
            ☀️
          </div>

          {[
            { top: '12%', left: '10%', dur: '32s', size: 'text-4xl sm:text-6xl' },
            { top: '20%', left: '70%', dur: '28s', size: 'text-5xl sm:text-7xl' },
            { top: '8%', left: '45%', dur: '36s', size: 'text-3xl sm:text-5xl' },
            { top: '28%', left: '85%', dur: '30s', size: 'text-4xl sm:text-6xl' },
          ].map((c, i) => (
            <div
              key={i}
              className={`animate-cloud-drift absolute opacity-60 ${c.size}`}
              style={{ top: c.top, left: c.left, animationDuration: c.dur }}
            >
              ☁️
            </div>
          ))}

          <div className="absolute bottom-0 left-0 right-0 h-[55%]">
            <div className="h-full w-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          </div>

          <div
            className="absolute bottom-[20%] left-1/2 -translate-x-1/2 transition-transform duration-200"
            style={{ transform: `translateX(-50%) rotate(${steerAngle * 15}deg)` }}
          >
            <svg viewBox="0 0 400 600" className="w-[min(50vw,320px)] h-auto opacity-90">
              <rect x="50" y="0" width="300" height="600" fill="#555" rx="10" />
              <rect x="55" y="5" width="290" height="590" fill="#666" rx="8" />
              <rect x="120" y="100" width="160" height="400" fill="#888" rx="6" />
              <line x1="200" y1="100" x2="200" y2="500" stroke="#fff" strokeWidth="4" strokeDasharray="20,15" />
              <rect x="60" y="50" width="80" height="8" fill="#444" rx="4" />
              <rect x="260" y="50" width="80" height="8" fill="#444" rx="4" />
              <rect x="60" y="540" width="80" height="8" fill="#444" rx="4" />
              <rect x="260" y="540" width="80" height="8" fill="#444" rx="4" />
              {[0, 1, 2, 3, 4].map(i => (
                <rect key={`tree-l-${i}`} x="10" y={120 + i * 100} width="25" height="35" fill="#2d5016" rx="4" />
              ))}
              {[0, 1, 2, 3, 4].map(i => (
                <rect key={`tree-r-${i}`} x="365" y={150 + i * 100} width="25" height="35" fill="#2d5016" rx="4" />
              ))}
              {[0, 1, 2, 3].map(i => (
                <circle key={`bush-l-${i}`} cx="20" cy={80 + i * 130} r="15" fill="#166534" />
              ))}
              {[0, 1, 2, 3].map(i => (
                <circle key={`bush-r-${i}`} cx="380" cy={110 + i * 130} r="15" fill="#166534" />
              ))}
            </svg>
          </div>

          <div className="absolute bottom-[42%] left-1/2 -translate-x-1/2 text-4xl sm:text-6xl opacity-30">
            🚧
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[18vh] min-h-[80px]">
          <DashboardInterior />
        </div>

        <div className="pointer-events-none absolute bottom-[14vh] left-1/2 z-25 -translate-x-1/2">
          <PoliceSteeringWheel />
        </div>

        <div className="pointer-events-none absolute left-3 top-2 z-30 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-white backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-[10px] font-black tracking-widest sm:text-xs">DASHCAM • REC</span>
        </div>

        {currentCue && phase === 'run' && (
          <div
            className="animate-cue-pop pointer-events-none absolute left-1/2 top-[25%] z-40 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-2xl px-8 py-4 text-center shadow-2xl sm:px-12 sm:py-6"
            style={{
              background: currentCue.direction === 'left'
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                : 'linear-gradient(135deg, #22c55e, #15803d)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-6xl">{currentCue.direction === 'left' ? '👈' : '👉'}</span>
              <div>
                <p className="text-2xl font-black text-white drop-shadow-lg sm:text-4xl">
                  MIRING {currentCue.direction === 'left' ? 'KIRI' : 'KANAN'}!
                </p>
                <p className="text-sm font-bold text-white/80 sm:text-lg">
                  Ikuti tikungan! 💪
                </p>
              </div>
              <span className="text-4xl sm:text-6xl">{currentCue.direction === 'left' ? '🧍' : '🧍'}</span>
            </div>
          </div>
        )}

        {phase === 'start' && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle,rgba(240,253,244,0.97)_0%,rgba(187,247,208,0.95)_100%)] px-4">
            <div className="animate-pop-in flex flex-col items-center text-center">
              <span className="text-[clamp(2.5rem,8vw,4rem)]" aria-hidden="true">
                🎥🚔
              </span>
              <h2 className="text-[clamp(1.6rem,5vw,2.6rem)] font-black text-blue-900">
                POV Polisi di Lintasan!
              </h2>
              <p className="max-w-xl text-[clamp(1rem,3vw,1.35rem)] font-bold text-blue-800">
                Kamu ada di dalam mobil polisi yang sedang patroli! Saat mobil{' '}
                <span className="text-amber-600">MENIKUNG</span>, kamu harus ikut miring! 🔄
              </p>
              <p className="max-w-xl text-sm font-bold text-blue-700 sm:text-base">
                Berdiri tegak, lalu miringkan tubuhmu ke kiri atau kanan mengikuti tikungan! 🧍‍♂️
              </p>
            </div>
            <button
              type="button"
              onClick={restart}
              className="animate-pov-replay rounded-full bg-blue-500 px-10 py-4 text-xl font-black text-white shadow-[0_6px_0_#1d4ed8] transition hover:scale-105 sm:text-2xl"
            >
              🚔 Mulai Patroli!
            </button>
          </div>
        )}

        {phase === 'win' && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle,rgba(255,244,214,0.97)_0%,rgba(253,230,138,0.93)_45%,rgba(245,197,24,0.88)_100%)] px-4">
            <div className="animate-hore-bounce flex items-center gap-2 text-center">
              <span className="text-[clamp(2rem,7vw,4rem)] font-black text-amber-800 drop-shadow-[0_4px_0_rgba(146,64,14,0.35)]">
                PATROLI SELESAI!
              </span>
              <span className="text-[clamp(1.6rem,5vw,3rem)]" aria-hidden="true">
                🎉
              </span>
            </div>
            <p className="text-5xl" aria-hidden="true">⭐🚔⭐</p>
            <p className="animate-pop-in text-center text-[clamp(1rem,3vw,1.5rem)] font-extrabold text-amber-800">
              Kamu berhasil menyelesaikan patroli!
            </p>
            <p className="-mt-1 text-center text-sm font-extrabold text-amber-700 sm:text-base">
              Menikung {turnCount} kali sejauh {distance} meter! 💪
            </p>
            <p className="text-center text-sm font-extrabold text-amber-700 sm:text-base">
              Kamu ikut miring ke kiri dan kanan, kan? Keren! 🧍‍♂️
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                className="rounded-full bg-blue-500 px-7 py-3 text-lg font-black text-white shadow-[0_5px_0_#1d4ed8] transition hover:scale-105 sm:text-xl"
              >
                🚔 Patroli Lagi
              </button>
              <button
                type="button"
                onClick={onExit}
                className="rounded-full bg-white/85 px-7 py-3 text-lg font-black text-slate-600 shadow-md transition hover:scale-105 sm:text-xl"
              >
                ‹ Keluar
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cue-pop {
          0% { transform: translateX(-50%) translateY(-50%) scale(0.5); opacity: 0; }
          60% { transform: translateX(-50%) translateY(-50%) scale(1.1); }
          100% { transform: translateX(-50%) translateY(-50%) scale(1); opacity: 1; }
        }
        @keyframes cloud-drift {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(calc(100vw + 120%)); }
        }
        @keyframes pov-replay {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes hore-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        .animate-cue-pop { animation: cue-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .animate-cloud-drift { animation: cloud-drift linear infinite; }
        .animate-pov-replay { animation: pov-replay 2.5s ease-in-out infinite; }
        .animate-hore-bounce { animation: hore-bounce 0.8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
