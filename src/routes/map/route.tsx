import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/map')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen text-foreground-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-accent-800">Mapa Tras</h1>
        <div className="bg-foreground-800 rounded-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Szukaj miejsca..."
              className="flex-1 px-4 py-2 bg-foreground-700 rounded-lg text-foreground-50 placeholder-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors">
              Szukaj
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 bg-foreground-700 hover:bg-foreground-600 rounded-lg text-sm transition-colors">
              Wszystkie
            </button>
            <button className="px-4 py-2 bg-foreground-700 hover:bg-foreground-600 rounded-lg text-sm transition-colors">
              Górskie
            </button>
            <button className="px-4 py-2 bg-foreground-700 hover:bg-foreground-600 rounded-lg text-sm transition-colors">
              Nadmorskie
            </button>
            <button className="px-4 py-2 bg-foreground-700 hover:bg-foreground-600 rounded-lg text-sm transition-colors">
              Miejskie
            </button>
            <button className="px-4 py-2 bg-foreground-700 hover:bg-foreground-600 rounded-lg text-sm transition-colors">
              Przyrodnicze
            </button>
          </div>
        </div>
        <div className="bg-foreground-800 rounded-lg p-8 min-h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold mb-2">Mapa</h2>
            <p className="text-foreground-400">
              Tutaj będzie wyświetlana interaktywna mapa z trasami
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-foreground-800 rounded-lg p-4 hover:bg-foreground-700 transition-colors cursor-pointer"
            >
              <div className="w-full h-32 bg-foreground-700 rounded-lg mb-3"></div>
              <h3 className="font-bold mb-1">Trasa {item}</h3>
              <p className="text-sm text-foreground-400">
                Przykładowy opis trasy turystycznej
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}