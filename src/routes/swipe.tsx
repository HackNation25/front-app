import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/swipe')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/swipe"!</div>
}
