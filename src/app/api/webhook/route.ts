import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '../../../utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15' as any,
})

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err: any) {
    if (process.env.NODE_ENV === 'development') {
      event = JSON.parse(payload)
    } else {
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }
  }

  try {
    const supabase = await createAdminClient()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const businessId = session.metadata?.businessId
      const plan = session.metadata?.plan

      if (businessId && plan) {
        await supabase
          .from('businesses')
          .update({ subscription_tier: plan, stripe_subscription_id: session.subscription as string })
          .eq('id', businessId)
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('businesses')
        .update({ subscription_tier: 'Free', stripe_subscription_id: null })
        .eq('stripe_subscription_id', subscription.id)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
