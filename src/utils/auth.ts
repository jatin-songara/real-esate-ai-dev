import { getDbClient } from './db'

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function getSessionIdFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/session=([^;]+)/)
  return match ? match[1] : null
}

export function setSessionCookie(sessionId: string): string {
  // Returns Cookie header string: HttpOnly, Secure, 30 days expiry
  return `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=2592000`
}

export function getClearSessionCookie(): string {
  return `session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`
}

export async function getSessionUser(req: Request): Promise<any | null> {
  const sessionId = getSessionIdFromRequest(req)
  if (!sessionId) return null

  const dbClient = await getDbClient()
  if (dbClient.type === 'd1') {
    const { results } = await dbClient.db
      .prepare(
        `SELECT p.id, p.email, b.id as business_id, b.name as business_name, b.slug as business_slug, b.subscription_tier
         FROM sessions s
         JOIN profiles p ON s.user_id = p.id
         JOIN businesses b ON b.owner_id = p.id
         WHERE s.id = ? AND s.expires_at > datetime('now')`
      )
      .bind(sessionId)
      .all()

    return results && results.length > 0 ? results[0] : null
  }
  return null
}
