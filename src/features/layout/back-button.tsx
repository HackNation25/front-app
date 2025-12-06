import { IconArrowLeft } from '@tabler/icons-react'
import { ExpandableFloatingButton } from '@/shared/components/expandable-floating-button'

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
      to="/"
      aria-label={ariaLabel}
    />
  )
}

