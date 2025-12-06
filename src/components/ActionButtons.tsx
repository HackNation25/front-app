interface ActionButtonsProps {
  onDislike?: () => void
  onInfo?: () => void
  onLike?: () => void
}

export function ActionButtons({
  onDislike,
  onInfo,
  onLike,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={onDislike}
        className="w-16 h-16 bg-white rounded-full shadow-lg shadow-red-500/50 flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <svg
          className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <button
        onClick={onInfo}
        className="w-14 h-14 bg-white rounded-full shadow-lg shadow-blue-500/50 flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <svg
          className="w-7 h-7 text-blue-500 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <button
        onClick={onLike}
        className="w-16 h-16 bg-white rounded-full shadow-lg shadow-green-500/50 flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <svg
          className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    </div>
  )
}