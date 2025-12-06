import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router'
import { motion, useMotionValue, useTransform, useMotionValueEvent } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { NAVIGATION_ITEMS, NAVIGATION_ROUTES } from '@/shared/const/navigation'
import { getSliderDirection } from '@/shared/utils/route-transitions'

export const Route = createFileRoute('/swipe')({
  component: RouteComponent,
})

const SWIPE_THRESHOLD = 100
const SWIPE_VELOCITY_THRESHOLD = 500

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDragging, setIsDragging] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const previousPathRef = useRef<string | null>(null)
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  const [entryDirection, setEntryDirection] = useState<'left' | 'right' | null>(null)
  
  // Pozycja aktualnej strony w navbarze (Swipe = indeks 1)
  const currentIndex = NAVIGATION_ITEMS.findIndex(
    (item) => item.path === NAVIGATION_ROUTES.SWIPE
  )
  
  // Określ kierunek animacji wejścia na podstawie poprzedniej ścieżki
  const currentPath = location.pathname
  
  const dragX = useMotionValue(0)
  const rotate = useTransform(dragX, [-200, 200], [-15, 15])
  const opacity = useTransform(dragX, [-100, 0, 100], [0, 1, 0])
  
  // Oblicz kierunek przed aktualizacją ref
  useEffect(() => {
    const prevPath = previousPathRef.current
    
    if (prevPath && prevPath !== currentPath) {
      const direction = getSliderDirection(prevPath, currentPath)
      setEntryDirection(direction)
    } else {
      setEntryDirection(null)
    }
    
    // Aktualizuj poprzednią ścieżkę
    previousPathRef.current = currentPath
  }, [currentPath])

  useMotionValueEvent(dragX, 'change', (latest) => {
    if (Math.abs(latest) > 20) {
      setDirection(latest > 0 ? 'right' : 'left')
    } else {
      setDirection(null)
    }
  })

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    // Przesunięcie w prawo (do następnej ikony w navbarze) -> Routes
    if (offset > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD) {
      const nextIndex = currentIndex + 1
      if (nextIndex < NAVIGATION_ITEMS.length) {
        navigate({ to: NAVIGATION_ITEMS[nextIndex].path })
      }
    }
    // Przesunięcie w lewo (do poprzedniej ikony w navbarze) -> Home
    else if (offset < -SWIPE_THRESHOLD || velocity < -SWIPE_VELOCITY_THRESHOLD) {
      const prevIndex = currentIndex - 1
      if (prevIndex >= 0) {
        navigate({ to: NAVIGATION_ITEMS[prevIndex].path })
      }
    }
    
    setIsDragging(false)
    setDirection(null)
    dragX.set(0)
  }

  const handleReject = () => {
    // Przesuń w lewo (odrzuć) -> Home
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      navigate({ to: NAVIGATION_ITEMS[prevIndex].path })
    }
  }

  const handleLike = () => {
    // Przesuń w prawo (polub) -> Routes
    const nextIndex = currentIndex + 1
    if (nextIndex < NAVIGATION_ITEMS.length) {
      navigate({ to: NAVIGATION_ITEMS[nextIndex].path })
    }
  }

  return (
    <div key={currentPath} className="min-h-screen bg-gray-800 text-foreground-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Odkryj Trasy</h1>
        <div className="relative">
          {/* Wskaźnik kierunku - pokazuje dokąd idziemy */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            style={{ opacity }}
          >
            <motion.div
              className="text-6xl"
              animate={isDragging && direction ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {direction === 'right' ? '→' : direction === 'left' ? '←' : ''}
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-foreground-800 rounded-lg overflow-hidden shadow-xl cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            style={{ rotate }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            <motion.div
              style={{ x: dragX }}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-primary-600 to-secondary-600 relative">
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="text-right">
                    <span className="bg-black/50 px-3 py-1 rounded-full text-sm">
                      Trasa #1
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Szlak Zamków</h2>
                    <p className="text-lg mb-4 opacity-90">
                      Piękna trasa przez historyczne zamki i pałace w Małopolsce
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-black/50 px-3 py-1 rounded-full text-sm">
                        🏰 Zamki
                      </span>
                      <span className="bg-black/50 px-3 py-1 rounded-full text-sm">
                        📍 Małopolska
                      </span>
                      <span className="bg-black/50 px-3 py-1 rounded-full text-sm">
                        ⏱️ 2 dni
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <div className="flex justify-center gap-8 mt-8">
          <motion.button
            onClick={handleReject}
            className="w-16 h-16 rounded-full bg-accent-600 hover:bg-accent-700 flex items-center justify-center text-2xl transition-colors shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Odrzuć - przejdź do poprzedniej strony"
          >
            ✕
          </motion.button>
          <motion.button
            onClick={handleLike}
            className="w-16 h-16 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center text-2xl transition-colors shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Polub - przejdź do następnej strony"
          >
            ❤️
          </motion.button>
        </div>
        <p className="text-center text-foreground-400 mt-4 text-sm">
          Przesuń kartę w lewo (←) lub w prawo (→), aby przejść do poprzedniej/następnej strony w navbarze
        </p>
      </div>
    </div>
  )
}