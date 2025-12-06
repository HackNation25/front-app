import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: ProfileLayout,
})

function ProfileLayout() {
  return (
    <div className="min-h-screen text-foreground-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-foreground-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-2xl font-bold">
              JD
            </div>
            <div>
              <h1 className="text-2xl font-bold">Jan Kowalski</h1>
              <p className="text-foreground-400">@jan_kowalski</p>
            </div>
          </div>
          <p className="text-foreground-200 mb-4">
            Miłośnik podróży i odkrywania nowych miejsc. Uwielbiam górskie
            wędrówki i odkrywanie lokalnych atrakcji.
          </p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-foreground-400">Trasy</span>
              <p className="text-xl font-bold">24</p>
            </div>
            <div>
              <span className="text-foreground-400">Obserwujący</span>
              <p className="text-xl font-bold">156</p>
            </div>
            <div>
              <span className="text-foreground-400">Obserwowani</span>
              <p className="text-xl font-bold">89</p>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
