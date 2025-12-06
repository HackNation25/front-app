import { NAVIGATION_ITEMS, NAVIGATION_ROUTES } from '@/shared/const/navigation'

/**
 * Sprawdza czy podana trasa jest trasą navbar (dokładne dopasowanie)
 */
export function isNavbarRoute(path: string): boolean {
  return Object.values(NAVIGATION_ROUTES).includes(path as typeof NAVIGATION_ROUTES[keyof typeof NAVIGATION_ROUTES])
}

/**
 * Zwraca indeks trasy w navbarze lub -1 jeśli trasa nie jest w navbarze
 */
export function getNavbarRouteIndex(path: string): number {
  return NAVIGATION_ITEMS.findIndex((item) => item.path === path)
}

/**
 * Określa typ animacji przejścia między trasami
 * @returns 'slider' dla tras navbar, 'fade-slide' dla pozostałych
 */
export function getTransitionType(fromPath: string, toPath: string): 'slider' | 'fade-slide' {
  const fromIsNavbar = isNavbarRoute(fromPath)
  const toIsNavbar = isNavbarRoute(toPath)

  // Jeśli obie trasy są w navbarze, użyj slidera
  if (fromIsNavbar && toIsNavbar) {
    return 'slider'
  }

  // W przeciwnym razie użyj fade-slide
  return 'fade-slide'
}

/**
 * Określa kierunek animacji slidera na podstawie indeksów tras w navbarze
 * @returns 'left' | 'right' | null (null jeśli nie można określić)
 */
export function getSliderDirection(fromPath: string, toPath: string): 'left' | 'right' | null {
  const fromIndex = getNavbarRouteIndex(fromPath)
  const toIndex = getNavbarRouteIndex(toPath)

  // Jeśli któraś z tras nie jest w navbarze, nie można określić kierunku
  if (fromIndex === -1 || toIndex === -1) {
    return null
  }

  // Jeśli indeks docelowy jest większy, przesuwamy w prawo
  if (toIndex > fromIndex) {
    return 'right'
  }

  // W przeciwnym razie w lewo
  return 'left'
}

