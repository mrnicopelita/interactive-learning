import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

/* ------------------------------- palette ------------------------------- */
const NAVY = '#2e53b5'
const NAVY_D = '#22418f'
const BLUE = '#2563eb'
const BLUE_D = '#1d4ed8'
const GOLD = '#f5c518'
const GOLD_D = '#d2a106'
const SKIN = '#f6b07f'
const SKIN_D = '#e09a66'
const HAIR = '#2b2b3a'
const INK = '#20242e'

/* ------------------------------ svg helpers ---------------------------- */
function starPoints(cx, cy, outer, inner, points = 5, rot = -90) {
  const pts = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = ((rot + i * 180) / points) * Math.PI / 180
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

const BADGE_RAYS = starPoints(160, 190, 166, 126, 16, -90)

/* ------------------------- audio (Web Audio API) ----------------------- */
let audioCtx = null

function getCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone(freq, dur, vol, type = 'triangle', when = 0, slideTo = null) {
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
}

function playPop() { tone(340, 0.1, 0.14, 'triangle', 0, 620) }
function playReturn() { tone(520, 0.2, 0.1, 'sine', 0, 300) }
function playChime() {
  tone(1760, 0.09, 0.16, 'sine')
  tone(3520, 0.06, 0.05, 'sine', 0.004)
  tone(1319, 0.16, 0.1, 'triangle', 0.05)
}
function playLevelUp() { tone(660, 0.14, 0.12, 'triangle'); tone(880, 0.18, 0.12, 'triangle', 0.12) }

function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((f, i) => tone(f, 0.42, 0.16, 'triangle', i * 0.11))
  tone(1318.5, 0.55, 0.12, 'sine', 0.46)
  tone(1046.5, 0.7, 0.12, 'triangle', 0.46)
  tone(1568, 0.5, 0.06, 'sine', 0.6)
  tone(2093, 0.4, 0.05, 'sine', 0.72)
}

/* ----------------------------- celebration ----------------------------- */
function bigConfetti() {
  const colors = ['#2563eb', '#f5c518', '#ffffff', '#ef4444', '#38bdf8', '#10b981']
  const star = confetti.shapeFromText({ text: '⭐', scalar: 1.8 })
  const shapes = [star, 'circle', 'square']
  const cannon = (origin, angle) =>
    confetti({ particleCount: 90, angle, spread: 130, startVelocity: 52, gravity: 0.85, origin, colors, shapes, scalar: 1.25, ticks: 260 })
  cannon({ x: 0.02, y: 0.9 }, 65)
  cannon({ x: 0.98, y: 0.9 }, 115)
  setTimeout(() => cannon({ x: 0.18, y: 0.6 }, 75), 220)
  setTimeout(() => cannon({ x: 0.82, y: 0.6 }, 105), 320)
  setTimeout(() => {
    confetti({ particleCount: 150, angle: 90, spread: 170, startVelocity: 58, gravity: 0.9, origin: { x: 0.5, y: 0.55 }, colors, shapes, scalar: 1.15 })
  }, 420)
  setTimeout(() => {
    confetti({ particleCount: 70, angle: 90, spread: 180, startVelocity: 30, gravity: 0.7, origin: { x: 0.5, y: 0.15 }, colors, shapes, scalar: 1 })
  }, 640)
}

