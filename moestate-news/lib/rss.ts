import { NewsArticle } from './sources'

// Simple RSS parser (basic implementation)
// Note: This is a simplified implementation. In production, use a proper RSS parser library
export async function parseRSSFeed(url: string): Promise<NewsArticle[]> {
  try {
    // In production, you'd want to use a proper RSS parser library like 'rss-parser'
    // For now, this is a placeholder that would need server-side XML parsing
    // The actual implementation should use a library that works in Node.js
    const response = await fetch(url)
    const text = await response.text()
    
    // Basic RSS parsing would go here
    // For now, return empty array as we're using mock data
    // In production: use 'rss-parser' or similar library
    return []
  } catch (error) {
    console.error('Failed to parse RSS feed:', error)
    return []
  }
}

export async function fetchNewsArticles(sources: Array<{ url: string; type: 'rss' | 'json' }>): Promise<NewsArticle[]> {
  const allArticles: NewsArticle[] = []
  
  for (const source of sources) {
    try {
      if (source.type === 'rss') {
        const articles = await parseRSSFeed(source.url)
        allArticles.push(...articles)
      } else if (source.type === 'json') {
        const response = await fetch(source.url)
        const data = await response.json()
        // Handle JSON feed format
        const articles = Array.isArray(data) ? data : data.items || []
        allArticles.push(...articles.map((item: any, index: number) => ({
          id: `${source.url}-${index}`,
          title: item.title || 'Untitled',
          source: new URL(source.url).hostname,
          url: item.url || item.link || '',
          publishedAt: item.publishedAt || item.date || new Date().toISOString(),
          excerpt: item.excerpt || item.description || '',
        })))
      }
    } catch (error) {
      console.error(`Failed to fetch from ${source.url}:`, error)
    }
  }
  
  return allArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

