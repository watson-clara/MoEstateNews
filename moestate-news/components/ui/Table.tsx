import React from 'react'
import { cn } from '@/lib/cn'

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn('w-full border-collapse', className)}
          {...props}
        />
      </div>
    )
  }
)

Table.displayName = 'Table'

export const THead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('bg-gray-50', className)}
        {...props}
      />
    )
  }
)

THead.displayName = 'THead'

export const TBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn('divide-y divide-border', className)}
        {...props}
      />
    )
  }
)

TBody.displayName = 'TBody'

export const TRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn('hover:bg-gray-50 transition-colors', className)}
        {...props}
      />
    )
  }
)

TRow.displayName = 'TRow'

export const TCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn('px-4 py-3 text-sm text-text-primary', className)}
        {...props}
      />
    )
  }
)

TCell.displayName = 'TCell'

export const THeader = React.forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn('px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider', className)}
        {...props}
      />
    )
  }
)

THeader.displayName = 'THeader'

