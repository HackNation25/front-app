import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { $api } from '@/shared/api/client'

export const Route = createFileRoute('/places')({
  component: RouteComponent,
})

type SortOption = 'default' | 'popular' | 'newest' | 'name'

function RouteComponent() {
  const [sortOption, setSortOption] = useState<SortOption>('default')

  // Fetch POIs from API
  const { data: pois, isLoading, error } = $api.useQuery('get', '/poi', {})

  const sortedPlaces = useMemo(() => {
    if (!pois) return []

    const sorted = [...pois]
    switch (sortOption) {
      case 'popular':
        sorted.sort((a, b) => b.popularity - a.popularity)
        break
      case 'newest':
        sorted.sort((a, b) => b.uuid.localeCompare(a.uuid))
        break
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order
        break
    }

    return sorted
  }, [pois, sortOption])

  if (isLoading) {
    return (
      <div className="min-h-screen text-foreground-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground-200 border-t-primary-600 mx-auto mb-4" />
          <p className="text-foreground-400">Ładowanie miejsc...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen text-foreground-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">
            Błąd podczas ładowania miejsc
          </p>
          <p className="text-foreground-400 text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-foreground-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-accent-800">
            Wszystkie miejsca
          </h1>
          <p className="text-foreground-400">
            Odkryj miejsca warte odwiedzenia w Bydgoszczy i okolicy
          </p>
        </div>
        <div className="mb-6 flex gap-4 flex-wrap">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 bg-foreground-800 rounded-lg text-foreground-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="default">Sortuj</option>
            <option value="popular">Najpopularniejsze</option>
            <option value="newest">Najnowsze</option>
            <option value="name">Nazwa A-Z</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPlaces.map((poi) => (
            <div
              key={poi.uuid}
              className="bg-foreground-800 rounded-lg overflow-hidden hover:bg-foreground-700 transition-colors shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={poi.imageUrl}
                  alt={poi.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{poi.name}</h3>
                  <span className="text-xs bg-primary-600 px-2 py-1 rounded whitespace-nowrap ml-2">
                    Popularność: {poi.popularity}
                  </span>
                </div>
                {(poi.locationX != null || poi.locationY != null) && (
                  <p className="text-foreground-400 text-sm mb-2">
                    📍 Lokalizacja:{' '}
                    {typeof poi.locationX === 'number'
                      ? poi.locationX.toFixed(4)
                      : (poi.locationX ?? 'N/A')}
                    ,{' '}
                    {typeof poi.locationY === 'number'
                      ? poi.locationY.toFixed(4)
                      : (poi.locationY ?? 'N/A')}
                  </p>
                )}
                {poi.shortDescription && (
                  <p className="text-foreground-200 text-sm mb-2">
                    {poi.shortDescription}
                  </p>
                )}
                {poi.longDescription && (
                  <p className="text-foreground-300 text-xs mb-3 line-clamp-2">
                    {poi.longDescription}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {sortedPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground-400 text-lg">
              Brak miejsc do wyświetlenia
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