/* ------------------------------- art: car ------------------------------ */
function CarScene() {
  return (
    <g>
      <ellipse cx="340" cy="354" rx="245" ry="17" fill="#1e3a8a" opacity="0.13" />
      {/* light bar */}
      <rect x="252" y="126" width="166" height="34" rx="15" fill="#1e3a8a" stroke="#14306b" strokeWidth="3" />
      <circle className="animate-alert-pulse" cx="296" cy="143" r="12" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
      <circle className="animate-alert-pulse" cx="374" cy="143" r="12" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" />
      <circle cx="296" cy="143" r="3.4" fill="#ffffff" />
      <circle cx="374" cy="143" r="3.4" fill="#ffffff" />
      {/* antenna */}
      <path d="M400 130 L414 96" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <circle cx="415" cy="94" r="4.5" fill="#e11d48" />
      {/* cabin body */}
      <path d="M120 292 L120 224 C120 176 150 160 205 160 L480 160 C520 160 550 186 556 226 L552 292 Z" fill={BLUE} stroke={BLUE_D} strokeWidth="4" />
      {/* windshield */}
      <polygon points="500,174 556,238 556,264 500,264" fill="#bfe3ff" stroke={BLUE_D} strokeWidth="3" strokeLinejoin="round" />
      {/* side window */}
      <rect x="180" y="180" width="300" height="62" rx="20" fill="#d7ecff" stroke={BLUE_D} strokeWidth="3" />
      <line x1="300" y1="180" x2="300" y2="242" stroke={BLUE_D} strokeWidth="3" />
      {/* cute face */}
      <ellipse cx="256" cy="216" rx="13" ry="16" fill="#ffffff" />
      <circle cx="259" cy="216" r="6" fill="#1d1d2e" />
      <circle cx="261" cy="214" r="2.1" fill="#ffffff" />
      <ellipse cx="302" cy="216" rx="13" ry="16" fill="#ffffff" />
      <circle cx="305" cy="216" r="6" fill="#1d1d2e" />
      <circle cx="307" cy="214" r="2.1" fill="#ffffff" />
      <path d="M269 234 Q279 244 291 234" stroke="#1d1d2e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="244" cy="234" rx="7" ry="4.5" fill="#ffc5c9" opacity="0.75" />
      <ellipse cx="318" cy="234" rx="7" ry="4.5" fill="#ffc5c9" opacity="0.75" />
      {/* door line */}
      <path d="M356 242 L356 292" stroke={BLUE_D} strokeWidth="3" />
      {/* lower white body */}
      <path d="M100 292 L590 292 L590 306 Q590 336 554 338 L142 338 Q106 336 100 306 Z" fill="#ffffff" stroke={BLUE_D} strokeWidth="4" />
      {/* checkered band */}
      {Array.from({ length: 16 }).map((_, i) =>
        Array.from({ length: 2 }).map((_, j) => (
          <rect
            key={`${i}-${j}`}
            x={118 + i * 29}
            y={296 + j * 14}
            width="14.5"
            height="14"
            fill={(i + j) % 2 === 0 ? '#0f172a' : '#f8fafc'}
          />
        )),
      )}
      {/* POLRI gold badge */}
      <g transform="translate(210,258)">
        <circle r="26" fill={GOLD} stroke={GOLD_D} strokeWidth="4" />
        <path d={starPoints(0, 0, 12, 5)} fill="#ffefb0" stroke={GOLD_D} strokeWidth="1.6" />
      </g>
      {/* tilted POLISI word */}
      <text
        x="478"
        y="262"
        fontSize="19"
        fontWeight="900"
        fontFamily="'Baloo 2', system-ui, sans-serif"
        fill="#ffffff"
        stroke={BLUE_D}
        strokeWidth="2"
        paintOrder="stroke"
        textAnchor="middle"
        transform="rotate(-12 478 262)"
      >
        POLISI
      </text>
      {/* front details */}
      <rect x="552" y="290" width="34" height="20" rx="8" fill="#cbd5e1" stroke={BLUE_D} strokeWidth="3" />
      <ellipse cx="574" cy="252" rx="10" ry="14" fill="#ffe28a" stroke={BLUE_D} strokeWidth="3" />
      <ellipse cx="574" cy="252" rx="4" ry="6" fill="#fff9c4" />
      <rect x="103" y="254" width="12" height="20" rx="5" fill="#e11d48" />
      {/* wheels */}
      <circle cx="190" cy="318" r="44" fill="#23233a" stroke="#0b0b14" strokeWidth="4" />
      <circle cx="190" cy="318" r="19" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
      <circle cx="190" cy="318" r="6.5" fill={BLUE} />
      <circle cx="455" cy="318" r="44" fill="#23233a" stroke="#0b0b14" strokeWidth="4" />
      <circle cx="455" cy="318" r="19" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
      <circle cx="455" cy="318" r="6.5" fill={BLUE} />
    </g>
  )
}

