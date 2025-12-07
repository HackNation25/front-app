import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useUserSessionContext } from '@/shared/contexts/user-session-context'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/profile')({
  component: ProfileLayout,
})

function ProfileLayout() {
  const { userId, setUserId, setSelectedCategories, swipeCount } =
    useUserSessionContext()
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Show reset menu only if user has session and at least 3 swipes
  const shouldShowResetMenu = userId !== null && swipeCount >= 3

  const handleReset = () => {
    // Clear all localStorage items
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }

    // Reset context state
    setUserId(null)
    setSelectedCategories(new Set())

    // Show success toast
    toast.success('LocalStorage został zresetowany', {
      duration: 2000,
    })

    // Reset confirmation state
    setShowConfirmation(false)

    // Reload the entire app
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <div className="min-h-screen text-foreground-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {shouldShowResetMenu && (
          <div className="bg-foreground-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Menu</h2>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {!showConfirmation ? (
                  <motion.button
                    key="reset-button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setShowConfirmation(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-foreground-800"
                  >
                    Resetuj LocalStorage
                  </motion.button>
                ) : (
                  <motion.div
                    key="confirmation-buttons"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3"
                  >
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-foreground-800"
                    >
                      Potwierdź reset
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 bg-foreground-700 hover:bg-foreground-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-foreground-500 focus:ring-offset-2 focus:ring-offset-foreground-800"
                    >
                      Anuluj
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-6 pt-6 border-t border-foreground-700">
                <p className="text-sm text-foreground-400">
                  Liczba swipów: <span className="font-bold">{swipeCount}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  )
}
