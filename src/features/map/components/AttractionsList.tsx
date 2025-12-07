interface AttractionsListProps {
  places: Array<{
    name: string
    image: string
    description: string
    tags: string[]
    location: string
    distance: string
  }>
  onPlaceSelect: (
    place: {
      name: string
      image: string
      description: string
      tags: string[]
      location: string
      distance: string
    }
  ) => void
}

export function AttractionsList({
  places,
  onPlaceSelect,
}: AttractionsListProps) {
  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Attractions</h2>
      {places.map((place) => (
        <div
          key={place.name}
          onClick={() => onPlaceSelect(place)}
          className="flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <img
            src={place.image}
            alt={place.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex flex-col justify-center min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {place.name}
            </h3>
            <span className="text-sm text-gray-600">{place.distance}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
