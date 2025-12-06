import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { IconUserCircle } from '@tabler/icons-react'

interface ProfileButtonProps {
  className?: string
  'aria-label'?: string
}

const containerVariants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
  },
}

const textVariants = {
  hidden: {
    opacity: 0,
    x: -8,
    maxWidth: 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    maxWidth: 60,
  },
}

const iconVariants = {
  idle: {
    rotate: 0,
  },
  hover: {
    rotate: 5,
  },
}

export function ProfileButton({
  className = '',
  'aria-label': ariaLabel = 'Otwórz profil',
}: ProfileButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative flex items-center ${className}`}
      variants={containerVariants}
      initial="idle"
      animate={isHovered ? 'hover' : 'idle'}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      <Link
        to="/profile/settings"
        aria-label={ariaLabel}
        className="relative flex items-center gap-2 rounded-full bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 p-2.5 pr-3 text-white shadow-lg shadow-primary-500/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white/10 hover:from-primary-600 hover:via-primary-500 hover:to-primary-700"
      >
        <motion.div
          variants={iconVariants}
          animate={isHovered ? 'hover' : 'idle'}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          <IconUserCircle
            size={24}
            stroke={2}
            className="text-white shrink-0"
            aria-hidden="true"
          />
        </motion.div>
        
        {/* Tekst "Profil" wysuwający się po prawej stronie */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              className="whitespace-nowrap text-sm font-medium text-white"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                opacity: {
                  duration: 0.15,
                },
              }}
              style={{
                overflow: 'hidden',
                display: 'inline-block',
              }}
            >
              Profil
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  )
}

