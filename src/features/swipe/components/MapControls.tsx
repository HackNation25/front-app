import { useState } from 'react'
import { ZoomIn, ZoomOut, Locate } from 'lucide-react'
import { useMap } from 'react-leaflet'

export function MapControls() {
  const map = useMap()
  const [isLocating, setIsLocating] = useState(false)

  // Handle geolocation events
  map.on('locationfound', () => setIsLocating(false))
  map.on('locationerror', () => {
    setIsLocating(false)
    alert('Geolokalizacja niedostępna')
  })

  return (
    <>
      {/* Control buttons */}
      <div className="absolute top-[86px] right-4 z-[1000] flex flex-col gap-2">
        {/* Zoom In */}
        <button
          onClick={() => map.zoomIn()}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => map.zoomOut()}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>

        {/* User Location */}
        <button
          onClick={() => {
            setIsLocating(true)
            map.locate({ setView: true, maxZoom: 14 })
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="My location"
        >
          <Locate
            className={`w-5 h-5 text-gray-700 ${isLocating ? 'animate-pulse' : ''}`}
          />
        </button>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
        © CARTO
      </div>
    </>
  )
}
