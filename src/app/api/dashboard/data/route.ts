import { NextResponse } from 'next/server'
import { getSessionUser } from '../../../../utils/auth'
import { createClient } from '../../../../utils/supabase/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const businessId = user.business_id

    const [{ data: properties }, { data: agents }, { data: appointments }, { data: tickets }] =
      await Promise.all([
        supabase.from('properties').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
        supabase.from('agents').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
        supabase.from('appointments').select('*').eq('business_id', businessId).order('slot_time', { ascending: true }),
        supabase.from('support_tickets').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
      ])

    return NextResponse.json({
      business: {
        id: user.business_id,
        name: user.business_name,
        slug: user.business_slug,
        subscription_tier: user.subscription_tier,
      },
      properties: properties || [],
      agents: agents || [],
      appointments: appointments || [],
      tickets: tickets || [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
