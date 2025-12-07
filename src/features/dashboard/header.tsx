import { type ReactNode, Suspense } from 'react'

interface AppHeaderProps {
  children: ReactNode
  enabled: boolean
}

export function AppHeader({ enabled, children }: AppHeaderProps) {
  if (!enabled) return <>{children}</>

  return (
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
          <div className="w-full">{children}</div>
        </div>
      </Suspense>
    </div>
  )
}
