// Mock data sources for permits, MLS, and sales records
// In production, these would be real API calls to county databases, MLS systems, etc.

export interface Permit {
  id: string
  permitNumber: string
  propertyAddress: string
  propertyType: string
  permitType: string
  value: number
  issueDate: string
  status: string
  description: string
}

export interface MLSListing {
  id: string
  mlsNumber: string
  address: string
  propertyType: string
  listPrice: number
  squareFeet: number
  bedrooms?: number
  bathrooms?: number
  listingDate: string
  status: 'active' | 'pending' | 'sold'
  description: string
}

export interface SalesRecord {
  id: string
  parcelNumber: string
  address: string
  propertyType: string
  salePrice: number
  saleDate: string
  buyer: string
  seller: string
  squareFeet: number
  yearBuilt?: number
}

export interface DataPoint {
  type: 'article' | 'permit' | 'mls' | 'sale'
  data: any
  category: 'office' | 'retail' | 'industrial' | 'multifamily'
}

// Mock permit data
export const mockPermits: Permit[] = [
  {
    id: 'perm-1',
    permitNumber: 'BLD-2024-001234',
    propertyAddress: '123 Main St, Downtown',
    propertyType: 'office',
    permitType: 'New Construction',
    value: 2500000,
    issueDate: '2024-01-10',
    status: 'approved',
    description: 'New office building - 5 stories, 50,000 sq ft',
  },
  {
    id: 'perm-2',
    permitNumber: 'BLD-2024-002345',
    propertyAddress: '456 Commerce Ave',
    propertyType: 'retail',
    permitType: 'Tenant Improvement',
    value: 450000,
    issueDate: '2024-01-12',
    status: 'approved',
    description: 'Retail space renovation - 15,000 sq ft anchor tenant',
  },
  {
    id: 'perm-3',
    permitNumber: 'BLD-2024-003456',
    propertyAddress: '789 Industrial Blvd',
    propertyType: 'industrial',
    permitType: 'Expansion',
    value: 3200000,
    issueDate: '2024-01-08',
    status: 'in-review',
    description: 'Warehouse expansion - adding 100,000 sq ft',
  },
  {
    id: 'perm-4',
    permitNumber: 'BLD-2024-004567',
    propertyAddress: '321 Apartment Way',
    propertyType: 'multifamily',
    permitType: 'New Construction',
    value: 8500000,
    issueDate: '2024-01-15',
    status: 'approved',
    description: 'New apartment complex - 120 units, 8 stories',
  },
  {
    id: 'perm-5',
    permitNumber: 'BLD-2024-005678',
    propertyAddress: '654 Office Plaza',
    propertyType: 'office',
    permitType: 'Renovation',
    value: 1200000,
    issueDate: '2024-01-11',
    status: 'approved',
    description: 'Office building facade renovation and HVAC upgrade',
  },
]

// Mock MLS listings
export const mockMLSListings: MLSListing[] = [
  {
    id: 'mls-1',
    mlsNumber: 'MLS-12345',
    address: '100 Corporate Center Dr',
    propertyType: 'office',
    listPrice: 5500000,
    squareFeet: 45000,
    listingDate: '2024-01-05',
    status: 'active',
    description: 'Class A office building, fully leased, prime location',
  },
  {
    id: 'mls-2',
    mlsNumber: 'MLS-12346',
    address: '200 Shopping Center Rd',
    propertyType: 'retail',
    listPrice: 3200000,
    squareFeet: 28000,
    listingDate: '2024-01-07',
    status: 'pending',
    description: 'Strip mall with national anchor tenants, high traffic area',
  },
  {
    id: 'mls-3',
    mlsNumber: 'MLS-12347',
    address: '300 Distribution Ave',
    propertyType: 'industrial',
    listPrice: 8500000,
    squareFeet: 150000,
    listingDate: '2024-01-04',
    status: 'active',
    description: 'Modern distribution facility, 32 ft clear height, rail access',
  },
  {
    id: 'mls-4',
    mlsNumber: 'MLS-12348',
    address: '400 Residential Tower Blvd',
    propertyType: 'multifamily',
    listPrice: 12500000,
    squareFeet: 95000,
    bedrooms: 80,
    bathrooms: 80,
    listingDate: '2024-01-09',
    status: 'active',
    description: '80-unit apartment building, built 2018, 95% occupied',
  },
  {
    id: 'mls-5',
    mlsNumber: 'MLS-12349',
    address: '500 Office Park Way',
    propertyType: 'office',
    listPrice: 4200000,
    squareFeet: 35000,
    listingDate: '2024-01-06',
    status: 'sold',
    description: 'Mid-rise office building, recently renovated',
  },
]

