'use client'

import React from 'react'
import { Toggle } from './ui/Toggle'
import { ViewMode } from '@/lib/view-logic'

interface ViewToggleProps {
  mode: ViewMode
  onModeChange: (mode: ViewMode) => void
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex gap-2">
      <Toggle
        active={mode === 'grid'}
        onClick={() => onModeChange('grid')}
        aria-label="Grid view"
      >
        Grid
      </Toggle>
      <Toggle
        active={mode === 'table'}
        onClick={() => onModeChange('table')}
        aria-label="Table view"
      >
        Table
      </Toggle>
    </div>
  )
}

