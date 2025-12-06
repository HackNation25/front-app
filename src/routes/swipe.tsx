import { createFileRoute } from '@tanstack/react-router'
import { SwipeableCard } from '@/features/swipe/components/SwipeableCard'
import { ActionButtons } from '@/features/swipe/components/ActionButtons'
import { PLACES_DATA } from '@/features/swipe/data.ts'
import { useState } from 'react'

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
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="relative w-full max-w-md h-[600px]">
          {!hasMoreCards ? (
            <div className="flex items-center justify-center h-full text-2xl font-bold text-gray-600">
              No more places! 🎉
            </div>
          ) : (
            <>
              {/* Stack effect - show next cards behind */}
              {PLACES_DATA[currentIndex + 1] && (
                <div
                  className="absolute top-2 left-2 right-2 opacity-50 scale-95"
                  style={{ zIndex: 0 }}
                >
                  <div className="w-full h-[600px] bg-white rounded-3xl shadow-xl" />
                </div>
              )}
              {PLACES_DATA[currentIndex + 2] && (
                <div
                  className="absolute top-4 left-4 right-4 opacity-30 scale-90"
                  style={{ zIndex: -1 }}
                >
                  <div className="w-full h-[600px] bg-white rounded-3xl shadow-xl" />
                </div>
              )}

              {/* Current card */}
              <SwipeableCard
                key={currentCard.name}
                {...currentCard}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSwipeComplete={handleSwipeComplete}
                triggerSwipe={triggerSwipe}
              />
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
