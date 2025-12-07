import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import type { Place } from '@/shared/types/place'
import { BYDGOSZCZ_CATEGORIES } from '@/features/profile/mock-categories'

export const Route = createFileRoute('/places')({
  component: RouteComponent,
})

const examplePlaces: Place[] = [
  {
    id: '1',
    name: 'Muzeum Okręgowe im. Leona Wyczółkowskiego',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Największe muzeum w Bydgoszczy z bogatą kolekcją sztuki i eksponatów historycznych',
    category: 'muzea',
  },
  {
    id: '2',
    name: 'Wyspa Młyńska',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Malownicza wyspa na Brdzie z zabytkowymi spichrzami i nowoczesnymi obiektami kulturalnymi',
    category: 'zabytki',
  },
  {
    id: '3',
    name: 'Mural "Przechodzenie przez rzekę"',
    image:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Jeden z najsłynniejszych murali w Bydgoszczy przedstawiający postacie przechodzące przez rzekę',
    category: 'murale',
  },
  {
    id: '4',
    name: 'Katedra św. Marcina i Mikołaja',
    image:
      'https://images.unsplash.com/photo-1519491050547-6ba5f34e834f?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Główna świątynia Bydgoszczy, gotycka katedra z XIV wieku o bogatej historii',
    category: 'koscioly',
  },
  {
    id: '5',
    name: 'Park im. Kazimierza Wielkiego',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Najstarszy park miejski w Bydgoszczy, idealne miejsce na spacer i odpoczynek',
    category: 'parki',
  },
  {
    id: '6',
    name: 'Most Jerzego Sulimy-Kamińskiego',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Charakterystyczny most nad Brdą łączący Stare Miasto z Wyspą Młyńską',
    category: 'mosty',
  },
  {
    id: '7',
    name: 'Fontanna "Potop"',
    image:
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Imponująca fontanna na Starym Rynku przedstawiająca scenę biblijną',
    category: 'fontanny',
  },
  {
    id: '8',
    name: 'Stary Rynek',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Główny plac miasta z zabytkowymi kamienicami i fontanną "Potop"',
    category: 'place',
  },
  {
    id: '9',
    name: 'Spichrze nad Brdą',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Zabytkowe spichlerze z XVIII wieku, symbol miasta nad Brdą',
    category: 'zabytki',
  },
  {
    id: '10',
    name: 'Kościół pw. św. Piotra i Pawła',
    image:
      'https://images.unsplash.com/photo-1519491050547-6ba5f34e834f?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Barokowy kościół z XVII wieku, jeden z najpiękniejszych w mieście',
    category: 'koscioly',
  },
  {
    id: '11',
    name: 'Mural "Łuczniczka"',
    image:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Wielkoformatowy mural przedstawiający symbol Bydgoszczy',
    category: 'murale',
  },
  {
    id: '12',
    name: 'Muzeum Wodociągów',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Interaktywne muzeum prezentujące historię bydgoskich wodociągów',
    category: 'muzea',
  },
  {
    id: '13',
    name: 'Park Centralny',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Nowoczesny park miejski z placem zabaw i ścieżkami rowerowymi',
    category: 'parki',
  },
  {
    id: '14',
    name: 'Most Królowej Jadwigi',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Nowoczesny most łączący Śródmieście z Sielanką',
    category: 'mosty',
  },
  {
    id: '15',
    name: 'Fontanna na Wyspie Młyńskiej',
    image:
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Nowoczesna fontanna multimedialna na Wyspie Młyńskiej',
    category: 'fontanny',
  },
  {
    id: '16',
    name: 'Plac Wolności',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    location: 'Bydgoszcz',
    description:
      'Główny plac komunikacyjny miasta z pomnikiem Walki i Męczeństwa',
    category: 'place',
  },
  {
    id: '17',
    name: 'Zamek w Bydgoszczy',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Pozostałości średniowiecznego zamku krzyżackiego',
    category: 'zabytki',
  },
  {
    id: '18',
    name: 'Kościół pw. Najświętszego Serca Pana Jezusa',
    image:
      'https://images.unsplash.com/photo-1519491050547-6ba5f34e834f?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Neogotycka świątynia z początku XX wieku',
    category: 'koscioly',
  },
  {
    id: '19',
    name: 'Mural "Bydgoszcz"',
    image:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Kolorowy mural przedstawiający panoramę miasta',
    category: 'murale',
  },
  {
    id: '20',
    name: 'Muzeum Mydła i Historii Brudu',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Unikalne muzeum prezentujące historię higieny',
    category: 'muzea',
  },
  {
    id: '21',
    name: 'Park nad Kanałem Bydgoskim',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Spacerowy park wzdłuż historycznego kanału',
    category: 'parki',
  },
  {
    id: '22',
    name: 'Most Staromiejski',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Zabytkowy most łączący Stare Miasto z Wyspą Młyńską',
    category: 'mosty',
  },
  {
    id: '23',
    name: 'Fontanna "Dzieci"',
    image:
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Fontanna z figurami dzieci na Starym Rynku',
    category: 'fontanny',
  },
  {
    id: '24',
    name: 'Plac Teatralny',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Plac przed Operą Nova z fontanną i rzeźbami',
    category: 'place',
  },
  {
    id: '25',
    name: 'Kościół pw. Matki Bożej Królowej Męczenników',
    image:
      'https://images.unsplash.com/photo-1519491050547-6ba5f34e834f?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Nowoczesna świątynia z charakterystyczną architekturą',
    category: 'koscioly',
  },
  {
    id: '26',
    name: 'Mural "Muzyka"',
    image:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Mural poświęcony muzycznej tradycji Bydgoszczy',
    category: 'murale',
  },
  {
    id: '27',
    name: 'Zabytkowa Dzielnica Szwederowo',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Historyczna dzielnica z zabytkową architekturą',
    category: 'zabytki',
  },
  {
    id: '28',
    name: 'Park im. Jana Kochanowskiego',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Park z pomnikiem poety i alejkami spacerowymi',
    category: 'parki',
  },
  {
    id: '29',
    name: 'Muzeum Fotografii',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Muzeum prezentujące historię fotografii i kolekcję zdjęć',
    category: 'muzea',
  },
  {
    id: '30',
    name: 'Most Uniwersytecki',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    location: 'Bydgoszcz',
    description: 'Nowoczesny most prowadzący do kampusu uniwersyteckiego',
    category: 'mosty',
  },
  {
    id: '31',
    name: 'Zamek w Koronowie',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    location: 'Koronowo',
    description: 'Zabytkowy zamek w pobliskim Koronowie',
    category: 'zabytki',
  },
  {
    id: '32',
    name: 'Park w Solcu Kujawskim',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    location: 'Solec Kujawski',
    description: 'Park miejski w pobliskim Solcu Kujawskim',
    category: 'parki',
  },
]

