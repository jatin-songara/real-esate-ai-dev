import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'edge'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15' as any,
})

export async function POST(req: Request) {
  try {
    const { plan, businessId, successUrl, cancelUrl } = await req.json()

    let priceId = ''
    if (plan === 'Pro') {
      priceId = 'price_pro_tier_mock' // Replace with live Stripe price ID in production
    } else if (plan === 'Business') {
      priceId = 'price_biz_tier_mock'
    } else {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Creating Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AgentFlow AI - ${plan} Subscription`,
              description: `Upgrade to ${plan} Tier benefits`,
            },
            unit_amount: plan === 'Pro' ? 4900 : 19900,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        businessId,
        plan,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
