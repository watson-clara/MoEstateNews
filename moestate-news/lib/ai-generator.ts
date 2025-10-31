// Mock AI Generator - Simulates AI-generated brief titles and content
// In production, this would call an actual LLM API
// TODO: add error handling for API failures

import { DataPoint, fetchAllDataSources, Permit, MLSListing, SalesRecord } from './data-sources'

export type PropertyType = 
  | 'office'
  | 'retail'
  | 'industrial'
  | 'multifamily'
  | 'all'

export type TimeSpan = 'daily' | 'weekly' | 'custom'

const propertyTypeLabels: Record<PropertyType, string> = {
  'office': 'Office Properties',
  'retail': 'Retail Properties',
  'industrial': 'Industrial Properties',
  'multifamily': 'Multi-Family Properties',
  'all': 'All Property Types',
}

const timeSpanLabels: Record<TimeSpan, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  custom: 'Custom Period',
}

// Generate title based on property type and time span
function generateTitle(propertyType: PropertyType, timeSpan: TimeSpan): string {
  const typeLabel = propertyType === 'all' ? 'Real Estate' : propertyTypeLabels[propertyType]
  return `${timeSpanLabels[timeSpan]} Market Report: ${typeLabel}`
}

// Generate summary for a permit
function generatePermitSummary(permit: Permit): string {
  const valueFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(permit.value)

  return `**Permit Activity**: ${permit.propertyAddress}\n\n` +
    `A ${permit.permitType.toLowerCase()} permit was ${permit.status === 'approved' ? 'approved' : 'under review'} for ${permit.propertyAddress}. ` +
    `The project is valued at approximately ${valueFormatted} and involves ${permit.description.toLowerCase()}. ` +
    `This ${permit.status === 'approved' ? 'indicates' : 'could indicate'} significant development activity in the area, potentially impacting local property values and market dynamics. ` +
    `The ${permit.issueDate} issue date suggests this is part of an ongoing or recently initiated development pipeline.`
}

// Generate summary for MLS listing
function generateMLSSummary(listing: MLSListing): string {
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(listing.listPrice)

  const pricePerSqft = Math.round(listing.listPrice / listing.squareFeet)
  const statusText = listing.status === 'active' ? 'currently on the market' : 
                     listing.status === 'pending' ? 'under contract' : 
                     'recently sold'

  return `**MLS Listing**: ${listing.address} (${listing.mlsNumber})\n\n` +
    `${listing.address} is ${statusText} with an asking price of ${priceFormatted} (${pricePerSqft}/sq ft). ` +
    `The ${listing.squareFeet.toLocaleString()} square foot ${listing.propertyType} property ${listing.description.toLowerCase()}. ` +
    `${listing.status === 'active' ? 'This listing' : listing.status === 'pending' ? 'This pending transaction' : 'This sale'} ` +
    `provides valuable market data for comparable properties in the area, showing current pricing trends and market activity levels.`
}

// Generate summary for sales record
function generateSaleSummary(sale: SalesRecord): string {
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(sale.salePrice)

  const pricePerSqft = Math.round(sale.salePrice / sale.squareFeet)
  const yearInfo = sale.yearBuilt ? `, built in ${sale.yearBuilt}` : ''

  return `**Recent Sale**: ${sale.address}\n\n` +
    `${sale.address} sold for ${priceFormatted} (${pricePerSqft}/sq ft) on ${sale.saleDate}. ` +
    `The ${sale.squareFeet.toLocaleString()} square foot ${sale.propertyType} property${yearInfo} was purchased by ${sale.buyer} from ${sale.seller}. ` +
    `This transaction reflects current market pricing and investor activity in the ${sale.propertyType} sector. ` +
    `The sale price per square foot provides a useful benchmark for comparable properties, indicating market strength and buyer confidence in the area.`
}

  // Find comparable data points (simplified - in real world would be more sophisticated)
  // TODO: improve this algorithm, maybe use ML model?
function findComparables(dataPoint: DataPoint, allData: DataPoint[]): DataPoint[] {
  const comparables: DataPoint[] = []
  const targetCategory = dataPoint.category
  const targetSize = dataPoint.data.squareFeet || dataPoint.data.value || 0
  
  for (const point of allData) {
    if (point.category === targetCategory && point.type !== dataPoint.type) {
      const pointSize = point.data.squareFeet || point.data.value || 0
      // Roughly similar size (within 50% - this logic is simplified, intern might not perfect this)
      // FIXME: edge case when targetSize is 0 might cause issues
      if (targetSize > 0 && Math.abs(pointSize - targetSize) / targetSize < 0.5) {
        comparables.push(point)
        if (comparables.length >= 2) break // get 2 comparables
      }
    }
  }
  
  return comparables
}

