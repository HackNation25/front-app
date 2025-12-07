import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { PLACES_DATA } from '@/features/swipe/data'
import { PlaceDrawer } from '@/features/swipe/components/PlaceDrawer'
import { MapControls } from '@/features/swipe/components/MapControls'
import { createMinimalistMarker } from '@/features/swipe/components/MapMarker'

export const Route = createFileRoute('/map')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof PLACES_DATA)[number] | null
  >(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="h-screen w-full relative bg-white">
      <style>{`
        .minimalist-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      <MapContainer
        center={[52.2297, 21.0122]}
        zoom={13}
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

        {PLACES_DATA.map((place) => (
          <Marker
            key={place.name}
            position={[place.coords.lat, place.coords.lng]}
            icon={createMinimalistMarker(selectedPlace?.name === place.name)}
            eventHandlers={{
              click: () => {
                setSelectedPlace(place)
                setIsDrawerOpen(true)
              },
            }}
          />
        ))}
      </MapContainer>

      <PlaceDrawer
        place={selectedPlace}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}
