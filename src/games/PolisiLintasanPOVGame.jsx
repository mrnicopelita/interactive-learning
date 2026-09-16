import { useRef, useEffect, useState, useCallback } from 'react'

const ROAD_SEGMENTS = 120
const TURN_THRESHOLD = 0.3

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

function playTurnSound(direction) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  if (direction === 'left') {
    o.frequency.setValueAtTime(440, t)
    o.frequency.linearRampToValueAtTime(330, t + 0.15)
  } else {
    o.frequency.setValueAtTime(330, t)
    o.frequency.linearRampToValueAtTime(440, t + 0.15)
  }
  g.gain.setValueAtTime(0.15, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
  o.connect(g)
  g.connect(ctx.destination)
  o.start(t)
  o.stop(t + 0.25)
}

function generateRoad() {
  const segments = []
  let angle = 0
  for (let i = 0; i < ROAD_SEGMENTS; i++) {
    if (i > 10 && i % 8 === 0 && Math.random() > 0.4) {
      const turn = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5)
      angle += turn
    }
    segments.push({
      angle,
      hasTurn: Math.abs(angle) > TURN_THRESHOLD,
      turnDirection: angle > TURN_THRESHOLD ? 'right' : angle < -TURN_THRESHOLD ? 'left' : null,
      speed: 0.8 + Math.random() * 0.4,
    })
    angle *= 0.92
  }
  return segments
}

