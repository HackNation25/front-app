import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { $api, fetchClient } from '@/shared/api/client'
import { MapPin, Route as RouteIcon } from 'lucide-react'
import { useUserSessionContext } from '@/shared/contexts/user-session-context'
import { useQueries } from '@tanstack/react-query'
import type { Poi } from '@/shared/types/poi.ts'
import { openGoogleMapsRoute } from '@/shared/utils/google-maps-route'

export const Route = createFileRoute('/places')({
  component: RouteComponent,
})

type SortOption = 'default' | 'popular' | 'newest' | 'name'

function RouteComponent() {
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const { userId } = useUserSessionContext()
  const navigate = useNavigate()

  // Fetch POIs from API
  const { data: pois, isLoading, error } = $api.useQuery('get', '/poi', {})

  // Fetch user decisions to get POI UUIDs
  const { data: userDecisions } = $api.useQuery(
    'get',
    '/poi-decision/user/{userProfileId}',
    {
      params: {
        path: {
          userProfileId: userId!,
        },
      },
    },
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  )

  // Extract POI UUIDs from decisions (only liked ones where decision is true)
  const userPoiUuids = useMemo(() => {
    if (!userDecisions) return []
    return userDecisions
      .filter((decision) => decision.decision === true)
      .map((decision) => decision.poiId)
  }, [userDecisions])

  // Fetch each POI by UUID using parallel queries
  const userPoiQueries = useQueries({
    queries: userPoiUuids.map((uuid) => ({
      queryKey: ['get', '/poi/{uuid}', { params: { path: { uuid } } }],
      queryFn: async (): Promise<Poi> => {
        const response = await fetchClient.GET('/poi/{uuid}', {
          params: {
            path: {
              uuid,
            },
          },
        })
        if (!response.data) {
          throw new Error(`Failed to fetch POI ${uuid}`)
        }
        return response.data
      },
      enabled: !!userId && userPoiUuids.length > 0,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    })),
  })

  // Extract POI data from queries
  const userPoi = useMemo(() => {
    return userPoiQueries
      .map((query: { data?: Poi }) => query.data)
      .filter((poi): poi is Poi => poi !== undefined)
  }, [userPoiQueries])

  // Combine POIs: user POIs first, then regular POIs, mark with isUserPoi flag
  const allPoiWithType = useMemo(() => {
    const userPoiArray = (userPoi as Poi[] | undefined) || []
    const poiArray = pois || []
    const userPoiUuidsSet = new Set(userPoiArray.map((p: Poi) => p.uuid))

    const userPoiList = userPoiArray.map((p: Poi) => ({
      ...p,
      isUserPoi: true,
    }))

    const regularPoiList = poiArray
      .filter((p: Poi) => !userPoiUuidsSet.has(p.uuid))
      .map((p: Poi) => ({
        ...p,
        isUserPoi: false,
      }))

    return [...userPoiList, ...regularPoiList]
  }, [pois, userPoi])

  const sortedPlaces = useMemo(() => {
    if (!allPoiWithType || allPoiWithType.length === 0) return []

    const sorted = [...allPoiWithType]
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
        // Keep user POIs first, then regular POIs
        sorted.sort((a, b) => {
          if (a.isUserPoi && !b.isUserPoi) return -1
          if (!a.isUserPoi && b.isUserPoi) return 1
          return 0
        })
        break
    }

    return sorted
  }, [allPoiWithType, sortOption])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Ładowanie miejsc...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">
            Błąd podczas ładowania miejsc
          </p>
          <p className="text-gray-600 text-sm">
            {String(error) || 'Nieznany błąd'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Wszystkie miejsca
          </h1>
          <p className="text-gray-600">
            Odkryj miejsca warte odwiedzenia w Bydgoszczy i okolicy
          </p>
        </div>
        <div className="mb-6 flex gap-4 flex-wrap items-center">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="default">Sortuj</option>
            <option value="popular">Najpopularniejsze</option>
            <option value="newest">Najnowsze</option>
            <option value="name">Nazwa A-Z</option>
          </select>
          {userPoi && Array.isArray(userPoi) && userPoi.length > 0 && (
            <button
              onClick={() => openGoogleMapsRoute(userPoi)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <RouteIcon className="w-4 h-4" />
              <span>Otwórz trasę w Google Maps</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedPlaces.map((poi) => (
            <div
              key={poi.uuid}
              className={`rounded-lg overflow-hidden hover:shadow-xl transition-all shadow-md border-2 ${
                poi.isUserPoi
                  ? ''
                  : 'bg-gray-200 hover:bg-gray-300 border-transparent'
              }`}
              style={
                poi.isUserPoi
                  ? {
                      borderColor: '#f97316', // orange-500
                      backgroundColor: '#fff7ed', // orange-50 - very light orange
                    }
                  : undefined
              }
              onMouseEnter={(e) => {
                if (poi.isUserPoi) {
                  e.currentTarget.style.backgroundColor = '#ffedd5' // orange-100 - slightly darker on hover
                }
              }}
              onMouseLeave={(e) => {
                if (poi.isUserPoi) {
                  e.currentTarget.style.backgroundColor = '#fff7ed' // orange-50 - back to very light
                }
              }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={poi.imageUrl}
                  alt={poi.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {poi.name}
                </h3>
                <span className="inline-block text-xs bg-primary-600 text-white px-2 py-1 rounded mb-2">
                  Popularność: {poi.popularity}
                </span>
                {(poi.locationX != null || poi.locationY != null) && (
                  <button
                    onClick={() => {
                      navigate({
                        to: '/map',
                        search: {
                          poiId: poi.uuid,
                        },
                      })
                    }}
                    className="flex items-center gap-2 text-gray-600 text-sm mb-2 hover:text-primary-600 transition-colors underline"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Pokaż na mapie</span>
                  </button>
                )}
                {poi.shortDescription && (
                  <p className="text-gray-700 text-sm mb-2 line-clamp-1">
                    {poi.shortDescription}
                  </p>
                )}
                {poi.longDescription && (
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {poi.longDescription}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {sortedPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Brak miejsc do wyświetlenia</p>
          </div>
        )}
      </div>
    </div>
  )
}
