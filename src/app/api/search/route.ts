import { NextResponse } from 'next/server'
import { getDbClient } from '../../../utils/db'
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

    const dbClient = await getDbClient()
    let properties: any[] = []

    // 1. Try semantic search querying Vectorize
    const matches = await semanticSearchProperties(query, 5)

    if (matches && matches.length > 0) {
      const matchIds = matches.map((m: any) => m.id)

      if (dbClient.type === 'd1') {
        // Query D1 using SQL IN
        const placeholders = matchIds.map(() => '?').join(',')
        const { results } = await dbClient.db
          .prepare(`SELECT * FROM properties WHERE business_id = ? AND id IN (${placeholders})`)
          .bind(businessId, ...matchIds)
          .all()

        properties = results
      } else {
        // Query Supabase using SQL IN
        const { data } = await dbClient.db
          .from('properties')
          .select('*')
          .eq('business_id', businessId)
          .in('id', matchIds)

        properties = data || []
      }
    } else {
      // 2. Fallback to SQL LIKE queries for local testing
      if (dbClient.type === 'd1') {
        const { results } = await dbClient.db
          .prepare("SELECT * FROM properties WHERE business_id = ? AND (title LIKE ? OR description LIKE ?)")
          .bind(businessId, `%${query}%`, `%${query}%`)
          .all()

        properties = results
      } else {
        const { data } = await dbClient.db
          .from('properties')
          .select('*')
          .eq('business_id', businessId)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)

        properties = data || []
      }
    }

    // Parse SQLite JSON properties if running on D1
    if (dbClient.type === 'd1') {
      properties = properties.map((p) => {
        const item = { ...p }
        if (typeof item.amenities === 'string') {
          item.amenities = JSON.parse(item.amenities)
        }
        if (typeof item.images === 'string') {
          item.images = JSON.parse(item.images)
        }
        return item
      })
    }

    return NextResponse.json({ properties })
  } catch (err: any) {
    console.error('Semantic search error:', err)
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
