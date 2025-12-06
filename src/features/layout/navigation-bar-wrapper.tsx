import { NavigationBarItemV2 } from './navigation-bar-item-v2'
import { NAVIGATION_ITEMS } from '@/shared/const/navigation'

interface NavigationBarWrapperProps {
  className?: string
  isVisible: boolean
}

/**
 * NavigationBarWrapper - zawsze widoczny oprócz /swipe
 */
export function NavigationBarWrapper({
  className = '',
  isVisible,
}: NavigationBarWrapperProps) {
  if (!isVisible) return null

  return (
    <>
      {/* Glass effect layer */}
      <div className="fixed bottom-0 left-1/2 z-[48] border-t border-white/20 shadow-2xl w-full max-w-[500px] h-12 sm:h-16 bg-white/10 backdrop-blur-[16px] backdrop-saturate-[180%] pointer-events-none -translate-x-1/2" />

      {/* Navbar container */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-row items-stretch overflow-visible w-full max-w-[500px] h-12 sm:h-16 ${className}`}
      >
        {NAVIGATION_ITEMS.map((item) => (
          <NavigationBarItemV2 key={item.path} item={item} />
        ))}
      </div>
    </>
  )
}
