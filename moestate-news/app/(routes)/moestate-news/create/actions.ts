'use server'

import { digestSchema } from '@/lib/validation'
import { getSupabaseClient, isSupabaseEnabled } from '@/lib/supabaseClient'

// save brief to supabase (if enabled)
export async function saveDigestToSupabase(digest: unknown) {
  // check if supabase is even on
  if (!isSupabaseEnabled()) {
    return { success: false, error: 'Supabase is not enabled' }
  }
  try {
    const validated = digestSchema.parse(digest)
    const supabase = getSupabaseClient()
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    // insert the main brief record
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .insert({
        id: validated.id,
        title: validated.title,
        content: validated.content,
        property_type: validated.propertyType, // forgot this before oops
        time_span: validated.timeSpan,
        custom_date_range: validated.customDateRange || null,
        created_at: validated.createdAt,
        updated_at: validated.updatedAt,
      })
      .select()
      .single()

    if (briefError) {
      return { success: false, error: briefError.message }
    }

    // now add the articles/data points if there are any
    // ai might not always pick articles so check for that
    const articles = validated.articles || []
    if (articles.length > 0) {
      const articlesData = articles.map((article, index) => ({
        brief_id: validated.id,
        title: article.title,
        source: article.source,
        url: article.url,
        published_at: article.publishedAt,
        excerpt: article.excerpt || null,
        display_order: index, // just use index for order
      }))

      const { error: articlesError } = await supabase
        .from('articles')
        .insert(articlesData)

      if (articlesError) {
        return { success: false, error: articlesError.message }
      }
    }

    return { success: true, data: brief }
  } catch (error: any) {
    // catch all errors and return something
    return { success: false, error: error.message || 'Failed to save digest' }
  }
}

// update existing brief
export async function updateDigestInSupabase(id: string, digest: unknown) {
  if (!isSupabaseEnabled()) {
    return { success: false, error: 'Supabase is not enabled' }
  }

  try {
    const validated = digestSchema.parse(digest)
    const supabase = getSupabaseClient()

    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    // update the brief
    const { error: briefError } = await supabase
      .from('briefs')
      .update({
        title: validated.title,
        content: validated.content,
        property_type: validated.propertyType,
        time_span: validated.timeSpan,
        custom_date_range: validated.customDateRange || null,
        updated_at: validated.updatedAt,
      })
      .eq('id', id)

    if (briefError) {
      return { success: false, error: briefError.message }
    }

    // delete old articles and add new ones
    // might not be the best way but it works
    await supabase.from('articles').delete().eq('brief_id', id)

    const articles = validated.articles || []
    if (articles.length > 0) {
      const articlesData = articles.map((article, index) => ({
        brief_id: id,
        title: article.title,
        source: article.source,
        url: article.url,
        published_at: article.publishedAt,
        excerpt: article.excerpt || null,
        display_order: index,
      }))
      const { error: articlesError } = await supabase
        .from('articles')
        .insert(articlesData)

      if (articlesError) {
        return { success: false, error: articlesError.message }
      }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update digest' }
  }
}

// delete a brief
export async function deleteDigestFromSupabase(id: string) {
  if (!isSupabaseEnabled()) {
    return { success: false, error: 'Supabase is not enabled' }
  }
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    // delete the brief - articles should delete automatically (cascade)
    const { error } = await supabase
      .from('briefs')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete digest' }
  }
}
