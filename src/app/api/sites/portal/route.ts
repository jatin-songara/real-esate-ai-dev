import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../utils/supabase/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const appointmentId = searchParams.get('appointmentId')
    if (!appointmentId) return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 })

    const supabase = await createAdminClient()

    const { data: appointment } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single()

    if (!appointment) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })

    const [{ data: property }, { data: business }] = await Promise.all([
      supabase.from('properties').select('*').eq('id', appointment.property_id).single(),
      supabase.from('businesses').select('*').eq('id', appointment.business_id).single(),
    ])

    // Find or create support ticket for this client
    let { data: ticket } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('client_email', appointment.client_email)
      .eq('business_id', appointment.business_id)
      .maybeSingle()

    if (!ticket) {
      const { data: newTicket } = await supabase
        .from('support_tickets')
        .insert({
          business_id: appointment.business_id,
          client_name: appointment.client_name,
          client_email: appointment.client_email,
          subject: 'Property Appointment',
        })
        .select()
        .single()
      ticket = newTicket
    }

    return NextResponse.json({ appointment, property, business, ticket })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { appointmentId, slotTime, paymentStatus } = await req.json()
    if (!appointmentId) return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 })

    const supabase = await createAdminClient()
    const updates: Record<string, any> = {}
    if (slotTime) updates.slot_time = slotTime
    if (paymentStatus) updates.payment_status = paymentStatus

    await supabase.from('appointments').update(updates).eq('id', appointmentId)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
