import { NextResponse } from 'next/server'
import { getSessionUser } from '../../../../utils/auth'
import { createClient } from '../../../../utils/supabase/server'

export async function POST(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, type, price, active, desc_text } = await req.json()
    const supabase = await createClient()

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        business_id: user.business_id,
        title,
        type,
        price: parseFloat(price || 0),
        active: active !== undefined ? active : true,
        desc_text
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, service })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, title, type, price, active, desc_text } = await req.json()
    const supabase = await createClient()

    const { data: service, error } = await supabase
      .from('services')
      .update({
        title,
        type,
        price: price !== undefined ? parseFloat(price || 0) : undefined,
        active,
        desc_text
      })
      .eq('id', id)
      .eq('business_id', user.business_id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, service })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const supabase = await createClient()
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('business_id', user.business_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
