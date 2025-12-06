import { Link, useMatchRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import type { NavigationItem } from '@/shared/const/navigation'

interface NavigationBarItemProps {
  item: NavigationItem
}

const springConfig = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
}

const bubbleLayoutConfig = {
  type: 'spring' as const,
  stiffness: 450,
  damping: 32,
  mass: 0.5,
}

const splashConfig = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 28,
  mass: 0.35,
  delay: 0.05, // Splash zaczyna się tuż po bombelku
}

const splashWaveConfig = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 22,
  mass: 0.45,
  delay: 0.12, // Wave pojawia się gdy splash się rozszerza
}

const iconSplashConfig = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 26,
  mass: 0.38,
  delay: 0.1, // Ikona zaczyna się wysuwać gdy splash się rozszerza
}

const itemVariants = {
  idle: {
    scale: 1,
    y: 0,
  },
  active: {
    scale: 1,
    y: -2,
  },
  hover: {
    scale: 1.05,
    y: 0,
  },
}

export const NavigationBarItem = ({ item }: NavigationBarItemProps) => {
  const matchRoute = useMatchRoute()
  const isActive = matchRoute({ to: item.path, fuzzy: false })

  const Icon = item.icon

  const handleClick = () => {
    // Navigation handled by TanStack Router
  }

  return (
    <Link
      to={item.path}
      onClick={handleClick}
      aria-label={item.ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      className="group relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:bg-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-foreground-900 focus-visible:outline-none lg:min-h-[60px] lg:w-full lg:px-4"
    >
      {/* Bombelek - przesuwa się między routami, wyśrodkowany z ikonkami */}
      {isActive && (
        <motion.div
          layoutId="active-bubble"
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 shadow-lg shadow-primary-500/40 lg:left-full lg:h-14 lg:w-14 lg:translate-x-0"
          layout
          transition={bubbleLayoutConfig}
          aria-hidden="true"
        />
      )}

      {/* Splash - wychodzi z bombelka, cienki u podstawy, grubszy na końcu */}
      {isActive && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-full lg:translate-x-0"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={splashConfig}
          style={{
            transformOrigin: 'center center',
          }}
          aria-hidden="true"
        >
          {/* Mobile: splash w górę */}
          <motion.svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:hidden"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: 1,
              opacity: 1,
              y: [0, -3, -1, -2, 0], // Bounce effect na czubku
            }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{
              ...splashConfig,
              y: {
                duration: 0.6,
                times: [0, 0.3, 0.5, 0.7, 1],
                ease: [0.16, 1, 0.3, 1],
                delay: 0.4, // Bounce zaczyna się gdy splash się wysunie
              },
            }}
            style={{ transformOrigin: '50% 100%' }}
          >
            <defs>
              <linearGradient
                id="splash-gradient-mobile"
                x1="50%"
                y1="100%"
                x2="50%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor="rgb(33, 150, 243)"
                  stopOpacity="0.4"
                />
                <stop
                  offset="25%"
                  stopColor="rgb(66, 165, 245)"
                  stopOpacity="0.55"
                />
                <stop
                  offset="50%"
                  stopColor="rgb(100, 181, 246)"
                  stopOpacity="0.7"
                />
                <stop
                  offset="75%"
                  stopColor="rgb(144, 202, 249)"
                  stopOpacity="0.85"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(255, 235, 59)"
                  stopOpacity="0.95"
                />
              </linearGradient>
            </defs>
            {/* Główny kształt splash - cienki u podstawy (y=56), grubszy na końcu (y=0) */}
            <motion.path
              d="M 28 56 Q 26 50, 27 42 Q 25 34, 27 28 Q 25 22, 28 20 Q 31 22, 29 28 Q 31 34, 29 42 Q 31 50, 28 56 Z"
              fill="url(#splash-gradient-mobile)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ ...splashConfig, delay: 0.05 }}
            />
            <motion.ellipse
              cx="28"
              cy="18"
              rx="7"
              ry="10"
              fill="url(#splash-gradient-mobile)"
              opacity="0.7"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              transition={{ ...splashConfig, delay: 0.1 }}
            />
            <motion.ellipse
              cx="27"
              cy="14"
              rx="5"
              ry="7"
              fill="url(#splash-gradient-mobile)"
              opacity="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ ...splashConfig, delay: 0.15 }}
            />
            {/* Wave effect na końcu - bardziej skaczący */}
            <motion.circle
              cx="28"
              cy="12"
              r="3"
              fill="url(#splash-gradient-mobile)"
              opacity="0.6"
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{
                scale: [0, 1.3, 0.9, 1.1, 1],
                opacity: [0, 0.7, 0.5, 0.6, 0.4],
                y: [0, -4, -2, -3, 0], // Bounce w górę i w dół
              }}
              transition={{
                ...splashWaveConfig,
                scale: {
                  duration: 0.7,
                  times: [0, 0.3, 0.5, 0.7, 1],
                  ease: [0.16, 1, 0.3, 1],
                },
                y: {
                  duration: 0.6,
                  times: [0, 0.3, 0.5, 0.7, 1],
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4,
                },
              }}
            />
          </motion.svg>
          {/* Desktop: splash w prawo */}
          <motion.svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block"
            initial={{ x: 0, scaleX: 0 }}
            animate={{ x: 8, scaleX: 1 }}
            transition={splashConfig}
            style={{ transformOrigin: '0% 50%' }}
          >
            <defs>
              <linearGradient
                id="splash-gradient-desktop"
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
              >
                <stop
                  offset="0%"
                  stopColor="rgb(33, 150, 243)"
                  stopOpacity="0.4"
                />
                <stop
                  offset="25%"
                  stopColor="rgb(66, 165, 245)"
                  stopOpacity="0.55"
                />
                <stop
                  offset="50%"
                  stopColor="rgb(100, 181, 246)"
                  stopOpacity="0.7"
                />
                <stop
                  offset="75%"
                  stopColor="rgb(144, 202, 249)"
                  stopOpacity="0.85"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(255, 235, 59)"
                  stopOpacity="0.95"
                />
              </linearGradient>
            </defs>
            {/* Główny kształt splash - cienki u podstawy (x=0), grubszy na końcu (x=56) */}
            <motion.path
              d="M 0 28 Q 6 26, 14 27 Q 22 25, 28 27 Q 34 25, 42 27 Q 50 26, 56 28 Q 50 30, 42 29 Q 34 31, 28 29 Q 22 31, 14 29 Q 6 30, 0 28 Z"
              fill="url(#splash-gradient-desktop)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ ...splashConfig, delay: 0.05 }}
            />
            <motion.ellipse
              cx="38"
              cy="28"
              rx="10"
              ry="7"
              fill="url(#splash-gradient-desktop)"
              opacity="0.7"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              transition={{ ...splashConfig, delay: 0.1 }}
            />
            <motion.ellipse
              cx="42"
              cy="28"
              rx="7"
              ry="5"
              fill="url(#splash-gradient-desktop)"
              opacity="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ ...splashConfig, delay: 0.15 }}
            />
            {/* Wave effect na końcu */}
            <motion.circle
              cx="46"
              cy="28"
              r="3"
              fill="url(#splash-gradient-desktop)"
              opacity="0.6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 0.6, 0.4] }}
              transition={splashWaveConfig}
            />
          </motion.svg>
        </motion.div>
      )}

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-1"
        variants={itemVariants}
        initial="idle"
        animate={isActive ? 'active' : 'idle'}
        whileHover="hover"
        transition={springConfig}
      >
        {/* Mobile: ikona wysuwa się w górę z chwilowym zwężeniem */}
        <motion.div
          className="relative z-10 lg:hidden"
          animate={
            isActive
              ? {
                  y: [-2, -6, -4],
                  scale: [1, 0.85, 1.08],
                  scaleX: [1, 0.7, 1],
                }
              : { y: 0, scale: 1, scaleX: 1 }
          }
          transition={{
            ...iconSplashConfig,
            times: [0, 0.4, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Icon
            size={24}
            className={`transition-colors duration-200 ${
              isActive
                ? 'text-white'
                : 'text-foreground-400 group-hover:text-foreground-200'
            }`}
            stroke={isActive ? 2.5 : 2}
            aria-hidden="true"
          />
        </motion.div>
        {/* Desktop: ikona wysuwa się w prawo z chwilowym zwężeniem */}
        <motion.div
          className="relative z-10 hidden lg:block"
          animate={
            isActive
              ? {
                  x: [0, 2, 3],
                  scale: [1, 0.85, 1.08],
                  scaleX: [1, 0.7, 1],
                }
              : { x: 0, scale: 1, scaleX: 1 }
          }
          transition={{
            ...iconSplashConfig,
            times: [0, 0.4, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Icon
            size={24}
            className={`transition-colors duration-200 ${
              isActive
                ? 'text-white'
                : 'text-foreground-400 group-hover:text-foreground-200'
            }`}
            stroke={isActive ? 2.5 : 2}
            aria-hidden="true"
          />
        </motion.div>
        <span
          className={`relative z-10 hidden text-xs transition-colors duration-200 lg:block ${
            isActive
              ? 'text-white font-semibold'
              : 'text-foreground-400 group-hover:text-foreground-200'
          }`}
        >
          {item.label}
        </span>
      </motion.div>
    </Link>
  )
}
