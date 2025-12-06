import { type PropsWithChildren } from 'react'

export const NavigationBarContainer = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* Warstwa glass effect - całkowicie oddzielona, fixed position */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[49] border-t border-white/20 shadow-2xl lg:left-0 lg:top-0 lg:right-auto lg:h-screen lg:w-20 lg:border-t-0 lg:border-r lg:border-r-white/20"
        style={{
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          height: 'var(--nav-height, 64px)',
          width: '100%',
          pointerEvents: 'none',
        }}
      />
      <nav
        aria-label="Główna nawigacja"
        role="navigation"
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-row items-center justify-around gap-1 overflow-visible lg:left-0 lg:top-0 lg:right-auto lg:h-screen lg:w-20 lg:flex-col lg:justify-start lg:gap-0"
        style={{
          height: 'var(--nav-height, 64px)',
          width: '100%',
        }}
      >
        {children}
      </nav>
    </>
  )
}
