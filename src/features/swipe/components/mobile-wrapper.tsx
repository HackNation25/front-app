import type { ReactNode } from 'react'

interface MobileWrapperProps {
  children: ReactNode
}

export function MobileWrapper({ children }: MobileWrapperProps) {
  return (
    <div className="flex min-h-screen justify-center">
      <div className="relative w-full max-w-[500px] bg-white min-h-screen">
        {children}
      </div>
    </div>
  )
}
