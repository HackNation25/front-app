import { Link, useMatchRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import type { MenuItem } from '@/shared/types/menu-item'

interface MenuListProps {
  items: MenuItem[]
  ariaLabel?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
}

export function MenuList({
  items,
  ariaLabel = 'Menu nawigacyjne',
}: MenuListProps) {
  const matchRoute = useMatchRoute()

  return (
    <nav
      className="grid grid-cols-3 gap-2"
      role="navigation"
      aria-label={ariaLabel}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="contents"
      >
        {items.map((item) => {
          const isActive = matchRoute({ to: item.path, fuzzy: false })
          const Icon = item.icon
          const ariaLabelText = item.ariaLabel || `Przejdź do ${item.label}`

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={item.path}
                className={`
                  group relative flex flex-col items-center justify-center gap-2 p-3
                  bg-white rounded-lg shadow-lg border border-foreground-200
                  transition-all duration-200 min-h-[80px]
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  hover:shadow-xl hover:bg-primary-50
                  ${isActive ? 'ring-2 ring-primary-500 ring-offset-2 bg-primary-50' : ''}
                `}
                aria-label={ariaLabelText}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Ikona */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    rotate: isActive ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{
                    scale: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 20,
                    },
                    rotate: isActive
                      ? {
                          type: 'keyframes',
                          values: [0, -5, 5, 0],
                          times: [0, 0.33, 0.66, 1],
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }
                      : {
                          type: 'spring',
                          stiffness: 400,
                          damping: 20,
                        },
                  }}
                >
                  <Icon
                    size={24}
                    className={`
                      transition-colors duration-200
                      ${
                        isActive
                          ? 'text-primary-600'
                          : 'text-primary-500 group-hover:text-primary-600'
                      }
                    `}
                    stroke={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                </motion.div>

                {/* Label */}
                <span
                  className={`
                    text-xs font-medium text-center line-clamp-2
                    transition-colors duration-200
                    ${
                      isActive
                        ? 'text-foreground-800'
                        : 'text-foreground-700 group-hover:text-foreground-800'
                    }
                  `}
                  aria-hidden="true"
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 20,
                    }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </nav>
  )
}
