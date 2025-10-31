'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useDigests } from '@/context/DigestsContext'
import { digestFormSchema, DigestFormData } from '@/lib/validation'
import { generateBriefWithAI, PropertyType, TimeSpan } from '@/lib/ai-generator'
import { Toast } from '@/components/ui/Toast'
import { DataPoint } from '@/lib/data-sources'

function CreatePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const { addDigest, updateDigest, getDigest } = useDigests()

  // state stuff
  const [propertyType, setPropertyType] = useState<PropertyType>('all')
  const [timeSpan, setTimeSpan] = useState<TimeSpan>('weekly')
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | undefined>()
  const [formData, setFormData] = useState<DigestFormData>({
    title: '',
    content: '',
    propertyType: 'all',
    timeSpan: 'weekly',
    articles: [],
  })
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const editing = !!editId

  // load existing if editing
  useEffect(() => {
    if (editId) {
      const existing = getDigest(editId)
      if (existing) {
        setPropertyType(existing.propertyType as PropertyType)
        setTimeSpan(existing.timeSpan as TimeSpan)
        setDateRange(existing.customDateRange)
        setFormData({
          title: existing.title,
          content: existing.content,
          propertyType: existing.propertyType as PropertyType,
          timeSpan: existing.timeSpan as TimeSpan,
          customDateRange: existing.customDateRange,
          articles: existing.articles || [],
        })
      }
    }
    setLoading(false)
  }, [editId, getDigest])

  // auto gen when settings change (but not if editing)
  useEffect(() => {
    if (!editing && propertyType && timeSpan) {
      const timer = setTimeout(() => {
        generateBrief()
      }, 600)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyType, timeSpan, dateRange?.start, dateRange?.end])

  // main generation function
  const generateBrief = async () => {
    if (!propertyType || !timeSpan) return

    setGenerating(true)
    try {
      // ai picks data automatically from all sources
      const result = await generateBriefWithAI(propertyType, timeSpan, dateRange)

      // convert to format we can store (kind of a workaround but it works)
      const articles = result.selectedData.map((dp, i) => {
        let title = ''
        let source = ''
        let url = ''
        let date = ''
        let excerpt = ''

        if (dp.type === 'permit') {
          const p = dp.data as any
          title = `${p.permitType} - ${p.propertyAddress}`
          source = 'County Permit Database'
          url = `#permit-${p.permitNumber}`
          date = p.issueDate
          excerpt = p.description
        } else if (dp.type === 'mls') {
          const m = dp.data as any
          title = m.address
          source = 'MLS Feed'
          url = `#mls-${m.mlsNumber}`
          date = m.listingDate
          excerpt = m.description
        } else if (dp.type === 'sale') {
          const s = dp.data as any
          title = `${s.address} - Sale`
          source = 'Public Sales Records'
          url = `#sale-${s.parcelNumber}`
          date = s.saleDate
          excerpt = `Sold for $${s.salePrice.toLocaleString()}`
        }

        return {
          id: `${dp.type}-${i}`,
          title,
          source,
          url,
          publishedAt: date,
          excerpt,
          type: dp.type as 'permit' | 'mls' | 'sale',
        }
      })

      setFormData({
        ...formData,
        title: result.title,
        content: result.content,
        propertyType,
        timeSpan,
        customDateRange: dateRange,
        articles,
      })

      setDataPoints(result.selectedData)
    } catch (error) {
      console.error('failed to generate:', error)
      setToast({ message: 'Failed to generate brief. Try again.', type: 'error' })
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // basic check
    if (!formData.title || !formData.content) {
      setErrors({ content: 'Wait for AI to finish generating' })
      return
    }

    try {
      const validated = digestFormSchema.parse({
        ...formData,
        articles: formData.articles || [],
      })

      setSaving(true)

      if (editing && editId) {
        updateDigest(editId, validated)
        setToast({ message: 'Updated!', type: 'success' })
      } else {
        const digest = addDigest(validated)

        // download as file
        const json = JSON.stringify(digest, null, 2)
        const blob = new Blob([json], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `digest-${digest.id}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setToast({ message: 'Saved and exported!', type: 'success' })
      }

      setTimeout(() => {
        router.push('/moestate-news/view')
      }, 1500)
    } catch (error: any) {
      if (error.errors) {
        const errs: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path) {
            errs[err.path[0]] = err.message
          }
        })
        setErrors(errs)
      }
      setToast({ message: 'Failed to save', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {editing && 'Edit Brief'}
            {!editing && 'Create Brief with AI'}
          </h1>
          <p className="text-text-muted">
            {(() => {
              if (editing) {
                return 'Update your brief';
              }
              return 'Pick property type and time span. AI will scrape permits, MLS, and sales records automatically.';
            })()}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* main form area */}
            <div className="lg:col-span-2 space-y-6">
              {/* config section */}
              <Card>
                <CardHeader>
                  <CardTitle>Brief Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="propertyType" required>Property Type</Label>
                    <Select
                      id="propertyType"
                      value={propertyType}
                      onChange={(e) => {
                        const newType = e.target.value as PropertyType
                        setPropertyType(newType)
                        setFormData({ ...formData, propertyType: newType })
                      }}
                      disabled={editing}
                    >
                      <option value="all">All Property Types</option>
                      <option value="office">Office</option>
                      <option value="retail">Retail</option>
                      <option value="industrial">Industrial</option>
                      <option value="multifamily">Multi-Family</option>
                    </Select>
                    {errors.propertyType && (
                      <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="timeSpan" required>Time Span</Label>
                    <Select
                      id="timeSpan"
                      value={timeSpan}
                      onChange={(e) => {
                        const newSpan = e.target.value as TimeSpan
                        setTimeSpan(newSpan)
                        setFormData({ ...formData, timeSpan: newSpan })
                      }}
                      disabled={editing}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Custom Range</option>
                    </Select>
                  </div>

                  {timeSpan === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={dateRange?.start || ''}
                          onChange={(e) => {
                            const range = { start: e.target.value, end: dateRange?.end || '' }
                            setDateRange(range)
                            setFormData({ ...formData, customDateRange: range })
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={dateRange?.end || ''}
                          onChange={(e) => {
                            const range = { start: dateRange?.start || '', end: e.target.value }
                            setDateRange(range)
                            setFormData({ ...formData, customDateRange: range })
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {!editing && (
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-sm text-text-muted">
                        {generating && 'AI is working...'}
                        {!generating && 'AI will auto-select data'}
                      </p>
                      <Button
                        type="button"
                        variant="subtle"
                        size="sm"
                        onClick={generateBrief}
                        disabled={generating || !propertyType || !timeSpan}
                      >
                        {(() => {
                          if (generating) return 'Generating...';
                          return 'Regenerate';
                        })()}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* preview section */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    AI-Generated Brief
                    {generating && <span className="text-sm font-normal text-text-muted ml-2">(working...)</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    {editing === true && (
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Brief title..."
                      />
                    )}
                    {editing === false && (
                      <Input
                        id="title"
                        value={formData.title}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed"
                        placeholder="Will be generated..."
                      />
                    )}
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    {editing && (
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Brief content..."
                        rows={16}
                        error={!!errors.content}
                      />
                    )}
                    {!editing && (
                      <Textarea
                        id="content"
                        value={formData.content}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed resize-none"
                        placeholder="AI is collecting data..."
                        rows={16}
                        error={!!errors.content}
                      />
                    )}
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                  </div>
                  {/* show what ai picked */}
                  {dataPoints.length > 0 && !editing && (
                    <div className="text-sm text-text-muted pt-2 border-t border-border">
                      <p>
                        {/* shows how many total items ai grabbed and breaks it down by permits mls and sales */}
                        AI found {dataPoints.length} items: {dataPoints.filter(d => d.type === 'permit').length} permits, {dataPoints.filter(d => d.type === 'mls').length} MLS listings, {dataPoints.filter(d => d.type === 'sale').length} sales
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="flex justify-end gap-4">
                <Button type="button" variant="ghost" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving || generating || !formData.title || !formData.content}
                >
                  {(() => {
                    if (saving) return 'Saving...';
                    if (editing) return 'Update';
                    return 'Save';
                  })()}
                </Button>
              </div>
            </div>
            {/* sidebar info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Data Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-text-primary mb-1">County Permits</p>
                      <p className="text-text-muted text-xs">
                        Building permits, construction projects
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary mb-1">MLS Feeds</p>
                      <p className="text-text-muted text-xs">
                        Listings, pending sales, sold properties
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary mb-1">Sales Records</p>
                      <p className="text-text-muted text-xs">
                        Public transactions, prices, buyer/seller info
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-text-light">
                      AI picks the best data points, sorts by property type, and makes summaries with comparables.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-text-muted">Loading...</div>
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  )
}
