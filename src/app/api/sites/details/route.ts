import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) return NextResponse.json({ error: 'slug is required' }, { status: 400 })

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    // 1. Fetch business
    const { results: bizResults } = await dbClient.db
      .prepare('SELECT * FROM businesses WHERE slug = ?')
      .bind(slug)
      .all()

    const business = bizResults && bizResults.length > 0 ? bizResults[0] : null
    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    // 2. Fetch properties
    const { results: rawProperties } = await dbClient.db
      .prepare('SELECT * FROM properties WHERE business_id = ?')
      .bind(business.id)
      .all()

    const properties = (rawProperties || []).map((p: any) => {
      const item = { ...p }
      if (typeof item.amenities === 'string') {
        item.amenities = JSON.parse(item.amenities)
      }
      if (typeof item.images === 'string') {
        item.images = JSON.parse(item.images)
      }
      return item
    })

    // 3. Fetch agents
    const { results: rawAgents } = await dbClient.db
      .prepare('SELECT * FROM agents WHERE business_id = ?')
      .bind(business.id)
      .all()

    const agents = (rawAgents || []).map((a: any) => {
      const item = { ...a }
      if (typeof item.custom_qa === 'string') {
        item.custom_qa = JSON.parse(item.custom_qa)
      }
      return item
    })

    return NextResponse.json({ business, properties, agents })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
