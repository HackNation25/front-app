import L from 'leaflet'

type MarkerType = 'default' | 'user' | 'selected'

export const createMinimalistMarker = (
  type: MarkerType | boolean = 'default'
) => {
  // Handle legacy boolean parameter
  const markerType: MarkerType =
    typeof type === 'boolean' ? (type ? 'selected' : 'default') : type

  const size = markerType === 'selected' ? 16 : 12
  let color: string

  switch (markerType) {
    case 'user':
      color = 'var(--color-green-500)' // accent-500 (red) from styles.css
      break
    case 'selected':
      color = '#3B82F6' // blue-500
      break
    default:
      color = '#6B7280' // gray-500
      break
  }

  const svgIcon = `
    <svg width="${size * 2}" height="${size * 2}" viewBox="0 0 ${size * 2} ${size * 2}" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="${size}"
        cy="${size}"
        r="${size - 2}"
        fill="${color}"
        stroke="white"
        stroke-width="2"
      />
    </svg>
  `

  return L.divIcon({
    html: svgIcon,
    className: 'minimalist-marker',
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
  })
}
