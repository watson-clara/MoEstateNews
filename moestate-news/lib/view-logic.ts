import { Digest } from './validation'

export type ViewMode = 'grid' | 'table'
export type TimeSpanFilter = 'all' | 'daily' | 'weekly' | 'custom'

export interface FilterOptions {
  search: string
  timeSpan: TimeSpanFilter
}

export function filterDigests(digests: Digest[], filters: FilterOptions): Digest[] {
  return digests.filter(digest => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesTitle = digest.title.toLowerCase().includes(searchLower)
      const matchesContent = digest.content.toLowerCase().includes(searchLower)
      if (!matchesTitle && !matchesContent) return false
    }
    
    // TimeSpan filter
    if (filters.timeSpan !== 'all' && digest.timeSpan !== filters.timeSpan) {
      return false
    }
    
    return true
  })
}

export function sortDigests(digests: Digest[], sortBy: 'newest' | 'oldest' | 'title'): Digest[] {
  const sorted = [...digests]
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    case 'oldest':
      return sorted.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
}

