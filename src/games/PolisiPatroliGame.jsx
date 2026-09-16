import { useRef, useEffect, useCallback, useState } from 'react'
import confetti from 'canvas-confetti'

const STAR_COUNT = 60
const TRAIL_INTERVAL = 40
const ON_PATH_THRESHOLD = 38

const TRACK_LAYOUTS = [
  (w, h) => {
    const pts = []
    const segs = 8
    for (let i = 0; i <= 200; i++) {
      const t = i / 200
      const x = t * w
      const y = h * 0.5 + Math.sin(t * Math.PI * 2.5) * h * 0.28
      pts.push({ x, y })
    }
    return pts
  },
  (w, h) => {
    const pts = []
    const zigN = 10
    const margin = w * 0.06
    for (let i = 0; i <= 200; i++) {
      const t = i / 200
      const x = margin + t * (w - margin * 2)
      const seg = Math.floor(t * zigN)
      const segT = (t * zigN) % 1
      const top = h * 0.2
      const bot = h * 0.8
      const y = seg % 2 === 0
        ? top + segT * (bot - top)
        : bot - segT * (bot - top)
      pts.push({ x, y })
    }
    return pts
  },
  (w, h) => {
    const pts = []
    for (let i = 0; i <= 200; i++) {
      const t = i / 200
      const x = t * w
      const base = h * 0.5
      const y = base + Math.sin(t * Math.PI * 4) * h * 0.18 + Math.cos(t * Math.PI * 1.5) * h * 0.12
      pts.push({ x, y })
    }
    return pts
  },
  (w, h) => {
    const pts = []
    for (let i = 0; i <= 200; i++) {
      const t = i / 200
      const x = t * w
      const y = h * 0.5 - Math.cos(t * Math.PI * 3) * h * 0.3 * Math.sin(t * Math.PI)
      pts.push({ x, y })
    }
    return pts
  },
  (w, h) => {
    const pts = []
    for (let i = 0; i <= 200; i++) {
      const t = i / 200
      const x = t * w
      const phase = t * Math.PI * 2
      const y = h * 0.5 + Math.sin(phase) * h * 0.25 + Math.sin(phase * 3) * h * 0.08
      pts.push({ x, y })
    }
    return pts
  },
]

let audioCtx = null
function ensureAudio() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function playSirenWin() {
  const ctx = ensureAudio()
  const t0 = ctx.currentTime
  const o1 = ctx.createOscillator()
  const o2 = ctx.createOscillator()
  const g = ctx.createGain()
  o1.type = 'square'
  o2.type = 'square'
  g.gain.setValueAtTime(0.12, t0)
  g.gain.linearRampToValueAtTime(0, t0 + 2.5)
  o1.frequency.setValueAtTime(600, t0)
  o1.frequency.linearRampToValueAtTime(900, t0 + 0.3)
  o1.frequency.linearRampToValueAtTime(600, t0 + 0.6)
  o1.frequency.linearRampToValueAtTime(900, t0 + 0.9)
  o1.frequency.linearRampToValueAtTime(600, t0 + 1.2)
  o2.frequency.setValueAtTime(500, t0)
  o2.frequency.linearRampToValueAtTime(800, t0 + 0.3)
  o2.frequency.linearRampToValueAtTime(500, t0 + 0.6)
  o2.frequency.linearRampToValueAtTime(800, t0 + 0.9)
  o2.frequency.linearRampToValueAtTime(500, t0 + 1.2)
  o1.connect(g)
  o2.connect(g)
  g.connect(ctx.destination)
  o1.start(t0)
  o2.start(t0)
  o1.stop(t0 + 2.5)
  o2.stop(t0 + 2.5)
}

function playApplause() {
  const ctx = ensureAudio()
  const t0 = ctx.currentTime
  for (let i = 0; i < 12; i++) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(200 + Math.random() * 600, t0 + i * 0.08)
    f.type = 'bandpass'
    f.frequency.value = 800 + Math.random() * 1200
    f.Q.value = 1.5
    g.gain.setValueAtTime(0.06, t0 + i * 0.08)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + i * 0.08 + 0.1)
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.start(t0 + i * 0.08)
    o.stop(t0 + i * 0.08 + 0.12)
  }
}

function distToPath(px, py, path) {
  let min = Infinity
  for (let i = 0; i < path.length; i++) {
    const dx = px - path[i].x
    const dy = py - path[i].y
    const d = dx * dx + dy * dy
    if (d < min) min = d
  }
  return Math.sqrt(min)
}

