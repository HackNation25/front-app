import { createFileRoute } from '@tanstack/react-router'
import { ProfileCategorySelection } from '@/features/profile/profile-category-selection'

export const Route = createFileRoute('/profile/settings')({
  component: ProfileSettings,
})

function ProfileSettings() {
  return (
    <div className="max-w-2xl mx-auto py-6 px-2">
      <ProfileCategorySelection />
    </div>
  )
}
