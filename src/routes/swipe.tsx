import { createFileRoute } from '@tanstack/react-router'

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
      <div className="relative w-full max-w-md h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Image with gradient overlay */}
        <div className="relative h-full w-full">
          <img
            src={PLACE_DATA.image}
            alt={PLACE_DATA.name}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {/* Title and distance */}
            <div className="flex items-end justify-between mb-3">
              <h1 className="text-3xl font-bold">{PLACE_DATA.name}</h1>
              <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{PLACE_DATA.distance}</span>
              </div>
            </div>

            {/* Location */}
            <p className="text-sm text-gray-200 mb-3 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {PLACE_DATA.location}
            </p>

            {/* Description */}
            <p className="text-sm text-gray-100 mb-4 line-clamp-3">
              {PLACE_DATA.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {PLACE_DATA.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Info button */}
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
