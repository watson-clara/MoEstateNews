import { NextResponse } from 'next/server'
import { DEFAULT_FEEDS } from '@/lib/sources'
import { fetchNewsArticles } from '@/lib/rss'

// Fallback mock data
const mockArticles = [
  {
    id: '1',
    title: 'Housing Market Shows Strong Growth in Q4 2024',
    source: 'realtor.com',
    url: 'https://example.com/article1',
    publishedAt: new Date().toISOString(),
    excerpt: 'The real estate market continues to show resilience with record-breaking sales numbers...',
  },
  {
    id: '2',
    title: 'New Development Projects Transform Downtown Area',
    source: 'inman.com',
    url: 'https://example.com/article2',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    excerpt: 'Several major development projects are reshaping the urban landscape...',
  },
  {
    id: '3',
    title: 'Mortgage Rates Stabilize After Fed Meeting',
    source: 'mansionglobal.com',
    url: 'https://example.com/article3',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    excerpt: 'Interest rates hold steady as the Federal Reserve maintains current policy...',
  },
  {
    id: '4',
    title: 'Luxury Home Sales Surge in Coastal Markets',
    source: 'realtor.com',
    url: 'https://example.com/article4',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    excerpt: 'High-end properties in beachfront communities see increased demand...',
  },
  {
    id: '5',
    title: 'Tech Companies Drive Commercial Real Estate Boom',
    source: 'inman.com',
    url: 'https://example.com/article5',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    excerpt: 'Major tech firms expand office spaces as remote work trends shift...',
  },
  {
    id: '6',
    title: 'Sustainable Building Practices Gain Traction',
    source: 'mansionglobal.com',
    url: 'https://example.com/article6',
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
    excerpt: 'Green building certifications become standard in new construction...',
  },
  {
    id: '7',
    title: 'Suburban Migration Continues Post-Pandemic',
    source: 'realtor.com',
    url: 'https://example.com/article7',
    publishedAt: new Date(Date.now() - 518400000).toISOString(),
    excerpt: 'Families seek larger homes in suburban communities...',
  },
  {
    id: '8',
    title: 'Investment Properties Show Strong ROI',
    source: 'inman.com',
    url: 'https://example.com/article8',
    publishedAt: new Date(Date.now() - 604800000).toISOString(),
    excerpt: 'Rental properties continue to generate impressive returns for investors...',
  },
]

export async function GET() {
  try {
    // mock for now but change to real when implemented 
    const articles = mockArticles

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Failed to ingest news:', error)
    // Return mock data as fallback
    return NextResponse.json({ articles: mockArticles })
  }
}
