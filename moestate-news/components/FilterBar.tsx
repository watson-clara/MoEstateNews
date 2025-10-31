'use client'

import React from 'react'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { TimeSpanFilter } from '@/lib/view-logic'

interface FilterBarProps {
  search: string
  timeSpan: TimeSpanFilter
  onSearchChange: (value: string) => void
  onTimeSpanChange: (value: TimeSpanFilter) => void
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  timeSpan,
  onSearchChange,
  onTimeSpanChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search briefs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={timeSpan}
          onChange={(e) => onTimeSpanChange(e.target.value as TimeSpanFilter)}
        >
          <option value="all">All Time Spans</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom</option>
        </Select>
      </div>
    </div>
  )
}

