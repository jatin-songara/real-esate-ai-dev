import { NextResponse } from 'next/server'
import { getDbClient } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/auth'

export const runtime = 'edge'

// 1. Add new Property
export async function POST(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      title,
      description,
      address,
      city,
      state,
      zip,
      price,
      type,
      category,
      status,
      bedrooms,
      bathrooms,
      parking_spaces,
      sqft,
      year_built,
      amenities,
      images,
    } = await req.json()

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const id = crypto.randomUUID()
    const amenitiesJson = JSON.stringify(amenities || [])
    const imagesJson = JSON.stringify(images || [])

    await dbClient.db
      .prepare(
        `INSERT INTO properties (id, business_id, title, description, address, city, state, zip, price, type, category, status, bedrooms, bathrooms, parking_spaces, sqft, year_built, amenities, images)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        user.business_id,
        title,
        description || '',
        address,
        city || '',
        state || '',
        zip || '',
        parseFloat(price),
        type,
        category || 'House',
        status || 'Available',
        parseInt(bedrooms),
        parseFloat(bathrooms),
        parseInt(parking_spaces || 0),
        parseFloat(sqft),
        year_built ? parseInt(year_built) : null,
        amenitiesJson,
        imagesJson
      )
      .run()

    return NextResponse.json({
      success: true,
      property: {
        id,
        business_id: user.business_id,
        title,
        description,
        address,
        city,
        state,
        zip,
        price,
        type,
        category,
        status,
        bedrooms,
        bathrooms,
        parking_spaces,
        sqft,
        year_built,
        amenities,
        images,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 2. Update existing Property
export async function PUT(req: Request) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      id,
      title,
      description,
      address,
      city,
      state,
      zip,
      price,
      type,
      category,
      status,
      bedrooms,
      bathrooms,
      parking_spaces,
      sqft,
      year_built,
      amenities,
      images,
    } = await req.json()

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') return NextResponse.json({ error: 'D1 not configured' }, { status: 500 })

    const amenitiesJson = JSON.stringify(amenities || [])
    const imagesJson = JSON.stringify(images || [])

    await dbClient.db
      .prepare(
        `UPDATE properties
         SET title = ?, description = ?, address = ?, city = ?, state = ?, zip = ?, price = ?, type = ?, category = ?, status = ?, bedrooms = ?, bathrooms = ?, parking_spaces = ?, sqft = ?, year_built = ?, amenities = ?, images = ?
         WHERE id = ? AND business_id = ?`
      )
      .bind(
        title,
        description || '',
        address,
        city || '',
        state || '',
        zip || '',
        parseFloat(price),
        type,
        category || 'House',
        status || 'Available',
        parseInt(bedrooms),
        parseFloat(bathrooms),
        parseInt(parking_spaces || 0),
        parseFloat(sqft),
        year_built ? parseInt(year_built) : null,
        amenitiesJson,
        imagesJson,
        id,
        user.business_id
      )
      .run()

    return NextResponse.json({
      success: true,
      property: {
        id,
        business_id: user.business_id,
        title,
        description,
        address,
        city,
        state,
        zip,
        price,
        type,
        category,
        status,
        bedrooms,
        bathrooms,
        parking_spaces,
        sqft,
        year_built,
        amenities,
        images,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}

// 3. Delete Property
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
      .prepare('DELETE FROM properties WHERE id = ? AND business_id = ?')
      .bind(id, user.business_id)
      .run()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
