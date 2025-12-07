import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapControls } from '@/features/swipe/components/MapControls'
import { createMinimalistMarker } from '@/features/swipe/components/MapMarker'
import { MapDrawer } from '@/features/map/components/MapDrawer.tsx'
import { $api } from '@/shared/api/client.ts'
import type { Poi } from '@/shared/types/poi.ts'

type DrawerView = 'list' | 'details'

export const Route = createFileRoute('/map')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedPlace, setSelectedPlace] = useState<Poi | null>(null)
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false)
  const [drawerView, setDrawerView] = useState<DrawerView>('list')

  const { data: poi } = $api.useQuery('get', '/poi')

  return (
    <div className="h-screen w-full relative bg-white">
      <style>{`
        .minimalist-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      <MapContainer
        center={[53.1235895, 18.00201924]}
        zoom={15}
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CARTO"
          subdomains="abcd"
          maxZoom={20}
        />

        <MapControls />

        {poi?.map((place) => (
          <Marker
            key={place.name}
            position={[place.locationX, place.locationY]}
            icon={createMinimalistMarker(selectedPlace?.name === place.name)}
            eventHandlers={{
              click: () => {
                setSelectedPlace(place as any)
                setDrawerView('details')
                setIsDrawerExpanded(true)
              },
            }}
          />
        ))}
      </MapContainer>

      <MapDrawer
        place={selectedPlace}
        isOpen={isDrawerExpanded}
        onClose={() => setIsDrawerExpanded(false)}
        onOpen={() => setIsDrawerExpanded(true)}
        view={drawerView}
        onViewChange={setDrawerView}
        places={poi as any}
        onPlaceSelect={(place) => {
          setSelectedPlace(place)
          setDrawerView('details')
          setIsDrawerExpanded(true)
        }}
      />
    </div>
  )
}