/* --------------------------- art: officers ----------------------------- */
function OfficerArt({ girl, wave }) {
  return (
    <g>
      <rect x="78" y="178" width="22" height="36" rx="10" fill="#232f6e" />
      <rect x="120" y="178" width="22" height="36" rx="10" fill="#232f6e" />
      <ellipse cx="89" cy="218" rx="17" ry="9" fill="#20242e" />
      <ellipse cx="131" cy="218" rx="17" ry="9" fill="#20242e" />

      <rect x="64" y="158" width="92" height="11" rx="4" fill="#191e33" />
      <rect x="103" y="159" width="14" height="9" rx="2" fill={GOLD} />

      <rect x="64" y="104" width="92" height="80" rx="30" fill={NAVY} />
      <rect x="82" y="126" width="18" height="22" rx="4" fill={GOLD} />
      <circle cx="82" cy="135" r="3" fill={NAVY_D} />
      <circle cx="108" cy="132" r="3" fill={NAVY_D} />
      <circle cx="108" cy="146" r="3" fill={NAVY_D} />
      <path d={starPoints(99, 127, 6, 2.6)} fill="#ffefb0" stroke={GOLD_D} strokeWidth="1" />
      <path d="M70 152 h14 M136 152 h14" stroke="#1a2f6b" strokeWidth="2" opacity="0.7" />

      {wave === 'left' && (
        <g>
          <line x1="74" y1="116" x2="50" y2="84" stroke={NAVY} strokeWidth="17" strokeLinecap="round" />
          <circle cx="46" cy="81" r="9" fill={SKIN} />
        </g>
      )}
      {wave === 'right' && (
        <g>
          <line x1="146" y1="116" x2="198" y2="84" stroke={NAVY} strokeWidth="17" strokeLinecap="round" />
          <circle cx="201" cy="81" r="9" fill={SKIN} />
        </g>
      )}

      <rect x="102" y="96" width="16" height="12" fill={SKIN_D} />
      <circle cx="110" cy="64" r="42" fill={SKIN} />

      {girl && (
        <>
          <circle cx="58" cy="58" r="11" fill={HAIR} />
          <circle cx="162" cy="58" r="11" fill={HAIR} />
          <circle cx="58" cy="58" r="3" fill="#e11d48" />
          <circle cx="162" cy="58" r="3" fill="#e11d48" />
        </>
      )}

      <circle cx="98" cy="76" r="5.5" fill="#1b1b21" />
      <circle cx="100" cy="74" r="1.8" fill="#ffffff" />
      <circle cx="122" cy="76" r="5.5" fill="#1b1b21" />
      <circle cx="124" cy="74" r="1.8" fill="#ffffff" />

      {!girl && <path d="M92 66 Q110 60 128 66 L128 62 Q110 54 92 62 Z" fill={HAIR} />}
      {girl && <path d="M78 70 Q100 60 118 66 Q128 68 130 72 Q112 58 92 64 Q82 66 78 70 Z" fill={HAIR} />}

      <path d="M102 88 Q110 96 118 88" stroke="#7c3b20" strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="86" cy="88" rx="6" ry="3.6" fill="#f7a9a9" opacity="0.6" />
      <ellipse cx="134" cy="88" rx="6" ry="3.6" fill="#f7a9a9" opacity="0.6" />

      <rect x="68" y="24" width="84" height="28" rx="14" fill={NAVY} />
      <rect x="68" y="48" width="84" height="11" rx="4" fill={NAVY_D} />
      <ellipse cx="110" cy="53.5" rx="12" ry="8" fill={GOLD} />
      <path d={starPoints(110, 53, 7, 3)} fill="#7c5726" />
      <ellipse cx="110" cy="63" rx="38" ry="9" fill="#2b241c" />

      <rect x="62" y="62" width="11" height="36" rx="5" fill={HAIR} />
      <rect x="147" y="62" width="11" height="36" rx="5" fill={HAIR} />
    </g>
  )
}

const BUNTING = [
  { x: 252, c: GOLD },
  { x: 292, c: '#ffffff' },
  { x: 330, c: BLUE },
  { x: 368, c: GOLD },
  { x: 405, c: '#ffffff' },
]

