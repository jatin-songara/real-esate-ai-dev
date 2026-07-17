import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { hashPassword, setSessionCookie } from '../../../../utils/auth'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') {
      return NextResponse.json({ error: 'Database binding not configured' }, { status: 500 })
    }

    // 1. Fetch user profile
    const { results } = await dbClient.db
      .prepare('SELECT * FROM profiles WHERE email = ?')
      .bind(email)
      .all()

    const user = results && results.length > 0 ? results[0] : null
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // 2. Verify password hash
    const hashedPassword = await hashPassword(password)
    if (user.password_hash !== hashedPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // 3. Create session
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await dbClient.db
      .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
      .bind(sessionId, user.id, expiresAt)
      .run()

    // 4. Return response with session cookie
    const response = NextResponse.json({ success: true, userId: user.id })
    response.headers.set('Set-Cookie', setSessionCookie(sessionId))
    return response
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
