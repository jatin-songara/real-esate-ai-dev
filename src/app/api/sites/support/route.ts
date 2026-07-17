import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'

export const runtime = 'edge'

// 1. Fetch chat messages or support tickets (by email/businessId)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticketId = searchParams.get('ticketId')

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    if (!ticketId) return NextResponse.json({ error: 'ticketId is required' }, { status: 400 })

    const { results } = await dbClient.db
      .prepare('SELECT * FROM chat_messages WHERE ticket_id = ? ORDER BY created_at ASC')
      .bind(ticketId)
      .all()

    return NextResponse.json({ messages: results || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 2. Create support ticket or insert guest message
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action } = body

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    if (action === 'create_ticket') {
      const { businessId, clientName, clientEmail } = body
      if (!businessId || !clientName || !clientEmail) {
        return NextResponse.json({ error: 'businessId, clientName, clientEmail required' }, { status: 400 })
      }

      const ticketId = crypto.randomUUID()
      await dbClient.db
        .prepare('INSERT INTO support_tickets (id, business_id, client_name, client_email, status) VALUES (?, ?, ?, ?, ?)')
        .bind(ticketId, businessId, clientName, clientEmail, 'open')
        .run()

      return NextResponse.json({ success: true, ticket: { id: ticketId, client_name: clientName, client_email: clientEmail } })
    }

    if (action === 'send_message') {
      const { ticketId, sender, message, imageUrl } = body
      if (!ticketId || !sender || !message) {
        return NextResponse.json({ error: 'ticketId, sender, message required' }, { status: 400 })
      }

      const id = crypto.randomUUID()
      await dbClient.db
        .prepare('INSERT INTO chat_messages (id, ticket_id, sender, message, image_url) VALUES (?, ?, ?, ?, ?)')
        .bind(id, ticketId, sender, message, imageUrl || null)
        .run()

      return NextResponse.json({ success: true, message: { id, ticket_id: ticketId, sender, message, image_url: imageUrl } })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
