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

/* ------------------------- art: police motorcycle ---------------------- */
function MotorcycleScene() {
  return (
    <g>
      <ellipse cx="345" cy="352" rx="175" ry="12" fill="#1e3a8a" opacity="0.13" />

      {/* wheels */}
      <circle cx="215" cy="330" r="42" fill="#23233a" stroke="#0b0b14" strokeWidth="4" />
      <circle cx="215" cy="330" r="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
      <circle cx="215" cy="330" r="6" fill={BLUE} />
      <circle cx="480" cy="330" r="42" fill="#23233a" stroke="#0b0b14" strokeWidth="4" />
      <circle cx="480" cy="330" r="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
      <circle cx="480" cy="330" r="6" fill={BLUE} />

      {/* engine + exhaust */}
      <rect x="270" y="305" width="120" height="30" rx="10" fill="#20242e" stroke="#171a22" strokeWidth="3" />
      <rect x="366" y="330" width="104" height="16" rx="8" fill="#7c8895" stroke="#5a6572" strokeWidth="3" />
      <rect x="454" y="330" width="32" height="16" rx="6" fill="#94a3b8" />

      {/* seat */}
      <rect x="252" y="266" width="104" height="26" rx="12" fill="#20242e" stroke="#171a22" strokeWidth="3" />
      {/* body skirt */}
      <path d="M254 316 Q262 272 300 264 L360 262 Q390 262 400 292 L400 316 Z" fill={BLUE} stroke={BLUE_D} strokeWidth="3" />
      {/* gas tank */}
      <path d="M348 268 L424 268 Q446 272 452 298 L444 320 L348 320 Z" fill={BLUE} stroke={BLUE_D} strokeWidth="3" />
      {/* POLRI badge on tank */}
      <g transform="translate(398,296)">
        <circle r="17" fill={GOLD} stroke={GOLD_D} strokeWidth="3" />
        <path d={starPoints(0, 0, 8, 3.4)} fill="#ffefb0" stroke={GOLD_D} strokeWidth="1.4" />
      </g>

      {/* front fairing */}
      <path d="M432 268 L506 268 Q528 280 540 308 L536 320 L432 320 Z" fill={BLUE} stroke={BLUE_D} strokeWidth="3" />
      {/* windshield */}
      <polygon points="450,268 478,232 500,258 500,268" fill="#bfe3ff" stroke={BLUE_D} strokeWidth="2.5" />
      {/* headlight */}
      <ellipse cx="536" cy="300" rx="9" ry="12" fill="#ffe28a" stroke={BLUE_D} strokeWidth="2.5" />
      {/* forks */}
      <path d="M470 296 L480 332" stroke="#374151" strokeWidth="7" strokeLinecap="round" />
      <path d="M446 312 L458 336" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
      {/* handlebars + mirrors */}
      <path d="M500 262 Q528 238 548 240" stroke="#20242e" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="552" cy="240" r="8" fill="#8ea6c8" stroke="#5a6572" strokeWidth="2.5" />
      <line x1="452" y1="262" x2="436" y2="238" stroke="#20242e" strokeWidth="5" strokeLinecap="round" />
      <circle cx="432" cy="236" r="7" fill="#8ea6c8" stroke="#5a6572" strokeWidth="2.5" />

      {/* cute face on fairing */}
      <ellipse cx="474" cy="290" rx="6.5" ry="8" fill="#ffffff" />
      <circle cx="475.5" cy="290" r="3" fill="#1d1d2e" />
      <circle cx="477" cy="289" r="1.1" fill="#ffffff" />
      <ellipse cx="496" cy="290" rx="6.5" ry="8" fill="#ffffff" />
      <circle cx="497.5" cy="290" r="3" fill="#1d1d2e" />
      <circle cx="499" cy="289" r="1.1" fill="#ffffff" />
      <path d="M480 300 Q486 306 492 300" stroke="#1d1d2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* light buttons */}
      <circle cx="262" cy="244" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
      <circle cx="278" cy="244" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />

      {/* kickstand */}
      <line x1="250" y1="318" x2="243" y2="352" stroke="#5a6572" strokeWidth="5" strokeLinecap="round" />

      {/* rider legs */}
      <path d="M320 288 L300 316" stroke={NAVY_D} strokeWidth="12" strokeLinecap="round" />
      <path d="M354 288 L402 316" stroke={NAVY_D} strokeWidth="12" strokeLinecap="round" />
      <ellipse cx="300" cy="320" rx="12" ry="8" fill="#20242e" />
      <ellipse cx="404" cy="320" rx="12" ry="8" fill="#20242e" />

      {/* rider torso */}
      <path d="M298 210 L372 216 Q378 250 366 284 L306 284 Q292 250 298 210 Z" fill={NAVY} stroke={NAVY_D} strokeWidth="3" />
      <rect x="302" y="264" width="66" height="12" rx="5" fill="#191e33" />
      <rect x="330" y="264" width="12" height="12" fill={GOLD} />

      {/* rider arms to bars */}
      <line x1="320" y1="240" x2="448" y2="258" stroke={NAVY} strokeWidth="12" strokeLinecap="round" />
      <line x1="362" y1="240" x2="500" y2="254" stroke={NAVY} strokeWidth="12" strokeLinecap="round" />
      <circle cx="448" cy="258" r="7" fill={SKIN} />
      <circle cx="500" cy="254" r="7" fill={SKIN} />

      {/* rider head */}
      <circle cx="335" cy="172" r="38" fill={SKIN} />
      <circle cx="323" cy="168" r="4.5" fill="#1b1b21" />
      <circle cx="348" cy="168" r="4.5" fill="#1b1b21" />
      <circle cx="324.5" cy="166.5" r="1.6" fill="#ffffff" />
      <circle cx="349.5" cy="166.5" r="1.6" fill="#ffffff" />
      <path d="M332 180 Q340 188 348 180" stroke="#7c3b20" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <ellipse cx="313" cy="182" rx="5" ry="3" fill="#f7a9a9" opacity="0.65" />
      <ellipse cx="358" cy="182" rx="5" ry="3" fill="#f7a9a9" opacity="0.65" />
      {/* helmet */}
      <path d="M297 178 Q295 122 335 118 Q376 122 374 178 Q358 166 336 164 Q312 166 297 178 Z" fill="#ffffff" stroke="#dbe4f0" strokeWidth="3" />
      <path d="M330 118 L330 162" stroke={NAVY_D} strokeWidth="5" />
      <g transform="translate(352,144)">
        <path d={starPoints(0, 0, 7, 3)} fill={GOLD} stroke={GOLD_D} strokeWidth="1" />
      </g>
    </g>
  )
}

