import { useEffect, useState } from 'react'

export function ScreenSizeBlocker() {
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenWidth(window.innerWidth)
    }

    // Check on mount
    checkScreenSize()

    // Check on resize
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  // Show blocker if screen width is greater than 1024px
  if (screenWidth > 1024) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground-900 p-4">
        <div className="max-w-md rounded-2xl bg-foreground-800 p-8 text-center shadow-2xl">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-foreground-50">
            Aplikacja dostępna tylko na urządzeniach mobilnych
          </h1>
          <p className="mb-6 text-foreground-300">
            Ta aplikacja została zaprojektowana specjalnie dla urządzeń mobilnych
            (szerokość ekranu do 1024px). Proszę otwórz aplikację na telefonie lub
            tablecie, lub zmniejsz szerokość okna przeglądarki.
          </p>
          <div className="rounded-lg bg-foreground-700 p-4">
            <p className="text-sm text-foreground-400">
              Aktualna szerokość: <span className="font-semibold text-primary-400">{screenWidth}px</span>
            </p>
            <p className="mt-2 text-sm text-foreground-400">
              Wymagana szerokość: <span className="font-semibold text-primary-400">≤ 1024px</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

