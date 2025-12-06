import { NavigationBarItemV2 } from './navigation-bar-item-v2'
import { NAVIGATION_ITEMS } from '@/shared/const/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationBarWrapperProps {
  className?: string
  isVisible: boolean
}

/**
 * NavigationBarWrapper - zawsze widoczny oprócz /swipe
 * Z animacją chowania w dół i pojawiania się w górę
 */
export function NavigationBarWrapper({
  className = '',
  isVisible,
}: NavigationBarWrapperProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Glass effect layer */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed bottom-0 left-1/2 z-[48] border-t border-white/20 shadow-2xl w-full max-w-[500px] h-12 sm:h-16 bg-white/10 backdrop-blur-[16px] backdrop-saturate-[180%] pointer-events-none -translate-x-1/2"
          />

          {/* Navbar container */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-row items-stretch overflow-visible w-full max-w-[500px] h-12 sm:h-16 ${className}`}
          >
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationBarItemV2 key={item.path} item={item} />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
