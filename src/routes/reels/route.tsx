import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reels')({
  component: RouteComponent,
})

const exampleReels = [
  {
    id: 1,
    title: 'Widok z Giewontu',
    author: 'Jan Kowalski',
    views: '12.5k',
    likes: '1.2k',
    image: '⛰️',
  },
  {
    id: 2,
    title: 'Zachód słońca nad Bałtykiem',
    author: 'Anna Nowak',
    views: '8.3k',
    likes: '890',
    image: '🌅',
  },
  {
    id: 3,
    title: 'Spacer po Starym Mieście',
    author: 'Piotr Wiśniewski',
    views: '15.2k',
    likes: '2.1k',
    image: '🏛️',
  },
  {
    id: 4,
    title: 'Jezioro o poranku',
    author: 'Maria Zielińska',
    views: '6.7k',
    likes: '543',
    image: '🏞️',
  },
]

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-800 text-foreground-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-accent-800">Reels</h1>
          <p className="text-foreground-400">
            Odkryj krótkie filmy z najpiękniejszych tras i miejsc
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {exampleReels.map((reel) => (
            <div
              key={reel.id}
              className="bg-foreground-800 rounded-lg overflow-hidden hover:bg-foreground-700 transition-colors cursor-pointer group"
            >
              <div className="aspect-[9/16] bg-gradient-to-br from-accent-600 to-primary-600 flex items-center justify-center text-8xl relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                <div className="relative z-10">{reel.image}</div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm"></div>
                    <span className="text-sm font-medium">{reel.author}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                    ❤️
                  </button>
                  <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                    💬
                  </button>
                  <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                    📤
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">{reel.title}</h3>
                <div className="flex items-center gap-4 text-sm text-foreground-400">
                  <span>👁️ {reel.views}</span>
                  <span>❤️ {reel.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-foreground-400 mb-4">
            Przesuń w górę lub w dół, aby zobaczyć więcej reels
          </p>
          <div className="flex justify-center gap-2">
            {exampleReels.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-foreground-600"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}