/* ------------------------- art: police helicopter ---------------------- */
function HelicopterScene() {
  return (
    <g>
      {/* sun */}
      <circle cx="566" cy="78" r="26" fill="#ffd93d" stroke="#f0b400" strokeWidth="4" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45) * Math.PI / 180
        return (
          <line
            key={i}
            x1={566 + 33 * Math.cos(a)}
            y1={78 + 33 * Math.sin(a)}
            x2={566 + 45 * Math.cos(a)}
            y2={78 + 45 * Math.sin(a)}
            stroke="#f0b400"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        )
      })}
      <circle cx="558" cy="75" r="2.5" fill="#7a4d00" />
      <circle cx="574" cy="75" r="2.5" fill="#7a4d00" />
      <path d="M558 86 Q566 92 574 86" stroke="#7a4d00" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* clouds */}
      <g fill="#ffffff" opacity="0.95">
        <circle cx="330" cy="58" r="24" />
        <circle cx="368" cy="48" r="18" />
        <circle cx="300" cy="52" r="16" />
        <rect x="284" y="48" width="88" height="14" rx="7" />
      </g>
      <g fill="#ffffff" opacity="0.85">
        <circle cx="120" cy="70" r="18" />
        <circle cx="146" cy="62" r="13" />
        <rect x="101" y="64" width="58" height="12" rx="6" />
      </g>
      <path d={starPoints(428, 94, 9, 4)} fill={GOLD} stroke={GOLD_D} strokeWidth="1.3" />
      <path d={starPoints(206, 40, 7, 3.2)} fill={GOLD} opacity="0.9" />

      {/* ground */}
      <path d="M0 356 Q120 340 250 350 Q390 364 500 352 Q580 344 660 354 L660 400 L0 400 Z" fill="#6bc98f" stroke="#4bbd7f" strokeWidth="4" />
      <path d="M30 376 Q330 388 630 376" stroke="#e8ecf3" strokeWidth="10" fill="none" strokeDasharray="18 14" opacity="0.9" />
      <path d="M40 348 l18 -26 l18 26 Z" fill="#2f9e63" opacity="0.85" />
      <path d="M120 344 l16 -22 l16 22 Z" fill="#2f9e63" opacity="0.85" />
      <path d="M576 346 l17 -24 l17 24 Z" fill="#2f9e63" opacity="0.85" />
      <ellipse cx="330" cy="372" rx="150" ry="16" fill="#1e3a8a" opacity="0.16" />

      {/* main rotor */}
      <rect x="356" y="98" width="8" height="58" fill="#374151" />
      <rect x="328" y="90" width="64" height="14" rx="5" fill="#20242e" stroke="#171a22" strokeWidth="2" />
      <path d="M118 97 L552 97" stroke="#1f2937" strokeWidth="7" strokeLinecap="round" opacity="0.85" />
      <path d="M118 102 L552 102" stroke="#94a3b8" strokeWidth="2" opacity="0.5" />
      <circle cx="118" cy="97" r="6" fill="#334155" />
      <circle cx="552" cy="97" r="6" fill="#334155" />

      {/* tail boom */}
      <path d="M250 210 L92 200 L92 224 L250 238 Z" fill={BLUE} stroke={BLUE_D} strokeWidth="3" />
      {/* tail fin */}
      <path d="M112 220 L96 148 L142 190 Z" fill={BLUE} stroke={BLUE_D} strokeWidth="3" />
      <g transform="translate(116,190)">
        <path d={starPoints(0, 0, 9, 3.8)} fill={GOLD} stroke={GOLD_D} strokeWidth="1.6" />
      </g>
      {/* tail rotor */}
      <ellipse cx="86" cy="206" rx="10" ry="26" fill="#20242e" stroke="#0b0b14" strokeWidth="2" />
      <ellipse cx="86" cy="206" rx="6" ry="18" fill="#334155" />
      {/* tail lights */}
      <circle cx="150" cy="230" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.8" />
      <circle cx="174" cy="232" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.8" />

      {/* fuselage */}
      <path d="M240 210 L420 214 Q470 216 478 248 Q482 288 452 298 L250 298 L218 292 Q208 258 240 210 Z" fill={BLUE} stroke={BLUE_D} strokeWidth="4" />
      <path d="M228 282 L466 282 L468 298 L220 292 Z" fill="#ffffff" />
      {/* side window + door */}
      <rect x="276" y="224" width="118" height="50" rx="14" fill="#d7ecff" stroke={BLUE_D} strokeWidth="3" />
      <rect x="286" y="234" width="96" height="30" rx="10" fill="#ffffff" opacity="0.85" stroke={BLUE_D} strokeWidth="2" />
      {/* POLRI badge on door */}
      <g transform="translate(334,296)">
        <circle r="15" fill={GOLD} stroke={GOLD_D} strokeWidth="3" />
        <path d={starPoints(0, 0, 7, 3)} fill="#ffefb0" stroke={GOLD_D} strokeWidth="1.3" />
      </g>
      {/* windshield + face */}
      <path d="M428 224 L482 240 Q492 264 486 288 L440 288 Q436 252 428 224 Z" fill="#bfe3ff" stroke={BLUE_D} strokeWidth="3" />
      <ellipse cx="454" cy="254" rx="7" ry="9" fill="#ffffff" />
      <circle cx="455" cy="254" r="3" fill="#1d1d2e" />
      <circle cx="456" cy="253" r="1.1" fill="#ffffff" />
      <ellipse cx="474" cy="256" rx="7" ry="9" fill="#ffffff" />
      <circle cx="475" cy="256" r="3" fill="#1d1d2e" />
      <circle cx="476" cy="255" r="1.1" fill="#ffffff" />
      <path d="M456 266 Q464 273 472 266" stroke="#1d1d2e" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <ellipse cx="446" cy="272" rx="5" ry="3" fill="#ffc5c9" opacity="0.7" />

      {/* skids */}
      <path d="M262 298 L232 322" stroke="#334155" strokeWidth="7" />
      <path d="M392 298 L420 320" stroke="#334155" strokeWidth="7" />
      <rect x="208" y="324" width="236" height="12" rx="6" fill={GOLD} stroke={GOLD_D} strokeWidth="3" />
      <rect x="208" y="336" width="236" height="8" rx="4" fill={BLUE_D} />
    </g>
  )
}

