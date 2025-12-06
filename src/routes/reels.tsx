import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reels')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div></div>
}
