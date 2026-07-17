import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/auth'

export const runtime = 'edge'

// 1. Fetch Chat Messages (if ticketId query param given) or Support Tickets (if no ticketId)
export async function GET(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const ticketId = searchParams.get('ticketId')

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    if (ticketId) {
      // Get chat messages
      const { results } = await dbClient.db
        .prepare('SELECT * FROM chat_messages WHERE ticket_id = ? ORDER BY created_at ASC')
        .bind(ticketId)
        .all()
      return NextResponse.json({ messages: results || [] })
    } else {
      // Get all tickets for the business
      const { results } = await dbClient.db
        .prepare('SELECT * FROM support_tickets WHERE business_id = ? ORDER BY created_at DESC')
        .bind(user.business_id)
        .all()
      return NextResponse.json({ tickets: results || [] })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 2. Insert Support Chat message
export async function POST(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { ticketId, sender, message, imageUrl } = await req.json()

    if (!ticketId || !sender || !message) {
      return NextResponse.json({ error: 'ticketId, sender, message are required' }, { status: 400 })
    }

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const id = crypto.randomUUID()
    await dbClient.db
      .prepare('INSERT INTO chat_messages (id, ticket_id, sender, message, image_url) VALUES (?, ?, ?, ?, ?)')
      .bind(id, ticketId, sender, message, imageUrl || null)
      .run()

    return NextResponse.json({
      success: true,
      message: {
        id,
        ticket_id: ticketId,
        sender,
        message,
        image_url: imageUrl,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 3. Update Ticket status (Resolve / Close)
export async function PUT(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 })

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    await dbClient.db
      .prepare('UPDATE support_tickets SET status = ? WHERE id = ? AND business_id = ?')
      .bind(status, id, user.business_id)
      .run()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
