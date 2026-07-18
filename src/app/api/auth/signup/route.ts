import { NextResponse } from 'next/server'
import { createClient } from '../../../../utils/supabase/server'
import { createAdminClient } from '../../../../utils/supabase/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { email, password, businessName, slug } = await req.json()

    if (!email || !password || !businessName || !slug) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const userId = data.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // 2. Create linked business using admin client (bypasses RLS)
    const admin = await createAdminClient()
    const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    const businessId = crypto.randomUUID()

    const { error: bizError } = await admin.from('businesses').insert({
      id: businessId,
      owner_id: userId,
      name: businessName,
      slug: formattedSlug,
      subscription_tier: 'Free',
    })

    if (bizError) {
      return NextResponse.json({ error: bizError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId, businessId })
  } catch (err: any) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
