import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const COMIC = "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', system-ui, sans-serif"
const CYAN = '#22d3ee'
const YELLOW = '#facc15'
const PROMPTS_COUNT = 10

const KEY_COLORS = {
  f: CYAN,
  g: CYAN,
  h: YELLOW,
  j: YELLOW,
}

function randomPrompts(n = PROMPTS_COUNT) {
  const keys = ['f', 'g', 'h', 'j']
  const seq = []
  // guarantee each key appears at least twice, then shuffle-fill
  const base = ['f', 'g', 'h', 'j', 'f', 'g', 'h', 'j']
  for (let i = 0; i < n; i++) {
    if (i < base.length) seq.push(base[i])
    else seq.push(keys[Math.floor(Math.random() * keys.length)])
  }
  // light shuffle
  for (let i = seq.length - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1))
    ;[seq[i], seq[k]] = [seq[k], seq[i]]
  }
  return seq
}

/* ------------------------- audio (Web Audio API) ----------------------- */
let audioCtx = null
function getCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}
function tone(freq, dur, vol, type = 'sine', when = 0, slideTo = null) {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime + when
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(ctx.destination)
    o.start(t)
    o.stop(t + dur + 0.05)
  } catch {
    /* audio unavailable — game still works */
  }
}
/* first tap: pleasant halfway chime */
function playChime() {
  tone(880, 0.12, 0.1, 'sine')
  tone(1320, 0.16, 0.08, 'sine', 0.06)
}
/* second tap: bubbly fuel success */
function playBubbly() {
  tone(420, 0.1, 0.12, 'sine', 0, 820)
  tone(560, 0.1, 0.11, 'sine', 0.08, 1050)
  tone(700, 0.14, 0.11, 'sine', 0.16, 1350)
  tone(1050, 0.18, 0.07, 'triangle', 0.24)
}
/* wrong key: soft nudge, no penalty */
function playSoft() {
  tone(300, 0.14, 0.04, 'sine', 0, 220)
}
function playLevelUp() {
  tone(659.25, 0.14, 0.11, 'triangle')
  tone(880, 0.2, 0.11, 'triangle', 0.12)
}
/* rocket engine ignition: deep rumble lifting off */
function playIgnition() {
  tone(85, 1.9, 0.16, 'sawtooth', 0, 38)
  tone(130, 1.6, 0.09, 'square', 0.1, 55)
  tone(220, 1.2, 0.06, 'triangle', 0.25, 1400)
  tone(440, 1.0, 0.05, 'sine', 0.5, 1800)
}
function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  notes.forEach((f, i) => tone(f, 0.45, 0.14, 'triangle', i * 0.1))
  tone(1568, 0.8, 0.11, 'sine', 0.5)
  tone(2093, 0.7, 0.07, 'triangle', 0.55)
}

function launchConfetti() {
  const colors = ['#22d3ee', '#facc15', '#f472b6', '#4ade80', '#a78bfa', '#ffffff']
  const star = confetti.shapeFromText({ text: '⭐', scalar: 1.6 })
  confetti({
    particleCount: 90,
    angle: 90,
    spread: 120,
    startVelocity: 52,
    gravity: 0.8,
    origin: { x: 0.5, y: 0.55 },
    colors,
    shapes: [star, 'circle', 'square'],
    scalar: 1.15,
    ticks: 240,
  })
  setTimeout(
    () =>
      confetti({
        particleCount: 60,
        angle: 90,
        spread: 160,
        startVelocity: 55,
        origin: { x: 0.5, y: 0.35 },
        colors,
        shapes: [star, 'circle'],
      }),
    350,
  )
}

/* full-menu dialog flow runs on Enter alone so kids never touch the mouse */
function useEnter(onEnter) {
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Enter' && !e.repeat) {
        e.preventDefault()
        onEnter()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEnter])
}

