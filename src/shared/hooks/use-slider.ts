import { useState, useCallback } from 'react'
import type { PanInfo } from 'framer-motion'

interface UseSliderOptions {
  totalSlides: number
}

interface UseSliderReturn {
  currentIndex: number
  next: () => void
  previous: () => void
  goTo: (index: number) => void
  handleDragEnd: (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function useSlider({ totalSlides }: UseSliderOptions): UseSliderReturn {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1))
  }, [totalSlides])

  const previous = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)))
    },
    [totalSlides],
  )

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 50
      const velocity = info.velocity.x

      if (Math.abs(velocity) > 500) {
        if (velocity > 0) {
          previous()
        } else {
          next()
        }
      } else if (Math.abs(info.offset.x) > threshold) {
        if (info.offset.x > 0) {
          previous()
        } else {
          next()
        }
      }
    },
    [next, previous],
  )

  return {
    currentIndex,
    next,
    previous,
    goTo,
    handleDragEnd,
    canGoNext: currentIndex < totalSlides - 1,
    canGoPrevious: currentIndex > 0,
  }
}

