import React from 'react'
import { cn } from '@/lib/cn'

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label?: string
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, active, label, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'px-3 py-1.5 rounded-button text-sm font-medium transition-colors',
          active
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
          className
        )}
        {...props}
      >
        {label || children}
      </button>
    )
  }
)

Toggle.displayName = 'Toggle'

