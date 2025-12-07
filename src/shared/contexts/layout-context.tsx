import { createContext, useContext, useState, type ReactNode } from 'react'

interface LayoutContextValue {
  showProfileIcon: boolean
  setShowProfileIcon: (show: boolean) => void
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined)

interface LayoutProviderProps {
  children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [showProfileIcon, setShowProfileIcon] = useState(true)

  return (
    <LayoutContext.Provider value={{ showProfileIcon, setShowProfileIcon }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayoutContext() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayoutContext must be used within a LayoutProvider')
  }
  return context
}




