import { NextResponse } from 'next/server'
import { getSessionUser } from '../../../../utils/auth'
import { createClient } from '../../../../utils/supabase/server'

export async function GET(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const ticketId = searchParams.get('ticketId')
    const supabase = await createClient()

    if (ticketId) {
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })
      return NextResponse.json({ messages: messages || [] })
    } else {
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('business_id', user.business_id)
        .order('created_at', { ascending: false })
      return NextResponse.json({ tickets: tickets || [] })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { ticketId, sender, message, imageUrl } = await req.json()
    if (!ticketId || !sender || !message) {
      return NextResponse.json({ error: 'ticketId, sender, message are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ ticket_id: ticketId, sender, message, image_url: imageUrl || null })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, message: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })

    const supabase = await createClient()
    const { error } = await supabase
      .from('support_tickets')
      .update({ status })
      .eq('id', id)
      .eq('business_id', user.business_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
