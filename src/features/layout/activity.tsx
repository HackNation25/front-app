import { useLayoutContext } from '@/shared/contexts/layout-context'
import { ProfileButton } from '@/shared/components/profile-button'

export function Activity() {
  const { showProfileIcon } = useLayoutContext()

  if (!showProfileIcon) {
    return null
  }

  return <ProfileButton />
}