function OfficersScene() {
  return (
    <g>
      <ellipse cx="170" cy="364" rx="62" ry="9" fill="#1e3a8a" opacity="0.13" />
      <ellipse cx="490" cy="364" rx="62" ry="9" fill="#1e3a8a" opacity="0.13" />

      {/* sun */}
      <circle cx="95" cy="66" r="28" fill="#ffd93d" stroke="#f0b400" strokeWidth="4" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45) * Math.PI / 180
        return (
          <line
            key={i}
            x1={95 + 36 * Math.cos(a)}
            y1={66 + 36 * Math.sin(a)}
            x2={95 + 48 * Math.cos(a)}
            y2={66 + 48 * Math.sin(a)}
            stroke="#f0b400"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )
      })}
      <circle cx="85" cy="62" r="2.5" fill="#7a4d00" />
      <circle cx="105" cy="62" r="2.5" fill="#7a4d00" />
      <path d="M85 74 Q95 82 105 74" stroke="#7a4d00" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* clouds */}
      <g fill="#ffffff" opacity="0.95">
        <circle cx="500" cy="58" r="26" />
        <circle cx="540" cy="48" r="20" />
        <circle cx="472" cy="52" r="18" />
        <rect x="456" y="50" width="88" height="16" rx="8" />
      </g>
      <g fill="#ffffff" opacity="0.85">
        <circle cx="196" cy="46" r="16" />
        <circle cx="222" cy="40" r="12" />
        <rect x="178" y="42" width="54" height="12" rx="6" />
      </g>

      {/* stars in middle strip */}
      <path d={starPoints(318, 70, 11, 5)} fill={GOLD} stroke={GOLD_D} strokeWidth="1.4" />
      <path d={starPoints(356, 46, 8, 3.6)} fill={GOLD} stroke={GOLD_D} strokeWidth="1.4" />
      <path d={starPoints(288, 116, 7, 3.2)} fill={GOLD} opacity="0.9" />
      <path d={starPoints(380, 108, 6, 2.8)} fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />

      {/* bunting */}
      <path d="M226 236 Q330 254 434 236" stroke={BLUE_D} strokeWidth="2.5" fill="none" />
      {BUNTING.map((b, i) => (
        <polygon key={i} points={`${b.x - 7},241 ${b.x + 7},241 ${b.x},257`} fill={b.c} stroke={BLUE_D} strokeWidth="1.4" />
      ))}

      {/* officers */}
      <g transform="translate(71,144) scale(0.9)">
        <OfficerArt girl={false} wave="left" />
      </g>
      <g transform="translate(391,144) scale(0.9)">
        <OfficerArt girl wave="right" />
      </g>

      {/* clasped hands */}
      <line x1="224" y1="252" x2="316" y2="260" stroke={NAVY} strokeWidth="16" strokeLinecap="round" />
      <circle cx="322" cy="261" r="10.5" fill={SKIN} stroke={SKIN_D} strokeWidth="2" />
      <line x1="436" y1="252" x2="344" y2="264" stroke={NAVY} strokeWidth="16" strokeLinecap="round" />
      <circle cx="340" cy="265" r="10.5" fill={SKIN} stroke={SKIN_D} strokeWidth="2" />
      <circle cx="331" cy="263" r="7" fill="#ffd7f0" opacity="0.25" />
    </g>
  )
}

/* --------------------------- level config ------------------------------ */
const LEVEL_CONFIG = {
  1: {
    sceneW: 680,
    sceneH: 400,
    slices: [
      { id: 'c-top', r: { x: 0, y: 0, w: 680, h: 200 } },
      { id: 'c-bottom', r: { x: 0, y: 200, w: 680, h: 200 } },
    ],
    scene: <CarScene />,
  },
  2: {
    sceneW: 660,
    sceneH: 400,
    slices: [
      { id: 'o-left', r: { x: 0, y: 0, w: 220, h: 400 } },
      { id: 'o-mid', r: { x: 220, y: 0, w: 220, h: 400 } },
      { id: 'o-right', r: { x: 440, y: 0, w: 220, h: 400 } },
    ],
    scene: <OfficersScene />,
  },
}

