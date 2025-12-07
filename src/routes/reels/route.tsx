import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion'

export const Route = createFileRoute('/reels')({
  component: RouteComponent,
})

// Lista filmików YouTube o Bydgoszczy - około 20 filmików
// Uwaga: Większość ID to placeholdery - zastąp je prawdziwymi ID filmów o Bydgoszczy
const reels = [
  {
    id: 'xqYUWkUKlII', // Prawdziwy film o Bydgoszczy
    title: 'Bydgoszcz - Spacer po mieście',
    description: '4K HDR - Old Market Square, Mill Island, Brda River',
  },
  {
    id: 'YQHsXMglC9A', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Najpiękniejsze miejsca',
    description: 'Odkryj najciekawsze zakątki miasta',
  },
  {
    id: 'dQw4w9WgXcQ', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Historia i kultura',
    description: 'Zabytki i dziedzictwo kulturowe',
  },
  {
    id: 'jNQXAC9IVRw', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Brda i Wyspa Młyńska',
    description: 'Spacer wzdłuż rzeki Brdy',
  },
  {
    id: 'kJQP7kiw5Fk', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Nocne życie',
    description: 'Miasto po zmroku',
  },
  {
    id: 'L_jWHffIx5E', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Architektura',
    description: 'Najpiękniejsze budynki',
  },
  {
    id: 'fJ9rUzIMcZQ', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Parki i zieleń',
    description: 'Zielone przestrzenie miasta',
  },
  {
    id: 'ScMzIvxBSi4', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Kultura i sztuka',
    description: 'Muzea i galerie',
  },
  {
    id: '9bZkp7q19f0', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Kulinaria',
    description: 'Najlepsze restauracje',
  },
  {
    id: 'dQw4w9WgXcQ', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Sport i rekreacja',
    description: 'Aktywności na świeżym powietrzu',
  },
  {
    id: 'jNQXAC9IVRw', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Zabytki',
    description: 'Historyczne miejsca',
  },
  {
    id: 'kJQP7kiw5Fk', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Mosty',
    description: 'Najpiękniejsze mosty nad Brdą',
  },
  {
    id: 'L_jWHffIx5E', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Festiwale',
    description: 'Wydarzenia kulturalne',
  },
  {
    id: 'fJ9rUzIMcZQ', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Stare Miasto',
    description: 'Serce miasta',
  },
  {
    id: 'ScMzIvxBSi4', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Muzyka',
    description: 'Scena muzyczna',
  },
  {
    id: '9bZkp7q19f0', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Edukacja',
    description: 'Szkoły i uczelnie',
  },
  {
    id: 'dQw4w9WgXcQ', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Transport',
    description: 'Komunikacja miejska',
  },
  {
    id: 'jNQXAC9IVRw', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Rozrywka',
    description: 'Miejsca rozrywki',
  },
  {
    id: 'kJQP7kiw5Fk', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Zakupy',
    description: 'Centra handlowe',
  },
  {
    id: 'L_jWHffIx5E', // Placeholder - zastąp prawdziwym ID
    title: 'Bydgoszcz - Panorama',
    description: 'Widoki z góry',
  },
]

const SWIPE_THRESHOLD = 50

