import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../utils/supabase/server'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (!slug) return NextResponse.json({ error: 'slug is required' }, { status: 400 })

    const supabase = await createAdminClient()

    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    const [{ data: properties }, { data: agents }] = await Promise.all([
      supabase.from('properties').select('*').eq('business_id', business.id),
      supabase.from('agents').select('*').eq('business_id', business.id),
    ])

    return NextResponse.json({ business, properties: properties || [], agents: agents || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
