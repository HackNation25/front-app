import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import type { Place } from '@/shared/types/place'

interface RecommendationCardProps {
  place: Place
  index: number
  currentIndex: number
}

export function RecommendationCard({
  place,
  index,
  currentIndex,
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
          <div className="flex items-start gap-3 mb-3">
            <MapPin
              className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-2xl font-bold mb-1">{place.name}</h3>
              <p className="text-sm text-foreground-200 font-medium">{place.location}</p>
            </div>
          </div>
          {place.description && (
            <p className="text-sm text-foreground-200 leading-relaxed">{place.description}</p>
          )}
        </div>
      </div>
    </motion.article>
  )
}

