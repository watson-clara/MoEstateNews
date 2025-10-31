'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { ViewToggle } from '@/components/ViewToggle'
import { FilterBar } from '@/components/FilterBar'
import { DigestCard } from '@/components/DigestCard'
import { DigestTable } from '@/components/DigestTable'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { useDigests } from '@/context/DigestsContext'
import { ViewMode, TimeSpanFilter, filterDigests, sortDigests } from '@/lib/view-logic'
import { Digest } from '@/lib/validation'

export default function ViewPage() {
  const router = useRouter()
  const { digests, removeDigest } = useDigests()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeSpanFilter>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // filter and sort
  const filtered = useMemo(() => {
    const f = filterDigests(digests, { search, timeSpan: timeFilter })
    return sortDigests(f, sortBy)
  }, [digests, search, timeFilter, sortBy])

  const handleEdit = (id: string) => {
    router.push(`/moestate-news/create?id=${id}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this brief?')) {
      try {
        removeDigest(id)
        setToast({ message: 'Deleted!', type: 'success' })
      } catch (error) {
        setToast({ message: 'Delete failed', type: 'error' })
      }
    }
  }

  // export brief as file
  const handleExport = async (digest: Digest) => {
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(digest),
      })
      
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `digest-${digest.id}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setToast({ message: 'Exported!', type: 'success' })
      } else {
        throw new Error('failed')
      }
    } catch (error) {
      setToast({ message: 'Export failed', type: 'error' })
    }
  }

  let briefsContent = null
  if (filtered.length === 0) {
    briefsContent = (
      <div className="text-center py-16">
        <p className="text-text-muted mb-4">
          {digests.length === 0 && 'No briefs yet'}
          {digests.length !== 0 && 'No matches'}
        </p>
        {digests.length === 0 && (
          // button to navigate to the create brief page when clicked
          // when user clicks this button it will navigate to the create brief page
          // this button is shown when there are no briefs yet
          <Button variant="primary" onClick={() => router.push('/moestate-news/create')}>
            Create First Brief
          </Button>
        )}
      </div>
    )
  } else if (viewMode === 'grid') {
    briefsContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((digest) => (
          <DigestCard
            key={digest.id}
            digest={digest}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    )
  } else {
    // this is table version 
    // if user picks table mode we show DigestTable instead of the grid
    // just pass in the filtered list and the edit/delete handlers from above
    briefsContent = (
      <DigestTable digests={filtered} onEdit={handleEdit} onDelete={handleDelete} />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
       <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Manage Briefs</h1>
            <p className="text-text-muted">View, edit, delete your briefs</p>
    </div>
         // button to navigate to the create brief page when clicked
          //when user clicks this button, it will navigate to the create brief page
          <Button variant="primary" onClick={() => router.push('/moestate-news/create')}>
            Create New
          </Button>
        </div>

        {/* filters and stuff */}
     <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex-1 max-w-2xl">
            <FilterBar
              search={search}
              timeSpan={timeFilter}
              onSearchChange={setSearch}
              onTimeSpanChange={setTimeFilter}
            />
      </div>
          <div className="flex items-center gap-4">
              <select
            value={sortBy}
            // this is the dropdown for sorting the briefs
            // when user selects a new option, it will update the sortBy state
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">By Title</option>
              </select>
            <ViewToggle mode={viewMode} onModeChange={setViewMode} />
          </div>
        </div>

        {/* show briefs */}
        {briefsContent}

        {/* stats */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
           <div className="text-2xl font-bold text-primary">{digests.length}</div>
          <div className="text-sm text-text-muted mt-1">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {/* calculate the total number of data points (articles) 
                    for each digest in the digests array -- if it has an "articles" array -  add its length to the sum
                    iff "articles" is missing or empty, use 0 so it doesn't affect the total */}
                {digests.reduce((sum, d) => sum + (d.articles?.length || 0), 0)}
            </div>
              <div className="text-sm text-text-muted mt-1">Data Points</div>
          </div>
           <div className="text-center">
              <div className="text-2xl font-bold text-primary">{filtered.length}</div>
              <div className="text-sm text-text-muted mt-1">Filtered</div>
            </div>
     </div>
        </div>
      </main>

      {toast && (
        // toast notification that appears when user performs an action
        // toast is  small popup that appears at the top right of the screen
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
