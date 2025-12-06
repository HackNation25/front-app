import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSlider } from '@/shared/hooks/use-slider'
import { Card } from '@/shared/components/card'
import { RouteCard } from './route-card'
import type { RouteItem } from '@/shared/types/route'

interface FloatingCardsSliderProps {
  title: string
  items: RouteItem[]
  ariaLabel?: string
}

export function FloatingCardsSlider({
  title,
  items,
  ariaLabel = 'Slider z kartami',
}: FloatingCardsSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const lastWidthRef = useRef(0)

  const {
    currentIndex,
    next,
    previous,
    handleDragEnd,
    canGoNext,
    canGoPrevious,
  } = useSlider({
    totalSlides: items.length,
  })

  // Stable measurement function with larger threshold for large screens
  const measureWidth = useCallback(() => {
    const element = containerRef.current
    if (!element) return

    // Use clientWidth instead of getBoundingClientRect for more stable measurement
    // clientWidth excludes padding and is more reliable for layout calculations
    const newWidth = element.clientWidth

    // Use larger threshold (5px) to prevent excessive updates on large screens
    // This prevents flickering when width changes by tiny amounts
    if (Math.abs(newWidth - lastWidthRef.current) >= 5) {
      lastWidthRef.current = newWidth
      setContainerWidth(newWidth)
    }
  }, [])

  // Measure container width with debouncing
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    let rafId: number | null = null
    let timeoutId: NodeJS.Timeout | null = null
    let resizeTimeoutId: NodeJS.Timeout | null = null

    // Initial measurement
    timeoutId = setTimeout(() => {
      measureWidth()
    }, 100)

    // Use ResizeObserver with stronger debouncing for large screens
    const resizeObserver = new ResizeObserver(() => {
      // Cancel any pending updates
      if (rafId) cancelAnimationFrame(rafId)
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId)

      // Double debounce: requestAnimationFrame + timeout for large screens
      rafId = requestAnimationFrame(() => {
        resizeTimeoutId = setTimeout(() => {
          measureWidth()
        }, 150) // Longer delay for large screens
      })
    })

    resizeObserver.observe(element)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId)
      resizeObserver.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [measureWidth])

  // Calculate slide width: show 3 cards at once
  // Padding is now in outer container, so we use full containerWidth
  // We want 3 cards visible with 2 gaps between them (16px each)
  const gapPx = 16 // 1rem gap between cards

  // Use useMemo to stabilize calculations and prevent infinite loops
  const { slideWidthPx, x, maxDrag } = useMemo(() => {
    // Don't calculate if width is not ready or too small
    if (containerWidth < 100) {
      return {
        slideWidthPx: 0,
        x: 0,
        maxDrag: 0,
      }
    }

    // Use full container width (padding is handled by outer container)
    const availableWidth = containerWidth

    // Round to avoid sub-pixel rendering issues
    const calculatedSlideWidth = Math.round((availableWidth - gapPx * 2) / 3)
    const slideWithGap = calculatedSlideWidth + gapPx

    // Round calculations to avoid floating point precision issues
    const calculatedX = Math.round(-currentIndex * slideWithGap)
    const calculatedMaxDrag = Math.round(-(items.length - 1) * slideWithGap)

    return {
      slideWidthPx: calculatedSlideWidth,
      x: calculatedX,
      maxDrag: calculatedMaxDrag,
    }
  }, [containerWidth, currentIndex, items.length, gapPx])

  const isReady = containerWidth > 0

  const headingId = `floating-cards-heading-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <section className="w-full py-6 px-4" aria-labelledby={headingId}>
      <Card>
        <h2
          id={headingId}
          className="text-2xl font-bold mb-4 px-6 text-accent-800"
        >
          {title}
        </h2>
        <div className="w-full">
          <div
            ref={containerRef}
            className="relative overflow-x-hidden overflow-y-visible w-full py-8"
            role="region"
            aria-label={ariaLabel}
            aria-live="polite"
            aria-atomic="true"
          >
            {isReady ? (
              <motion.div
                className="flex"
                style={{ gap: `${gapPx}px` }}
                animate={{ x }}
                drag="x"
                dragConstraints={{ left: maxDrag, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {items.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    width={slideWidthPx}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex gap-4" style={{ minHeight: '200px' }}>
                {/* Placeholder while measuring */}
              </div>
            )}
          </div>
        </div>
        <div
          className="flex justify-end gap-2 mt-4 px-6"
          role="group"
          aria-label={`Nawigacja slidera ${title}`}
        >
          <button
            onClick={previous}
            disabled={!canGoPrevious}
            aria-disabled={!canGoPrevious}
            aria-label={
              canGoPrevious
                ? `Przejdź do poprzedniego slajdu. Obecnie slajd ${currentIndex + 1} z ${items.length}`
                : `Nie można przejść do poprzedniego slajdu. Obecnie slajd ${currentIndex + 1} z ${items.length}`
            }
            className={`bg-white/90 rounded-full p-2 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              canGoPrevious
                ? 'hover:bg-white cursor-pointer opacity-100 hover:shadow-xl'
                : 'cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronLeft
              className="w-6 h-6 text-foreground-700"
              aria-hidden="true"
            />
          </button>

          <button
            onClick={next}
            disabled={!canGoNext}
            aria-disabled={!canGoNext}
            aria-label={
              canGoNext
                ? `Przejdź do następnego slajdu. Obecnie slajd ${currentIndex + 1} z ${items.length}`
                : `Nie można przejść do następnego slajdu. Obecnie slajd ${currentIndex + 1} z ${items.length}`
            }
            className={`bg-white/90 rounded-full p-2 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              canGoNext
                ? 'hover:bg-white cursor-pointer opacity-100 hover:shadow-xl'
                : 'cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronRight
              className="w-6 h-6 text-foreground-700"
              aria-hidden="true"
            />
          </button>
        </div>
      </Card>
    </section>
  )
}
