import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { PlaceCard } from './PlaceCard'
import { useState, useEffect } from 'react'

interface SwipeableCardProps {
  name: string
  image: string
  description: string
  tags: string[]
  location: string
  distance: string
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSwipeComplete: () => void
  triggerSwipe?: 'left' | 'right' | null
  stackPosition?: number
  isDraggable: boolean
}

const SWIPE_THRESHOLD = 100

export function SwipeableCard({
  name,
  image,
  description,
  tags,
  location,
  distance,
  onSwipeLeft,
  onSwipeRight,
  onSwipeComplete,
  triggerSwipe,
  stackPosition,
  isDraggable,
}: SwipeableCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 0, 1, 0])
  const [exitX, setExitX] = useState(0)

  useEffect(() => {
    if (triggerSwipe === 'left') {
      setExitX(-500)
      onSwipeLeft()
    } else if (triggerSwipe === 'right') {
      setExitX(500)
      onSwipeRight()
    }
  }, [triggerSwipe, onSwipeLeft, onSwipeRight])

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      setExitX(500)
      onSwipeRight()
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      setExitX(-500)
      onSwipeLeft()
    }
  }

  return (
    <motion.div
      style={{
        x,
        rotate,
        cursor: 'grab',
      }}
      drag={isDraggable ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      animate={
        exitX !== 0
          ? { x: exitX, opacity: 0, transition: { duration: 0.3 } }
          : { x: 0, opacity: 1 }
      }
      onAnimationComplete={() => {
        if (exitX !== 0) {
          onSwipeComplete()
        }
      }}
      className="absolute w-full"
    >
      <div className="relative w-full">
        {stackPosition === 1 && (
          <div className="absolute inset-0 rounded-3xl z-10 bg-black/30" />
        )}
        <PlaceCard
          name={name}
          image={image}
          description={description}
          tags={tags}
          location={location}
          distance={distance}
        />

        {/* Like Overlay */}
        <motion.div
          style={{ opacity }}
          className="absolute top-8 left-8 px-6 py-3 border-4 border-green-500 text-green-500 font-bold text-3xl rounded-xl rotate-[-20deg] pointer-events-none"
        >
          LIKE
        </motion.div>

        {/* Nope Overlay */}
        <motion.div
          style={{
            opacity: useTransform(
              x,
              [-200, -100, 0, 100, 200],
              [1, 1, 0, 0, 0]
            ),
          }}
          className="absolute top-8 right-8 px-6 py-3 border-4 border-red-500 text-red-500 font-bold text-3xl rounded-xl rotate-[20deg] pointer-events-none"
        >
          NOPE
        </motion.div>
      </div>
    </motion.div>
  )
}
