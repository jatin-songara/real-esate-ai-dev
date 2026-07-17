import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/auth'

export const runtime = 'edge'

// 1. Create AI Agent
export async function POST(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, property_id, voice, personality, greeting, language, custom_qa, widget_color, widget_theme } = await req.json()

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const id = crypto.randomUUID()
    const qaJson = JSON.stringify(custom_qa || [])

    await dbClient.db
      .prepare(
        `INSERT INTO agents (id, business_id, property_id, name, voice, personality, greeting, language, custom_qa, widget_color, widget_theme)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        user.business_id,
        property_id || null,
        name,
        voice,
        personality,
        greeting,
        language || 'English',
        qaJson,
        widget_color || '#2563eb',
        widget_theme || 'light'
      )
      .run()

    return NextResponse.json({
      success: true,
      agent: {
        id,
        business_id: user.business_id,
        property_id,
        name,
        voice,
        personality,
        greeting,
        language,
        custom_qa,
        widget_color,
        widget_theme,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 2. Update AI Agent
export async function PUT(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, name, property_id, voice, personality, greeting, language, custom_qa, widget_color, widget_theme } = await req.json()

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const qaJson = JSON.stringify(custom_qa || [])

    await dbClient.db
      .prepare(
        `UPDATE agents
         SET property_id = ?, name = ?, voice = ?, personality = ?, greeting = ?, language = ?, custom_qa = ?, widget_color = ?, widget_theme = ?
         WHERE id = ? AND business_id = ?`
      )
      .bind(
        property_id || null,
        name,
        voice,
        personality,
        greeting,
        language || 'English',
        qaJson,
        widget_color || '#2563eb',
        widget_theme || 'light',
        id,
        user.business_id
      )
      .run()

    return NextResponse.json({
      success: true,
      agent: {
        id,
        business_id: user.business_id,
        property_id,
        name,
        voice,
        personality,
        greeting,
        language,
        custom_qa,
        widget_color,
        widget_theme,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 3. Delete AI Agent
export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    await dbClient.db
      .prepare('DELETE FROM agents WHERE id = ? AND business_id = ?')
      .bind(id, user.business_id)
      .run()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
