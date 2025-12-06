import { IconSettings } from '@tabler/icons-react'
import { MenuList } from '@/shared/components/menu-list'
import type { MenuItem } from '@/shared/types/menu-item'

const PROFILE_MENU_ITEMS: MenuItem[] = [
  {
    id: 'settings',
    label: 'Ustawienia',
    icon: IconSettings,
    path: '/profile/settings',
    ariaLabel: 'Przejdź do ustawień profilu',
  },
]

export function ProfileSettingsMenu() {
  return (
    <section
      className="w-full p-4"
      aria-labelledby="profile-menu-heading"
    >
      <h2
        id="profile-menu-heading"
        className="text-xl font-bold mb-4 text-white"
      >
        Menu profilu
      </h2>
      <MenuList
        items={PROFILE_MENU_ITEMS}
        ariaLabel="Menu ustawień profilu"
      />
    </section>
  )
}

