import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/auth'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    // 1. Authenticate user session
    const user = await getSessionUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const businessId = user.business_id
    const dbClient = await getDbClient()

    if (dbClient.type !== 'd1') {
      return NextResponse.json({ error: 'D1 binding not configured' }, { status: 500 })
    }

    // 2. Fetch all properties
    const { results: rawProperties } = await dbClient.db
      .prepare('SELECT * FROM properties WHERE business_id = ? ORDER BY created_at DESC')
      .bind(businessId)
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

    // 3. Fetch all agents
    const { results: rawAgents } = await dbClient.db
      .prepare('SELECT * FROM agents WHERE business_id = ? ORDER BY created_at DESC')
      .bind(businessId)
      .all()

    const agents = (rawAgents || []).map((a: any) => {
      const item = { ...a }
      if (typeof item.custom_qa === 'string') {
        item.custom_qa = JSON.parse(item.custom_qa)
      }
      return item
    })

    // 4. Fetch all appointments
    const { results: appointments } = await dbClient.db
      .prepare('SELECT * FROM appointments WHERE business_id = ? ORDER BY slot_time ASC')
      .bind(businessId)
      .all()

    // 5. Fetch support tickets
    const { results: tickets } = await dbClient.db
      .prepare('SELECT * FROM support_tickets WHERE business_id = ? ORDER BY created_at DESC')
      .bind(businessId)
      .all()

    // 6. Return response
    return NextResponse.json({
      business: {
        id: user.business_id,
        name: user.business_name,
        slug: user.business_slug,
        subscription_tier: user.subscription_tier,
      },
      properties,
      agents,
      appointments,
      tickets,
    })
  } catch (err: any) {
    console.error('Fetch dashboard data error:', err)
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
