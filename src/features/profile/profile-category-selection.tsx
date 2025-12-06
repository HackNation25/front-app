import { useState } from 'react'
import { CheckboxCardList } from '@/shared/components/checkbox-card-list'
import { BYDGOSZCZ_CATEGORIES } from './mock-categories'

export function ProfileCategorySelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds)
  }

  return (
    <section
      className="w-full p-4"
      aria-labelledby="category-selection-heading"
    >
      <h2
        id="category-selection-heading"
        className="text-xl font-bold mb-4 text-white"
      >
        Wybierz kategorie, które Cię interesują
      </h2>
      <p className="text-sm text-white/80 mb-6">
        Zaznacz kategorie miejsc w Bydgoszczy, które chcesz zobaczyć w swoich
        rekomendacjach.
      </p>
      <CheckboxCardList
        items={BYDGOSZCZ_CATEGORIES}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        ariaLabel="Lista kategorii miejsc w Bydgoszczy"
      />
      {selectedIds.size > 0 && (
        <div
          className="mt-4 text-sm text-white/80"
          role="status"
          aria-live="polite"
        >
          Wybrano {selectedIds.size} z {BYDGOSZCZ_CATEGORIES.length} kategorii
        </div>
      )}
    </section>
  )
}

