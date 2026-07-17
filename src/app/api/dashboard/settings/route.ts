import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/auth'

export const runtime = 'edge'

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, slug, stripe_secret_key, stripe_publishable_key } = await req.json()

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

    await dbClient.db
      .prepare(
        `UPDATE businesses
         SET name = ?, slug = ?, stripe_secret_key = ?, stripe_publishable_key = ?
         WHERE id = ?`
      )
      .bind(
        name,
        formattedSlug,
        stripe_secret_key || null,
        stripe_publishable_key || null,
        user.business_id
      )
      .run()

    // Fetch updated business
    const { results } = await dbClient.db
      .prepare('SELECT * FROM businesses WHERE id = ?')
      .bind(user.business_id)
      .all()

    return NextResponse.json({
      success: true,
      business: results && results.length > 0 ? results[0] : null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
