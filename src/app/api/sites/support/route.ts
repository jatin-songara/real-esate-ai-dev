import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../utils/supabase/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticketId = searchParams.get('ticketId')
    if (!ticketId) return NextResponse.json({ error: 'ticketId is required' }, { status: 400 })

    const supabase = await createAdminClient()
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    return NextResponse.json({ messages: messages || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action } = body
    const supabase = await createAdminClient()

    if (action === 'create_ticket') {
      const { businessId, clientName, clientEmail, subject } = body
      if (!businessId || !clientName || !clientEmail) {
        return NextResponse.json({ error: 'businessId, clientName, clientEmail required' }, { status: 400 })
      }

      const { data: ticket, error } = await supabase
        .from('support_tickets')
        .insert({ business_id: businessId, client_name: clientName, client_email: clientEmail, subject: subject || 'General Inquiry' })
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, ticket })
    }

    if (action === 'send_message') {
      const { ticketId, sender, message, imageUrl } = body
      if (!ticketId || !sender || !message) {
        return NextResponse.json({ error: 'ticketId, sender, message required' }, { status: 400 })
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({ ticket_id: ticketId, sender, message, image_url: imageUrl || null })
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, message: data })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
