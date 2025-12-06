import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { CheckboxCardItem } from '@/shared/types/checkbox-card'

interface CheckboxCardListProps {
  items: CheckboxCardItem[]
  selectedIds: Set<string>
  onSelectionChange: (selectedIds: Set<string>) => void
  ariaLabel?: string
}

export function CheckboxCardList({
  items,
  selectedIds,
  onSelectionChange,
  ariaLabel = 'Lista kart z checkboxami',
}: CheckboxCardListProps) {
  const handleToggle = useCallback(
    (itemId: string) => {
      const newSelectedIds = new Set(selectedIds)
      if (newSelectedIds.has(itemId)) {
        newSelectedIds.delete(itemId)
      } else {
        newSelectedIds.add(itemId)
      }
      onSelectionChange(newSelectedIds)
    },
    [selectedIds, onSelectionChange],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, itemId: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleToggle(itemId)
      }
    },
    [handleToggle],
  )

  return (
    <div
      className="grid grid-cols-3 gap-2"
      role="group"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const isSelected = selectedIds.has(item.id)
        const checkboxId = `checkbox-${item.id}`

        return (
          <label
            key={item.id}
            htmlFor={checkboxId}
            className={`
              relative flex flex-col cursor-pointer
              bg-white rounded-lg shadow-lg border border-foreground-200
              overflow-hidden transition-all duration-200
              focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2
              hover:shadow-xl hover:scale-[1.02]
              ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
            `}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
          >
            {/* Obrazek */}
            <div className="relative aspect-square w-full overflow-hidden bg-foreground-100">
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay dla lepszego kontrastu tekstu */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Label i checkbox */}
            <div className="flex items-center justify-between p-2 gap-2 min-h-[48px]">
              <span
                className="flex-1 text-sm font-medium text-foreground-800 line-clamp-2"
                aria-hidden="true"
              >
                {item.label}
              </span>

              {/* Checkbox */}
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  id={checkboxId}
                  checked={isSelected}
                  onChange={() => handleToggle(item.id)}
                  className="sr-only"
                  aria-label={`Wybierz ${item.label}`}
                  aria-checked={isSelected}
                />
                <motion.div
                  className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center
                    transition-colors duration-200
                    ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600'
                        : 'bg-white border-foreground-300'
                    }
                  `}
                  animate={{
                    scale: isSelected ? 1.1 : 0.9,
                    opacity: isSelected ? 1 : 0.7,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </label>
        )
      })}
    </div>
  )
}

