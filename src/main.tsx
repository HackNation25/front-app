import { StrictMode, useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'

import * as TanStackQueryProvider from './shared/integrations/tanstack-query/root-provider.tsx'
import {
  UserSessionProvider,
  useUserSessionContext,
} from './shared/contexts/user-session-context'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    userId: null as string | null,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Component that provides router context with userId
function RouterProviderWrapper() {
  const { userId } = useUserSessionContext()

  const routerContext = useMemo(
    () => ({
      ...TanStackQueryProviderContext,
      userId,
    }),
    [userId]
  )

  // Invalidate router when userId changes
  useEffect(() => {
    router.invalidate()
  }, [userId])

  return <RouterProvider router={router} context={routerContext} />
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <UserSessionProvider>
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <RouterProviderWrapper />
          <Toaster position="top-center" />
        </TanStackQueryProvider.Provider>
      </UserSessionProvider>
    </StrictMode>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
