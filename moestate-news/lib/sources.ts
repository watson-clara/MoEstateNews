export interface NewsSource {
  id: string
  name: string
  url: string
  type: 'rss' | 'json'
}

export const DEFAULT_FEEDS: NewsSource[] = [
  {
    id: 'realtor-daily',
    name: 'Realtor.com Daily News',
    url: 'https://www.realtor.com/news/rss/',
    type: 'rss',
  },
  {
    id: 'inman-news',
    name: 'Inman Real Estate News',
    url: 'https://www.inman.com/feed/',
    type: 'rss',
  },
  {
    id: 'mansion-global',
    name: 'Mansion Global',
    url: 'https://www.mansionglobal.com/rss.xml',
    type: 'rss',
  },
]

export interface NewsArticle {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  excerpt?: string
  imageUrl?: string
}

