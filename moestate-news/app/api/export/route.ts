import { NextResponse } from 'next/server'
import { digestSchema } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the digest structure
    const validated = digestSchema.parse(body)
    
    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(validated, null, 2)
    
    // Return as text/plain content type
    return new NextResponse(jsonString, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="digest-${validated.id}.txt"`,
      },
    })
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export digest', details: error.message },
      { status: 400 }
    )
  }
}
