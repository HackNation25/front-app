import { IconUserCircle } from '@tabler/icons-react'
import { useLayoutContext } from '@/shared/contexts/layout-context'
import { ExpandableFloatingButton } from '@/shared/components/expandable-floating-button'

export function ProfileButtonFeature() {
  const { showProfileIcon } = useLayoutContext()

  return (
    <ExpandableFloatingButton
      isVisible={showProfileIcon}
      position="right"
      text="Profil"
      icon={
        <IconUserCircle
          size={24}
          stroke={2.5}
          className="text-white"
          aria-hidden="true"
        />
      }
      to="/profile/settings"
      aria-label="Otwórz profil"
    />
  )
}

