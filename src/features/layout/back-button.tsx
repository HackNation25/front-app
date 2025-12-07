import { IconArrowLeft } from '@tabler/icons-react'
import { ExpandableFloatingButton } from '@/shared/components/expandable-floating-button'
import { useUserSessionContext } from '@/shared/contexts/user-session-context'

interface BackButtonProps {
  /**
   * Whether the button should be visible
   */
  isVisible: boolean
  /**
   * Optional aria-label for accessibility
   * @default 'Cofnij do poprzedniej strony'
   */
  'aria-label'?: string
}

export function BackButton({
  isVisible,
  'aria-label': ariaLabel = 'Cofnij do poprzedniej strony',
}: BackButtonProps) {
  const { userId, selectedCategories } = useUserSessionContext()

  // Jeśli nie ma userId ale są kategorie, wróć do /profile/settings
  // W przeciwnym razie wróć do strony głównej
  const backTo =
    !userId && selectedCategories.size >= 3 ? '/profile/settings' : '/'

  return (
    <ExpandableFloatingButton
      isVisible={isVisible}
      position="left"
      text="Powrót"
      icon={
        <IconArrowLeft
          size={24}
          stroke={2.5}
          className="text-white"
          aria-hidden="true"
        />
      }
      to={backTo}
      aria-label={ariaLabel}
    />
  )
}
