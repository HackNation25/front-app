import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg py-6 w-full max-w-full lg:max-w-[500px] xl:max-w-[500px] ${className}`}
    >
      {children}
    </div>
  )
}
