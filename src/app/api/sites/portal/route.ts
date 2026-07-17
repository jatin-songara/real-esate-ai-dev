import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'

export const runtime = 'edge'

// 1. Fetch portal details
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const appointmentId = searchParams.get('appointmentId')

    if (!appointmentId) return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 })

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    // Fetch appointment
    const { results: apptResults } = await dbClient.db
      .prepare('SELECT * FROM appointments WHERE id = ?')
      .bind(appointmentId)
      .all()

    const appointment = apptResults && apptResults.length > 0 ? apptResults[0] : null
    if (!appointment) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })

    // Fetch property
    const { results: propResults } = await dbClient.db
      .prepare('SELECT * FROM properties WHERE id = ?')
      .bind(appointment.property_id)
      .all()
    const property = propResults && propResults.length > 0 ? propResults[0] : null

    // Fetch business
    const { results: bizResults } = await dbClient.db
      .prepare('SELECT * FROM businesses WHERE id = ?')
      .bind(appointment.business_id)
      .all()
    const business = bizResults && bizResults.length > 0 ? bizResults[0] : null

    // Find or create support ticket
    const { results: tktResults } = await dbClient.db
      .prepare('SELECT * FROM support_tickets WHERE client_email = ? AND business_id = ? LIMIT 1')
      .bind(appointment.client_email, appointment.business_id)
      .all()

    let ticket = tktResults && tktResults.length > 0 ? tktResults[0] : null

    if (!ticket) {
      const ticketId = crypto.randomUUID()
      await dbClient.db
        .prepare('INSERT INTO support_tickets (id, business_id, client_name, client_email, status) VALUES (?, ?, ?, ?, ?)')
        .bind(ticketId, appointment.business_id, appointment.client_name, appointment.client_email, 'open')
        .run()

      ticket = {
        id: ticketId,
        business_id: appointment.business_id,
        client_name: appointment.client_name,
        client_email: appointment.client_email,
        status: 'open',
      }
    }

    return NextResponse.json({ appointment, property, business, ticket })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 2. Reschedule or modify appointment
export async function PUT(req: Request) {
  try {
    const { appointmentId, slotTime, paymentStatus } = await req.json()
    if (!appointmentId) return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 })

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    if (slotTime) {
      await dbClient.db
        .prepare('UPDATE appointments SET slot_time = ? WHERE id = ?')
        .bind(slotTime, appointmentId)
        .run()
    }

    if (paymentStatus) {
      await dbClient.db
        .prepare('UPDATE appointments SET payment_status = ? WHERE id = ?')
        .bind(paymentStatus, appointmentId)
        .run()
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
