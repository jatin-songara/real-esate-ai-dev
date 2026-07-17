import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get('agentId')

    if (!agentId) return NextResponse.json({ error: 'agentId is required' }, { status: 400 })

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const { results } = await dbClient.db
      .prepare('SELECT * FROM agents WHERE id = ?')
      .bind(agentId)
      .all()

    const agent = results && results.length > 0 ? results[0] : null
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    return NextResponse.json({ agent })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
