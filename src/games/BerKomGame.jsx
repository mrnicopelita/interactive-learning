import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const PARTS = [
  { id: 'monitor', name: 'Monitor', src: '/images/monitor.svg' },
  { id: 'cpu', name: 'CPU', src: '/images/cpu.svg' },
  { id: 'keyboard', name: 'Keyboard', src: '/images/keyboard.svg' },
  { id: 'mouse', name: 'Mouse', src: '/images/mouse.svg' },
]

function shuffle(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function createStartOrder() {
  let order = shuffle(PARTS)
  while (order.every((part, index) => part.id === PARTS[index].id)) {
    order = shuffle(PARTS)
  }
  return order
}

function SortablePart({ part, showNumber }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: part.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex cursor-grab items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-md sm:gap-4 sm:px-6 sm:py-4 ${
        isDragging ? 'z-10 scale-105 ring-4 ring-sky-300' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className="text-2xl text-slate-300 select-none sm:text-3xl"
      >
        ⠿
      </span>
      {showNumber && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-lg font-extrabold text-white sm:h-10 sm:w-10 sm:text-xl">
          {part.order}
        </span>
      )}
      <img
        src={part.src}
        alt=""
        className="h-10 w-10 select-none object-contain sm:h-14 sm:w-14"
      />
      <span className="text-xl font-extrabold text-slate-700 sm:text-2xl">
        {part.name}
      </span>
    </div>
  )
}

function BerKomGame({ onExit }) {
  const [stops, setStops] = useState(() => createStartOrder())
  const [result, setResult] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setStops((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
    setResult(null)
  }

  function checkOrder() {
    const isCorrect = stops.every((part, index) => part.id === PARTS[index].id)
    setResult(isCorrect ? 'correct' : 'wrong')
  }

  function shuffleOrder() {
    setStops(createStartOrder())
    setResult(null)
  }

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
      <button
        type="button"
        onClick={onExit}
        className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-sky-700 shadow-lg transition hover:scale-105 sm:left-5 sm:top-5 sm:px-6 sm:py-3 sm:text-2xl"
      >
        <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
        Games
      </button>

      <header className="z-10 flex w-full shrink-0 flex-col items-center gap-1 px-4 pt-16 text-center sm:pt-20">
        <h1 className="text-[clamp(2.25rem,7vw,4rem)] font-extrabold leading-none text-slate-700">
          Ber<span className="text-sky-600">Kom</span>
        </h1>
        <p className="text-sm font-bold text-slate-600 sm:text-lg">
          Drag the parts to build your computer in the right order!
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto px-4 py-4 sm:gap-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stops.map((part) => part.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex w-full max-w-lg flex-col gap-2">
              {stops.map((part, index) => (
                <SortablePart
                  key={part.id}
                  part={{ ...part, order: index + 1 }}
                  showNumber={result === 'correct'}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {result === 'correct' && (
          <div className="animate-pop-in flex w-full max-w-lg flex-col items-center gap-2 rounded-3xl bg-emerald-500/95 px-6 py-4 text-center shadow-xl">
            <div className="flex gap-2 text-3xl sm:text-4xl">
              <span className="animate-bounce" aria-hidden="true">🎉</span>
              <span className="animate-bounce" style={{ animationDelay: '0.15s' }} aria-hidden="true">✨</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }} aria-hidden="true">⭐</span>
            </div>
            <p className="text-2xl font-extrabold text-white sm:text-3xl">
              Great job! You built your computer!
            </p>
          </div>
        )}

        {result === 'wrong' && (
          <div className="animate-shake flex w-full max-w-lg flex-col items-center gap-1 rounded-3xl bg-amber-400/95 px-6 py-4 text-center shadow-xl">
            <p className="text-2xl font-extrabold text-amber-900 sm:text-3xl">
              Almost! Try again! 💪
            </p>
            <p className="text-sm font-bold text-amber-800 sm:text-base">
              Remember: Monitor first, then CPU, Keyboard, Mouse.
            </p>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={checkOrder}
            className="rounded-full bg-emerald-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:px-10 sm:text-2xl"
          >
            Check!
          </button>
          <button
            type="button"
            onClick={shuffleOrder}
            className="rounded-full bg-white/95 px-6 py-3 text-xl font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:px-8 sm:text-2xl"
          >
            Shuffle
          </button>
        </div>
      </main>
    </div>
  )
}

export default BerKomGame
