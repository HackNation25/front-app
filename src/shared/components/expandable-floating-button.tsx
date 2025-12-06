import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'

interface ExpandableFloatingButtonProps {
  /**
   * Whether the button should be visible
   */
  isVisible: boolean
  /**
   * Position of the button - 'left' or 'right'
   */
  position: 'left' | 'right'
  /**
   * Text to display when expanded
   */
  text: string
  /**
   * Icon component to display
   */
  icon: ReactNode
  /**
   * Route to navigate to when clicked
   */
  to: string
  /**
   * Optional aria-label for accessibility
   */
  'aria-label'?: string
  /**
   * Optional className for custom styling
   */
  className?: string
}

const createContainerVariants = (position: 'left' | 'right') => ({
  hidden: {
    opacity: 0,
    x: position === 'left' ? -20 : 20,
    y: position === 'right' ? -20 : 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: position === 'left' ? -20 : 20,
    y: position === 'right' ? -20 : 0,
    scale: 0.9,
  },
})

const buttonVariants = {
  idle: {
    scale: 1,
    backgroundColor: 'rgba(33, 150, 243, 0.9)', // primary-500 with opacity
  },
  hover: {
    scale: 1.05,
    backgroundColor: 'rgba(30, 136, 229, 0.95)', // primary-600 with opacity
  },
  focus: {
    scale: 1.05,
    backgroundColor: 'rgba(30, 136, 229, 0.95)',
    boxShadow: '0 0 0 3px rgba(244, 67, 54, 0.5)', // accent-500 ring
  },
  active: {
    scale: 0.95,
  },
}

const iconVariants = {
  idle: {
    x: 0,
  },
  hover: {
    x: -2,
  },
}

const textVariants = {
  visible: {
    opacity: 1,
    x: 0,
    maxWidth: 200,
  },
  hidden: {
    opacity: 0,
    x: -8,
    maxWidth: 0,
  },
}

const textTransition = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 25,
  mass: 1,
  opacity: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  },
}

const containerTransition = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 20,
  mass: 0.8,
}

const buttonTransition = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 25,
  mass: 1,
}

