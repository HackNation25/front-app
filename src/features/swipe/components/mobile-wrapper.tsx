import type { ReactNode } from 'react'

interface MobileWrapperProps {
  children: ReactNode
}

export function MobileWrapper({ children }: MobileWrapperProps) {
  return (
    <div className="flex min-h-screen justify-center items-center w-full max-w-full overflow-x-hidden">
      <div className="relative w-full max-w-[500px] lg:max-w-[500px] xl:max-w-[500px] bg-gradient-to-br from-primary-100 via-secondary-50 to-accent-50 min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
