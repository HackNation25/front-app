import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'
import { AttractionsList } from './AttractionsList'
import type { Poi } from '@/shared/types/poi.ts'

type DrawerView = 'list' | 'details'

interface MapDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  view: DrawerView
  onViewChange: (view: DrawerView) => void
  places: Array<Poi>
  place: Poi | null
  onPlaceSelect: (place: Poi) => void
}

const TAGS = ['Test1', 'Test2', 'Test3']

export function MapDrawer({
  isOpen,
  onClose,
  onOpen,
  view,
  onViewChange,
  places,
  place,
  onPlaceSelect,
}: MapDrawerProps) {
  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y > 150) {
      onClose()
      onViewChange('list')
    } else if (info.offset.y < -150) {
      onOpen()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Drawer */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.3 }}
        onDragEnd={handleDragEnd}
        initial={{ y: '70%' }}
        animate={{ y: isOpen ? 0 : '70%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-0 left-1/2 right-0 bg-white rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-w-[400px] min-w-[400px] -translate-x-1/2"
        style={{ willChange: 'transform' }}
      >
        {/* Drag handle */}
        <div className="py-3 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {view === 'list' ? (
            <AttractionsList places={places} onPlaceSelect={onPlaceSelect} />
          ) : place ? (
            <>
              {/* Hero image */}
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-24 aspect-video object-cover"
              />

              {/* Content */}
              <div className="p-6 pb-8">
                {/* Name */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {place.name}
                </h2>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Location & Distance */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Location</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Navigation className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">2km</span>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    About
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {place.longDescription}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-gray-500">Select an attraction</div>
          )}
        </div>
      </motion.div>
    </>
  )
}
