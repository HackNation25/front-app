import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { List } from 'lucide-react'
import { PLACES_DATA } from '@/features/swipe/data'
import { MapControls } from '@/features/swipe/components/MapControls'
import { createMinimalistMarker } from '@/features/swipe/components/MapMarker'
import { MapDrawer } from '@/features/map/components/MapDrawer.tsx'

type DrawerView = 'list' | 'details'

export const Route = createFileRoute('/map')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof PLACES_DATA)[number] | null
  >(null)
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false)
  const [drawerView, setDrawerView] = useState<DrawerView>('list')
  const [rightOffset, setRightOffset] = useState(() => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0
    if (viewportWidth >= 500) {
      const offset = (viewportWidth - 500) / 2 + 16
      return `${offset}px`
    }
    return '1rem'
  })

  useEffect(() => {
    const updateOffset = () => {
      const viewportWidth = window.innerWidth
      if (viewportWidth >= 500) {
        const offset = (viewportWidth - 500) / 2 + 16
        setRightOffset(`${offset}px`)
      } else {
        setRightOffset('1rem')
      }
    }

    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [])

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
        places={PLACES_DATA}
        onPlaceSelect={(place) => {
          // Find the full place object with coords from PLACES_DATA
          const fullPlace = PLACES_DATA.find((p) => p.name === place.name)
          if (fullPlace) {
            setSelectedPlace(fullPlace)
            setDrawerView('details')
            setIsDrawerExpanded(true)
          }
        }}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setDrawerView('list')
          setIsDrawerExpanded(true)
        }}
        className="fixed bottom-[64px] sm:bottom-[80px] z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center w-14 h-14"
        style={{ right: rightOffset }}
        aria-label="Otwórz listę miejsc"
      >
        <List className="w-6 h-6" />
      </button>
    </div>
  )
}
