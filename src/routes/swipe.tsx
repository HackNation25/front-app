import { createFileRoute } from '@tanstack/react-router'
import { PlaceCard } from '@/features/swipe/components/PlaceCard'
import { ActionButtons } from '@/features/swipe/components/ActionButtons'
import { PLACES_DATA } from '@/features/swipe/data.ts'

export const Route = createFileRoute('/swipe')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <PlaceCard {...PLACES_DATA[2]} />
        <ActionButtons />
      </div>
    </div>
  )
}
