import type { TablerIconsProps } from '@tabler/icons-react'

export interface MenuItem {
  id: string
  label: string
  icon: (props: TablerIconsProps) => JSX.Element
  path: string
  ariaLabel?: string
}