// Mock sales records
export const mockSalesRecords: SalesRecord[] = [
  {
    id: 'sale-1',
    parcelNumber: 'PARC-001234',
    address: '150 Office Blvd',
    propertyType: 'office',
    salePrice: 4850000,
    saleDate: '2024-01-10',
    buyer: 'ABC Real Estate Fund LLC',
    seller: 'XYZ Holdings Inc',
    squareFeet: 40000,
    yearBuilt: 2010,
  },
  {
    id: 'sale-2',
    parcelNumber: 'PARC-002345',
    address: '250 Retail Plaza',
    propertyType: 'retail',
    salePrice: 2800000,
    saleDate: '2024-01-08',
    buyer: 'Retail Investment Group',
    seller: 'Local Developer Corp',
    squareFeet: 22000,
    yearBuilt: 2005,
  },
  {
    id: 'sale-3',
    parcelNumber: 'PARC-003456',
    address: '350 Warehouse Way',
    propertyType: 'industrial',
    salePrice: 9200000,
    saleDate: '2024-01-12',
    buyer: 'Logistics Partners LP',
    seller: 'Industrial Developers LLC',
    squareFeet: 180000,
    yearBuilt: 2015,
  },
  {
    id: 'sale-4',
    parcelNumber: 'PARC-004567',
    address: '450 Apartment Complex Dr',
    propertyType: 'multifamily',
    salePrice: 11200000,
    saleDate: '2024-01-11',
    buyer: 'Multi-Family Investment Trust',
    seller: 'Residential Developers Inc',
    squareFeet: 88000,
    yearBuilt: 2018,
  },
  {
    id: 'sale-5',
    parcelNumber: 'PARC-005678',
    address: '550 Business Park',
    propertyType: 'office',
    salePrice: 3600000,
    saleDate: '2024-01-09',
    buyer: 'Office Investors LLC',
    seller: 'Commercial Holdings',
    squareFeet: 30000,
    yearBuilt: 2008,
  },
]

// Categorize property types
// Note: this is a simplified categorizer, might miss some edge cases
export function categorizePropertyType(inputType: string): 'office' | 'retail' | 'industrial' | 'multifamily' {
  const type = inputType.toLowerCase()
  // TODO: make this more robust
  if (type.includes('office') || type.includes('commercial')) return 'office'
  if (type.includes('retail') || type.includes('shop') || type.includes('store')) return 'retail'
  if (type.includes('industrial') || type.includes('warehouse') || type.includes('distribution') || type.includes('manufacturing')) return 'industrial'
  if (type.includes('multi') || type.includes('apartment') || type.includes('residential') || type.includes('condo')) return 'multifamily'
  return 'office' // default fallback (maybe should be 'all'?)
}

// Fetch all data sources (mock)
export async function fetchAllDataSources(propertyTypeFilter?: string): Promise<DataPoint[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const dataPoints: DataPoint[] = []
  
  // Add permits
  mockPermits.forEach(permit => {
    if (!propertyTypeFilter || categorizePropertyType(permit.propertyType) === propertyTypeFilter) {
      dataPoints.push({
        type: 'permit',
        data: permit,
        category: categorizePropertyType(permit.propertyType),
      })
    }
  })
  
  // Add MLS listings
  mockMLSListings.forEach(listing => {
    if (!propertyTypeFilter || categorizePropertyType(listing.propertyType) === propertyTypeFilter) {
      dataPoints.push({
        type: 'mls',
        data: listing,
        category: categorizePropertyType(listing.propertyType),
      })
    }
  })
  
  // Add sales records
  mockSalesRecords.forEach(sale => {
    if (!propertyTypeFilter || categorizePropertyType(sale.propertyType) === propertyTypeFilter) {
      dataPoints.push({
        type: 'sale',
        data: sale,
        category: categorizePropertyType(sale.propertyType),
      })
    }
  })
  
  return dataPoints.sort((a, b) => {
    // Sort by date (most recent first) - this logic is a bit simplified
    const dateA = a.data.issueDate || a.data.listingDate || a.data.saleDate || ''
    const dateB = b.data.issueDate || b.data.listingDate || b.data.saleDate || ''
    return dateB.localeCompare(dateA)
  })
}

