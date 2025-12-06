import { useEffect, useState, useRef, type RefObject } from 'react'

interface UseElementSizeReturn {
  width: number
  height: number
}

export function useElementSize<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>,
): UseElementSizeReturn {
  const [size, setSize] = useState<UseElementSizeReturn>({ width: 0, height: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    const updateSize = () => {
      const newWidth = element.offsetWidth
      const newHeight = element.offsetHeight
      
      // Only update if size actually changed (prevent unnecessary re-renders)
      setSize((prev) => {
        if (prev.width === newWidth && prev.height === newHeight) {
          return prev
        }
        return { width: newWidth, height: newHeight }
      })
    }

    // Initial measurement with requestAnimationFrame to ensure layout is ready
    rafRef.current = requestAnimationFrame(() => {
      updateSize()
    })

    // Use ResizeObserver for efficient size tracking
    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to batch updates and prevent flickering
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(() => {
        updateSize()
      })
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [ref])

  return size
}

