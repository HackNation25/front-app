import { Suspense, useEffect, useState } from 'react'
import {
  createRootRouteWithContext,
  useMatchRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../shared/integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
import { MobileWrapper } from '@/features/swipe/components/mobile-wrapper'
import { NavigationBarWrapper } from '@/features/layout/navigation-bar-wrapper'
import { BackButton } from '@/features/layout/back-button'
import { NAVIGATION_ROUTES } from '@/shared/const/navigation'
import { LayoutProvider } from '@/shared/contexts/layout-context'
import { ProfileButtonFeature } from '@/features/layout/profile-button'
import { ScreenSizeBlocker } from '@/shared/components/screen-size-blocker'
import { useUserSessionContext } from '@/shared/contexts/user-session-context'

interface MyRouterContext {
  queryClient: QueryClient
  userId: string | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: ({ context, location }) => {
    // Sprawdź liczbę swipów z localStorage
    let swipeCount = 0

    if (typeof window !== 'undefined') {
      const storedSwipeCount = localStorage.getItem('swipeCount')
      if (storedSwipeCount) {
        try {
          swipeCount = parseInt(storedSwipeCount, 10)
          if (isNaN(swipeCount)) swipeCount = 0
        } catch {
          swipeCount = 0
        }
      }
    }

    // Jeśli swipeCount < 3, blokuj nawigację niezależnie od userId
    if (swipeCount < 3) {
      // Sprawdź kategorie z localStorage
      let hasCategories = false

      if (typeof window !== 'undefined') {
        const storedCategories = localStorage.getItem('selectedCategories')
        if (storedCategories) {
          try {
            const parsed = JSON.parse(storedCategories)
            hasCategories = Array.isArray(parsed) && parsed.length >= 3
          } catch {
            hasCategories = false
          }
        }
      }

      // Jeśli ma kategorie, pozwól tylko na /profile/settings i /swipe
      if (hasCategories) {
        if (
          location.pathname !== '/profile/settings' &&
          location.pathname !== '/swipe'
        ) {
          throw redirect({
            to: '/swipe',
          })
        }
      }
      // Jeśli nie ma kategorii, pozwól tylko na /profile/settings
      else {
        if (location.pathname !== '/profile/settings') {
          throw redirect({
            to: '/profile/settings',
          })
        }
      }
    }
    // Jeśli swipeCount >= 3, pozwól na wszystkie routy (niezależnie od userId)
  },
  component: RootComponent,
})

function RootComponent() {
  const matchRoute = useMatchRoute()
  const isSwipeRoute = !!matchRoute({
    to: NAVIGATION_ROUTES.SWIPE,
    fuzzy: false,
  })

  const { userId, selectedCategories, swipeCount } = useUserSessionContext()
  const [screenWidth, setScreenWidth] = useState(0)

  // Sprawdź czy użytkownik może używać pełnej aplikacji
  // Pokazuj navbar i umożliwiaj nawigację tylko jeśli swipeCount >= 3
  // (niezależnie od userId - nawet jeśli ma userId, ale swipeCount < 3, nie pokazuj navbar)
  const hasCompletedOnboarding = swipeCount >= 3

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

  // Show blocker instead of app if screen width is greater than 1024px
  if (screenWidth > 1024) {
    return (
      <>
        <ScreenSizeBlocker />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      </>
    )
  }

  return (
    <>
      <LayoutProvider>
        <MobileWrapper>
          <div className="flex min-h-screen flex-col pb-20 lg:flex-row lg:pb-0 lg:pl-20">
            {/* Logo centered at top */}
            <img
              src="/logo.png"
              alt="Logo"
              className="absolute left-1/2 top-4 z-10 h-[50px] -translate-x-1/2"
            />
            <Suspense
              fallback={
                <div className="flex flex-1 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground-200 border-t-primary-600" />
                </div>
              }
            >
              <div className="flex-1 flex items-center justify-center pt-[100px]">
                <div className="w-full">
                  <Outlet />
                </div>
              </div>
            </Suspense>
          </div>

          {/* Navbar wrapper with Activity and Framer Motion animations */}
          <NavigationBarWrapper isVisible={hasCompletedOnboarding} />

          {/* Back button - appears on /swipe route if user has completed onboarding OR if has categories but no userId */}
          <BackButton
            isVisible={
              isSwipeRoute &&
              (hasCompletedOnboarding ||
                (selectedCategories.size >= 3 && userId === null))
            }
          />

          {/* Profile button - floating icon in top-right corner */}
          {hasCompletedOnboarding && <ProfileButtonFeature />}
        </MobileWrapper>
      </LayoutProvider>

      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  )
}