function PoliceCarSVG() {
  return (
    <svg viewBox="0 0 80 50" className="w-[min(10vw,60px)] h-auto" aria-hidden="true">
      <rect x="5" y="18" width="70" height="22" rx="6" fill="#1e40af" />
      <rect x="10" y="10" width="40" height="16" rx="5" fill="#2563eb" />
      <rect x="12" y="12" width="12" height="10" rx="2" fill="#bfdbfe" opacity="0.8" />
      <rect x="26" y="12" width="12" height="10" rx="2" fill="#bfdbfe" opacity="0.8" />
      <rect x="42" y="12" width="6" height="10" rx="2" fill="#bfdbfe" opacity="0.8" />
      <rect x="0" y="22" width="10" height="8" rx="3" fill="#fbbf24" />
      <rect x="70" y="22" width="10" height="8" rx="3" fill="#ef4444" />
      <text x="28" y="33" fontSize="7" fill="white" fontWeight="bold" textAnchor="middle">POLISI</text>
      <circle cx="20" cy="42" r="6" fill="#1f2937" />
      <circle cx="20" cy="42" r="3" fill="#6b7280" />
      <circle cx="60" cy="42" r="6" fill="#1f2937" />
      <circle cx="60" cy="42" r="3" fill="#6b7280" />
      <rect x="26" y="6" width="10" height="6" rx="2" fill="#ef4444" className="siren-red" />
      <rect x="38" y="6" width="10" height="6" rx="2" fill="#3b82f6" className="siren-blue" />
    </svg>
  )
}

function StationBuilding() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl sm:text-5xl mb-1 animate-bounce-slow">🚔</div>
      <div className="relative">
        <div className="w-[min(18vw,90px)] h-[min(12vw,60px)] bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-lg flex items-center justify-center border-b-4 border-blue-900/30 shadow-xl">
          <span className="text-white text-[min(3.5vw,14px)] font-black tracking-wider">KANTOR</span>
          <span className="text-yellow-400 text-[min(3.5vw,14px)] font-black ml-1">POLISI</span>
        </div>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xs">⭐</span>
        </div>
      </div>
      <div className="w-[min(18vw,90px)] h-3 bg-yellow-500 rounded-b-md" />
    </div>
  )
}