/* ------------------------- art: officer portrait ------------------------ */
function OfficerPortraitScene() {
  return (
    <g>
      {/* backdrop disc + stars */}
      <circle cx="200" cy="205" r="176" fill="#dbe7ff" />
      <circle cx="200" cy="205" r="158" fill="#caddff" stroke="#aecdff" strokeWidth="4" />
      <path d={starPoints(96, 78, 9, 3.8)} fill={GOLD} stroke={GOLD_D} strokeWidth="1.4" />
      <path d={starPoints(312, 90, 8, 3.4)} fill={GOLD} stroke={GOLD_D} strokeWidth="1.4" />
      <path d={starPoints(72, 262, 7, 3)} fill={GOLD} opacity="0.9" />
      <path d={starPoints(326, 256, 7, 3)} fill={GOLD} opacity="0.9" />
      <path d={starPoints(200, 52, 9, 3.8)} fill={GOLD} stroke={GOLD_D} strokeWidth="1.4" />

      {/* torso */}
      <path d="M88 360 Q88 268 135 250 L265 250 Q312 268 312 360 Z" fill={NAVY} stroke={NAVY_D} strokeWidth="4" />
      <path d="M168 250 L200 298 L232 250" stroke="#ffffff" strokeWidth="9" fill="none" strokeLinecap="round" />
      <rect x="104" y="252" width="32" height="22" rx="6" fill={GOLD} stroke={GOLD_D} strokeWidth="2" />
      <rect x="264" y="252" width="32" height="22" rx="6" fill={GOLD} stroke={GOLD_D} strokeWidth="2" />
      <circle cx="190" cy="316" r="7" fill={GOLD} stroke={GOLD_D} strokeWidth="2" />
      <circle cx="210" cy="316" r="7" fill={GOLD} stroke={GOLD_D} strokeWidth="2" />
      <circle cx="190" cy="345" r="7" fill={GOLD} stroke={GOLD_D} strokeWidth="2" opacity="0.95" />
      <circle cx="210" cy="345" r="7" fill={GOLD} stroke={GOLD_D} strokeWidth="2" opacity="0.95" />
      {/* chest badge */}
      <g transform="translate(200,302)">
        <circle r="20" fill={GOLD} stroke={GOLD_D} strokeWidth="4" />
        <path d={starPoints(0, 0, 10, 4.2)} fill="#ffefb0" stroke={GOLD_D} strokeWidth="1.6" />
      </g>

      <rect x="178" y="214" width="44" height="38" rx="14" fill={SKIN_D} />

      {/* head */}
      <circle cx="200" cy="138" r="88" fill={SKIN} />
      <circle cx="108" cy="150" r="18" fill={SKIN} stroke={SKIN_D} strokeWidth="2" />
      <circle cx="292" cy="150" r="18" fill={SKIN} stroke={SKIN_D} strokeWidth="2" />
      <rect x="122" y="84" width="22" height="86" rx="10" fill={HAIR} />
      <rect x="256" y="84" width="22" height="86" rx="10" fill={HAIR} />

      {/* eyes */}
      <ellipse cx="166" cy="132" rx="23" ry="28" fill="#ffffff" />
      <circle cx="170" cy="134" r="12" fill="#1b1b21" />
      <circle cx="174" cy="128" r="4" fill="#ffffff" />
      <ellipse cx="234" cy="132" rx="23" ry="28" fill="#ffffff" />
      <circle cx="230" cy="134" r="12" fill="#1b1b21" />
      <circle cx="226" cy="128" r="4" fill="#ffffff" />
      <path d="M142 96 Q166 88 190 98" stroke={HAIR} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M210 98 Q234 88 258 96" stroke={HAIR} strokeWidth="6" fill="none" strokeLinecap="round" />

      <ellipse cx="200" cy="168" rx="5" ry="7" fill={SKIN_D} />
      <path d="M168 192 Q200 216 232 192" stroke="#7c3b20" strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="138" cy="178" rx="13" ry="8" fill="#f7a9a9" opacity="0.6" />
      <ellipse cx="262" cy="178" rx="13" ry="8" fill="#f7a9a9" opacity="0.6" />

      {/* cap */}
      <path d="M128 92 Q122 44 200 38 Q278 44 272 92 L128 92 Z" fill={NAVY} stroke={NAVY_D} strokeWidth="5" />
      <rect x="124" y="88" width="152" height="26" rx="10" fill={NAVY_D} />
      <g transform="translate(200,84)">
        <circle r="16" fill={GOLD} stroke={GOLD_D} strokeWidth="4" />
        <path d={starPoints(0, 0, 8, 3.4)} fill="#ffefb0" stroke={GOLD_D} strokeWidth="1.6" />
      </g>
      <path d="M132 116 Q200 106 268 116 Q200 150 132 116 Z" fill="#2b241c" />
    </g>
  )
}