export function ExpandableFloatingButton({
  isVisible,
  position,
  text,
  icon,
  to,
  'aria-label': ariaLabel,
  className = '',
}: ExpandableFloatingButtonProps) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [offset, setOffset] = useState(() => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0
    if (viewportWidth >= 500) {
      const offset = (viewportWidth - 500) / 2 + 16
      return `${offset}px`
    }
    return '1rem'
  })
  const [showText, setShowText] = useState(true)
  const hideTextTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasStartedTimerRef = useRef(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isHoveredRef = useRef(false)
  const isFocusedRef = useRef(false)

  useEffect(() => {
    const updateOffset = () => {
      const viewportWidth = window.innerWidth
      if (viewportWidth >= 500) {
        const offset = (viewportWidth - 500) / 2 + 16
        setOffset(`${offset}px`)
      } else {
        setOffset('1rem')
      }
    }

    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [])

  const handleClick = () => {
    navigate({ to })
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  const containerVariants = createContainerVariants(position)

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        // Reset gdy przycisk znika
        if (hideTextTimerRef.current) {
          clearTimeout(hideTextTimerRef.current)
          hideTextTimerRef.current = null
        }
        hasStartedTimerRef.current = false
        isHoveredRef.current = false
        isFocusedRef.current = false
        setShowText(true)
      }}
    >
      {isVisible && (
        <motion.div
          key={`expandable-button-${isVisible}`}
          className={`fixed top-4 z-50 ${className}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={containerTransition}
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
            [position]: offset,
          }}
          onAnimationComplete={() => {
            // Gdy animacja wejścia się zakończy, uruchom timer na ukrycie tekstu
            if (!hasStartedTimerRef.current) {
              hasStartedTimerRef.current = true
              setShowText(true) // Upewnij się że tekst jest widoczny
              // Usuń focus jeśli został automatycznie ustawiony
              if (
                buttonRef.current &&
                document.activeElement === buttonRef.current
              ) {
                buttonRef.current.blur()
              }
              hideTextTimerRef.current = setTimeout(() => {
                // Ukryj tekst tylko jeśli nie ma hoveru ani focusu
                if (!isHoveredRef.current && !isFocusedRef.current) {
                  setShowText(false)
                }
              }, 1000) // 1 sekunda po zakończeniu animacji
            }
          }}
          onHoverStart={() => {
            setIsHovered(true)
            isHoveredRef.current = true
            setShowText(true)
            if (hideTextTimerRef.current) {
              clearTimeout(hideTextTimerRef.current)
              hideTextTimerRef.current = null
            }
          }}
          onHoverEnd={() => {
            setIsHovered(false)
            isHoveredRef.current = false
            // Jeśli nie ma focusu, uruchom timer na ukrycie tekstu
            if (!isFocusedRef.current && isVisible) {
              if (hideTextTimerRef.current) {
                clearTimeout(hideTextTimerRef.current)
              }
              hideTextTimerRef.current = setTimeout(() => {
                setShowText(false)
              }, 1000) // 1 sekunda po zakończeniu hover
            }
          }}
        >
          <motion.button
            ref={buttonRef}
            type="button"
            layout
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              // Zapobiegaj automatycznemu focusowi przy pierwszym renderze
              if (!hasStartedTimerRef.current) {
                e.currentTarget.blur()
                return
              }
              setIsFocused(true)
              isFocusedRef.current = true
              setShowText(true)
              // Resetuj timer gdy jest focus
              if (hideTextTimerRef.current) {
                clearTimeout(hideTextTimerRef.current)
                hideTextTimerRef.current = null
              }
            }}
            onBlur={() => {
              setIsFocused(false)
              isFocusedRef.current = false
              // Jeśli nie ma hoveru, zawsze uruchom timer na ukrycie tekstu
              if (!isHoveredRef.current && isVisible) {
                // Wyczyść istniejący timer
                if (hideTextTimerRef.current) {
                  clearTimeout(hideTextTimerRef.current)
                  hideTextTimerRef.current = null
                }
                // Uruchom nowy timer
                hideTextTimerRef.current = setTimeout(() => {
                  // Sprawdź ponownie czy nie ma hoveru ani focusu przed ukryciem
                  if (!isHoveredRef.current && !isFocusedRef.current) {
                    setShowText(false)
                  }
                }, 1000) // 1 sekunda po zakończeniu focus
              }
            }}
            aria-label={ariaLabel}
            className="flex items-center gap-2 rounded-full text-white shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white/10 overflow-hidden"
            style={{
              backgroundColor: 'rgba(33, 150, 243, 0.9)', // primary-500
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              height: '48px',
              minWidth: '48px', // WCAG 2.1 minimum touch target size
              minHeight: '48px',
              paddingLeft: '12px',
            }}
            variants={buttonVariants}
            initial="idle"
            animate={{
              ...(isFocused
                ? buttonVariants.focus
                : isHovered
                  ? buttonVariants.hover
                  : buttonVariants.idle),
              paddingRight:
                showText || isHovered || isFocused ? '16px' : '12px',
            }}
            whileTap="active"
            transition={buttonTransition}
          >
            <motion.div
              variants={iconVariants}
              animate={isHovered ? 'hover' : 'idle'}
              transition={buttonTransition}
              className="flex-shrink-0"
            >
              {icon}
            </motion.div>
            <motion.span
              layout
              variants={textVariants}
              animate={
                showText || isHovered || isFocused ? 'visible' : 'hidden'
              }
              initial="visible"
              transition={textTransition}
              className="whitespace-nowrap text-sm font-medium pr-1"
              style={{
                overflow: 'hidden',
                display: 'inline-block',
              }}
            >
              {text}
            </motion.span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