type SortOption = 'default' | 'popular' | 'newest' | 'name'

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortOption, setSortOption] = useState<SortOption>('default')

  const filteredAndSortedPlaces = useMemo(() => {
    let filtered = examplePlaces

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((place) => place.category === selectedCategory)
    }

    // Sort
    const sorted = [...filtered]
    switch (sortOption) {
      case 'popular':
        // Mock popularity - could be based on actual data
        sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id))
        break
      case 'newest':
        sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id))
        break
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order
        break
    }

    return sorted
  }, [selectedCategory, sortOption])

  const getCategoryLabel = (categoryId: string) => {
    const category = BYDGOSZCZ_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.label || categoryId
  }

  return (
    <div className="min-h-screen text-foreground-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-accent-800">
            Wszystkie miejsca
          </h1>
          <p className="text-foreground-400">
            Odkryj miejsca warte odwiedzenia w Bydgoszczy i okolicy
          </p>
        </div>
        <div className="mb-6 flex gap-4 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-foreground-800 rounded-lg text-foreground-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Wszystkie kategorie</option>
            {BYDGOSZCZ_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 bg-foreground-800 rounded-lg text-foreground-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="default">Sortuj</option>
            <option value="popular">Najpopularniejsze</option>
            <option value="newest">Najnowsze</option>
            <option value="name">Nazwa A-Z</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-foreground-800 rounded-lg overflow-hidden hover:bg-foreground-700 transition-colors cursor-pointer shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{place.name}</h3>
                  {place.category && (
                    <span className="text-xs bg-primary-600 px-2 py-1 rounded whitespace-nowrap ml-2">
                      {getCategoryLabel(place.category)}
                    </span>
                  )}
                </div>
                <p className="text-foreground-400 text-sm mb-3">
                  📍 {place.location}
                </p>
                {place.description && (
                  <p className="text-foreground-200 text-sm mb-4">
                    {place.description}
                  </p>
                )}
                <div className="flex items-center justify-end text-sm">
                  <button className="text-primary-400 hover:text-primary-300 font-medium">
                    Zobacz więcej →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredAndSortedPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground-400 text-lg">
              Nie znaleziono miejsc w wybranej kategorii
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
