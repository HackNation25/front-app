import { Drawer } from 'vaul'
import { MapPin, Navigation, X } from 'lucide-react'

type CardData = {
  poiId: string
  name: string
  image: string
  description: string
  tags: string[]
  location: string
  distance: string
}

interface PlaceDrawerProps {
  isOpen: boolean
  onClose: () => void
  place: CardData | null
}

export function PlaceDrawer({ isOpen, onClose, place }: PlaceDrawerProps) {
  if (!place) return null

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50 max-w-[500px] mx-auto">
          <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Drag Handle */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />

            {/* Hero Image */}
            <div className="w-full h-64 mb-4 rounded-lg overflow-hidden mt-8">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <Drawer.Title className="text-2xl font-bold text-gray-900 mb-4">
              {place.name}
            </Drawer.Title>

            {/* Tags Section */}
            {place.tags && place.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {place.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-600 text-primary-50 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Location & Distance Section */}
            <div className="flex flex-col gap-2 mb-4">
              {place.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{place.location}</span>
                </div>
              )}
              {place.distance && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Navigation className="w-4 h-4" />
                  <span className="text-sm">{place.distance}</span>
                </div>
              )}
            </div>

            {/* Description Section */}
            {place.description && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Opis
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {place.description}
                </p>
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
