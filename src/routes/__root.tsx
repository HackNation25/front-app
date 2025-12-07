import { useEffect, useState } from 'react'
import {
  createRootRouteWithContext,
  useMatchRoute,
  Outlet,
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
import { AppHeader } from '@/features/dashboard/header.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const matchRoute = useMatchRoute()
  const isSwipeRoute = !!matchRoute({
    to: NAVIGATION_ROUTES.SWIPE,
    fuzzy: false,
  })

  const isMapRoute = !!matchRoute({
    to: NAVIGATION_ROUTES.MAP,
    fuzzy: false,
  })

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
          <AppHeader enabled={!isMapRoute}>
            <Outlet />
          </AppHeader>

          {/* Navbar wrapper with Activity and Framer Motion animations */}
          <NavigationBarWrapper isVisible={!isSwipeRoute && !isMapRoute} />

          {/* Back button - appears only on /swipe route */}
          <BackButton isVisible={isSwipeRoute || isMapRoute} />

          {/* Profile button - floating icon in top-right corner */}
          {!isMapRoute && <ProfileButtonFeature />}
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