// Main content generation function
export async function generateBriefContent(
  propertyType: PropertyType,
  timeSpan: TimeSpan,
  customDateRange?: { start: string; end: string },
): Promise<{ title: string; content: string; selectedData: DataPoint[] }> {
  // Fetch all relevant data
  const categoryFilter = propertyType === 'all' ? undefined : propertyType
  const allDataPoints = await fetchAllDataSources(categoryFilter)
  
  // AI selects the most relevant data points (top 5-8)
  // Simulating AI selection logic - prioritizing recent, high-value, and diverse types
  const selectedData: DataPoint[] = []
  const seenCategories = new Set<string>()
  const seenTypes = new Set<string>()
  
  for (const point of allDataPoints) {
    if (selectedData.length >= 8) break // max 8 data points
    
    // Prioritize diversity in types and categories
    const typeKey = `${point.type}-${point.category}`
    if (!seenTypes.has(typeKey) || Math.random() > 0.3) {
      selectedData.push(point)
      seenTypes.add(typeKey)
      seenCategories.add(point.category)
    }
  }
  
  // If we don't have enough, just add more
  if (selectedData.length < 5) {
    selectedData.push(...allDataPoints.slice(0, 5))
  }
  
  // Sort by relevance/importance (simplified logic)
  selectedData.sort((a, b) => {
    // Prioritize sales, then MLS, then permits
    const priority = { sale: 3, mls: 2, permit: 1 }
    return (priority[b.type as keyof typeof priority] || 0) - (priority[a.type as keyof typeof priority] || 0)
  })
  
  // Generate title
  const title = generateTitle(propertyType, timeSpan)
  
  // Build content sections
  let content = `# ${title}\n\n`
  
  if (customDateRange) {
    const start = new Date(customDateRange.start).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    })
    const end = new Date(customDateRange.end).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    })
    content += `**Reporting Period**: ${start} - ${end}\n\n`
  }
  
  // Intro paragraph
  const categoryCount = seenCategories.size
  content += `This ${timeSpanLabels[timeSpan].toLowerCase()} market report analyzes ${selectedData.length} key transactions and activities across ${categoryCount} property category${categoryCount > 1 ? 'ies' : 'y'}. ` +
    `Our AI has automatically selected the most relevant permits, MLS listings, and sales records from county databases and MLS feeds. ` +
    `Each deal summary includes comparable data and market insights to help you understand current trends and opportunities.\n\n`
  
  // Group by category
  const byCategory: Record<string, DataPoint[]> = {}
  selectedData.forEach(point => {
    if (!byCategory[point.category]) byCategory[point.category] = []
    byCategory[point.category].push(point)
  })
  
  // Generate summaries for each category
  for (const [category, points] of Object.entries(byCategory)) {
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)
    content += `## ${categoryLabel} Properties\n\n`
    
    for (const point of points) {
      let summary = ''
      
      if (point.type === 'permit') {
        summary = generatePermitSummary(point.data as Permit)
      } else if (point.type === 'mls') {
        summary = generateMLSSummary(point.data as MLSListing)
      } else if (point.type === 'sale') {
        summary = generateSaleSummary(point.data as SalesRecord)
      }
      
      // Add comparable data
      const comparables = findComparables(point, allDataPoints)
      if (comparables.length > 0) {
        summary += `\n\n*Comparable Activity*: ` +
          `Similar ${category} properties in the market show ${comparables.length} related transaction${comparables.length > 1 ? 's' : ''}, ` +
          `indicating ${category} sector ${comparables.length > 1 ? 'remains' : 'remains'} active.`
      }
      
      content += summary + '\n\n'
    }
  }
  
  // Closing summary
  const saleCount = selectedData.filter(p => p.type === 'sale').length
  const mlsCount = selectedData.filter(p => p.type === 'mls').length
  const permitCount = selectedData.filter(p => p.type === 'permit').length
  
  content += `## Market Summary\n\n` +
    `Overall, the market shows ${saleCount} completed sale${saleCount !== 1 ? 's' : ''}, ` +
    `${mlsCount} active or pending listing${mlsCount !== 1 ? 's' : ''}, ` +
    `and ${permitCount} significant permit${permitCount !== 1 ? 's' : ''} ` +
    `across the analyzed property types. These indicators suggest a ${selectedData.length > 6 ? 'vibrant' : 'stable'} market with ongoing activity and development. ` +
    `Investors and stakeholders should monitor these trends as they develop over the coming periods.`
  
  return { title, content, selectedData }
}

// Wrapper function with delay to simulate AI processing
export async function generateBriefWithAI(
  propertyType: PropertyType,
  timeSpan: TimeSpan,
  customDateRange?: { start: string; end: string },
): Promise<{ title: string; content: string; selectedData: DataPoint[] }> {
  // Simulate AI processing time (like an intern, might make this too slow sometimes)
  await new Promise(resolve => setTimeout(resolve, 1200)) // 1.2 seconds
  
  try {
    const result = await generateBriefContent(propertyType, timeSpan, customDateRange)
    return result
  } catch (error) {
    // Oops, error handling (intern might forget this sometimes)
    console.error('AI generation error:', error)
    throw error
  }
}