/* ------------------------- art: police dog ------------------------------ */
function PoliceDogScene() {
  return (
    <g>
      {/* sun + clouds */}
      <circle cx="342" cy="64" r="24" fill="#ffd93d" stroke="#f0b400" strokeWidth="4" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45) * Math.PI / 180
        return (
          <line
            key={i}
            x1={342 + 31 * Math.cos(a)}
            y1={64 + 31 * Math.sin(a)}
            x2={342 + 42 * Math.cos(a)}
            y2={64 + 42 * Math.sin(a)}
            stroke="#f0b400"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )
      })}
      <circle cx="336" cy="61" r="2.2" fill="#7a4d00" />
      <circle cx="348" cy="61" r="2.2" fill="#7a4d00" />
      <path d="M336 71 Q342 76 348 71" stroke="#7a4d00" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <g fill="#ffffff" opacity="0.95">
        <circle cx="78" cy="58" r="20" />
        <circle cx="106" cy="50" r="15" />
        <rect x="56" y="52" width="58" height="12" rx="6" />
      </g>

      {/* grass */}
      <path d="M0 330 Q120 316 240 326 Q340 334 400 322 L400 400 L0 400 Z" fill="#8fd98a" stroke="#5fbf6f" strokeWidth="4" />
      <ellipse cx="200" cy="360" rx="118" ry="16" fill="#1e3a8a" opacity="0.14" />

      {/* body */}
      <ellipse cx="200" cy="356" rx="122" ry="58" fill="#c99b63" stroke="#a97c42" strokeWidth="3" />

      {/* ears */}
      <path d="M102 130 Q78 244 142 254 Q152 172 130 120 Z" fill="#8a5a2b" stroke="#6b4526" strokeWidth="3" />
      <path d="M298 130 Q322 244 258 254 Q248 172 270 120 Z" fill="#8a5a2b" stroke="#6b4526" strokeWidth="3" />
      <path d="M114 148 Q98 224 138 240 Q146 178 130 138 Z" fill="#c98f6f" />
      <path d="M286 148 Q302 224 262 240 Q254 178 270 138 Z" fill="#c98f6f" />

      {/* head */}
      <ellipse cx="200" cy="198" rx="120" ry="112" fill="#e0b878" stroke="#c08a4f" strokeWidth="4" />
      <path d="M118 190 Q200 240 282 190 Q274 300 200 302 Q126 300 118 190 Z" fill="#d9a35b" />

      {/* brows + eyes */}
      <path d="M138 148 Q160 136 184 144" stroke="#6b4526" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M216 144 Q240 136 262 148" stroke="#6b4526" strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="170" cy="168" rx="15" ry="19" fill="#ffffff" />
      <circle cx="174" cy="171" r="8" fill="#2b1d10" />
      <circle cx="167" cy="165" r="2.5" fill="#ffffff" />
      <ellipse cx="230" cy="168" rx="15" ry="19" fill="#ffffff" />
      <circle cx="226" cy="171" r="8" fill="#2b1d10" />
      <circle cx="233" cy="165" r="2.5" fill="#ffffff" />

      {/* snout + nose + mouth + tongue */}
      <ellipse cx="200" cy="246" rx="52" ry="42" fill="#f3e8cf" stroke="#d9c48f" strokeWidth="3" />
      <ellipse cx="200" cy="220" rx="24" ry="16" fill="#22160c" />
      <ellipse cx="193" cy="215" rx="6" ry="4" fill="#4a3a26" />
      <path d="M176 236 Q200 252 224 236" stroke="#22160c" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M192 246 Q192 282 200 290 Q208 282 208 246 Z" fill="#ff8fa3" stroke="#e0526f" strokeWidth="3" />

      <ellipse cx="136" cy="208" rx="14" ry="9" fill="#f79c9c" opacity="0.55" />
      <ellipse cx="264" cy="208" rx="14" ry="9" fill="#f79c9c" opacity="0.55" />

      {/* police cap */}
      <path d="M118 116 Q116 58 200 52 Q284 58 282 116 L118 116 Z" fill={NAVY} stroke={NAVY_D} strokeWidth="5" />
      <rect x="114" y="110" width="172" height="28" rx="12" fill={NAVY_D} />
      <g transform="translate(200,116)">
        <circle r="17" fill={GOLD} stroke={GOLD_D} strokeWidth="4" />
        <path d={starPoints(0, 0, 8.5, 3.6)} fill="#ffefb0" stroke={GOLD_D} strokeWidth="1.6" />
      </g>
      <path d="M130 140 Q200 130 270 140 Q200 176 130 140 Z" fill="#2b241c" />

      {/* collar + tag */}
      <path d="M118 330 Q200 348 282 330 L270 360 Q200 372 130 360 Z" fill={BLUE} stroke={BLUE_D} strokeWidth="4" />
      <g transform="translate(200,366)">
        <circle r="11" fill={GOLD} stroke={GOLD_D} strokeWidth="3" />
        <path d={starPoints(0, 0, 5.5, 2.4)} fill="#ffefb0" />
      </g>
    </g>
  )
}

