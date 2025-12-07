import type { Poi } from '@/shared/types/poi'

/**
 * Generuje URL trasy Google Maps z listy punktów POI
 * Tworzy luźną trasę (waypoints) bez optymalizacji kolejności
 *
 * @param pois - Lista punktów POI do uwzględnienia w trasie
 * @returns URL do otwarcia w Google Maps lub null jeśli brak punktów
 */
export function generateGoogleMapsRouteUrl(pois: Poi[]): string | null {
  if (!pois || pois.length === 0) {
    return null
  }

  // Filtruj tylko punkty z poprawnymi współrzędnymi
  const validPois = pois.filter(
    (poi) =>
      poi.locationX != null &&
      poi.locationY != null &&
      !isNaN(poi.locationX) &&
      !isNaN(poi.locationY)
  )

  if (validPois.length === 0) {
    return null
  }

  // Jeśli jest tylko jeden punkt, użyj go jako destination
  // locationX = latitude, locationY = longitude (zgodnie z użyciem w Leaflet)
  if (validPois.length === 1) {
    const poi = validPois[0]
    return `https://www.google.com/maps/dir/?api=1&destination=${poi.locationX},${poi.locationY}`
  }

  // Dla wielu punktów: pierwszy jako origin, ostatni jako destination, reszta jako waypoints
  const origin = validPois[0]
  const destination = validPois[validPois.length - 1]
  const waypoints = validPois.slice(1, -1)

  // Format waypoints: lat1,lng1|lat2,lng2|...
  // locationX = latitude, locationY = longitude
  const waypointsStr = waypoints
    .map((poi) => `${poi.locationX},${poi.locationY}`)
    .join('|')

  // Buduj URL
  // locationX = latitude, locationY = longitude
  const params = new URLSearchParams({
    api: '1',
    origin: `${origin.locationX},${origin.locationY}`,
    destination: `${destination.locationX},${destination.locationY}`,
  })

  if (waypointsStr) {
    params.append('waypoints', waypointsStr)
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`
}

/**
 * Otwiera trasę Google Maps w nowej karcie
 */
export function openGoogleMapsRoute(pois: Poi[]): void {
  const url = generateGoogleMapsRouteUrl(pois)
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
