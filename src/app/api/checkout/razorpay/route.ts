import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { plan, businessId } = await req.json()

    // Calculate amounts in Paisa (INR) e.g., Pro = Rs 4,165, Business = Rs 16,915
    const amountInPaisa = plan === 'Pro' ? 4165 * 100 : 16915 * 100

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'

    // Create Razorpay Order via REST API
    const authString = btoa(`${keyId}:${keySecret}`)
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify({
        amount: amountInPaisa,
        currency: 'INR',
        receipt: `rcpt_${crypto.randomUUID().slice(0, 8)}`,
        notes: {
          businessId,
          plan,
        },
      }),
    })

    const order = await response.json()
    return NextResponse.json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (err: any) {
    console.error('Razorpay order creation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
