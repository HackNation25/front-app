import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import type { RouteItem } from '@/shared/types/route'

interface RouteCardProps {
  route: RouteItem
  width: number
}

export function RouteCard({ route, width }: RouteCardProps) {
  const cardContent = (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground-50 group">
      <motion.img
        src={route.image}
        alt={route.name}
        className="w-full h-full object-cover"
        loading="lazy"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-semibold text-base drop-shadow-lg">
          {route.name}
        </h3>
        {route.description && (
          <p className="text-white/90 text-sm mt-1 drop-shadow-lg">
            {route.description}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <motion.div
      className="flex-shrink-0"
      style={{
        width: `${width}px`,
        minWidth: `${width}px`,
      }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {route.externalUrl ? (
        <a
          href={route.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white rounded-2xl overflow-hidden"
          aria-label={`Otwórz ${route.name} w nowej karcie`}
        >
          {cardContent}
        </a>
      ) : route.routePath ? (
        <Link
          to={route.routePath}
          className="block h-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white rounded-2xl overflow-hidden"
          aria-label={`Przejdź do trasy ${route.name} w ${route.location}`}
        >
          {cardContent}
        </Link>
      ) : (
        <div className="block h-full rounded-2xl overflow-hidden">
          {cardContent}
        </div>
      )}
    </motion.div>
  )
}
