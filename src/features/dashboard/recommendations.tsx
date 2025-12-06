import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSlider } from '@/shared/hooks/use-slider'
import { useElementSize } from '@/shared/hooks/use-element-size'
import { RecommendationCard } from '@/shared/components/recommendation-card'
import type { Place } from '@/shared/types/place'

// Przykładowe dane - miejsca warte odwiedzenia w Bydgoszczy
// W przyszłości będą filtrowane na podstawie wybranych kategorii z profile/settings
const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Muzeum Okręgowe im. Leona Wyczółkowskiego',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Największe muzeum w Bydgoszczy z bogatą kolekcją sztuki i eksponatów historycznych',
    category: 'Muzea',
  },
  {
    id: '2',
    name: 'Wyspa Młyńska',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Malownicza wyspa na Brdzie z zabytkowymi spichrzami i nowoczesnymi obiektami kulturalnymi',
    category: 'Zabytki',
  },
  {
    id: '3',
    name: 'Mural "Przechodzenie przez rzekę"',
    image:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Jeden z najsłynniejszych murali w Bydgoszczy przedstawiający postacie przechodzące przez rzekę',
    category: 'Murale',
  },
  {
    id: '4',
    name: 'Katedra św. Marcina i Mikołaja',
    image:
      'https://images.unsplash.com/photo-1519491050547-6ba5f34e834f?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Główna świątynia Bydgoszczy, gotycka katedra z XIV wieku o bogatej historii',
    category: 'Kościoły',
  },
  {
    id: '5',
    name: 'Park im. Kazimierza Wielkiego',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Najstarszy park miejski w Bydgoszczy, idealne miejsce na spacer i odpoczynek',
    category: 'Parki',
  },
  {
    id: '6',
    name: 'Most Jerzego Sulimy-Kamińskiego',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Charakterystyczny most nad Brdą łączący Stare Miasto z Wyspą Młyńską',
    category: 'Mosty',
  },
  {
    id: '7',
    name: 'Fontanna "Potop"',
    image:
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Imponująca fontanna na Starym Rynku przedstawiająca scenę biblijną',
    category: 'Fontanny',
  },
  {
    id: '8',
    name: 'Stary Rynek',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Główny plac miasta z zabytkowymi kamienicami i fontanną "Potop"',
    category: 'Place',
  },
]

export function Recommendations() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width: containerWidth } = useElementSize(containerRef)

  const {
    currentIndex,
    next,
    previous,
    handleDragEnd,
    canGoNext,
    canGoPrevious,
  } = useSlider({
    totalSlides: mockPlaces.length,
  })

  // Use percentage-based width for slides to prevent layout jumps
  // Calculate x offset: each slide is 90% width to show peek of next slide, no gap
  const slideWidthPx = containerWidth > 0 ? containerWidth * 0.9 : 0
  const x = containerWidth > 0 ? -currentIndex * slideWidthPx : 0

  // Calculate drag constraints: can drag from 0 to -(total slides - 1) * slideWidthPx
  const maxDrag =
    containerWidth > 0 ? -(mockPlaces.length - 1) * slideWidthPx : 0

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
          dragConstraints={
            containerWidth > 0
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
          {mockPlaces.map((place, index) => (
            <RecommendationCard
              key={place.id}
              place={place}
              index={index}
              currentIndex={currentIndex}
            />
          ))}
        </motion.div>
      </div>
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
              ? `Przejdź do poprzedniego slajdu. Obecnie slajd ${currentIndex + 1} z ${mockPlaces.length}`
              : `Nie można przejść do poprzedniego slajdu. Obecnie slajd ${currentIndex + 1} z ${mockPlaces.length}`
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
              ? `Przejdź do następnego slajdu. Obecnie slajd ${currentIndex + 1} z ${mockPlaces.length}`
              : `Nie można przejść do następnego slajdu. Obecnie slajd ${currentIndex + 1} z ${mockPlaces.length}`
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
    </section>
  )
}
