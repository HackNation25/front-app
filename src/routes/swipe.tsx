import { createFileRoute } from '@tanstack/react-router'
import { SwipeableCard } from '@/features/swipe/components/SwipeableCard'
import { ActionButtons } from '@/features/swipe/components/ActionButtons'
import { PLACES_DATA } from '@/features/swipe/data.ts'
import { useState } from 'react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/swipe')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedPlaces, setLikedPlaces] = useState<typeof PLACES_DATA>([])
  const [dislikedPlaces, setDislikedPlaces] = useState<typeof PLACES_DATA>([])
  const [triggerSwipe, setTriggerSwipe] = useState<'left' | 'right' | null>(
    null
  )

  const currentCard = PLACES_DATA[currentIndex]
  const hasMoreCards = currentIndex < PLACES_DATA.length

  const handleSwipeLeft = () => {
    if (!currentCard) return
    setDislikedPlaces((prev) => [...prev, currentCard])
  }

  const handleSwipeRight = () => {
    if (!currentCard) return
    setLikedPlaces((prev) => [...prev, currentCard])
  }

  const handleSwipeComplete = () => {
    setCurrentIndex((prev) => prev + 1)
    setTriggerSwipe(null)
  }

  const onDislike = () => {
    setTriggerSwipe('left')
  }

  const onLike = () => {
    setTriggerSwipe('right')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 w-[95%]">
        <div className="relative w-full max-w-md h-[600px]">
          {!hasMoreCards ? (
            <div className="flex items-center justify-center h-full text-2xl font-bold text-gray-600">
              No more places! 🎉
            </div>
          ) : (
            <>
              {[0, 1].map((offset) => {
                const index = currentIndex + offset
                const card = PLACES_DATA[index]
                if (!card) return null

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    style={{ zIndex: 20 - offset * 10 }}
                    animate={{
                      scale: offset === 0 ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <SwipeableCard
                      {...card}
                      stackPosition={offset}
                      isDraggable={offset === 0}
                      onSwipeLeft={handleSwipeLeft}
                      onSwipeRight={handleSwipeRight}
                      onSwipeComplete={handleSwipeComplete}
                      triggerSwipe={offset === 0 ? triggerSwipe : null}
                    />
                  </motion.div>
                )
              })}
            </>
          )}
        </div>

        {hasMoreCards && (
          <ActionButtons
            onDislike={onDislike}
            onLike={onLike}
            onInfo={() => console.log('Info clicked', currentCard)}
          />
        )}
      </div>
    </div>
  )
}
