import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { hashPassword, setSessionCookie } from '../../../../utils/auth'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { email, password, businessName, slug } = await req.json()

    if (!email || !password || !businessName || !slug) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') {
      return NextResponse.json({ error: 'Database binding not configured' }, { status: 500 })
    }

    // 1. Verify if user already exists
    const { results: existingUsers } = await dbClient.db
      .prepare('SELECT id FROM profiles WHERE email = ?')
      .bind(email)
      .all()

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password)
    const userId = crypto.randomUUID()
    const businessId = crypto.randomUUID()
    const sessionId = crypto.randomUUID()

    // 3. Perform inserts in D1
    // Insert profile
    await dbClient.db
      .prepare('INSERT INTO profiles (id, email, password_hash) VALUES (?, ?, ?)')
      .bind(userId, email, hashedPassword)
      .run()

    // Insert business
    const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    await dbClient.db
      .prepare('INSERT INTO businesses (id, owner_id, name, slug, subscription_tier) VALUES (?, ?, ?, ?, ?)')
      .bind(businessId, userId, businessName, formattedSlug, 'Free')
      .run()

    // Insert session (30 days)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await dbClient.db
      .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
      .bind(sessionId, userId, expiresAt)
      .run()

    // 4. Return response with cookie
    const response = NextResponse.json({ success: true, userId, businessId })
    response.headers.set('Set-Cookie', setSessionCookie(sessionId))
    return response
  } catch (err: any) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
