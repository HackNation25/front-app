import { createFileRoute } from '@tanstack/react-router'
import { HeroHeader } from '@/features/dashboard/hero-header'
import { Recommendations } from '@/features/dashboard/recommendations'
import { MapJumbotron } from '@/features/dashboard/map-jumbotron'
import { FloatingCardsSlider } from '@/features/dashboard/floating-cards-slider'
import type { RouteItem } from '@/shared/types/route'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Query } from '@tanstack/react-query'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    // Refetch recommendations query without cache when entering / route
    context.queryClient.refetchQueries({
      predicate: (query: Query) => {
        const queryKey = query.queryKey
        return (
          Array.isArray(queryKey) &&
          queryKey.length >= 2 &&
          queryKey[0] === 'get' &&
          queryKey[1] === '/recommendation'
        )
      },
    })
  },
  component: App,
})

// Strony o Bydgoszczy
const bydgoszczWebsites: RouteItem[] = [
  {
    id: '1',
    name: 'Visit Bydgoszcz',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    location: 'Bydgoszcz',
    description: 'Oficjalny portal turystyczny miasta',
    externalUrl: 'https://visitbydgoszcz.pl',
  },
  {
    id: '2',
    name: 'Bydgoszcz.pl',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    location: 'Bydgoszcz',
    description: 'Oficjalna strona miasta Bydgoszcz',
    externalUrl: 'https://www.bydgoszcz.pl',
  },
  {
    id: '3',
    name: 'Bydgoskie Centrum Sztuki',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    location: 'Bydgoszcz',
    description: 'Centrum kultury i sztuki w Bydgoszczy',
    externalUrl: 'https://www.mck-bydgoszcz.pl',
  },
  {
    id: '4',
    name: 'Muzeum Okręgowe',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400',
    location: 'Bydgoszcz',
    description: 'Muzeum Okręgowe im. Leona Wyczółkowskiego',
    externalUrl: 'https://muzeum.bydgoszcz.pl',
  },
  {
    id: '5',
    name: 'Opera Nova',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    location: 'Bydgoszcz',
    description: 'Opera Nova - opera i filharmonia',
    externalUrl: 'https://www.opera.bydgoszcz.pl',
  },
  {
    id: '6',
    name: 'Bydgoskie Wodociągi',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    location: 'Bydgoszcz',
    description: 'Wyspa Młyńska i zabytkowe wodociągi',
    externalUrl: 'https://www.mwik.bydgoszcz.pl',
  },
  {
    id: '7',
    name: 'Bydgoska Lokalna Organizacja Turystyczna',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    location: 'Bydgoszcz',
    description: 'Informacje turystyczne o regionie',
    externalUrl: 'https://www.blot.bydgoszcz.pl',
  },
  {
    id: '8',
    name: 'Bydgoskie Centrum Targowo-Wystawiennicze',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    location: 'Bydgoszcz',
    description: 'Wydarzenia i targi w Bydgoszczy',
    externalUrl: 'https://www.bctw.pl',
  },
]

function App() {
  const queryClient = useQueryClient()

  // Refetch recommendations query on mount without cache
  useEffect(() => {
    queryClient.refetchQueries({
      predicate: (query: Query) => {
        const queryKey = query.queryKey
        return (
          Array.isArray(queryKey) &&
          queryKey.length >= 2 &&
          queryKey[0] === 'get' &&
          queryKey[1] === '/recommendation'
        )
      },
    })
  }, [queryClient])

  return (
    <div className="relative w-full max-w-full overflow-x-hidden lg:max-w-[500px] xl:max-w-[500px]">
      <HeroHeader />
      <Recommendations />
      <MapJumbotron />
      <FloatingCardsSlider
        title="Poznaj Bydgoszcz"
        items={bydgoszczWebsites}
        ariaLabel="Slider ze stronami o Bydgoszczy"
      />
    </div>
  )
}
