import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSlider } from '@/shared/hooks/use-slider'
import { useElementSize } from '@/shared/hooks/use-element-size'
import type { Place } from '@/shared/types/place'

// Przykładowe dane - w przyszłości mogą pochodzić z API
const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Kraków',
    image: 'https://images.unsplash.com/photo-1531590878845-12627191e687?w=400',
    location: 'Małopolska',
    description: 'Historyczne miasto z pięknym rynkiem',
  },
  {
    id: '2',
    name: 'Warszawa',
    image: 'https://images.unsplash.com/photo-1519473812332-b719bff50bd1?w=400',
    location: 'Mazowsze',
    description: 'Stolica Polski z bogatą historią',
  },
  {
    id: '3',
    name: 'Gdańsk',
    image: 'https://images.unsplash.com/photo-1605236453806-6e368a10a6b1?w=400',
    location: 'Pomorskie',
    description: 'Nadmorskie miasto z piękną starówką',
  },
  {
    id: '4',
    name: 'Wrocław',
    image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9e7?w=400',
    location: 'Dolnośląskie',
    description: 'Miasto mostów i krasnali',
  },
]

export function Recommendations() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width: containerWidth } = useElementSize(containerRef)

  const { currentIndex, next, previous, handleDragEnd, canGoNext, canGoPrevious } = useSlider({
    totalSlides: mockPlaces.length,
  })

  // Use percentage-based width for slides to prevent layout jumps
  // Calculate x offset: each slide is 90% width to show peek of next slide, no gap
  const slideWidthPx = containerWidth > 0 ? containerWidth * 0.9 : 0
  const x = containerWidth > 0 ? -currentIndex * slideWidthPx : 0

  // Calculate drag constraints: can drag from 0 to -(total slides - 1) * slideWidthPx
  const maxDrag = containerWidth > 0 ? -(mockPlaces.length - 1) * slideWidthPx : 0

  return (
    <section className="w-full py-6" aria-labelledby="recommendations-heading">
      <h2 id="recommendations-heading" className="text-2xl font-bold mb-4 text-center px-4">
        Rekomendacje
      </h2>
      <div
        ref={containerRef}
        className="relative overflow-hidden w-full"
        role="region"
        aria-label={`Slider rekomendacji, slajd ${currentIndex + 1} z ${mockPlaces.length}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <motion.div
          className="flex"
          animate={{
            x,
          }}
          drag="x"
          dragConstraints={containerWidth > 0 ? { left: maxDrag, right: 0 } : { left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          {mockPlaces.map((place) => (
            <div
              key={place.id}
              className="flex-shrink-0"
              style={{
                width: '90%',
                minWidth: '90%',
              }}
            >
              <div className="bg-white shadow-lg overflow-hidden aspect-square">
                <div className="relative w-full h-full">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">{place.name}</h3>
                    <p className="text-sm mb-2 opacity-90">{place.location}</p>
                    {place.description && (
                      <p className="text-xs opacity-75">{place.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="flex justify-end gap-2 mt-4 px-4" role="group" aria-label="Nawigacja slidera rekomendacji">
        <button
          onClick={previous}
          disabled={!canGoPrevious}
          aria-disabled={!canGoPrevious}
          aria-label={
            canGoPrevious
              ? `Przejdź do poprzedniego slajdu. Obecnie slajd ${currentIndex + 1} z ${mockPlaces.length}`
              : `Nie można przejść do poprzedniego slajdu. Obecnie slajd ${currentIndex + 1} z ${mockPlaces.length}`
          }
          className={`bg-white/80 rounded-full p-2 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            canGoPrevious
              ? 'hover:bg-white cursor-pointer opacity-100'
              : 'cursor-not-allowed opacity-40'
          }`}
        >
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </button>

        <button
          onClick={next}
          disabled={!canGoNext}
          aria-disabled={!canGoNext}
          aria-label={
            canGoNext
              ? `Przejdź do następnego slajdu. Obecnie slajd ${currentIndex + 1} z ${mockPlaces.length}`
              : `Nie można przejść do następnego slajdu. Obecnie slajd ${currentIndex + 1} z ${mockPlaces.length}`
          }
          className={`bg-white/80 rounded-full p-2 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            canGoNext
              ? 'hover:bg-white cursor-pointer opacity-100'
              : 'cursor-not-allowed opacity-40'
          }`}
        >
          <ChevronRight className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

