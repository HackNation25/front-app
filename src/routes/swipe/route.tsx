import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import type { Query } from '@tanstack/react-query'
import { SwipeableCard } from '@/features/swipe/components/SwipeableCard'
import { ActionButtons } from '@/features/swipe/components/ActionButtons'
import { PlaceDrawer } from '@/features/swipe/components/drawer-vaul'
import { useUserSessionContext } from '@/shared/contexts/user-session-context'
import { $api } from '@/shared/api/client'

export const Route = createFileRoute('/swipe')({
  beforeLoad: ({ context }) => {
    // Refetch recommendations query without cache when entering /swipe route
    context.queryClient.refetchQueries({
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
  tags: Array<string>
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
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  // Refetch recommendations query on mount without cache
  useEffect(() => {
    queryClient.refetchQueries({
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

  // Fetch recommendations from API - no cache, always refetch
  const {
    data: recommendations,
    isLoading,
    isFetching,
    refetch: refetchRecommendations,
  } = $api.useQuery(
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
      staleTime: 0, // Always consider data stale
      gcTime: 0, // Don't cache data
      refetchOnMount: true, // Always refetch on mount
    }
  )

  // Retry up to 2 times if recommendations is empty array
  useEffect(() => {
    if (
      !isLoading &&
      !isFetching &&
      recommendations &&
      Array.isArray(recommendations) &&
      recommendations.length === 0 &&
      retryCount < 2
    ) {
      setIsRetrying(true)
      const timer = setTimeout(
        () => {
          setRetryCount((prev) => prev + 1)
          refetchRecommendations()
        },
        1000 * (retryCount + 1)
      ) // Exponential backoff: 1s, 2s

      return () => {
        clearTimeout(timer)
        setIsRetrying(false)
      }
    } else {
      setIsRetrying(false)
    }
  }, [
    recommendations,
    isLoading,
    isFetching,
    retryCount,
    refetchRecommendations,
  ])

  // Reset retry count when recommendations has data
  useEffect(() => {
    if (
      recommendations &&
      Array.isArray(recommendations) &&
      recommendations.length > 0
    ) {
      setRetryCount(0)
      setIsRetrying(false)
    }
  }, [recommendations])

  // Mutation for creating POI decision
  const createDecisionMutation = $api.useMutation('post', '/poi-decision')

  // Map API response to card data format
  const cardsData: Array<CardData> =
    recommendations?.map((poi) => {
      const card: CardData = {
        poiId: poi.uuid,
        name: poi.name,
        image: poi.imageUrl,
        description: poi.longDescription || poi.shortDescription || '',
        tags: [] as Array<string>, // Tags not available in API response
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
    if (!isLoading && !isFetching && cardsData.length > 0 && !hasMoreCards) {
      toast.success('Zostałeś przekierowany na mapę, aby odkrywać okolicę!', {
        duration: 2000,
      })
      // Use setTimeout to ensure toast is visible before navigation
      setTimeout(() => {
        navigate({
          to: '/map',
          search: {
            poiId: undefined,
          },
        })
      }, 500)
    }
  }, [hasMoreCards, isLoading, isFetching, cardsData.length, navigate])

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

  if (isLoading || isFetching || isRetrying) {
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
              Brak pozostałych miejsc do odwiedzenia! 🎉
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
            onShowOnMap={(poiId) => {
              navigate({
                to: '/map',
                search: {
                  poiId,
                },
              })
            }}
          />
        )}
      </div>
    </div>
  )
}
