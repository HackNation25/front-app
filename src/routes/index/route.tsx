import { createFileRoute } from '@tanstack/react-router'
import { HeroHeader } from '@/features/dashboard/hero-header'
import { Recommendations } from '@/features/dashboard/recommendations'
import { MapJumbotron } from '@/features/dashboard/map-jumbotron'
import { FloatingCardsSlider } from '@/features/dashboard/floating-cards-slider'
import type { RouteItem } from '@/shared/types/route'

export const Route = createFileRoute('/')({
  component: App,
})

// Mock data - Rekomendowane trasy
const recommendedRoutes: RouteItem[] = [
  {
    id: '1',
    name: 'Szlak Zamków',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    location: 'Małopolska',
    description: 'Piękna trasa przez historyczne zamki i pałace',
    routePath: '/routes/1',
  },
  {
    id: '2',
    name: 'Górskie Wędrówki',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    location: 'Tatry',
    description: 'Wspaniałe widoki i świeże górskie powietrze',
    routePath: '/routes/2',
  },
  {
    id: '3',
    name: 'Nadbałtyckie Plaże',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    location: 'Pomorze',
    description: 'Relaksująca trasa wzdłuż polskiego wybrzeża',
    routePath: '/routes/3',
  },
  {
    id: '4',
    name: 'Mazurskie Jeziora',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    location: 'Mazury',
    description: 'Raj dla miłośników żeglarstwa i natury',
    routePath: '/routes/4',
  },
]

// Mock data - To też może ci się spodobać
const otherRecommendations: RouteItem[] = [
  {
    id: '5',
    name: 'Kulinarna Podróż',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    location: 'Wielkopolska',
    description: 'Odkryj lokalne smaki i tradycyjne potrawy',
    routePath: '/routes/5',
  },
  {
    id: '6',
    name: 'Miasta Sztuki',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    location: 'Dolny Śląsk',
    description: 'Zwiedzaj galerie, muzea i miejsca kultury',
    routePath: '/routes/6',
  },
  {
    id: '7',
    name: 'Przyrodnicze Skarby',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    location: 'Podlasie',
    description: 'Niesamowite parki narodowe i rezerwaty',
    routePath: '/routes/7',
  },
  {
    id: '8',
    name: 'Historyczne Miasta',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400',
    location: 'Śląsk',
    description: 'Poznaj bogatą historię polskich miast',
    routePath: '/routes/8',
  },
]

function App() {
  return (
    <div className="relative">
      <HeroHeader />
      <Recommendations />
      <MapJumbotron />
      <FloatingCardsSlider
        title="Rekomendowane trasy"
        items={recommendedRoutes}
        ariaLabel="Slider z rekomendowanymi trasami"
      />
      <FloatingCardsSlider
        title="To też może ci się spodobać"
        items={otherRecommendations}
        ariaLabel="Slider z dodatkowymi propozycjami"
      />
    </div>
  )
}
