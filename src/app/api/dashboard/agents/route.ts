import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/auth'

export const runtime = 'edge'

// 1. Add new Agent
export async function POST(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      property_id,
      name,
      voice,
      personality,
      greeting,
      language,
      custom_qa,
      widget_color,
      widget_theme,
      interpretation_level,
      service_type,
    } = await req.json()

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const id = crypto.randomUUID()
    const customQaJson = JSON.stringify(custom_qa || [])

    await dbClient.db
      .prepare(
        `INSERT INTO agents (id, business_id, property_id, name, voice, personality, greeting, language, custom_qa, widget_color, widget_theme, interpretation_level, service_type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
        customQaJson,
        widget_color || '#2563eb',
        widget_theme || 'light',
        interpretation_level || 'medium',
        service_type || 'Viewing Property'
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
        interpretation_level,
        service_type,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 2. Update existing Agent
export async function PUT(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      id,
      property_id,
      name,
      voice,
      personality,
      greeting,
      language,
      custom_qa,
      widget_color,
      widget_theme,
      interpretation_level,
      service_type,
    } = await req.json()

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const customQaJson = JSON.stringify(custom_qa || [])

    await dbClient.db
      .prepare(
        `UPDATE agents
         SET property_id = ?, name = ?, voice = ?, personality = ?, greeting = ?, language = ?, custom_qa = ?, widget_color = ?, widget_theme = ?, interpretation_level = ?, service_type = ?
         WHERE id = ? AND business_id = ?`
      )
      .bind(
        property_id || null,
        name,
        voice,
        personality,
        greeting,
        language || 'English',
        customQaJson,
        widget_color || '#2563eb',
        widget_theme || 'light',
        interpretation_level || 'medium',
        service_type || 'Viewing Property',
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
        interpretation_level,
        service_type,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 3. Delete Agent
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
