'use client'

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Digest } from '@/lib/validation'
import { formatDate, timeAgo } from '@/lib/time'

interface DigestCardProps {
  digest: Digest
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  active?: boolean
}

export const DigestCard: React.FC<DigestCardProps> = ({
  digest,
  onEdit,
  onDelete,
  active = false,
}) => {
  const timeSpanLabels = {
    daily: 'Daily',
    weekly: 'Weekly',
    custom: 'Custom',
  }

  const propertyTypeLabels: Record<string, string> = {
    'office': 'Office',
    'retail': 'Retail',
    'industrial': 'Industrial',
    'multifamily': 'Multi-Family',
    'all': 'All Types',
  }

  return (
    <Card active={active} hover>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-primary">{digest.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="primary">{timeSpanLabels[digest.timeSpan]}</Badge>
            <Badge variant="secondary">{propertyTypeLabels[digest.propertyType] || 'All'}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-text-secondary text-sm mb-4 line-clamp-3">
          {digest.content.substring(0, 200)}...
        </p>
        <div className="flex items-center gap-4 text-text-muted text-xs">
          <span>{digest.articles?.length || 0} data point{digest.articles?.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{timeAgo(digest.createdAt)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full">
          {onEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(digest.id)}
              className="flex-1"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(digest.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

