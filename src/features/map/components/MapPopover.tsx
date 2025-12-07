import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'
import type { Poi } from '@/shared/types/poi.ts'

interface MapPopoverProps {
  place: Poi | null
  onShowMore: () => void
  onClose: () => void
}

export function MapPopover({ place, onShowMore, onClose }: MapPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && place) {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        place
      ) {
        // Sprawdź czy kliknięcie nie było na markerze
        const target = e.target as HTMLElement
        if (!target.closest('.leaflet-marker-icon')) {
          onClose()
        }
      }
    }

    if (place) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [place, onClose])

  if (!place) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={popoverRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto max-w-[calc(100%-2rem)] w-full max-w-md px-4"
      >
        {/* Floating card content */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Zamknij"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Image */}
          {place.imageUrl && (
            <div className="w-full h-[120px] overflow-hidden">
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1 pr-6">
              {place.name}
            </h3>
            {place.longDescription && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {place.longDescription}
              </p>
            )}

            {/* Show more button */}
            <button
              onClick={onShowMore}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm"
              style={{
                backgroundColor: 'rgba(33, 150, 243, 1)', // primary-500
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30, 136, 229, 1)' // primary-600
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 1)' // primary-500
              }}
            >
              Pokaż więcej
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
