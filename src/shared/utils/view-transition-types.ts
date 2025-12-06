import type { Location } from '@tanstack/react-router'

export type ViewTransitionType = 'fade'

/**
 * Sprawdza czy przeglądarka obsługuje View Transitions API
 */
export function supportsViewTransitions(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

/**
 * Określa typ przejścia View Transition - zawsze fade
 */
export function getViewTransitionType(
  fromLocation: Location | undefined,
  toLocation: Location,
): ViewTransitionType[] {
  return ['fade']
}

