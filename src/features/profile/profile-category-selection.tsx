import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { CheckboxCardList } from '@/shared/components/checkbox-card-list'
import { Card } from '@/shared/components/card'
import type { CheckboxCardItem } from '@/shared/types/checkbox-card'
import { useUserSessionContext } from '@/shared/contexts/user-session-context'
import { NAVIGATION_ROUTES } from '@/shared/const/navigation'
import { $api } from '@/shared/api/client'

const categoryFormSchema = z.object({
  categories: z
    .array(z.string())
    .min(3, 'Musisz wybrać przynajmniej 3 kategorie'),
})

export function ProfileCategorySelection() {
  const navigate = useNavigate()
  const { userId, selectedCategories, setSelectedCategories, setUserId } =
    useUserSessionContext()

  // Fetch categories from API
  const { data: categories, isLoading: isLoadingCategories } = $api.useQuery(
    'get',
    '/category',
    {}
  )

  // Mutation for creating user profile
  const createUserProfileMutation = $api.useMutation('post', '/user/profile')

  // Map API response to CheckboxCardItem format
  const categoriesData: CheckboxCardItem[] =
    categories?.map((category: any) => ({
      id: category.id || category.uuid || '',
      label: category.name || '',
      image: category.image_url || category.imageUrl || '',
    })) || []

  const form = useForm({
    defaultValues: {
      categories: Array.from(selectedCategories),
    },
    validators: {
      onChange: categoryFormSchema,
    },
    onSubmit: async ({ value }) => {
      const categoriesSet = new Set(value.categories)
      // Save categories to context (which will also save to localStorage)
      setSelectedCategories(categoriesSet)

      // Map selected categories from API to choices format
      const choices = value.categories.map((categoryId, index) => ({
        category_id: categoryId,
        choice: '1',
      }))

      const requestBody = {
        choices,
      }

      console.log('Sending request with body:', requestBody)

      // Always create/update user profile with hardcoded categories
      createUserProfileMutation.mutate(
        {
          body: requestBody,
        },
        {
          onSuccess: (data) => {
            // Extract UUID from response and save to localStorage
            const responseData = data as {
              uuid?: string
              id?: string
              userProfileId?: string
            }
            const responseUuid =
              responseData?.uuid ||
              responseData?.id ||
              responseData?.userProfileId
            if (responseUuid) {
              setUserId(responseUuid)
              console.log('Saved user ID to localStorage:', responseUuid)
            }

            // If user doesn't have session id, redirect to swipe after successful creation
            if (!userId) {
              navigate({ to: NAVIGATION_ROUTES.SWIPE })
            }
          },
          onError: (error) => {
            console.error('Error creating user profile:', error)
            toast.error('Błąd podczas zapisywania kategorii. Spróbuj ponownie.')
          },
        }
      )
    },
  })

  // Sync form with context when it changes (only on mount)
  useEffect(() => {
    const currentCategories = Array.from(selectedCategories)
    if (currentCategories.length > 0) {
      form.setFieldValue('categories', currentCategories)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <section
        className="w-full p-4"
        aria-labelledby="category-selection-heading"
      >
        <Card>
          <div className="px-6">
            <h2
              id="category-selection-heading"
              className="text-xl font-bold mb-4 text-accent-800"
            >
              Wybierz kategorie, które Cię interesują
            </h2>
            <p className="text-sm text-foreground-600 mb-6">
              Zaznacz kategorie miejsc w Bydgoszczy, które chcesz zobaczyć w
              swoich rekomendacjach.
            </p>
            <form.Field name="categories">
              {(field) => {
                const selectedIdsSet = new Set(field.state.value)

                const handleSelectionChange = (newSelectedIds: Set<string>) => {
                  field.handleChange(Array.from(newSelectedIds))
                }

                const hasErrors =
                  field.state.meta.errors && field.state.meta.errors.length > 0
                const isValid = field.state.value.length >= 3
                const canSubmit =
                  isValid && !hasErrors && !form.state.isSubmitting

                return (
                  <>
                    {isLoadingCategories ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground-200 border-t-primary-600" />
                      </div>
                    ) : (
                      <>
                        <CheckboxCardList
                          items={categoriesData}
                          selectedIds={selectedIdsSet}
                          onSelectionChange={handleSelectionChange}
                          ariaLabel="Lista kategorii miejsc w Bydgoszczy"
                        />
                        {hasErrors && (
                          <div
                            className="mt-4 text-sm text-red-500"
                            role="alert"
                            aria-live="polite"
                          >
                            {typeof field.state.meta.errors[0] === 'string'
                              ? field.state.meta.errors[0]
                              : 'Musisz wybrać przynajmniej 3 kategorie'}
                          </div>
                        )}
                        {selectedIdsSet.size > 0 && (
                          <div
                            className="mt-4 text-sm text-foreground-600"
                            role="status"
                            aria-live="polite"
                          >
                            Wybrano {selectedIdsSet.size} z{' '}
                            {categoriesData.length} kategorii
                          </div>
                        )}
                      </>
                    )}
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-foreground-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {form.state.isSubmitting
                          ? 'Zapisywanie...'
                          : userId
                            ? 'Zapisz'
                            : 'Dalej'}
                      </button>
                    </div>
                  </>
                )
              }}
            </form.Field>
          </div>
        </Card>
      </section>
    </form>
  )
}
