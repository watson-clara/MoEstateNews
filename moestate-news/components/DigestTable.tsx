'use client'

import React from 'react'
import { Table, TBody, TCell, THead, THeader, TRow } from './ui/Table'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Digest } from '@/lib/validation'
import { formatDate, timeAgo } from '@/lib/time'

interface DigestTableProps {
  digests: Digest[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const DigestTable: React.FC<DigestTableProps> = ({
  digests,
  onEdit,
  onDelete,
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
    <Table>
      <THead>
        <TRow>
          <THeader>Title</THeader>
          <THeader>Property Type</THeader>
          <THeader>Time Span</THeader>
          <THeader>Articles</THeader>
          <THeader>Created</THeader>
          <THeader>Actions</THeader>
        </TRow>
      </THead>
      <TBody>
        {digests.length === 0 ? (
          <TRow>
            <TCell colSpan={6} className="text-center text-text-muted py-8">
              No briefs found
            </TCell>
          </TRow>
        ) : (
          digests.map((digest) => (
            <TRow key={digest.id}>
              <TCell>
                <div>
                  <div className="font-medium text-text-primary">{digest.title}</div>
                  <div className="text-xs text-text-muted mt-1 line-clamp-1">
                    {digest.content.substring(0, 100)}...
                  </div>
                </div>
              </TCell>
              <TCell>
                <Badge variant="secondary">{propertyTypeLabels[digest.propertyType] || 'All'}</Badge>
              </TCell>
              <TCell>
                <Badge variant="default">{timeSpanLabels[digest.timeSpan]}</Badge>
              </TCell>
              <TCell className="text-text-secondary">
                {digest.articles?.length || 0}
              </TCell>
              <TCell className="text-text-muted">
                {timeAgo(digest.createdAt)}
              </TCell>
              <TCell>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(digest.id)}
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
              </TCell>
            </TRow>
          ))
        )}
      </TBody>
    </Table>
  )
}

