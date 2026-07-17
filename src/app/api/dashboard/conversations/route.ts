import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/auth'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const { results: rawLogs } = await dbClient.db
      .prepare('SELECT * FROM call_logs WHERE business_id = ? ORDER BY created_at DESC')
      .bind(user.business_id)
      .all()

    const logs = (rawLogs || []).map((l: any) => {
      const item = { ...l }
      if (typeof item.transcript === 'string') {
        try {
          item.transcript = JSON.parse(item.transcript)
        } catch (_) {
          item.transcript = []
        }
      }
      return item
    })

    return NextResponse.json({ logs })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
