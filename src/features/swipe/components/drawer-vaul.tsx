import { Drawer } from 'vaul'
import { MapPin, Navigation, X, List, Route as RouteIcon } from 'lucide-react'
import type { Poi } from '@/shared/types/poi.ts'
import { openGoogleMapsRoute } from '@/shared/utils/google-maps-route'

type CardData = {
  poiId: string
  name: string
  image: string
  description: string
  tags: string[]
  location: string
  distance: string
  isUserPoi?: boolean
}

interface PlaceDrawerProps {
  isOpen: boolean
  onClose: () => void
  place: CardData | null
  places?: CardData[] | null
  onPlaceSelect?: (place: CardData) => void
  onShowAll?: () => void
  onShowOnMap?: (poiId: string) => void
  userPoi?: Poi[] | null
}

export function PlaceDrawer({
  isOpen,
  onClose,
  place,
  places,
  onPlaceSelect,
  onShowAll,
  onShowOnMap,
  userPoi,
}: PlaceDrawerProps) {
  // Show list if places array is provided, otherwise show single place details
  const showList = places && places.length > 0

  if (!place && !showList) return null

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

            {showList ? (
              /* List View */
              <div className="mt-4">
                <Drawer.Title className="text-2xl font-bold text-gray-900 mb-4">
                  Miejsca
                </Drawer.Title>
                {/* Google Maps Route Button - only show if user has POIs */}
                {userPoi && Array.isArray(userPoi) && userPoi.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        openGoogleMapsRoute(userPoi)
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                    >
                      <RouteIcon className="w-4 h-4" />
                      Otwórz trasę w Google Maps
                    </button>
                  </div>
                )}
                <div className="space-y-2">
                  {places?.map((placeItem) => (
                    <div
                      key={placeItem.poiId}
                      onClick={() => {
                        if (onPlaceSelect) {
                          onPlaceSelect(placeItem)
                        }
                      }}
                      className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        placeItem.isUserPoi
                          ? 'border-2'
                          : 'bg-gray-200 hover:bg-gray-300 border-2 border-transparent'
                      }`}
                      style={
                        placeItem.isUserPoi
                          ? {
                              borderColor: '#f44336', // accent-500 (red) - same as marker
                              backgroundColor: '#ffebee', // accent-50 - very light red, almost white
                            }
                          : undefined
                      }
                      onMouseEnter={(e) => {
                        if (placeItem.isUserPoi) {
                          e.currentTarget.style.backgroundColor = '#ffcdd2' // accent-100 - slightly darker on hover
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (placeItem.isUserPoi) {
                          e.currentTarget.style.backgroundColor = '#ffebee' // accent-50 - back to very light
                        }
                      }}
                    >
                      <img
                        src={placeItem.image}
                        alt={placeItem.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col justify-center min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {placeItem.name}
                        </h3>
                        {placeItem.location && (
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {placeItem.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Details View */
              place && (
                <>
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
                      <div className="flex items-center gap-2">
                        {onShowOnMap ? (
                          <button
                            onClick={() => {
                              if (onShowOnMap && place.poiId) {
                                onShowOnMap(place.poiId)
                                onClose()
                              }
                            }}
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium underline"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>Pokaż na mapie</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{place.location}</span>
                          </div>
                        )}
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

                  {/* Show All Button */}
                  {onShowAll && (
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          onClose()
                          onShowAll()
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors font-medium text-sm"
                        style={{
                          backgroundColor: 'rgba(33, 150, 243, 1)', // primary-500
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'rgba(30, 136, 229, 1)' // primary-600
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'rgba(33, 150, 243, 1)' // primary-500
                        }}
                      >
                        <List className="w-4 h-4" />
                        Pokaż wszystkie
                      </button>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
