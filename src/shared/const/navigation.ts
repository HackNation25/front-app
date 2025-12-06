import {
  IconHome,
  IconRefresh,
  IconRoute,
  IconMapPin,
  IconPlayerPlay,
  type TablerIconsProps,
} from '@tabler/icons-react'

export interface NavigationItem {
  path: string
  label: string
  ariaLabel: string
  icon: (props: TablerIconsProps) => JSX.Element
}

export const NAVIGATION_ROUTES = {
  HOME: '/',
  SWIPE: '/swipe',
  PLACES: '/places',
  MAP: '/map',
  REELS: '/reels',
} as const

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    path: NAVIGATION_ROUTES.HOME,
    label: 'Home',
    ariaLabel: 'Przejdź do strony głównej',
    icon: IconHome,
  },
  {
    path: NAVIGATION_ROUTES.SWIPE,
    label: 'Swipe',
    ariaLabel: 'Przejdź do Swipe',
    icon: IconRefresh,
  },
  {
    path: NAVIGATION_ROUTES.MAP,
    label: 'Mapka',
    ariaLabel: 'Przejdź do Mapka',
    icon: IconMapPin,
  },
  {
    path: NAVIGATION_ROUTES.PLACES,
    label: 'Miejsca',
    ariaLabel: 'Przejdź do Miejsca',
    icon: IconRoute,
  },
  {
    path: NAVIGATION_ROUTES.REELS,
    label: 'Reelsy',
    ariaLabel: 'Przejdź do Reelsy',
    icon: IconPlayerPlay,
  },
] as const