/* ------------------------------ level config ---------------------------- */
const LEVELS = [
  {
    id: 1,
    kind: 'horz2',
    layout: 'stack',
    sceneW: 680,
    sceneH: 400,
    sliceSize: { w: 680, h: 200 },
    scene: <CarScene />,
  },
  {
    id: 2,
    kind: 'horz2',
    layout: 'stack',
    sceneW: 680,
    sceneH: 400,
    sliceSize: { w: 680, h: 200 },
    scene: <MotorcycleScene />,
  },
  {
    id: 3,
    kind: 'vert3',
    layout: 'row',
    sceneW: 660,
    sceneH: 400,
    sliceSize: { w: 220, h: 400 },
    scene: <OfficersScene />,
  },
  {
    id: 4,
    kind: 'vert3',
    layout: 'row',
    sceneW: 660,
    sceneH: 400,
    sliceSize: { w: 220, h: 400 },
    scene: <HelicopterScene />,
  },
  {
    id: 5,
    kind: 'grid4',
    layout: 'grid',
    sceneW: 400,
    sceneH: 400,
    sliceSize: { w: 200, h: 200 },
    scene: <OfficerPortraitScene />,
  },
  {
    id: 6,
    kind: 'grid4',
    layout: 'grid',
    sceneW: 400,
    sceneH: 400,
    sliceSize: { w: 200, h: 200 },
    scene: <PoliceDogScene />,
  },
]
const LEVEL_COUNT = LEVELS.length