export default function PolisiLintasanPOVGame({ onExit }) {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const [currentTurn, setCurrentTurn] = useState(null)
  const [turnActive, setTurnActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [lives, setLives] = useState(3)
  const roadRef = useRef(generateRoad())
  const positionRef = useRef(0)
  const leanRef = useRef(0)
  const animRef = useRef(null)
  const lastTimeRef = useRef(0)

  const processLean = useCallback((newLean) => {
    leanRef.current = newLean
  }, [])

  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma !== null) {
        const normalizedLean = Math.max(-1, Math.min(1, e.gamma / 30))
        processLean(normalizedLean)
      }
    }

    const handleMotion = (e) => {
      if (e.accelerationIncludingGravity) {
        const x = e.accelerationIncludingGravity.x || 0
        const normalizedLean = Math.max(-1, Math.min(1, x / 10))
        processLean(normalizedLean)
      }
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation)
    }
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion)
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [processLean])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        processLean(-0.7)
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        processLean(0.7)
      }
    }
    const handleKeyUp = () => {
      processLean(0)
    }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [processLean])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width, height

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.parentElement.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    function drawFrame(ts) {
      if (!gameStarted || gameOver) {
        animRef.current = requestAnimationFrame(drawFrame)
        return
      }

      const dt = Math.min((ts - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = ts

      const road = roadRef.current
      const segIdx = Math.floor(positionRef.current) % road.length
      const seg = road[segIdx]

      positionRef.current += seg.speed * dt * 8

      if (seg.hasTurn && !turnActive) {
        setCurrentTurn(seg.turnDirection)
        setTurnActive(true)
        playTurnSound(seg.turnDirection)
      } else if (!seg.hasTurn && turnActive) {
        setTurnActive(false)
        setCurrentTurn(null)
      }

      const turnError = seg.hasTurn
        ? Math.abs(leanRef.current - (seg.turnDirection === 'right' ? 0.5 : -0.5))
        : 0

      if (seg.hasTurn && turnError < 0.4) {
        setScore((s) => s + Math.floor((1 - turnError) * 10))
      }

      setDistance((d) => d + seg.speed * dt * 10)

      ctx.clearRect(0, 0, width, height)

      const horizonY = height * 0.4
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY)
      skyGrad.addColorStop(0, '#1e3a5f')
      skyGrad.addColorStop(1, '#87ceeb')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, width, horizonY)

      ctx.fillStyle = '#2d5016'
      ctx.fillRect(0, horizonY, width, height - horizonY)

      const roadWidth = width * 0.4
      const roadLeft = (width - roadWidth) / 2
      const roadRight = roadLeft + roadWidth

      ctx.fillStyle = '#444'
      ctx.beginPath()
      ctx.moveTo(roadLeft, horizonY)
      ctx.lineTo(0, height)
      ctx.lineTo(width, height)
      ctx.lineTo(roadRight, horizonY)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.setLineDash([20, 15])
      ctx.beginPath()
      ctx.moveTo(width / 2, horizonY)
      ctx.lineTo(width / 2, height)
      ctx.stroke()
      ctx.setLineDash([])

      const tiltOffset = leanRef.current * 40
      const carX = width / 2 + tiltOffset
      const carY = height * 0.75
      const carWidth = 80
      const carHeight = 50

      ctx.fillStyle = '#1e40af'
      ctx.beginPath()
      ctx.roundRect(carX - carWidth / 2, carY - carHeight / 2, carWidth, carHeight, 8)
      ctx.fill()

      ctx.fillStyle = '#2563eb'
      ctx.beginPath()
      ctx.roundRect(carX - carWidth / 2 + 5, carY - carHeight / 2 + 5, carWidth - 10, carHeight / 2, 4)
      ctx.fill()

      ctx.fillStyle = '#bfdbfe'
      ctx.globalAlpha = 0.7
      ctx.fillRect(carX - 25, carY - 18, 15, 10)
      ctx.fillRect(carX + 10, carY - 18, 15, 10)
      ctx.globalAlpha = 1

      ctx.fillStyle = '#ef4444'
      ctx.fillRect(carX - 12, carY - 28, 8, 8)
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(carX + 4, carY - 28, 8, 8)

      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.roundRect(carX - carWidth / 2 - 8, carY - 5, 10, 10, 3)
      ctx.fill()
      ctx.beginPath()
      ctx.roundRect(carX + carWidth / 2 - 2, carY - 5, 10, 10, 3)
      ctx.fill()

      ctx.fillStyle = '#1f2937'
      ctx.beginPath()
      ctx.arc(carX - 25, carY + 22, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(carX + 25, carY + 22, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#6b7280'
      ctx.beginPath()
      ctx.arc(carX - 25, carY + 22, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(carX + 25, carY + 22, 4, 0, Math.PI * 2)
      ctx.fill()

      if (turnActive && currentTurn) {
        const arrowX = currentTurn === 'right' ? width * 0.85 : width * 0.15
        const arrowY = height * 0.5
        const pulse = Math.sin(ts / 150) * 0.3 + 0.7

        ctx.save()
        ctx.globalAlpha = pulse
        ctx.fillStyle = currentTurn === 'right' ? '#22c55e' : '#3b82f6'
        ctx.beginPath()
        if (currentTurn === 'right') {
          ctx.moveTo(arrowX - 30, arrowY - 25)
          ctx.lineTo(arrowX + 30, arrowY)
          ctx.lineTo(arrowX - 30, arrowY + 25)
        } else {
          ctx.moveTo(arrowX + 30, arrowY - 25)
          ctx.lineTo(arrowX - 30, arrowY)
          ctx.lineTo(arrowX + 30, arrowY + 25)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()

        const leanIndicatorX = width / 2
        const leanIndicatorY = height * 0.88
        const leanBarWidth = 120
        const leanProgress = (leanRef.current + 1) / 2

        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.beginPath()
        ctx.roundRect(leanIndicatorX - leanBarWidth / 2 - 10, leanIndicatorY - 15, leanBarWidth + 20, 30, 15)
        ctx.fill()

        const targetLean = currentTurn === 'right' ? 0.7 : 0.3
        ctx.fillStyle = '#22c55e'
        ctx.beginPath()
        ctx.roundRect(
          leanIndicatorX - leanBarWidth / 2 + targetLean * leanBarWidth - 5,
          leanIndicatorY - 8,
          10,
          16,
          5
        )
        ctx.fill()

        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(
          leanIndicatorX - leanBarWidth / 2 + leanProgress * leanBarWidth,
          leanIndicatorY,
          8,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }

      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.beginPath()
      ctx.roundRect(10, 10, 140, 80, 10)
      ctx.fill()

      ctx.fillStyle = '#facc15'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText(`⭐ ${score}`, 20, 35)

      ctx.fillStyle = '#fff'
      ctx.font = '14px sans-serif'
      ctx.fillText(`📍 ${Math.floor(distance)}m`, 20, 55)
      ctx.fillText(`❤️ ${lives}`, 20, 75)

      animRef.current = requestAnimationFrame(drawFrame)
    }

    animRef.current = requestAnimationFrame(drawFrame)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [gameStarted, gameOver, score, distance, lives, currentTurn, turnActive])

  useEffect(() => {
    if (lives <= 0 && gameStarted) {
      setGameOver(true)
      playSiren()
    }
  }, [lives, gameStarted])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setDistance(0)
    setLives(3)
    positionRef.current = 0
    roadRef.current = generateRoad()
    lastTimeRef.current = performance.now()
  }

  return (
    <div className="flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden bg-slate-900">
      <header className="z-20 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base"
        >
          ‹ Keluar
        </button>
        <h1 className="text-[clamp(1.2rem,4vw,2.2rem)] font-black leading-none text-white drop-shadow-sm">
          <span aria-hidden="true">🚔</span> POLISI LINTASAN POV
        </h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-400/90 px-3 py-1 text-sm font-black text-white shadow">
            ⭐ {score}
          </span>
        </div>
      </header>

      <div className="relative flex-1 min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0" />

        {!gameStarted && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70">
            <div className="text-center px-6">
              <div className="text-6xl mb-4">🚔</div>
              <h2 className="text-3xl font-black text-white mb-4">POLISI LINTASAN POV</h2>
              <p className="text-lg text-slate-300 mb-6 max-w-md">
                Kamu adalah polisi yang sedang patroli! Miringkan tubuhmu ke kiri atau kanan untuk menikung.
              </p>
              <div className="bg-slate-800 rounded-xl p-4 mb-6 text-left max-w-sm mx-auto">
                <p className="text-yellow-400 font-bold mb-2">📱 Di HP:</p>
                <p className="text-slate-300 text-sm mb-3">Miringkan HP ke kiri/kanan</p>
                <p className="text-yellow-400 font-bold mb-2">⌨️ Di Komputer:</p>
                <p className="text-slate-300 text-sm">Tekan ← → atau A/D</p>
              </div>
              <button
                onClick={startGame}
                className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-4 text-xl font-black text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
              >
                🚀 MULAI PATROLI
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80">
            <div className="text-center px-6">
              <div className="text-6xl mb-4">🚨</div>
              <h2 className="text-3xl font-black text-red-500 mb-2">PERJALANAN SELESAI!</h2>
              <p className="text-xl text-white mb-2">Skor: ⭐ {score}</p>
              <p className="text-lg text-slate-300 mb-6">Jarak: 📍 {Math.floor(distance)} meter</p>
              <button
                onClick={startGame}
                className="rounded-full bg-gradient-to-r from-green-500 to-green-700 px-8 py-4 text-xl font-black text-white shadow-lg transition hover:scale-105"
              >
                🔄 COBA LAGI
              </button>
            </div>
          </div>
        )}

        {turnActive && currentTurn && gameStarted && !gameOver && (
          <div className={`absolute top-1/2 -translate-y-1/2 z-20 ${
            currentTurn === 'right' ? 'right-4' : 'left-4'
          }`}>
            <div className={`animate-pulse text-4xl font-black text-white drop-shadow-lg ${
              currentTurn === 'right' ? 'rotate-0' : 'rotate-180'
            }`}>
              ➡️ MIRINGKAN KE {currentTurn === 'right' ? 'KANAN' : 'KIRI'}!
            </div>
          </div>
        )}

        {gameStarted && !gameOver && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-black/50 rounded-full px-6 py-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👈</span>
                <span className="text-white font-bold text-sm">KIRI</span>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">KANAN</span>
                <span className="text-2xl">👉</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
