import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../utils/supabase/server'
import { semanticSearchProperties } from '../../../utils/search'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const businessId = searchParams.get('businessId') || ''

    if (!query || !businessId) {
      return NextResponse.json({ error: 'q and businessId are required parameters' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    let properties: any[] = []

    // 1. Try semantic search via Vectorize
    const matches = await semanticSearchProperties(query, 5)

    if (matches && matches.length > 0) {
      const matchIds = matches.map((m: any) => m.id)
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('business_id', businessId)
        .in('id', matchIds)
      properties = data || []
    } else {
      // 2. Fallback to text search
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('business_id', businessId)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      properties = data || []
    }

    return NextResponse.json({ properties })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