function buildSlices(lvl) {
  const { kind, sceneW: W, sceneH: H } = lvl
  if (kind === 'horz2') {
    return [
      { id: `${lvl.id}-t`, r: { x: 0, y: 0, w: W, h: H / 2 } },
      { id: `${lvl.id}-b`, r: { x: 0, y: H / 2, w: W, h: H / 2 } },
    ]
  }
  if (kind === 'vert3') {
    const w = W / 3
    return [0, 1, 2].map((i) => ({
      id: `${lvl.id}-${i + 1}`,
      r: { x: i * w, y: 0, w, h: H },
    }))
  }
  const w = W / 2
  const h = H / 2
  return [
    { id: `${lvl.id}-1`, r: { x: 0, y: 0, w, h } },
    { id: `${lvl.id}-2`, r: { x: w, y: 0, w, h } },
    { id: `${lvl.id}-3`, r: { x: 0, y: h, w, h } },
    { id: `${lvl.id}-4`, r: { x: w, y: h, w, h } },
  ]
}

const getCfg = (n) => {
  const i = Math.max(0, Math.min(LEVEL_COUNT - 1, (n | 0) - 1))
  const lvl = LEVELS[i]
  return { ...lvl, slices: buildSlices(lvl) }
}

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
        if (levelRef.current < LEVEL_COUNT) {
          setTimeout(() => { setLevel(levelRef.current + 1); setHint(true); playLevelUp() }, 750)
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
        <div className="flex items-center gap-2" aria-label="Level">
          {LEVELS.map((lvl) => {
            const done = celebrate || lvl.id < level
            const current = lvl.id === level
            return (
              <span
                key={lvl.id}
                className={`h-3 w-3 rounded-full transition sm:h-3.5 sm:w-3.5 ${
                  done ? 'bg-amber-400' : current ? 'scale-125 bg-sky-500 ring-2 ring-white' : 'bg-white/70'
                }`}
              />
            )
          })}
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
              <div
                className={
                  cfg.layout === 'stack'
                    ? 'flex flex-col items-center gap-3'
                    : cfg.layout === 'row'
                      ? 'flex flex-row items-center gap-3'
                      : 'grid grid-cols-2 gap-3'
                }
              >
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