'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { NewsArticle } from '@/lib/sources'
import { timeAgo } from '@/lib/time'

interface NewsSuggestionsProps {
  articles: NewsArticle[]
  selectedIds: Set<string>
  onToggleSelect: (article: NewsArticle) => void
}

export const NewsSuggestions: React.FC<NewsSuggestionsProps> = ({
  articles,
  selectedIds,
  onToggleSelect,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suggested Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {articles.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-4">
                No articles available
              </p>
            ) : (
              articles.map((article) => {
                const isSelected = selectedIds.has(article.id)
                return (
                  <div
                    key={article.id}
                    className={`p-3 rounded-input border ${
                      isSelected
                        ? 'border-primary bg-blue-50'
                        : 'border-border bg-background'
                    } hover:border-primary transition-colors cursor-pointer`}
                    onClick={() => onToggleSelect(article)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-text-primary line-clamp-2 mb-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-text-muted line-clamp-2 mb-2">
                          {article.excerpt || 'No description available'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-text-light">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{timeAgo(article.publishedAt)}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-border" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

