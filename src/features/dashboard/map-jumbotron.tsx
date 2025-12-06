import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function MapJumbotron() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full px-4 py-8 lg:py-12"
      aria-labelledby="map-jumbotron-heading"
    >
      <Link
        to="/map"
        className="block relative overflow-hidden rounded-2xl group cursor-pointer hover:scale-[1.01] transition-transform duration-300"
        aria-label="Przejdź do mapy atrakcji"
      >
        {/* Glass effect background */}
        <div
          className="absolute inset-0 rounded-2xl border border-white/10"
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.6)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        />

        <div className="relative flex flex-col lg:flex-row">
          {/* Image side - left */}
          <div className="relative lg:w-1/2 h-64 lg:h-auto min-h-[300px] lg:min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
              alt="Mapa atrakcji"
              className="w-full h-full object-cover"
            />
            {/* Gradient fade from middle (50%) to right */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, transparent 0%, transparent 50%, rgba(26, 26, 26, 0.5) 50%, rgba(26, 26, 26, 1) 100%)',
              }}
            />
          </div>

          {/* Content side - right */}
          <div className="relative lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
            {/* Title */}
            <motion.h2
              id="map-jumbotron-heading"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-foreground-50 leading-tight"
            >
              Odkryj mapę atrakcji
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base lg:text-lg text-foreground-200 mb-6 leading-relaxed max-w-lg"
            >
              Przejrzyj interaktywną mapę i znajdź najciekawsze miejsca w Twojej okolicy.
              Odkryj ukryte perełki i zaplanuj idealną trasę zwiedzania.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="inline-flex items-center gap-2 text-primary-400 group-hover:text-primary-300 font-semibold transition-colors"
            >
              <span>Zobacz mapę</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.section>
  )
}

