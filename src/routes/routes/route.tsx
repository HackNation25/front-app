import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/routes')({
  component: RouteComponent,
})

const exampleRoutes = [
  {
    id: 1,
    name: 'Szlak Zamków',
    location: 'Małopolska',
    description: 'Piękna trasa przez historyczne zamki i pałace',
    duration: '2 dni',
    difficulty: 'Średnia',
    image: '🏰',
  },
  {
    id: 2,
    name: 'Górskie Wędrówki',
    location: 'Tatry',
    description: 'Wspaniałe widoki i świeże górskie powietrze',
    duration: '3 dni',
    difficulty: 'Trudna',
    image: '⛰️',
  },
  {
    id: 3,
    name: 'Nadbałtyckie Plaże',
    location: 'Pomorze',
    description: 'Relaksująca trasa wzdłuż polskiego wybrzeża',
    duration: '1 dzień',
    difficulty: 'Łatwa',
    image: '🏖️',
  },
  {
    id: 4,
    name: 'Mazurskie Jeziora',
    location: 'Mazury',
    description: 'Raj dla miłośników żeglarstwa i natury',
    duration: '4 dni',
    difficulty: 'Średnia',
    image: '⛵',
  },
  {
    id: 5,
    name: 'Kulinarna Podróż',
    location: 'Wielkopolska',
    description: 'Odkryj lokalne smaki i tradycyjne potrawy',
    duration: '2 dni',
    difficulty: 'Łatwa',
    image: '🍽️',
  },
  {
    id: 6,
    name: 'Miasta Sztuki',
    location: 'Dolny Śląsk',
    description: 'Zwiedzaj galerie, muzea i miejsca kultury',
    duration: '1 dzień',
    difficulty: 'Łatwa',
    image: '🎨',
  },
]

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-800 text-foreground-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-accent-800">Wszystkie Trasy</h1>
          <p className="text-foreground-400">
            Odkryj naszą kolekcję starannie wyselekcjonowanych tras turystycznych
          </p>
        </div>
        <div className="mb-6 flex gap-4 flex-wrap">
          <select className="px-4 py-2 bg-foreground-800 rounded-lg text-foreground-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Wszystkie regiony</option>
            <option>Małopolska</option>
            <option>Tatry</option>
            <option>Pomorze</option>
            <option>Mazury</option>
          </select>
          <select className="px-4 py-2 bg-foreground-800 rounded-lg text-foreground-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Wszystkie poziomy</option>
            <option>Łatwa</option>
            <option>Średnia</option>
            <option>Trudna</option>
          </select>
          <select className="px-4 py-2 bg-foreground-800 rounded-lg text-foreground-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Sortuj</option>
            <option>Najpopularniejsze</option>
            <option>Najnowsze</option>
            <option>Najdłuższe</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-foreground-800 rounded-lg overflow-hidden hover:bg-foreground-700 transition-colors cursor-pointer shadow-lg"
            >
              <div className="h-48 bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-6xl">
                {route.image}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{route.name}</h3>
                  <span className="text-xs bg-primary-600 px-2 py-1 rounded">
                    {route.difficulty}
                  </span>
                </div>
                <p className="text-foreground-400 text-sm mb-3">
                  📍 {route.location}
                </p>
                <p className="text-foreground-200 text-sm mb-4">
                  {route.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-400">⏱️ {route.duration}</span>
                  <button className="text-primary-400 hover:text-primary-300 font-medium">
                    Zobacz więcej →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}