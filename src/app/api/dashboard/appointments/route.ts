import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/auth'

export const runtime = 'edge'

// 1. Update Appointment
export async function PUT(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, status, payment_status, slot_time } = await req.json()

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    await dbClient.db
      .prepare(
        `UPDATE appointments
         SET status = ?, payment_status = ?, slot_time = ?
         WHERE id = ? AND business_id = ?`
      )
      .bind(status, payment_status, slot_time, id, user.business_id)
      .run()

    // Fetch updated appointment
    const { results } = await dbClient.db
      .prepare('SELECT * FROM appointments WHERE id = ?')
      .bind(id)
      .all()

    return NextResponse.json({
      success: true,
      appointment: results && results.length > 0 ? results[0] : null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 2. Delete Appointment
export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    await dbClient.db
      .prepare('DELETE FROM appointments WHERE id = ? AND business_id = ?')
      .bind(id, user.business_id)
      .run()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