const getCfg = (n) => LEVEL_CONFIG[n] || LEVEL_CONFIG[1]

function computeScale(el, cfg) {
  if (!el) return 1
  const r = el.getBoundingClientRect()
  const boardW = r.width * 0.44
  const trayW = r.width * 0.52
  const availH = r.height * 0.96
  const s = Math.min((trayW - 28) / cfg.sceneW, (availH - 20) / cfg.sceneH, boardW / cfg.sceneW)
  return Math.max(0.25, s)
}

const sliceViewBox = (r) => `${r.x} ${r.y} ${r.w} ${r.h}`

/* ------------------------------- game ---------------------------------- */
export default function PestaPuzzlePolisiGame({ onExit }) {
  const [level, setLevel] = useState(1)
  const [scale, setScale] = useState(1)
  const [pieces, setPieces] = useState(() => ({}))
  const [dragId, setDragId] = useState(null)
  const [celebrate, setCelebrate] = useState(false)
  const [hint, setHint] = useState(true)

  const playRef = useRef(null)
  const boardRef = useRef(null)
  const homeRefs = useRef({})
  const dragRef = useRef(null)
  const piecesRef = useRef({})
  const levelRef = useRef(1)
  const scaleRef = useRef(1)

  useEffect(() => { levelRef.current = level }, [level])
  useEffect(() => { scaleRef.current = scale }, [scale])

  const cfg = getCfg(level)

  /* scale follows available space */
  useEffect(() => {
    const el = playRef.current
    if (!el) return
    const update = () => setScale(computeScale(el, cfg))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.sceneW, cfg.sceneH])

  /* position every (non-dragged) piece from home slot / board slot measurements */
  useLayoutEffect(() => {
    const play = playRef.current
    const board = boardRef.current
    if (!play || !board) return
    const pr = play.getBoundingClientRect()
    const br = board.getBoundingClientRect()
    const k = br.width / cfg.sceneW
    setPieces((prev) => {
      const next = {}
      for (const s of cfg.slices) {
        const p = prev[s.id] || { locked: false }
        const lock = !!p.locked
        if (dragRef.current?.id === s.id && p.x != null) {
          next[s.id] = { ...p, locked: false }
          continue
        }
        let x, y
        if (lock) {
          x = br.left - pr.left + s.r.x * k
          y = br.top - pr.top + s.r.y * k
        } else {
          const home = homeRefs.current[s.id]
          if (home) {
            const hr = home.getBoundingClientRect()
            x = hr.left - pr.left
            y = hr.top - pr.top
          } else {
            x = -9999
            y = -9999
          }
        }
        next[s.id] = { locked: lock, x, y }
      }
      piecesRef.current = next
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, level, cfg.sceneW, cfg.sceneH])

  /* ---------------------------- drag logic ----------------------------- */
  function startDrag(e, id) {
    if (piecesRef.current[id]?.locked) return
    e.preventDefault()
    const el = e.currentTarget.getBoundingClientRect()
    dragRef.current = { id, offX: e.clientX - el.left, offY: e.clientY - el.top, moved: false }
    setDragId(id)
    setHint(false)
    playPop()
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
  }

  function onMove(e) {
    const meta = dragRef.current
    if (!meta) return
    meta.moved = true
    const pr = playRef.current.getBoundingClientRect()
    const x = e.clientX - pr.left - meta.offX
    const y = e.clientY - pr.top - meta.offY
    setPieces((prev) => {
      const next = { ...prev, [meta.id]: { ...prev[meta.id], x, y } }
      piecesRef.current = next
      return next
    })
  }

  function onUp() {
    const meta = dragRef.current
    if (!meta) return
    cleanupDrag()
    setDragId(null)
    if (!meta.moved) return
    const play = playRef.current
    const board = boardRef.current
    const pr = play.getBoundingClientRect()
    const br = board.getBoundingClientRect()
    const bx = br.left - pr.left
    const by = br.top - pr.top
    const p = piecesRef.current[meta.id]
    const slice = cfg.slices.find((s) => s.id === meta.id)
    const pw = slice.r.w * scaleRef.current
    const ph = slice.r.h * scaleRef.current
    const pcx = p.x + pw / 2
    const pcy = p.y + ph / 2

    const cx = bx + (slice.r.x + slice.r.w / 2) * (br.width / cfg.sceneW)
    const cy = by + (slice.r.y + slice.r.h / 2) * (br.height / cfg.sceneH)
    const dist = Math.hypot(pcx - cx, pcy - cy)
    const insideBoard = pcx >= bx && pcx <= bx + br.width && pcy >= by && pcy <= by + br.height

    if (insideBoard && dist < 80 * scaleRef.current) {
      const nx = cx - pw / 2
      const ny = cy - ph / 2
      setPieces((prev) => {
        const next = { ...prev, [meta.id]: { ...prev[meta.id], locked: true, x: nx, y: ny } }
        piecesRef.current = next
        return next
      })
      playChime()
      const allLocked = cfg.slices.every((s) => (piecesRef.current[s.id] || {}).locked || s.id === meta.id)
      if (allLocked) {
        if (levelRef.current === 1) {
          setTimeout(() => { setLevel(2); setHint(true); playLevelUp() }, 750)
        } else {
          setTimeout(() => { setCelebrate(true); playFanfare(); bigConfetti() }, 420)
        }
      }
    } else {
      const home = homeRefs.current[meta.id]
      if (home) {
        const hr = home.getBoundingClientRect()
        setPieces((prev) => {
          const next = { ...prev, [meta.id]: { ...prev[meta.id], x: hr.left - pr.left, y: hr.top - pr.top } }
          piecesRef.current = next
          return next
        })
      }
      playReturn()
    }
  }

  function onCancel() {
    const meta = dragRef.current
    if (!meta) return
    cleanupDrag()
    setDragId(null)
    const home = homeRefs.current[meta.id]
    if (home) {
      const hr = home.getBoundingClientRect()
      const pr = playRef.current.getBoundingClientRect()
      setPieces((prev) => {
        const next = { ...prev, [meta.id]: { ...prev[meta.id], x: hr.left - pr.left, y: hr.top - pr.top } }
        piecesRef.current = next
        return next
      })
    }
    playReturn()
  }

  function cleanupDrag() {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onCancel)
    dragRef.current = null
  }

  function playAgain() {
    setCelebrate(false)
    setHint(true)
    dragRef.current = null
    setLevel(1)
    setDragId(null)
  }

  const frameW = cfg.sceneW * scale
  const frameH = cfg.sceneH * scale

  return (
    <div className="flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-yellow-100">
      <header className="z-50 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-8 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-white/85 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base"
        >
          ‹ Keluar
        </button>
        <h1 className="text-[clamp(1.5rem,4.5vw,2.6rem)] font-black leading-none text-slate-800 drop-shadow-sm">
          <span aria-hidden="true">🧩</span> Pesta Puzzle Polisi
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black shadow sm:h-9 sm:w-9 ${
              level === 1 || celebrate ? 'bg-sky-500 text-white' : 'bg-white/70 text-slate-400'
            }`}
          >
            1
          </span>
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black shadow sm:h-9 sm:w-9 ${
              level === 2 || celebrate ? 'bg-amber-400 text-white' : 'bg-white/70 text-slate-400'
            }`}
          >
            2
          </span>
        </div>
      </header>

      <div ref={playRef} className="relative min-h-0 flex-1 overflow-hidden">
        {/* decorative floats */}
        <span className="animate-floaty pointer-events-none absolute right-8 top-2 text-6xl opacity-80 sm:text-7xl" aria-hidden="true">
          ☀️
        </span>
        <span className="animate-cloud-drift pointer-events-none absolute -top-2 left-0 text-6xl opacity-70" aria-hidden="true">
          ☁️
        </span>

        <div className="flex h-full items-stretch gap-4 px-4 pb-4 pt-2 sm:gap-6 sm:px-6 sm:pt-3">
          {/* left: white board */}
          <div className="flex w-[46%] min-w-0 items-center justify-center">
            <div ref={boardRef} className="relative" style={{ width: frameW, height: frameH }}>
              <div className="absolute -inset-4 rounded-3xl bg-white shadow-[0_12px_40px_rgba(2,6,23,0.22)] ring-4 ring-sky-900/10" />
              {/* faint target image */}
              <svg width="100%" height="100%" viewBox={`0 0 ${cfg.sceneW} ${cfg.sceneH}`} className="absolute left-0 top-0 opacity-30" aria-hidden="true">
                {cfg.scene}
              </svg>
              {/* slot outlines */}
              <svg width="100%" height="100%" viewBox={`0 0 ${cfg.sceneW} ${cfg.sceneH}`} className="absolute left-0 top-0" aria-hidden="true">
                {cfg.slices.map((s) => (
                  <rect
                    key={s.id}
                    x={s.r.x}
                    y={s.r.y}
                    width={s.r.w}
                    height={s.r.h}
                    fill="none"
                    stroke={BLUE}
                    strokeWidth="3"
                    strokeDasharray="12 10"
                    rx="8"
                    opacity="0.6"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* right: tray */}
          <div className="flex w-[50%] min-w-0 flex-col items-center justify-center">
            <div className="rounded-3xl bg-white/70 px-5 py-5 shadow-xl ring-4 ring-sky-200/70 backdrop-blur sm:px-7 sm:py-7">
              <div className="mb-3 flex items-center justify-center gap-2 text-3xl" aria-hidden="true">
                <span className="animate-floaty inline-block" style={{ animationDuration: '3s' }}>🧩</span>
              </div>
              <div className={level === 1 ? 'flex flex-col items-center gap-3' : 'flex flex-row items-center gap-3'}>
                {cfg.slices.map((s) => (
                  <div
                    key={s.id}
                    ref={(el) => (homeRefs.current[s.id] = el)}
                    className="relative shrink-0"
                    style={{ width: s.r.w * scale, height: s.r.h * scale }}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-xl border-4 border-dashed border-sky-400/60 bg-sky-50/70">
                      <svg width="100%" height="100%" viewBox={sliceViewBox(s.r)} className="absolute inset-0 opacity-25">
                        {cfg.scene}
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* overlay: draggable pieces */}
        <div key={level} className="pointer-events-none absolute inset-0 z-40">
          {cfg.slices.map((s) => {
            const p = pieces[s.id] || { x: -9999, y: -9999, locked: false }
            const dragging = dragId === s.id
            return (
              <div
                key={s.id}
                role="img"
                aria-label="Potongan puzzle"
                onPointerDown={(e) => startDrag(e, s.id)}
                className={`absolute ${p.locked ? 'pointer-events-none' : 'pointer-events-auto cursor-grab touch-none'} ${dragging ? 'z-[60] cursor-grabbing' : 'z-50'}`}
                style={{
                  left: p.x,
                  top: p.y,
                  width: s.r.w * scale,
                  height: s.r.h * scale,
                  transition: dragging ? 'none' : 'left 0.5s cubic-bezier(0.34,1.35,0.5,1), top 0.5s cubic-bezier(0.34,1.35,0.5,1), transform 0.18s ease',
                  touchAction: 'none',
                  userSelect: 'none',
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox={sliceViewBox(s.r)}
                  style={{ display: 'block', pointerEvents: 'none', transition: 'transform 0.18s ease' }}
                  className={`rounded-lg ring-4 ring-white ${
                    p.locked
                      ? 'animate-kelinci-pop'
                      : dragging
                        ? 'scale-[1.07] drop-shadow-[0_18px_30px_rgba(2,6,23,0.4)]'
                        : 'drop-shadow-[0_9px_16px_rgba(2,6,23,0.3)]'
                  }`}
                >
                  {cfg.scene}
                </svg>
              </div>
            )
          })}
        </div>

        {/* hint bubble */}
        {hint && !celebrate && (
          <div
            key={level}
            className="animate-pop-in pointer-events-none absolute left-1/2 top-3 z-[70] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-slate-800/85 px-5 py-2.5 text-base font-extrabold text-white shadow-xl sm:top-4 sm:text-lg"
          >
            <span className="animate-floaty inline-block" style={{ animationDuration: '1.6s' }} aria-hidden="true">👆</span>
            Seret potongan puzzle ke papan kiri!
          </div>
        )}

        {/* ------------------- celebration screen ------------------- */}
        {celebrate && (
          <div className="absolute inset-0 z-[80] flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-sky-200/95 via-white/95 to-yellow-100/95 px-4 backdrop-blur-sm sm:gap-7">
            <div className="animate-pop-in relative flex flex-col items-center">
              <svg width="min(300px,38vh)" viewBox="0 0 320 410" className="drop-shadow-[0_14px_30px_rgba(180,123,0,0.55)]" aria-hidden="true">
                <defs>
                  <radialGradient id="goldShield" cx="35%" cy="28%" r="85%">
                    <stop offset="0%" stopColor="#fff7c2" />
                    <stop offset="38%" stopColor="#ffd93d" />
                    <stop offset="72%" stopColor="#f5b301" />
                    <stop offset="100%" stopColor="#b47b00" />
                  </radialGradient>
                  <radialGradient id="goldCenter" cx="40%" cy="35%" r="80%">
                    <stop offset="0%" stopColor="#fffbe0" />
                    <stop offset="60%" stopColor="#ffe98a" />
                    <stop offset="100%" stopColor="#f5b301" />
                  </radialGradient>
                </defs>

                <g className="animate-gold-spin" fill="#ffd93d" opacity="0.5" transform="translate(160,190)">
                  <polygon points={BADGE_RAYS} transform="translate(-160,-190)" />
                </g>

                <path
                  d="M160 20 L258 56 L258 194 Q258 292 160 350 Q62 292 62 194 L62 56 Z"
                  fill={GOLD}
                  stroke="#8a5b00"
                  strokeWidth="7"
                  strokeLinejoin="round"
                />
                <circle cx="160" cy="196" r="116" fill={GOLD} stroke="#c98a00" strokeWidth="4" />
                <circle cx="160" cy="196" r="104" fill="url(#goldCenter)" stroke="#e8a800" strokeWidth="3" />
                <path d={starPoints(160, 200, 78, 34)} fill="#fff2b3" stroke="#d99a00" strokeWidth="3" strokeLinejoin="round" />
                <circle cx="160" cy="200" r="30" fill={GOLD} stroke="#b98200" strokeWidth="3" />
                <path d={starPoints(160, 200, 18, 8)} fill="#fffbe0" stroke="#b98200" strokeWidth="1.6" />

                {/* shiny highlight */}
                <ellipse cx="118" cy="104" rx="52" ry="26" fill="#ffffff" opacity="0.4" transform="rotate(-24 118 104)" />
                <ellipse cx="150" cy="160" rx="34" ry="12" fill="#ffffff" opacity="0.25" />

                {/* ribbons */}
                <g stroke="#c98a00" strokeWidth="3" strokeLinecap="round">
                  <line x1="70" y1="330" x2="106" y2="342" strokeWidth="8" stroke={BLUE} />
                  <line x1="250" y1="330" x2="214" y2="342" strokeWidth="8" stroke="#ef4444" />
                  <circle cx="160" cy="336" r="14" fill="#ffffff" stroke={GOLD_D} strokeWidth="4" />
                </g>
              </svg>

              <span className="animate-hore-bounce mt-2 text-5xl" aria-hidden="true">🎉</span>
            </div>

            <h2 className="animate-pop-in text-center text-[clamp(1.7rem,5vw,3rem)] font-black leading-tight text-amber-600 [text-shadow:0_2px_0_#b45309,0_4px_0_#92400e,0_8px_20px_rgba(0,0,0,0.35)] sm:text-4xl">
              POLISI CILIK MANDIRI
            </h2>

            <button
              type="button"
              onClick={playAgain}
              className="animate-pop-in mx-auto mt-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-10 py-4 text-2xl font-black text-white shadow-[0_6px_0_#047857,0_16px_28px_rgba(4,120,87,0.45)] transition hover:scale-105 hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#047857] sm:px-14 sm:text-3xl"
              style={{ animationDelay: '0.15s' }}
            >
              🚓 MAIN LAGI
            </button>
          </div>
        )}
      </div>
    </div>
  )
}