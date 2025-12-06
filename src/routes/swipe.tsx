import { createFileRoute } from '@tanstack/react-router'
import { PlaceCard } from '../components/PlaceCard'
import { ActionButtons } from '../components/ActionButtons'

export const Route = createFileRoute('/swipe')({
  component: RouteComponent,
})

const PLACE_DATA = {
  name: 'Pałac Kultury i Nauki',
  image:
    'https://backend.triverna.pl/blog/wp-content/uploads/2023/11/Centrum-Bydgoszczy-z-charakterystycznymi-atrakcjami.jpeg',
  description:
    'Najwyższy budynek w Polsce i jeden z najbardziej rozpoznawalnych symboli Warszawy. Kompleks kulturalno-rozrywkowy z kinem, teatrami i punktami widokowymi.',
  tags: ['Architektura', 'Kultura', 'Widok', 'Historia'],
  location: 'Plac Defilad 1, Śródmieście',
  distance: '2.3 km',
}

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <PlaceCard {...PLACE_DATA} />
        <ActionButtons />
      </div>
    </div>
  )
}