function SpaceBackdrop() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + Math.random() * 18,
        color: ['#22d3ee', '#4ade80', '#facc15', '#f472b6', '#a78bfa'][i % 5],
        ch: ['✦', '✧', '★', '·'][i % 4],
        delay: (i % 11) * 180,
        dur: 2 + (i % 6) * 0.3,
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 18% 12%, rgba(124,58,237,0.32), transparent 62%),' +
            'radial-gradient(ellipse 65% 50% at 85% 80%, rgba(34,211,238,0.26), transparent 62%),' +
            'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(244,63,94,0.18), transparent 66%)',
        }}
      />
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="pbb-twinkle absolute leading-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            color: s.color,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}ms`,
            animationDuration: `${s.dur}s`,
          }}
        >
          {s.ch}
        </span>
      ))}
    </div>
  )
}

function RocketArt({ blasting }) {
  return (
    <svg viewBox="0 0 110 210" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="pbb-flame-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="pbb-hull-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="42%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <g className={blasting ? 'pbb-flame-big' : 'pbb-flame'}>
        <path
          d="M41 164 C41 186 49 196 55 208 C61 196 69 186 69 164 Z"
          fill="url(#pbb-flame-grad)"
          opacity="0.95"
        />
        <path d="M48 164 C48 179 51 186 55 194 C59 186 62 179 62 164 Z" fill="#fffbeb" />
      </g>
      <path
        d="M30 100 C18 114 13 130 13 148 L33 138 Z"
        fill="#fb7185"
        stroke="#be123c"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        d="M80 100 C92 114 97 130 97 148 L77 138 Z"
        fill="#fb7185"
        stroke="#be123c"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        d="M55 8 C75 36 82 64 82 80 L82 148 C82 162 70 168 55 168 C40 168 28 162 28 148 L28 80 C28 64 35 36 55 8 Z"
        fill="url(#pbb-hull-grad)"
        stroke="#94a3b8"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        d="M55 8 C75 36 81 62 82 80 L28 80 C29 62 35 36 55 8 Z"
        fill="#f43f5e"
        stroke="#be123c"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path d="M28.4 80 L81.6 80 L81.8 94 L28.2 94 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2.4" />
      <circle cx="55" cy="120" r="20" fill="#22d3ee" stroke="#0e7490" strokeWidth="4" />
      <ellipse cx="47" cy="113" rx="6.5" ry="4.5" fill="#ffffff" opacity="0.7" transform="rotate(-28 47 113)" />
      <circle cx="37" cy="148" r="4.8" fill="#fda4af" opacity="0.9" />
      <circle cx="73" cy="148" r="4.8" fill="#fda4af" opacity="0.9" />
      <circle cx="46" cy="144" r="4.4" fill="#1e293b" />
      <circle cx="64" cy="144" r="4.4" fill="#1e293b" />
      <circle cx="47.5" cy="142.5" r="1.6" fill="#ffffff" />
      <circle cx="65.5" cy="142.5" r="1.6" fill="#ffffff" />
      <path d="M47 154 Q55 162 63 154" fill="none" stroke="#1e293b" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

function Shell({ children, onExit, right }) {
  return (
    <div
      className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950"
      style={{ fontFamily: COMIC }}
    >
      <style>{`
        .pbb-twinkle { animation: pbb-twinkle 2.6s ease-in-out infinite alternate; }
        @keyframes pbb-twinkle { from { opacity: .25; transform: scale(.8);} to { opacity: 1; transform: scale(1.15);} }
        .pbb-orb { transition: transform .18s ease, box-shadow .18s ease; }
        .pbb-orb-half { box-shadow: 0 0 34px rgba(34,211,238,.85), 0 0 80px rgba(34,211,238,.35), inset 0 0 26px rgba(255,255,255,.35); }
        .pbb-orb-full { box-shadow: 0 0 54px rgba(250,204,21,.95), 0 0 110px rgba(244,114,182,.5), inset 0 0 30px rgba(255,255,255,.5); }
        .pbb-wobble { animation: pbb-wobble .45s ease; }
        @keyframes pbb-wobble { 0%,100% { transform: translateX(0) rotate(0);} 25% { transform: translateX(-10px) rotate(-3deg);} 50% { transform: translateX(9px) rotate(3deg);} 75% { transform: translateX(-5px) rotate(-1.5deg);} }
        .pbb-pop { animation: pbb-pop .38s ease; }
        @keyframes pbb-pop { 0% { transform: scale(1);} 40% { transform: scale(1.18);} 100% { transform: scale(1);} }
        .pbb-float { animation: pbb-float 2.4s ease-in-out infinite; }
        @keyframes pbb-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-9px);} }
        .pbb-bob { animation: pbb-float 2.8s ease-in-out infinite; }
        .pbb-flame { animation: pbb-flick .35s ease-in-out infinite alternate; transform-origin: 55px 164px; }
        .pbb-flame-big { animation: pbb-flick .16s ease-in-out infinite alternate; transform-origin: 55px 164px; }
        @keyframes pbb-flick { from { transform: scaleY(.92);} to { transform: scaleY(1.12);} }
        .pbb-liquid { transition: height .7s cubic-bezier(.34,1.4,.64,1); }
        .pbb-wave { animation: pbb-wave 2.2s linear infinite; }
        @keyframes pbb-wave { from { transform: translateX(0);} to { transform: translateX(-50%);} }
        .pbb-bubble { animation: pbb-rise 1.8s ease-in infinite; }
        @keyframes pbb-rise { from { transform: translateY(0); opacity: 0;} 20% { opacity: .9;} to { transform: translateY(-70px); opacity: 0;} }
        .pbb-blast { animation: pbb-blast 2.1s ease-in forwards; }
        @keyframes pbb-blast { 0% { transform: translateY(0) scale(1);} 25% { transform: translateY(14px) scale(1.04);} 100% { transform: translateY(-72vh) scale(1.08);} }
        .pbb-trail { position: absolute; border-radius: 9999px; animation: pbb-trail-fall 1.1s ease-out forwards; }
        @keyframes pbb-trail-fall { from { transform: translate(0,0) scale(1); opacity: 1;} to { transform: translate(var(--tx), 120px) scale(.2); opacity: 0;} }
        .pbb-key-target { box-shadow: 0 0 0 3px #fff, 0 0 22px rgba(255,255,255,.9); transform: scale(1.12); }
      `}</style>
      <SpaceBackdrop />
      <div className="z-10 flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-3 sm:px-6 sm:pt-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-indigo-700 shadow transition hover:scale-105 sm:px-4 sm:py-2 sm:text-lg"
        >
          <span aria-hidden="true">←</span> keluar
        </button>
        {right ?? <div className="w-16 sm:w-24" aria-hidden="true" />}
      </div>
      {children}
    </div>
  )
}

function StartScreen({ onStart, onExit }) {
  useEnter(onStart)
  return (
    <Shell onExit={onExit}>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="animate-pop-in w-full max-w-2xl rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-9">
          <div className="mx-auto mb-1 text-5xl sm:text-6xl" aria-hidden="true">⛽🚀</div>
          <h1 className="text-[clamp(1.6rem,5.5vw,2.6rem)] font-extrabold leading-none text-slate-700">
            p13 <span className="text-cyan-600">pengisi bahan bakar roket</span>
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500 sm:text-base">
            ketuk tombolnya DUA KALI untuk mengisi tangki! 10 orb = tangki penuh!
          </p>
          <p className="mt-1 text-xs font-extrabold tracking-wide text-cyan-600 sm:text-sm">
            F & G → telunjuk kiri (cyan) · H & J → telunjuk kanan (kuning)
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {['f', 'g', 'h', 'j'].map((l) => (
              <span
                key={l}
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 bg-indigo-50 text-2xl font-black shadow sm:h-14 sm:w-14 sm:text-3xl"
                style={{ color: KEY_COLORS[l], borderColor: KEY_COLORS[l] }}
              >
                {l.toUpperCase()}
              </span>
            ))}
          </div>
          <div className="mt-3 rounded-2xl bg-indigo-50 p-3 text-sm font-bold text-indigo-700">
            contoh: orb <span className="font-black">“F F”</span> → tekan{' '}
            <span className="rounded-md bg-slate-800 px-1.5 py-0.5 font-black text-white">F</span> lalu{' '}
            <span className="rounded-md bg-slate-800 px-1.5 py-0.5 font-black text-white">F</span> lagi!
          </div>
          <button
            type="button"
            onClick={onStart}
            className="mt-5 w-full rounded-full bg-rose-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            mulai mengisi! ⛽
          </button>
          <p className="mt-2 text-xs font-extrabold text-slate-400">
            tekan <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-slate-500">enter</span> untuk mulai
          </p>
        </div>
      </main>
    </Shell>
  )
}

function CompleteScreen({ onReplay, onExit }) {
  useEnter(onReplay)
  return (
    <Shell onExit={onExit}>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="animate-pop-in w-full max-w-lg rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-9">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">🚀🌈</span>
          <h1 className="mt-2 text-[clamp(1.4rem,5vw,2.2rem)] font-extrabold leading-tight text-slate-700">
            tangki penuh! roket meluncur!
          </h1>
          <p className="text-base font-bold text-emerald-600 sm:text-lg">
            10 orb bahan bakar terisi — 100%! Kerja hebat, insinyur cilik! ⛽✨
          </p>
          <div className="mx-auto mt-3 h-24 w-16">
            <div className="pbb-blast h-full w-full">
              <RocketArt blasting />
            </div>
          </div>
          <button
            type="button"
            onClick={onReplay}
            className="animate-pov-replay mt-5 w-full rounded-full bg-rose-500 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-3xl"
          >
            MAIN LAGI
          </button>
          <p className="mt-2 text-xs font-extrabold text-slate-400">
            tekan <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-slate-500">enter</span> untuk main lagi
          </p>
        </div>
      </main>
    </Shell>
  )
}

function FuelTank({ fuel, count }) {
  const bubbles = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    id: i,
    left: 12 + ((i * 23) % 76),
    size: 6 + ((i * 5) % 10),
    delay: (i * 0.35) % 1.8,
  })), [])
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="text-3xl sm:text-4xl" aria-hidden="true">⛽</div>
      <div
        className="relative w-20 overflow-hidden rounded-2xl border-4 border-cyan-200/70 bg-white/10 shadow-[0_0_24px_rgba(34,211,238,0.35)] backdrop-blur-sm sm:w-24"
        style={{ height: 'clamp(11rem, 38vh, 19rem)' }}
        role="progressbar"
        aria-valuenow={fuel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`tangki bahan bakar ${fuel} persen`}
      >
        {/* tick marks */}
        {[25, 50, 75].map((t) => (
          <div key={t} className="absolute inset-x-1 border-t-2 border-dashed border-white/25" style={{ bottom: `${t}%` }} />
        ))}
        {/* liquid */}
        <div
          className="pbb-liquid absolute inset-x-0 bottom-0"
          style={{ height: `${fuel}%` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, #22d3ee 0%, #4ade80 38%, #facc15 72%, #f472b6 100%)',
            }}
          />
          {/* wavy surface */}
          <div className="absolute -top-2.5 left-0 h-5 w-[200%]" aria-hidden="true">
            <svg viewBox="0 0 120 20" preserveAspectRatio="none" className="pbb-wave h-full w-full">
              <path
                d="M0 12 Q 7.5 4 15 12 T 30 12 T 45 12 T 60 12 T 75 12 T 90 12 T 105 12 T 120 12 L120 20 L0 20 Z"
                fill="rgba(255,255,255,0.55)"
              />
            </svg>
          </div>
          {fuel > 0 && bubbles.map((b) => (
            <span
              key={b.id}
              className="pbb-bubble absolute bottom-1 rounded-full bg-white/70"
              style={{
                left: `${b.left}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>
        {/* glass shine */}
        <div className="pointer-events-none absolute inset-y-1 left-1.5 w-2.5 rounded-full bg-white/30" aria-hidden="true" />
        {/* percent label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-slate-950/70 px-2 py-0.5 text-sm font-black text-white sm:text-base">
            {fuel}%
          </span>
        </div>
      </div>
      <p className="text-xs font-black text-cyan-200 sm:text-sm">🛢️ {count}/10 orb</p>
    </div>
  )
}

function FuelOrb({ target, taps, wobbleKey, popping }) {
  const upper = target.toUpperCase()
  return (
    <div className="flex flex-col items-center gap-2">
      <div key={wobbleKey} className={wobbleKey > 0 ? 'pbb-wobble' : ''}>
        <div className={`pbb-float ${popping ? 'pbb-pop' : ''}`}>
          <div
            className={`pbb-orb flex items-center justify-center rounded-full border-4 ${
              taps === 1 ? 'pbb-orb-half' : taps >= 2 ? 'pbb-orb-full' : ''
            }`}
            style={{
              width: 'clamp(9rem, 30vh, 13rem)',
              height: 'clamp(9rem, 30vh, 13rem)',
              borderColor: taps === 1 ? CYAN : taps >= 2 ? YELLOW : 'rgba(255,255,255,0.5)',
              background:
                taps === 0
                  ? 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.28), rgba(34,211,238,0.16) 45%, rgba(15,23,42,0.85) 75%)'
                  : taps === 1
                    ? 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5), rgba(34,211,238,0.55) 45%, rgba(14,116,144,0.9) 78%)'
                    : 'radial-gradient(circle at 35% 30%, #fefce8, #facc15 42%, #f472b6 78%, #7c3aed 100%)',
            }}
          >
            <div className="text-center">
              <div className="text-[clamp(2.2rem,7vh,3.4rem)] font-black leading-none tracking-widest text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {upper} <span className={taps >= 1 ? 'opacity-40' : ''}>{upper}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-center gap-1.5" aria-hidden="true">
                <span className={`h-3 w-3 rounded-full ${taps >= 1 ? 'bg-emerald-300' : 'bg-white/30'}`} />
                <span className={`h-3 w-3 rounded-full ${taps >= 2 ? 'bg-emerald-300' : 'bg-white/30'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="rounded-full bg-slate-950/60 px-3 py-1 text-xs font-black text-white sm:text-sm">
        {taps === 0 ? `ketuk ${upper} 2x!` : taps === 1 ? `sekali lagi ${upper}! ✨` : 'penuh! 🎉'}
      </p>
    </div>
  )
}

function KeyGuide({ target, taps }) {
  return (
    <div
      className="pointer-events-none w-full touch-none select-none rounded-2xl border border-cyan-300/20 bg-slate-950/65 px-2 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_-8px_24px_rgba(0,0,0,0.45)] sm:px-3 sm:py-3"
      aria-hidden="true"
    >
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {['f', 'g', 'h', 'j'].map((l) => {
          const isTarget = target === l
          const color = KEY_COLORS[l]
          return (
            <div key={l} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-[min(13vw,3.4rem)] w-[min(13vw,3.4rem)] items-center justify-center rounded-lg border-2 font-extrabold transition-all duration-150 ${
                  isTarget ? 'pbb-key-target' : 'opacity-60'
                }`}
                style={{
                  color,
                  borderColor: isTarget ? '#ffffff' : `${color}66`,
                  background: isTarget ? `${color}33` : 'rgba(255,255,255,0.05)',
                  fontSize: '1.4rem',
                }}
              >
                {l.toUpperCase()}
              </div>
              <span className="text-[9px] font-black leading-none sm:text-[10px]" style={{ color }}>
                {l === 'f' || l === 'g' ? '👆 kiri' : '👆 kanan'}
              </span>
            </div>
          )
        })}
      </div>
      {taps === 1 && (
        <p className="mt-1 text-center text-[10px] font-black text-emerald-300 sm:text-xs">
          bagus! satu ketukan lagi! ✨
        </p>
      )}
    </div>
  )
}

export default function PengisiBahanBakarGame({ onExit }) {
  const [screen, setScreen] = useState('entry')
  const [prompts, setPrompts] = useState(() => randomPrompts())
  const [step, setStep] = useState(0)
  const [taps, setTaps] = useState(0)
  const [fuel, setFuel] = useState(0)
  const [wobbleKey, setWobbleKey] = useState(0)
  const [popping, setPopping] = useState(false)
  const [blasting, setBlasting] = useState(false)
  const [trails, setTrails] = useState([])
  const timers = useRef(new Set())
  const trailTimer = useRef(null)

  const target = prompts[step] ?? 'f'
  const filled = Math.min(PROMPTS_COUNT, step + (blasting ? 1 : 0))

  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.current.delete(id)
      fn()
    }, ms)
    timers.current.add(id)
    return id
  }

  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const id of pending) clearTimeout(id)
      pending.clear()
      if (trailTimer.current) clearInterval(trailTimer.current)
    }
  }, [])

  const stateRef = useRef({})
  stateRef.current = { step, taps, blasting, target, screen, prompts }

  function spawnRainbowTrails() {
    const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#a78bfa', '#f472b6']
    if (trailTimer.current) clearInterval(trailTimer.current)
    trailTimer.current = setInterval(() => {
      setTrails((prev) => {
        const next = [
          ...prev.slice(-24),
          {
            id: Math.random().toString(36).slice(2),
            x: 42 + Math.random() * 16,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 6 + Math.random() * 12,
            tx: (Math.random() - 0.5) * 120,
          },
        ]
        return next
      })
    }, 90)
  }

  function completeGame() {
    setBlasting(true)
    playIgnition()
    spawnRainbowTrails()
    later(() => {
      playFanfare()
      launchConfetti()
    }, 1300)
    later(() => {
      if (trailTimer.current) clearInterval(trailTimer.current)
      setTrails([])
      setScreen('complete')
    }, 2400)
  }

  useEffect(() => {
    if (screen !== 'playing') return
    const handleKey = (e) => {
      if (e.repeat || e.key.length !== 1) return
      const k = e.key.toLowerCase()
      // strictly listen to F G H J only
      if (!['f', 'g', 'h', 'j'].includes(k)) return
      e.preventDefault()
      const s = stateRef.current
      if (s.blasting) return
      if (k === s.target) {
        if (s.taps === 0) {
          setTaps(1)
          playChime()
        } else {
          // second tap completes the orb
          setTaps(2)
          setPopping(true)
          playBubbly()
          const nextFuel = Math.min(100, (s.step + 1) * 10)
          setFuel(nextFuel)
          later(() => {
            setPopping(false)
            if (s.step + 1 >= PROMPTS_COUNT) {
              completeGame()
            } else {
              setStep(s.step + 1)
              setTaps(0)
            }
          }, 380)
        }
      } else {
        // wrong key: soft wobble, no penalty, no fuel loss
        setWobbleKey((w) => w + 1)
        playSoft()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [screen])

  function startGame() {
    for (const id of timers.current) clearTimeout(id)
    timers.current.clear()
    if (trailTimer.current) clearInterval(trailTimer.current)
    setPrompts(randomPrompts())
    setStep(0)
    setTaps(0)
    setFuel(0)
    setWobbleKey(0)
    setPopping(false)
    setBlasting(false)
    setTrails([])
    setScreen('playing')
    playLevelUp()
  }

  if (screen === 'entry') return <StartScreen onStart={startGame} onExit={onExit} />
  if (screen === 'complete') return <CompleteScreen onReplay={startGame} onExit={onExit} />

  return (
    <Shell
      onExit={onExit}
      right={
        <div className="text-right">
          <p className="text-[10px] font-extrabold tracking-wide text-cyan-400 sm:text-xs">
            tangki {fuel}%
          </p>
          <p className="text-xs font-bold text-white/60">
            orb {Math.min(step + 1, PROMPTS_COUNT)} / {PROMPTS_COUNT}
          </p>
          <p className="text-[10px] font-bold text-amber-400/80 sm:text-xs">
            ⛽ {filled * 10}%
          </p>
        </div>
      }
    >
      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center gap-3 px-3 sm:gap-8">
        {/* LEFT: fuel tank */}
        <FuelTank fuel={fuel} count={filled} />

        {/* CENTER: fuel orb */}
        <div className="flex flex-col items-center">
          <FuelOrb target={target} taps={taps} wobbleKey={wobbleKey} popping={popping} />
          <p className="mt-2 max-w-[12rem] text-center text-[10px] font-bold text-white/50 sm:text-xs">
            {blasting ? 'roket meluncur! 🚀🌈' : `tekan ${target.toUpperCase()} dua kali!`}
          </p>
        </div>

        {/* RIGHT: rocket */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="relative"
            style={{ width: 'clamp(3.6rem, 15vh, 6rem)', height: 'clamp(7rem, 28vh, 11.5rem)' }}
          >
            {blasting && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-full" aria-hidden="true">
                {trails.map((t) => (
                  <span
                    key={t.id}
                    className="pbb-trail"
                    style={{
                      left: `${t.x}%`,
                      top: '78%',
                      width: `${t.size}px`,
                      height: `${t.size}px`,
                      backgroundColor: t.color,
                      boxShadow: `0 0 10px ${t.color}`,
                      '--tx': `${t.tx}px`,
                    }}
                  />
                ))}
              </div>
            )}
            <div className={`h-full w-full ${blasting ? 'pbb-blast' : ''}`}>
              <div className="pbb-bob h-full w-full">
                <RocketArt blasting={blasting} />
              </div>
            </div>
          </div>
          <span className="text-2xl leading-none sm:text-3xl" aria-hidden="true">👩‍🚀</span>
          <p className="text-[10px] font-black text-rose-200 sm:text-xs">
            {blasting ? 'woooosh! 🌈' : 'siap meluncur…'}
          </p>
        </div>
      </main>

      <div className="z-10 shrink-0 px-4 pb-3 sm:pb-4">
        <div className="flex min-h-8 items-center justify-center" role="status" aria-live="polite">
          {blasting ? (
            <span className="animate-pop-in rounded-2xl bg-rose-500/90 px-5 py-1.5 text-base font-extrabold text-white shadow-md sm:text-xl">
              ignition! roket meluncur! 🚀🌈
            </span>
          ) : taps === 1 ? (
            <span className="animate-pop-in rounded-2xl bg-cyan-400/90 px-5 py-1.5 text-base font-extrabold text-slate-900 shadow-md sm:text-xl">
              setengah penuh… sekali lagi! ✨
            </span>
          ) : (
            <span className="text-sm font-bold text-cyan-200 sm:text-base">
              tekan tombol <span className="font-black text-white">{target.toUpperCase()} {target.toUpperCase()}</span> di keyboard
            </span>
          )}
        </div>
        <p className="mt-1 text-center text-[10px] font-bold text-white/40 sm:text-xs">
          F & G → telunjuk kiri (cyan) · H & J → telunjuk kanan (kuning)
        </p>
        <KeyGuide target={blasting ? null : target} taps={taps} />
      </div>
    </Shell>
  )
}
