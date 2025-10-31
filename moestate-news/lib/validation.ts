import { z } from 'zod'

export const propertyTypeEnum = z.enum([
  'office',
  'retail',
  'industrial',
  'multifamily',
  'all',
])

export const digestFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  propertyType: propertyTypeEnum,
  timeSpan: z.enum(['daily', 'weekly', 'custom']),
  customDateRange: z.object({
    start: z.string(),
    end: z.string(),
  }).optional(),
  // Articles/data points are auto-selected by AI now
  articles: z.array(z.object({
    id: z.string(),
    title: z.string(),
    source: z.string(),
    url: z.string(),
    publishedAt: z.string(),
    excerpt: z.string().optional(),
    type: z.enum(['article', 'permit', 'mls', 'sale']).optional(),
  })).optional(), // Made optional since AI selects them
})

export const digestSchema = digestFormSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type DigestFormData = z.infer<typeof digestFormSchema>
export type Digest = z.infer<typeof digestSchema>

