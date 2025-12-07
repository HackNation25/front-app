import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSlider } from '@/shared/hooks/use-slider'
import { useElementSize } from '@/shared/hooks/use-element-size'
import { RecommendationCard } from '@/shared/components/recommendation-card'
import type { Place } from '@/shared/types/place'
import { useUserSessionContext } from '@/shared/contexts/user-session-context'
import { $api } from '@/shared/api/client'

export function Recommendations() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width: containerWidth } = useElementSize(containerRef)
  const { userId } = useUserSessionContext()

  // Fetch recommendations from API (same as swipe route)
  const { data: recommendations, isLoading } = $api.useQuery(
    'get',
    '/recommendation',
    {
      params: {
        query: {
          userId: userId || '',
          limit: 10, // Limit to 10 for homepage
        },
      },
    },
    {
      enabled: !!userId,
    }
  )

  // Map API response to Place format
  const places: Place[] =
    recommendations?.map((poi) => ({
      id: poi.uuid,
      name: poi.name,
      image: poi.imageUrl,
      location:
        poi.locationX && poi.locationY
          ? `${poi.locationX}, ${poi.locationY}`
          : 'Bydgoszcz',
      description: poi.shortDescription || poi.longDescription || '',
      category: undefined, // Category not available in API response
    })) || []

  const {
    currentIndex,
    next,
    previous,
    handleDragEnd,
    canGoNext,
    canGoPrevious,
  } = useSlider({
    totalSlides: places.length || 0,
  })

  // Use percentage-based width for slides to prevent layout jumps
  // Calculate x offset: each slide is 90% width to show peek of next slide, no gap
  const slideWidthPx = containerWidth > 0 ? containerWidth * 0.9 : 0
  const x =
    containerWidth > 0 && places.length > 0 ? -currentIndex * slideWidthPx : 0

  // Calculate drag constraints: can drag from 0 to -(total slides - 1) * slideWidthPx
  const maxDrag =
    containerWidth > 0 && places.length > 0
      ? -(places.length - 1) * slideWidthPx
      : 0

  return (
    <section className="w-full py-6" aria-labelledby="recommendations-heading">
      <h2
        id="recommendations-heading"
        className="text-2xl font-bold mb-6 px-4 text-accent-800"
      >
        Sprawdź coś nowego
      </h2>
      <div
        ref={containerRef}
        className="relative overflow-x-hidden overflow-y-visible w-full py-4"
        role="region"
        aria-label={`Slider rekomendacji, slajd ${currentIndex + 1} z ${places.length}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <motion.div
          className="flex"
          animate={{
            x,
          }}
          drag="x"
          dragConstraints={
            containerWidth > 0 && places.length > 0
              ? { left: maxDrag, right: 0 }
              : { left: 0, right: 0 }
          }
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
            </div>
          ) : places.length === 0 ? (
            <div className="flex items-center justify-center w-full h-64 text-gray-500">
              Brak rekomendacji
            </div>
          ) : (
            places.map((place, index) => (
              <RecommendationCard
                key={place.id}
                place={place}
                index={index}
                currentIndex={currentIndex}
              />
            ))
          )}
        </motion.div>
      </div>
      {places.length > 0 && (
        <div
          className="flex justify-end gap-3 mt-6 px-4"
          role="group"
          aria-label="Nawigacja slidera rekomendacji"
        >
          <button
            onClick={previous}
            disabled={!canGoPrevious}
            aria-disabled={!canGoPrevious}
            aria-label={
              canGoPrevious
                ? `Przejdź do poprzedniego slajdu. Obecnie slajd ${currentIndex + 1} z ${places.length}`
                : `Nie można przejść do poprzedniego slajdu. Obecnie slajd ${currentIndex + 1} z ${places.length}`
            }
            className={`rounded-full p-3 shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              canGoPrevious
                ? 'bg-primary-500 hover:bg-primary-600 cursor-pointer opacity-100 hover:scale-110 active:scale-95'
                : 'bg-foreground-600 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-white" aria-hidden="true" />
          </button>

          <button
            onClick={next}
            disabled={!canGoNext}
            aria-disabled={!canGoNext}
            aria-label={
              canGoNext
                ? `Przejdź do następnego slajdu. Obecnie slajd ${currentIndex + 1} z ${places.length}`
                : `Nie można przejść do następnego slajdu. Obecnie slajd ${currentIndex + 1} z ${places.length}`
            }
            className={`rounded-full p-3 shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              canGoNext
                ? 'bg-primary-500 hover:bg-primary-600 cursor-pointer opacity-100 hover:scale-110 active:scale-95'
                : 'bg-foreground-600 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronRight className="w-6 h-6 text-white" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}
