import { Card } from '@/shared/components/card'

export function HeroHeader() {
  return (
    <section className="w-full px-4 py-6" aria-labelledby="hero-heading">
      <Card className="border-l-4 border-l-primary-500">
        <div className="px-6">
          <h1
            id="hero-heading"
            className="text-3xl lg:text-4xl font-bold mb-3 text-foreground-800 leading-tight"
          >
            Odkryj{' '}
            <img
              src="/logo-transparent.png"
              alt="Bydgoszcz"
              className="inline-block h-8 lg:h-10 align-middle"
            />
          </h1>
          <p className="text-base lg:text-lg text-foreground-600 leading-relaxed max-w-2xl">
            Znajdź idealną trasę turystyczną dla siebie. Odkrywaj najpiękniejsze
            miejsca, zabytki i atrakcje w Bydgoszczy.
          </p>
        </div>
      </Card>
    </section>
  )
}
