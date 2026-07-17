import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { getSessionIdFromRequest, getClearSessionCookie } from '../../../../utils/auth'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const sessionId = getSessionIdFromRequest(req)

    if (sessionId) {
      const dbClient = await getDbClient()
      if (dbClient.type === 'd1') {
        // Delete session from D1
        await dbClient.db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run()
      }
    }

    const response = NextResponse.json({ success: true })
    response.headers.set('Set-Cookie', getClearSessionCookie())
    return response
  } catch (err: any) {
    console.error('Logout error:', err)
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
