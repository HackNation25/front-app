import { Drawer } from 'vaul'
import { AttractionsList } from './AttractionsList'
import type { Poi } from '@/shared/types/poi.ts'
import { PlaceDrawer } from '@/features/swipe/components/drawer-vaul'

type DrawerView = 'list' | 'details'

interface MapDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  view: DrawerView
  onViewChange: (view: DrawerView) => void
  places: Array<Poi> | undefined
  place: Poi | null
  onPlaceSelect: (place: Poi) => void
  onShowAll?: () => void
  onShowOnMap?: (poiId: string) => void
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
  onShowAll,
  onShowOnMap,
}: MapDrawerProps) {
  // Convert Poi to CardData format for PlaceDrawer
  const placeCardData = place
    ? {
        poiId: place.uuid,
        name: place.name,
        image: place.imageUrl,
        description: place.longDescription || place.shortDescription || '',
        tags: [] as Array<string>,
        location:
          place.locationX && place.locationY
            ? `${place.locationX}, ${place.locationY}`
            : '',
        distance: '',
      }
    : null

  return (
    <>
      {/* List View */}
      {view === 'list' && (
        <Drawer.Root
          open={isOpen}
          snapPoints={[30, 80]}
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
            <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 z-50 max-w-[400px] mx-auto">
              <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto relative">
                {/* Drag Handle */}
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />
                <AttractionsList
                  places={places}
                  onPlaceSelect={onPlaceSelect}
                />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}

      {/* Details View - using PlaceDrawer */}
      {view === 'details' && (
        <PlaceDrawer
          isOpen={isOpen}
          onClose={() => {
            onClose()
            onViewChange('list')
          }}
          place={placeCardData}
          onShowAll={onShowAll}
          onShowOnMap={onShowOnMap}
        />
      )}
    </>
  )
}
