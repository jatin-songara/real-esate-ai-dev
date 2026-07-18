import { NextResponse } from 'next/server'
import { getSessionUser } from '../../../../utils/auth'
import { createClient } from '../../../../utils/supabase/server'

export const runtime = 'edge'

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    if (body.slug) {
      body.slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    }

    const supabase = await createClient()
    const { data: business, error } = await supabase
      .from('businesses')
      .update(body)
      .eq('id', user.business_id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, business })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
