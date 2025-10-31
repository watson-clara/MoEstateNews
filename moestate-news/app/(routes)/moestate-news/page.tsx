'use client'

import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useDigests } from '@/context/DigestsContext'
import { formatDate } from '@/lib/time'

export default function MoEstateNewsPage() {
  const { digests, isLoading } = useDigests()
  const recent = digests.slice(0, 3) // just show 3 most recent

  let briefsSection
  if (isLoading) {
      briefsSection = (
    <div className="text-text-muted">Loading...</div>
      )
  } else if (recent.length === 0) {
      briefsSection = (
      <Card>
     <CardContent className="text-center py-12">
      <p className="text-text-muted mb-4">No briefs yet</p>
            <Link href="/moestate-news/create">
    <Button variant="primary">Create First Brief</Button>
        </Link>
      </CardContent>
      </Card>
      )
  } else {
        briefsSection = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recent.map((digest) => (
         <Card key={digest.id} hover>
            <CardHeader>
         <CardTitle className="text-lg">{digest.title}</CardTitle>
            </CardHeader>
           <CardContent>
            <p className="text-text-secondary text-sm mb-4 line-clamp-3">
        {digest.content.substring(0, 150)}...
            </p>
                <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{digest.articles?.length || 0} data points</span>
            <span>{formatDate(digest.createdAt)}</span>
                  </div>
           </CardContent>
         </Card>
        ))}
        </div>
    )
  }

  return (
  <div className="min-h-screen bg-background">
      <Navbar />

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* hero stuff */}
  <div className="mb-16">
      <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">MoEstateNews</h1>
     <h2 className="text-3xl sm:text-4xl font-bold text-text-secondary mb-6">
        AI-Powered Real Estate Briefs
        </h2>
    <p className="text-lg text-text-muted max-w-3xl mb-8">
  Auto-generate briefs with AI. Scrapes county permits, MLS feeds, and sales records. 
    Categorizes by property type and makes summaries with comparables.
    </p>
       <div className="flex gap-4 flex-wrap">
      <Link href="/moestate-news/create">
          <Button variant="primary" size="lg">
      Create Brief
        </Button>
                 </Link>
         <Link href="/moestate-news/view">
     <Button variant="black" size="lg">
       Manage Briefs
        </Button>
      </Link>
    </div>
    </div>

      {/* recent briefs */}
  <div className="mb-12">
   <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Recent Activity</h2>
         <Link href="/moestate-news/view">
          <Button variant="ghost" size="sm">View All</Button>
            </Link>
    </div>
                {briefsSection}
      </div>

      {/* how it works section */}
    <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">
                How It <span className="text-primary">Works</span>
              </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover>
            <CardHeader className="text-center">
<div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
  </svg>
     </div>
      <CardTitle className="text-lg">Auto Data Collection</CardTitle>
        </CardHeader>
       <CardContent className="text-center">
<p className="text-text-secondary text-sm mb-4">
  AI scrapes county permits, MLS feeds, and sales records automatically. No manual work needed.
          </p>
     <Link href="/moestate-news/create">
        <Button variant="primary" size="sm">Try It Now</Button>
    </Link>
     </CardContent>
      </Card>

          <Card hover>
        <CardHeader className="text-center">
    <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
        </div>
             <CardTitle className="text-lg">Smart Sorting</CardTitle>
         </CardHeader>
      <CardContent className="text-center">
              <p className="text-text-secondary text-sm mb-4">
    Categorizes by property type (office, retail, etc) and makes summaries with comparable deals.
      </p>
               <Link href="/moestate-news/view">
    <Button variant="primary" size="sm">View Examples</Button>
    </Link>
    </CardContent>
         </Card>

         <Card hover>
    <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
</div>
          <CardTitle className="text-lg">Export & Share</CardTitle>
  </CardHeader>
    <CardContent className="text-center">
               <p className="text-text-secondary text-sm mb-4">
     Export as JSON files. Share with clients or use for emails/presentations.
      </p>
        <Link href="/moestate-news/create">
         <Button variant="primary" size="sm">Get Started</Button>
     </Link>
    </CardContent>
      </Card>
        </div>
        </div>
      </main>
   </div>
  )
}
