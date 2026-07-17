import { NextResponse } from 'next/server'
import { handleBookAppointment } from '../../../../ai/tools'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const args = await req.json()
    const result = await handleBookAppointment(args)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 550 })
  }
}
