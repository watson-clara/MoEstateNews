const STORAGE_KEY = 'moestate-news-digests'

export interface StoredDigest {
  id: string
  title: string
  content: string
  propertyType: 'office' | 'retail' | 'industrial' | 'multifamily' | 'all'
  timeSpan: 'daily' | 'weekly' | 'custom'
  customDateRange?: { start: string; end: string }
  articles?: Array<{
    id: string
    title: string
    source: string
    url: string
    publishedAt: string
    excerpt?: string
    type?: 'article' | 'permit' | 'mls' | 'sale'
  }>
  createdAt: string
  updatedAt: string
}

export function loadDigests(): StoredDigest[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as StoredDigest[]
  } catch (error) {
    console.error('Failed to load digests from localStorage:', error)
    return []
  }
}

export function saveDigest(digest: StoredDigest): void {
  if (typeof window === 'undefined') return
  
  try {
    const digests = loadDigests()
    const existingIndex = digests.findIndex(d => d.id === digest.id)
    
    if (existingIndex >= 0) {
      digests[existingIndex] = digest
    } else {
      digests.push(digest)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(digests))
  } catch (error) {
    console.error('Failed to save digest to localStorage:', error)
    throw error
  }
}

export function deleteDigest(id: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const digests = loadDigests()
    const filtered = digests.filter(d => d.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete digest from localStorage:', error)
    throw error
  }
}

export function getDigestById(id: string): StoredDigest | null {
  if (typeof window === 'undefined') return null
  
  const digests = loadDigests()
  return digests.find(d => d.id === id) || null
}

