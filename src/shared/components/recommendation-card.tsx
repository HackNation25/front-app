import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import type { Place } from '@/shared/types/place'

interface RecommendationCardProps {
  place: Place
  index: number
  currentIndex: number
  onShowOnMap?: () => void
  onGoToSwipe?: () => void
}

export function RecommendationCard({
  place,
  index,
  currentIndex,
  onShowOnMap,
  onGoToSwipe,
}: RecommendationCardProps) {
  const isVisible = Math.abs(index - currentIndex) <= 1

  return (
    <motion.article
      className="flex-shrink-0"
      style={{
        width: '90%',
        minWidth: '90%',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={
        isVisible
          ? {
              opacity: 1,
              y: 0,
            }
          : {
              opacity: 0.3,
              y: 0,
            }
      }
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      whileHover={{ y: -4 }}
      aria-label={`Rekomendacja: ${place.name} w ${place.location}${place.category ? `, kategoria: ${place.category}` : ''}`}
    >
      <div className="relative bg-white rounded-lg overflow-hidden aspect-square shadow-lg cursor-grab active:cursor-grabbing">
        {/* Image Background */}
        {place.image && (
          <img
            src={place.image}
            alt={`${place.name} - ${place.description || place.location}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

        {/* Category Tag */}
        {place.category && (
          <div className="absolute top-4 right-4 z-10">
            <span
              className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground-800 shadow-md"
              aria-label={`Kategoria: ${place.category}`}
            >
              {place.category}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-3">
            <h3 className="text-2xl font-bold mb-1">{place.name}</h3>
            {onShowOnMap ? (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onShowOnMap()
                  }}
                  className="text-sm text-primary-300 font-medium hover:text-primary-200 transition-colors flex items-center gap-1 underline"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Pokaż na mapie</span>
                </button>
                {onGoToSwipe && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onGoToSwipe()
                    }}
                    className="text-sm text-primary-300 font-medium hover:text-primary-200 transition-colors"
                  >
                    Przejdź do wyboru
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-foreground-200 font-medium">
                {place.location}
              </p>
            )}
          </div>
          {place.description && (
            <p className="text-sm text-foreground-200 leading-relaxed">
              {place.description}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  )
}