export default function PolisiPatroliGame({ onExit }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const trailCanvasRef = useRef(null)
  const pathRef = useRef([])
  const trailRef = useRef([])
  const mouseRef = useRef({ x: -100, y: -100 })
  const carRef = useRef({ x: 80, y: 0 })
  const onPathRef = useRef(false)
  const winRef = useRef(false)
  const layoutIdxRef = useRef(0)
  const animRef = useRef(null)
  const lastTrailRef = useRef(0)
  const starBurstsRef = useRef([])
  const [victory, setVictory] = useState(false)

  const generatePath = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.width
    const h = canvas.height
    const layout = TRACK_LAYOUTS[layoutIdxRef.current % TRACK_LAYOUTS.length]
    pathRef.current = layout(w, h)
    layoutIdxRef.current++
    trailRef.current = []
    winRef.current = false
    starBurstsRef.current = []
    carRef.current = { x: 80, y: pathRef.current[0]?.y || h / 2 }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const trail = trailCanvasRef.current
    const container = containerRef.current
    if (!canvas || !trail || !container) return

    function resize() {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      trail.width = rect.width * window.devicePixelRatio
      trail.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      trail.style.width = rect.width + 'px'
      trail.style.height = rect.height + 'px'
      const ctx = canvas.getContext('2d')
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      const tctx = trail.getContext('2d')
      tctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      generatePath()
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [generatePath])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function onMove(e) {
      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - rect.left,
        y: (e.clientY ?? e.touches?.[0]?.clientY ?? 0) - rect.top,
      }
    }

    function onTouchMove(e) {
      e.preventDefault()
      onMove(e)
    }

    container.addEventListener('mousemove', onMove)
    container.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const trail = trailCanvasRef.current
    if (!canvas || !trail) return

    const ctx = canvas.getContext('2d')
    const tctx = trail.getContext('2d')

    function drawFrame(ts) {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      const path = pathRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      ctx.clearRect(0, 0, w, h)

      // Draw path glow
      if (path.length > 1) {
        ctx.save()
        ctx.shadowColor = '#facc15'
        ctx.shadowBlur = 22
        ctx.strokeStyle = '#facc15'
        ctx.lineWidth = ON_PATH_THRESHOLD * 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.globalAlpha = 0.35
        ctx.beginPath()
        ctx.moveTo(path[0].x, path[0].y)
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y)
        }
        ctx.stroke()
        ctx.restore()

        // Draw path road
        ctx.save()
        ctx.strokeStyle = '#6b7280'
        ctx.lineWidth = ON_PATH_THRESHOLD * 1.6
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.moveTo(path[0].x, path[0].y)
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y)
        }
        ctx.stroke()
        ctx.restore()

        // Draw path center line
        ctx.save()
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.setLineDash([12, 10])
        ctx.beginPath()
        ctx.moveTo(path[0].x, path[0].y)
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y)
        }
        ctx.stroke()
        ctx.restore()
      }

      // Check if on path
      const onPath = distToPath(mx, my, path) < ON_PATH_THRESHOLD
      onPathRef.current = onPath

      // Add star trail
      if (onPath && !winRef.current && ts - lastTrailRef.current > TRAIL_INTERVAL) {
        lastTrailRef.current = ts
        trailRef.current.push({
          x: mx,
          y: my,
          life: 1,
          size: 10 + Math.random() * 8,
          rot: Math.random() * Math.PI * 2,
        })
        if (trailRef.current.length > STAR_COUNT) trailRef.current.shift()
      }

      // Draw trail stars
      tctx.clearRect(0, 0, w, h)
      for (const star of trailRef.current) {
        star.life -= 0.008
        if (star.life <= 0) continue
        tctx.save()
        tctx.translate(star.x, star.y)
        tctx.rotate(star.rot)
        tctx.globalAlpha = star.life * 0.9
        tctx.shadowColor = '#facc15'
        tctx.shadowBlur = 12
        const s = star.size * star.life
        tctx.fillStyle = '#facc15'
        drawStar(tctx, 0, 0, 5, s, s * 0.45)
        tctx.restore()
      }
      trailRef.current = trailRef.current.filter((s) => s.life > 0)

      // Draw star bursts
      for (const burst of starBurstsRef.current) {
        burst.life -= 0.015
        if (burst.life <= 0) continue
        for (const p of burst.particles) {
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.15
          tctx.save()
          tctx.globalAlpha = burst.life
          tctx.fillStyle = p.color
          tctx.shadowColor = p.color
          tctx.shadowBlur = 8
          tctx.beginPath()
          tctx.arc(p.x, p.y, p.r * burst.life, 0, Math.PI * 2)
          tctx.fill()
          tctx.restore()
        }
      }
      starBurstsRef.current = starBurstsRef.current.filter((b) => b.life > 0)

      // Move car smoothly toward cursor
      const car = carRef.current
      const lerp = winRef.current ? 0.03 : 0.12
      car.x += (mx - car.x) * lerp
      car.y += (my - car.y) * lerp

      // Victory check
      if (path.length > 0 && !winRef.current) {
        const end = path[path.length - 1]
        const dx = car.x - end.x
        const dy = car.y - end.y
        if (Math.sqrt(dx * dx + dy * dy) < 50) {
          winRef.current = true
          onVictory()
        }
      }

      animRef.current = requestAnimationFrame(drawFrame)
    }

    animRef.current = requestAnimationFrame(drawFrame)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  function onVictory() {
    setVictory(true)
    playSirenWin()
    setTimeout(playApplause, 400)
    setTimeout(() => playSirenWin(), 1200)

    const star = confetti.shapeFromText({ text: '⭐', scalar: 1.2 })
    const thumb = confetti.shapeFromText({ text: '👍', scalar: 2.2 })
    const colors = ['#3b82f6', '#facc15', '#ef4444', '#22c55e', '#ffffff', '#f472b6', '#a78bfa']

    // Wave 1 — center explosion
    confetti({
      particleCount: 140,
      spread: 170,
      startVelocity: 55,
      gravity: 0.8,
      origin: { x: 0.5, y: 0.55 },
      colors,
      shapes: [star, 'circle'],
      scalar: 1.3,
    })

    // Wave 2 — left side
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        startVelocity: 50,
        angle: 65,
        gravity: 0.85,
        origin: { x: 0.0, y: 0.85 },
        colors,
        shapes: ['circle', 'square', star],
      })
    }, 150)

    // Wave 3 — right side
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        startVelocity: 50,
        angle: 115,
        gravity: 0.85,
        origin: { x: 1.0, y: 0.85 },
        colors,
        shapes: ['circle', 'square', star],
      })
    }, 300)

    // Wave 4 — top rain
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 180,
        startVelocity: 30,
        gravity: 0.6,
        origin: { x: 0.5, y: 0.0 },
        colors,
        shapes: [star, 'circle'],
        scalar: 1.1,
      })
    }, 500)

    // Wave 5 — big thumbs up burst
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 90,
        startVelocity: 40,
        gravity: 0.7,
        origin: { x: 0.5, y: 0.45 },
        colors: ['#facc15', '#fbbf24'],
        shapes: [thumb],
        scalar: 2.5,
      })
    }, 700)

    // Wave 6 — side sparkle
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        startVelocity: 45,
        origin: { x: 0.2, y: 0.3 },
        colors,
        shapes: [star],
        scalar: 0.9,
      })
      confetti({
        particleCount: 60,
        spread: 100,
        startVelocity: 45,
        origin: { x: 0.8, y: 0.3 },
        colors,
        shapes: [star],
        scalar: 0.9,
      })
    }, 900)

    // Wave 7 — final grand finale
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 200,
        startVelocity: 60,
        gravity: 0.75,
        origin: { x: 0.5, y: 0.5 },
        colors,
        shapes: [star, 'circle', 'square'],
        scalar: 1.4,
      })
    }, 1200)

    // Spawn star burst at car position
    const car = carRef.current
    const particles = []
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30
      particles.push({
        x: car.x,
        y: car.y,
        vx: Math.cos(angle) * (2 + Math.random() * 4),
        vy: Math.sin(angle) * (2 + Math.random() * 4) - 2,
        r: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    starBurstsRef.current.push({ life: 1, particles })

    // Clear victory state and auto next track
    setTimeout(() => {
      setVictory(false)
      generatePath()
    }, 3500)
  }

  return (
    <div className="flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-blue-100 to-emerald-100">
      <header className="z-20 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base"
        >
          ‹ Keluar
        </button>
        <h1 className="text-[clamp(1.4rem,5vw,2.8rem)] font-black leading-none text-slate-800 drop-shadow-sm">
          <span aria-hidden="true">🚔</span> POLISI PATROLI LINTASAN
        </h1>
        <span className="text-sm font-bold text-slate-500">Gemink!</span>
      </header>

      <div ref={containerRef} className="pointer-events-auto relative z-10 min-h-0 flex-1 cursor-none">
        {/* Sky decorations */}
        <span className="animate-floaty pointer-events-none absolute right-6 top-4 select-none text-6xl opacity-90 sm:text-8xl" aria-hidden="true" style={{ animationDuration: '10s' }}>☀️</span>
        {[
          { top: '8%', left: '5%', dur: '9s' },
          { top: '15%', left: '65%', dur: '11s' },
          { top: '25%', left: '85%', dur: '10s' },
          { top: '12%', left: '30%', dur: '8s' },
        ].map((c, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="animate-floaty pointer-events-none absolute select-none text-4xl opacity-60 sm:text-6xl"
            style={{ top: c.top, left: c.left, animationDuration: c.dur }}
          >
            ☁️
          </span>
        ))}

        {/* Ground */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[4vh] bg-gradient-to-b from-emerald-400 to-emerald-600" />

        {/* Path canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[6]"
          style={{ imageRendering: 'auto' }}
        />

        {/* Trail canvas */}
        <canvas
          ref={trailCanvasRef}
          className="absolute inset-0 z-[7]"
          style={{ imageRendering: 'auto', pointerEvents: 'none' }}
        />

        {/* Police station at end */}
        <div
          className="absolute z-[8] -translate-y-1/2"
          style={{
            right: '2%',
            top: '50%',
          }}
        >
          <StationBuilding />
        </div>

        {/* Start marker */}
        <div className="absolute z-[8] left-[1%] top-1/2 -translate-y-1/2 flex flex-col items-center">
          <span className="text-3xl sm:text-5xl">🏁</span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-1">MULAI</span>
        </div>

        {/* Police car cursor */}
        <div
          className="absolute z-[20] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: carRef.current?.x || 80,
            top: carRef.current?.y || 0,
            transition: 'none',
          }}
          ref={(el) => {
            if (!el) return
            const update = () => {
              const c = carRef.current
              el.style.left = c.x + 'px'
              el.style.top = c.y + 'px'
              requestAnimationFrame(update)
            }
            requestAnimationFrame(update)
          }}
        >
          <PoliceCarSVG />
          {onPathRef.current && !winRef.current && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-yellow-400/40 rounded-full blur-sm" />
          )}
        </div>

        {/* Victory effects */}
        {victory && (
          <>
            {/* Blinking color edges */}
            <div className="pointer-events-none absolute inset-0 z-[31]">
              <div className="absolute inset-x-0 top-0 h-3 animate-edge-blink-top" />
              <div className="absolute inset-x-0 bottom-0 h-3 animate-edge-blink-bottom" />
              <div className="absolute inset-y-0 left-0 w-3 animate-edge-blink-left" />
              <div className="absolute inset-y-0 right-0 w-3 animate-edge-blink-right" />
            </div>
            {/* Big thumbs up */}
            <div className="pointer-events-none absolute inset-0 z-[32] flex items-center justify-center">
              <span className="animate-thumbs-up text-[min(30vw,14rem)] drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)]">👍</span>
            </div>
            {/* Siren flash overlay */}
            <div className="pointer-events-none absolute inset-0 z-[30]">
              <div className="absolute inset-0 animate-siren-flash" />
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-12px) translateX(6px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes siren-flash {
          0%, 100% { background: rgba(239,68,68,0.08); }
          25% { background: rgba(59,130,246,0.12); }
          50% { background: rgba(239,68,68,0.12); }
          75% { background: rgba(59,130,246,0.08); }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes edge-blink-top {
          0%, 100% { background: #ef4444; box-shadow: 0 0 20px #ef4444; }
          25% { background: #3b82f6; box-shadow: 0 0 20px #3b82f6; }
          50% { background: #facc15; box-shadow: 0 0 20px #facc15; }
          75% { background: #22c55e; box-shadow: 0 0 20px #22c55e; }
        }
        @keyframes edge-blink-bottom {
          0%, 100% { background: #22c55e; box-shadow: 0 0 20px #22c55e; }
          25% { background: #facc15; box-shadow: 0 0 20px #facc15; }
          50% { background: #3b82f6; box-shadow: 0 0 20px #3b82f6; }
          75% { background: #ef4444; box-shadow: 0 0 20px #ef4444; }
        }
        @keyframes edge-blink-left {
          0%, 100% { background: #f472b6; box-shadow: 0 0 20px #f472b6; }
          25% { background: #a78bfa; box-shadow: 0 0 20px #a78bfa; }
          50% { background: #facc15; box-shadow: 0 0 20px #facc15; }
          75% { background: #3b82f6; box-shadow: 0 0 20px #3b82f6; }
        }
        @keyframes edge-blink-right {
          0%, 100% { background: #a78bfa; box-shadow: 0 0 20px #a78bfa; }
          25% { background: #f472b6; box-shadow: 0 0 20px #f472b6; }
          50% { background: #22c55e; box-shadow: 0 0 20px #22c55e; }
          75% { background: #facc15; box-shadow: 0 0 20px #facc15; }
        }
        @keyframes thumbs-up {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          40% { transform: scale(1.3) rotate(5deg); opacity: 1; }
          60% { transform: scale(0.95) rotate(-2deg); }
          80% { transform: scale(1.1) rotate(1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-floaty { animation: floaty 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-siren-flash { animation: siren-flash 0.35s ease-in-out infinite; }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .animate-edge-blink-top { animation: edge-blink-top 0.4s linear infinite; }
        .animate-edge-blink-bottom { animation: edge-blink-bottom 0.4s linear infinite; }
        .animate-edge-blink-left { animation: edge-blink-left 0.4s linear infinite; }
        .animate-edge-blink-right { animation: edge-blink-right 0.4s linear infinite; }
        .animate-thumbs-up { animation: thumbs-up 0.8s cubic-bezier(0.34,1.56,0.64,1) both; }
        .siren-red { animation: siren-flash 0.3s ease-in-out infinite; }
        .siren-blue { animation: siren-flash 0.3s ease-in-out infinite 0.15s; }
      `}</style>
    </div>
  )
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3
  const step = Math.PI / spikes
  ctx.beginPath()
  ctx.moveTo(cx, cy - outerR)
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR)
    rot += step
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR)
    rot += step
  }
  ctx.lineTo(cx, cy - outerR)
  ctx.closePath()
  ctx.fill()
}
