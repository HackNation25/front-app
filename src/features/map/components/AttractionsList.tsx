import type { Poi } from '@/shared/types/poi.ts'

interface AttractionsListProps {
  places: (Poi & { isUserPoi?: boolean })[] | undefined
  onPlaceSelect: (place: Poi) => void
}

export function AttractionsList({
  places,
  onPlaceSelect,
}: AttractionsListProps) {
  console.log({ places })

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Attractions</h2>
      {places?.map((place) => (
        <div
          key={place.uuid || place.name}
          onClick={() => onPlaceSelect(place)}
          className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            place.isUserPoi
              ? 'border-2'
              : 'bg-gray-200 hover:bg-gray-300 border-2 border-transparent'
          }`}
          style={
            place.isUserPoi
              ? {
                  borderColor: '#f44336', // accent-500 (red) - same as marker
                  backgroundColor: '#ffebee', // accent-50 - very light red, almost white
                }
              : undefined
          }
          onMouseEnter={(e) => {
            if (place.isUserPoi) {
              e.currentTarget.style.backgroundColor = '#ffcdd2' // accent-100 - slightly darker on hover
            }
          }}
          onMouseLeave={(e) => {
            if (place.isUserPoi) {
              e.currentTarget.style.backgroundColor = '#ffebee' // accent-50 - back to very light
            }
          }}
        >
          <img
            src={String(place.imageUrl)}
            alt={place.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex flex-col justify-center min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{place.name}</h3>
            <span className="text-sm text-gray-600">{place.popularity}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
