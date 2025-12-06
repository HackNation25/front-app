import { Link, useMatchRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { NavigationItem } from '@/shared/const/navigation'

interface NavigationBarItemV2Props {
  item: NavigationItem
}

// Konfiguracje animacji dla płynącego splash
// flowingSplashConfig został usunięty - używamy prostszego transition dla layout

const bubblePopConfig = {
  type: 'spring' as const,
  stiffness: 600,
  damping: 25,
  mass: 0.3,
  delay: 0.2, // Bombel wyskakuje równo z splash lub chwilę wcześniej
}

const bounceUpConfig = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 15,
  mass: 0.4,
  delay: 0.4, // Wyrzucenie zaczyna się gdy bombel się pojawia
}

const itemVariants = {
  idle: {
    scale: 1,
    y: 0,
  },
  active: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.05,
    y: 0,
  },
}

export const NavigationBarItemV2 = ({ item }: NavigationBarItemV2Props) => {
  const matchRoute = useMatchRoute()
  const isActive = matchRoute({ to: item.path, fuzzy: false })
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)')
    setIsMobile(!mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(!e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const Icon = item.icon
  const iconSize = isMobile ? 18 : 24

  return (
    <Link
      to={item.path}
      aria-label={item.ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      className={`group relative flex flex-1 flex-col items-center justify-center gap-1 text-sm font-medium transition-colors hover:bg-white/20 overflow-visible h-full ${
        isActive
          ? 'focus:outline-none focus-visible:outline-none'
          : 'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white/10'
      }`}
    >
      {/* Bombel z ikoną wyskakujący ze splash i wyrzucany do góry */}
      {isActive && (
        <motion.div
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
          initial={{ scale: 0, y: 0, opacity: 0 }}
          animate={{
            scale: 1,
            y: -9, // Wyrzucenie do góry - spring naturally creates bounce
            opacity: 1,
          }}
          exit={{ scale: 0, y: 0, opacity: 0 }}
          transition={{
            scale: {
              ...bubblePopConfig,
              type: 'spring',
              stiffness: 600,
              damping: 20,
            },
            y: {
              ...bounceUpConfig,
              type: 'spring',
              stiffness: 300,
              damping: 10, // Low damping creates natural bounce
            },
            opacity: {
              duration: 0.15,
              delay: 0.2,
            },
          }}
        >
          {/* Bombel */}
          <motion.div
            className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 shadow-lg shadow-primary-500/40 flex items-center justify-center group-focus-within:outline-2 group-focus-within:outline-accent-500 group-focus-within:outline-offset-2"
            initial={{ scale: 0 }}
            animate={{
              scale: 1, // Spring naturally creates overshoot with low damping
            }}
            transition={{
              ...bubblePopConfig,
              type: 'spring',
              stiffness: 600,
              damping: 20, // Low damping creates natural overshoot/bounce
            }}
          >
            {/* Ikona w środku */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 25,
                delay: 0.35,
              }}
            >
              <Icon
                size={iconSize}
                className="text-white"
                stroke={2.5}
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Ikona normalna (widoczna gdy nieaktywna) */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-1"
        variants={itemVariants}
        initial="idle"
        animate={isActive ? 'active' : 'idle'}
        whileHover="hover"
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {!isActive && (
          <Icon
            size={iconSize}
            className={`transition-colors duration-200 text-foreground-700 group-hover:text-foreground-800`}
            stroke={2}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </Link>
  )
}