function RouteComponent() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)
  const opacity = useTransform(y, [-200, 0, 200], [0.5, 1, 0.5])

  const goToNext = useCallback(() => {
    if (currentIndex < reels.length - 1 && !isTransitioning) {
      setIsTransitioning(true)
      y.set(0) // Reset pozycji przed przejściem
      setCurrentIndex((prev) => prev + 1)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [currentIndex, isTransitioning, y])

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true)
      y.set(0) // Reset pozycji przed przejściem
      setCurrentIndex((prev) => prev - 1)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [currentIndex, isTransitioning, y])

  // Obsługa przewijania myszką/touchpad
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isTransitioning) return

      if (e.deltaY > 0 && currentIndex < reels.length - 1) {
        // Przewijanie w dół - następny filmik
        goToNext()
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Przewijanie w górę - poprzedni filmik
        goToPrevious()
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel)
    }
  }, [currentIndex, isTransitioning, goToNext, goToPrevious])

  // Obsługa klawiatury (strzałki góra/dół)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return

      if (e.key === 'ArrowDown' && currentIndex < reels.length - 1) {
        goToNext()
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        goToPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isTransitioning, goToNext, goToPrevious])

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (isTransitioning) {
      y.set(0)
      return
    }

    if (info.offset.y < -SWIPE_THRESHOLD && currentIndex < reels.length - 1) {
      // Przeciągnięcie w górę - następny filmik
      goToNext()
    } else if (info.offset.y > SWIPE_THRESHOLD && currentIndex > 0) {
      // Przeciągnięcie w dół - poprzedni filmik
      goToPrevious()
    } else {
      // Powrót do pozycji startowej
      y.set(0)
    }
  }

  const currentReel = reels[currentIndex]
  const nextReel = reels[currentIndex + 1]
  const prevReel = reels[currentIndex - 1]

  // Transform dla poprzedniego i następnego filmiku podczas przeciągania
  const prevY = useTransform(y, (val) => (val > 0 ? val : 0))
  const nextY = useTransform(y, (val) => (val < 0 ? val : 0))

  // Transform dla pozycji poprzedniego i następnego filmiku
  const prevYTransform = useTransform(prevY, (val) => `calc(-100% + ${val}px)`)
  const nextYTransform = useTransform(nextY, (val) => `calc(100% + ${val}px)`)

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-black overflow-hidden touch-none pb-12 sm:pb-16"
    >
      <div className="absolute inset-0">
        {/* Poprzedni filmik (w tle) - zawsze renderowany jeśli istnieje */}
        {prevReel && (
          <motion.div
            key={`prev-${currentIndex - 1}`}
            className="absolute inset-0"
            style={{ y: prevYTransform }}
            initial={false}
          >
            <VideoPlayer videoId={prevReel.id} isActive={false} />
          </motion.div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {/* Aktualny filmik */}
          {currentReel && (
            <motion.div
              key={`current-${currentIndex}`}
              style={{ y, opacity }}
              className="absolute inset-0 z-10"
              initial={{ y: currentIndex === 0 ? 0 : '100%' }}
              animate={{ y: 0 }}
              exit={{ y: currentIndex === 0 ? '-100%' : '100%' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <VideoPlayer videoId={currentReel.id} isActive={true} />
              <VideoOverlay reel={currentReel} />
              {/* Warstwa przeciągania - nad iframe YouTube, przechwytuje zdarzenia */}
              <motion.div
                drag="y"
                dragConstraints={{ top: -300, bottom: 300 }}
                dragElastic={0.3}
                onDragEnd={handleDragEnd}
                onDrag={(_, info) => {
                  // Synchronizuj pozycję z głównym kontenerem podczas przeciągania
                  y.set(info.offset.y)
                }}
                style={{ y: 0 }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing z-50 touch-none pointer-events-auto"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Następny filmik (w tle) - zawsze renderowany jeśli istnieje */}
        {nextReel && (
          <motion.div
            key={`next-${currentIndex + 1}`}
            className="absolute inset-0"
            style={{ y: nextYTransform }}
            initial={false}
          >
            <VideoPlayer videoId={nextReel.id} isActive={false} />
          </motion.div>
        )}
      </div>

      {/* Wskaźnik przewijania */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {reels.map((_, index) => (
          <motion.div
            key={index}
            className={`w-1.5 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white h-8' : 'bg-white/40 h-4'
            }`}
            animate={{
              scale: index === currentIndex ? 1.2 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>

      {/* Instrukcja */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 text-white/60 text-sm text-center px-4"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
      >
        Przesuń w górę lub w dół, aby zmienić filmik
      </motion.div>
    </div>
  )
}

interface VideoPlayerProps {
  videoId: string
  isActive: boolean
}

function VideoPlayer({ videoId, isActive }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current && isActive) {
      // Autoplay dla aktywnego filmiku
      const iframe = iframeRef.current
      const src = iframe.src
      if (!src.includes('autoplay=1')) {
        iframe.src = src.replace('autoplay=0', 'autoplay=1')
      }
    }
  }, [isActive])

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="w-full h-full relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isActive ? 1 : 0}&mute=0&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}&enablejsapi=1&playsinline=1&iv_load_policy=3`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}

interface VideoOverlayProps {
  reel: { id: string; title: string; description: string }
}

function VideoOverlay({ reel }: VideoOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {/* Gradient na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Informacje o filmiku */}
      <div className="absolute bottom-12 sm:bottom-16 left-0 right-0 p-6 text-white">
        <motion.h2
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {reel.title}
        </motion.h2>
        <motion.p
          className="text-white/80 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {reel.description}
        </motion.p>
      </div>
    </div>
  )
}
