import type { ReactNode } from 'react'

interface MobileWrapperProps {
  children: ReactNode
}

export function MobileWrapper({ children }: MobileWrapperProps) {
  return (
    <div className="flex justify-center bg-neutral-800 h-screen">
      <div className="max-w-[400px] min-w-[400px] bg-neutral-600">
        {children}
      </div>
    </div>
  )
}
