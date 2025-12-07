import { Drawer } from 'vaul'
import { MapPin, Navigation } from 'lucide-react'
import { AttractionsList } from './AttractionsList'

type DrawerView = 'list' | 'details'

interface MapDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  view: DrawerView
  onViewChange: (view: DrawerView) => void
  places: Array<{
    name: string
    image: string
    description: string
    tags: string[]
    location: string
    distance: string
  }>
  place: {
    name: string
    image: string
    description: string
    tags: string[]
    location: string
    distance: string
  } | null
  onPlaceSelect: (place: {
    name: string
    image: string
    description: string
    tags: string[]
    location: string
    distance: string
  }) => void
}

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
  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          onViewChange('list')
        } else {
          onOpen()
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] min-h-[30%] max-h-[79%] mt-24 fixed bottom-0 left-0 right-0 z-50 max-w-[400px] mx-auto">
          <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto relative">
            {/* Drag Handle */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />

            {/* Scrollable content */}
            {view === 'list' ? (
              <AttractionsList places={places} onPlaceSelect={onPlaceSelect} />
            ) : place ? (
              <>
                {/* Hero image */}
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-24 aspect-video object-cover mb-4 rounded-lg"
                />

                {/* Content */}
                <div className="pb-8">
                  {/* Name */}
                  <Drawer.Title className="text-2xl font-bold text-gray-900 mb-4">
                    {place.name}
                  </Drawer.Title>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {place.tags.map((tag) => (
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
                      <span className="text-sm">{place.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Navigation className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {place.distance}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      About
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {place.description}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-gray-500">Select an attraction</div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
