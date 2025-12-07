import { useState, useMemo, useEffect, useRef } from 'react'
import { createFileRoute, useSearch, useNavigate } from '@tanstack/react-router'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapControls } from '@/features/swipe/components/MapControls'
import { createMinimalistMarker } from '@/features/swipe/components/MapMarker'
import { MapDrawer } from '@/features/map/components/MapDrawer.tsx'
import { MapPopover } from '@/features/map/components/MapPopover'
import { PlaceDrawer } from '@/features/swipe/components/drawer-vaul'
import { ExpandableFloatingButton } from '@/shared/components/expandable-floating-button'
import { $api, fetchClient } from '@/shared/api/client.ts'
import type { Poi } from '@/shared/types/poi.ts'
import { List } from 'lucide-react'
import { useUserSessionContext } from '@/shared/contexts/user-session-context'
import { useQueries } from '@tanstack/react-query'

type DrawerView = 'list' | 'details'

export const Route = createFileRoute('/map')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      poiId: (search.poiId as string) || undefined,
    }
  },
})

function RouteComponent() {
  const [selectedPlace, setSelectedPlace] = useState<Poi | null>(null)
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false)
  const [drawerView, setDrawerView] = useState<DrawerView>('list')
  const [isPlaceDrawerOpen, setIsPlaceDrawerOpen] = useState(false)
  const [popoverPlace, setPopoverPlace] = useState<Poi | null>(null)
  const { userId } = useUserSessionContext()
  const { poiId } = useSearch({ from: '/map' })
  const navigate = useNavigate()
  const processedPoiIdRef = useRef<string | undefined>(undefined)

  const { data: poi } = $api.useQuery('get', '/poi')

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

  // Combine POIs and mark which are from user
  const allPoiWithType = useMemo(() => {
    if (!poi) return []
    const userPoiUuids = new Set(
      (userPoi as Poi[] | undefined)?.map((p: Poi) => p.uuid) || []
    )
    return poi.map((p) => ({
      ...p,
      isUserPoi: userPoiUuids.has(p.uuid),
    }))
  }, [poi, userPoi])

  // For listing: combine without duplicates, user POIs first, then regular POIs
  const placesForListing = useMemo(() => {
    const userPoiArray = (userPoi as Poi[] | undefined) || []
    const poiArray = poi || []
    const userPoiUuids = new Set(userPoiArray.map((p: Poi) => p.uuid))
    const userPoiList = userPoiArray.map((p: Poi) => ({
      ...p,
      isUserPoi: true,
    }))
    const regularPoiList = poiArray
      .filter((p: Poi) => !userPoiUuids.has(p.uuid))
      .map((p: Poi) => ({
        ...p,
        isUserPoi: false,
      }))
    return [...userPoiList, ...regularPoiList]
  }, [poi, userPoi])

  // Convert all places to CardData format for PlaceDrawer (sorted: user POIs first)
  const placesCardData =
    placesForListing.length > 0
      ? placesForListing.map((place) => ({
          poiId: place.uuid,
          name: place.name,
          image: place.imageUrl,
          description: place.shortDescription || place.longDescription || '',
          tags: [] as string[],
          location:
            place.locationX && place.locationY
              ? `${place.locationX}, ${place.locationY}`
              : '',
          distance: '',
          isUserPoi: place.isUserPoi,
        }))
      : null

  // Handle poiId from URL - show popover instead of drawer
  useEffect(() => {
    if (
      poiId &&
      placesForListing.length > 0 &&
      processedPoiIdRef.current !== poiId
    ) {
      // Find POI in all POIs (includes both regular and user POIs, no duplicates)
      const foundPoi = placesForListing.find((p) => p.uuid === poiId)

      if (foundPoi) {
        processedPoiIdRef.current = poiId
        // Show popover instead of drawer
        setPopoverPlace(foundPoi)
        setSelectedPlace(null)
        setIsDrawerExpanded(false)
        setIsPlaceDrawerOpen(false)
      }
    } else if (!poiId) {
      // Reset when poiId is removed from URL, but only if drawer is not open
      // This prevents resetting state when opening drawer from popover
      if (processedPoiIdRef.current && !isDrawerExpanded) {
        processedPoiIdRef.current = undefined
        setSelectedPlace(null)
        setPopoverPlace(null)
        setIsDrawerExpanded(false)
      } else if (processedPoiIdRef.current) {
        // Just mark as processed, don't reset state if drawer is open
        processedPoiIdRef.current = undefined
      }
    }
  }, [poiId, placesForListing, isDrawerExpanded])

  const handlePlaceSelect = (placeCard: {
    poiId: string
    name: string
    image: string
    description: string
    tags: string[]
    location: string
    distance: string
  }) => {
    // Find the original Poi object
    const originalPlace = poi?.find((p) => p.uuid === placeCard.poiId)
    if (originalPlace) {
      setSelectedPlace(originalPlace)
      setDrawerView('details')
      setIsDrawerExpanded(true)
      setIsPlaceDrawerOpen(false)
    }
  }

  return (
    <div className="h-screen w-full relative bg-white">
      <style>{`
        .minimalist-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* Logo - same as in AppHeader */}
      <img
        src="/logo.png"
        alt="Logo"
        className="absolute left-1/2 top-4 z-10 h-[50px] -translate-x-1/2"
      />

      <MapContainer
        center={[53.1235895, 18.00201924]}
        zoom={15}
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%', paddingTop: '70px' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CARTO"
          subdomains="abcd"
          maxZoom={20}
        />

        <MapControls />

        {allPoiWithType.map((place) => {
          const isSelected =
            selectedPlace?.uuid === place.uuid ||
            popoverPlace?.uuid === place.uuid
          const markerType = isSelected
            ? 'selected'
            : place.isUserPoi
              ? 'user'
              : 'default'

          return (
            <Marker
              key={place.uuid}
              position={[place.locationX, place.locationY]}
              icon={createMinimalistMarker(markerType)}
              eventHandlers={{
                click: () => {
                  setPopoverPlace(place)
                },
              }}
            />
          )
        })}
      </MapContainer>

      {/* MapPopover - floating card at bottom */}
      <MapPopover
        place={popoverPlace}
        onShowMore={() => {
          if (popoverPlace) {
            // First set drawer state
            setSelectedPlace(popoverPlace)
            setDrawerView('details')
            setIsDrawerExpanded(true)
            // Close popover
            setPopoverPlace(null)
            // Remove poiId from URL when opening drawer
            // This will trigger useEffect but it won't reset state because isDrawerExpanded is true
            if (poiId) {
              navigate({
                to: '/map',
                search: {
                  poiId: undefined,
                },
                replace: true,
              })
            }
          }
        }}
        onClose={() => {
          setPopoverPlace(null)
          // Remove poiId from URL when closing popover
          if (poiId) {
            navigate({
              to: '/map',
              search: {
                poiId: undefined,
              },
              replace: true,
            })
          }
        }}
      />

      <MapDrawer
        place={selectedPlace}
        isOpen={isDrawerExpanded}
        onClose={() => {
          // Remove poiId from URL - useEffect will handle state reset
          if (poiId) {
            navigate({
              to: '/map',
              search: {
                poiId: undefined,
              },
              replace: true,
            })
          } else {
            // If no poiId in URL, just close drawer
            setIsDrawerExpanded(false)
            setSelectedPlace(null)
          }
        }}
        onOpen={() => setIsDrawerExpanded(true)}
        view={drawerView}
        onViewChange={setDrawerView}
        places={allPoiWithType}
        onPlaceSelect={(place) => {
          setSelectedPlace(place)
          setDrawerView('details')
          setIsDrawerExpanded(true)
        }}
        onShowAll={() => {
          setIsDrawerExpanded(false)
          setIsPlaceDrawerOpen(true)
        }}
        onShowOnMap={(poiId) => {
          // Close drawer and show popover instead
          setIsDrawerExpanded(false)
          setSelectedPlace(null)
          const foundPoi = placesForListing.find((p) => p.uuid === poiId)
          if (foundPoi) {
            setPopoverPlace(foundPoi)
            // Update URL to show poiId
            navigate({
              to: '/map',
              search: {
                poiId,
              },
              replace: true,
            })
          }
        }}
      />

      {/* PlaceDrawer from drawer-vaul with list */}
      {placesCardData && placesCardData.length > 0 && (
        <PlaceDrawer
          isOpen={isPlaceDrawerOpen}
          onClose={() => setIsPlaceDrawerOpen(false)}
          place={null}
          places={placesCardData}
          onPlaceSelect={handlePlaceSelect}
          userPoi={userPoi && Array.isArray(userPoi) ? userPoi : null}
        />
      )}

      {/* Floating Button to Open PlaceDrawer */}
      <ExpandableFloatingButton
        isVisible={
          !isDrawerExpanded &&
          !isPlaceDrawerOpen &&
          !popoverPlace &&
          placesCardData !== null &&
          placesCardData.length > 0
        }
        position="bottom-right"
        text="Pokaż miejsca"
        icon={<List className="w-5 h-5 text-white" />}
        onClick={() => {
          setIsPlaceDrawerOpen(true)
        }}
        aria-label="Pokaż listę miejsc"
      />
    </div>
  )
}
