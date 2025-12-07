import L from 'leaflet'

export const createMinimalistMarker = (isSelected = false) => {
  const size = isSelected ? 16 : 12
  const color = isSelected ? '#3B82F6' : '#6B7280' // blue-500 : gray-500

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
