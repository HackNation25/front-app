import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SwipeableCard } from '@/features/swipe/components/SwipeableCard'
import { ActionButtons } from '@/features/swipe/components/ActionButtons'
import { PlaceDrawer } from '@/features/swipe/components/drawer-vaul'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUserSessionContext } from '@/shared/contexts/user-session-context'
import { $api } from '@/shared/api/client'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import type { Query } from '@tanstack/react-query'

export const Route = createFileRoute('/swipe')({
  beforeLoad: ({ context }) => {
    // Invalidate recommendations query when entering /swipe route
    context.queryClient.invalidateQueries({
      predicate: (query: Query) => {
        const queryKey = query.queryKey
        return (
          Array.isArray(queryKey) &&
          queryKey.length >= 2 &&
          queryKey[0] === 'get' &&
          queryKey[1] === '/recommendation'
        )
      },
    })
  },
  component: RouteComponent,
})

type CardData = {
  poiId: string
  name: string
  image: string
  description: string
  tags: string[]
  location: string
  distance: string
}

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { incrementSwipeCount, userId } = useUserSessionContext()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [triggerSwipe, setTriggerSwipe] = useState<'left' | 'right' | null>(
    null
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Invalidate recommendations query on mount
  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query: Query) => {
        const queryKey = query.queryKey
        return (
          Array.isArray(queryKey) &&
          queryKey.length >= 2 &&
          queryKey[0] === 'get' &&
          queryKey[1] === '/recommendation'
        )
      },
    })
  }, [queryClient])

  // Fetch recommendations from API
  const { data: recommendations, isLoading } = $api.useQuery(
    'get',
    '/recommendation',
    {
      params: {
        query: {
          userId: userId || '',
          limit: 50, // Fetch up to 50 recommendations
        },
      },
    },
    {
      enabled: !!userId,
    }
  )

  // Mutation for creating POI decision
  const createDecisionMutation = $api.useMutation('post', '/poi-decision')

  // Map API response to card data format
  const cardsData: CardData[] =
    recommendations?.map((poi) => {
      const card: CardData = {
        poiId: poi.uuid,
        name: poi.name,
        image: poi.imageUrl,
        description: poi.shortDescription || poi.longDescription || '',
        tags: [] as string[], // Tags not available in API response
        location:
          poi.locationX && poi.locationY
            ? `${poi.locationX}, ${poi.locationY}`
            : '',
        distance: '', // Distance not available in recommendations response
      }
      return card
    }) || []

  const currentCard = cardsData[currentIndex]
  const hasMoreCards = currentIndex < cardsData.length

  // Automatyczne przekierowanie na /map gdy skończą się karty
  useEffect(() => {
    if (!isLoading && cardsData.length > 0 && !hasMoreCards) {
      toast.success('Zostałeś przekierowany na mapę, aby odkrywać okolicę!', {
        duration: 2000,
      })
      // Use setTimeout to ensure toast is visible before navigation
      setTimeout(() => {
        navigate({ to: '/map' })
      }, 500)
    }
  }, [hasMoreCards, isLoading, cardsData.length, navigate])

  const handleSwipe = (decision: boolean) => {
    if (!currentCard || !userId || isProcessing) return

    setIsProcessing(true)

    // Create POI decision via API
    createDecisionMutation.mutate(
      {
        body: {
          poiId: currentCard.poiId,
          userProfileId: userId,
          decision,
        },
      },
      {
        onSuccess: () => {
          // Only increment swipe count and remove card on success
          incrementSwipeCount()
          setCurrentIndex((prev) => prev + 1)
          setTriggerSwipe(null)
          setIsProcessing(false)
        },
        onError: (error) => {
          console.error('Error creating POI decision:', error)
          toast.error('Błąd podczas zapisywania decyzji. Spróbuj ponownie.')
          // Reset trigger swipe to prevent card removal
          setTriggerSwipe(null)
          setIsProcessing(false)
          // Don't remove card on error
        },
      }
    )
  }

  const handleSwipeLeft = () => {
    handleSwipe(false)
  }

  const handleSwipeRight = () => {
    handleSwipe(true)
  }

  const handleSwipeComplete = () => {
    // Called after animation completes
    // Card removal already happened in onSuccess
  }

  const onDislike = () => {
    if (!isProcessing && currentCard) {
      // Trigger swipe animation first, then API call
      setTriggerSwipe('left')
      handleSwipe(false)
    }
  }

  const onLike = () => {
    if (!isProcessing && currentCard) {
      // Trigger swipe animation first, then API call
      setTriggerSwipe('right')
      handleSwipe(true)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground-200 border-t-primary-600" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground-400">
          Musisz być zalogowany aby używać tej funkcji.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 w-[95%]">
        <div className="relative w-full max-w-md h-[600px]">
          {!hasMoreCards ? (
            <div className="flex items-center justify-center h-full text-2xl font-bold text-gray-600">
              No more places! 🎉
            </div>
          ) : (
            <>
              {[0, 1].map((offset) => {
                const index = currentIndex + offset
                const card = cardsData[index]
                if (!card) return null

                return (
                  <motion.div
                    key={card.poiId}
                    className="absolute inset-0 will-change-transform"
                    style={{
                      zIndex: 20 - offset * 10,
                      willChange: 'transform',
                    }}
                    animate={{
                      scale: offset === 0 ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <SwipeableCard
                      name={card.name}
                      image={card.image}
                      description={card.description}
                      tags={card.tags}
                      location={card.location}
                      distance={card.distance}
                      stackPosition={offset}
                      isDraggable={offset === 0}
                      disabled={isProcessing}
                      onSwipeLeft={handleSwipeLeft}
                      onSwipeRight={handleSwipeRight}
                      onSwipeComplete={handleSwipeComplete}
                      triggerSwipe={offset === 0 ? triggerSwipe : null}
                    />
                  </motion.div>
                )
              })}
            </>
          )}
        </div>

        {hasMoreCards && (
          <ActionButtons
            onDislike={onDislike}
            onLike={onLike}
            onInfo={() => setIsDrawerOpen(true)}
          />
        )}

        {currentCard && (
          <PlaceDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            place={currentCard}
          />
        )}
      </div>
    </div>
  )
}
