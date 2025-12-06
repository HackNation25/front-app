import { Suspense } from 'react'
import {
  createRootRouteWithContext,
  useMatchRoute,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../shared/integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
<<<<<<< HEAD
import { MobileWrapper } from '@/components/mobile-wrapper'
import { NavigationBarWrapper } from '@/features/layout/navigation-bar-wrapper'
import { BackButton } from '@/features/layout/back-button'
import { NAVIGATION_ROUTES } from '@/shared/const/navigation'
import { LayoutProvider } from '@/shared/contexts/layout-context'
import { ProfileButtonFeature } from '@/features/layout/profile-button'
=======
import { MobileWrapper } from '@/features/swipe/components/mobile-wrapper.tsx'
>>>>>>> origin/main

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

  return (
    <>
      <LayoutProvider>
        <MobileWrapper>
          <div className="flex min-h-screen flex-col pb-20 lg:flex-row lg:pb-0 lg:pl-20">
            <Suspense
              fallback={
                <div className="flex flex-1 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground-200 border-t-primary-600" />
                </div>
              }
            >
              <div>
                <Outlet />
              </div>
            </Suspense>
          </div>

          {/* Navbar wrapper with Activity and Framer Motion animations */}
          <NavigationBarWrapper isVisible={!isSwipeRoute} />

          {/* Back button - appears only on /swipe route */}
          <BackButton isVisible={isSwipeRoute} />

          {/* Profile button - floating icon in top-right corner */}
          <ProfileButtonFeature />
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
