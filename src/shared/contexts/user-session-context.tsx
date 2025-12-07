import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

const SELECTED_CATEGORIES_STORAGE_KEY = 'selectedCategories'
const SWIPE_COUNT_STORAGE_KEY = 'swipeCount'
const USER_ID_STORAGE_KEY = 'userId'

interface UserSessionContextValue {
  userId: string | null
  setUserId: (userId: string | null) => void
  selectedCategories: Set<string>
  setSelectedCategories: (categories: Set<string>) => void
  swipeCount: number
  incrementSwipeCount: () => void
}

const UserSessionContext = createContext<UserSessionContextValue | undefined>(
  undefined
)

interface UserSessionProviderProps {
  children: ReactNode
}

export function UserSessionProvider({ children }: UserSessionProviderProps) {
  const [userId, setUserIdState] = useState<string | null>(() => {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(USER_ID_STORAGE_KEY)
      return stored || null
    }
    return null
  })

  const setUserId = (userId: string | null) => {
    setUserIdState(userId)
    // Save to localStorage whenever userId changes
    if (typeof window !== 'undefined') {
      if (userId) {
        localStorage.setItem(USER_ID_STORAGE_KEY, userId)
      } else {
        localStorage.removeItem(USER_ID_STORAGE_KEY)
      }
    }
  }
  const [selectedCategories, setSelectedCategoriesState] = useState<
    Set<string>
  >(() => {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SELECTED_CATEGORIES_STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          return new Set(Array.isArray(parsed) ? parsed : [])
        } catch {
          return new Set()
        }
      }
    }
    return new Set()
  })

  const [swipeCount, setSwipeCountState] = useState<number>(() => {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SWIPE_COUNT_STORAGE_KEY)
      if (stored) {
        try {
          const parsed = parseInt(stored, 10)
          return isNaN(parsed) ? 0 : parsed
        } catch {
          return 0
        }
      }
    }
    return 0
  })

  // Save to localStorage whenever selectedCategories changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const categoriesArray = Array.from(selectedCategories)
      localStorage.setItem(
        SELECTED_CATEGORIES_STORAGE_KEY,
        JSON.stringify(categoriesArray)
      )
    }
  }, [selectedCategories])

  // Save to localStorage whenever swipeCount changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SWIPE_COUNT_STORAGE_KEY, swipeCount.toString())
    }
  }, [swipeCount])

  const setSelectedCategories = (categories: Set<string>) => {
    setSelectedCategoriesState(categories)
  }

  const incrementSwipeCount = () => {
    setSwipeCountState((prev) => prev + 1)
  }

  return (
    <UserSessionContext.Provider
      value={{
        userId,
        setUserId: setUserId,
        selectedCategories,
        setSelectedCategories,
        swipeCount,
        incrementSwipeCount,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  )
}

export function useUserSessionContext() {
  const context = useContext(UserSessionContext)
  if (context === undefined) {
    throw new Error(
      'useUserSessionContext must be used within a UserSessionProvider'
    )
  }
  return context
}
