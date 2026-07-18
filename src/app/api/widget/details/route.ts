import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../utils/supabase/server'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get('agentId')
    if (!agentId) return NextResponse.json({ error: 'agentId is required' }, { status: 400 })

    const supabase = await createAdminClient()
    const { data: agent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    return NextResponse.json({ agent })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
