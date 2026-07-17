import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { getDbClient } from '../../../utils/db'

export const runtime = 'edge'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15' as any,
})

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://placeholder-project.supabase.co'

const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
)

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    if (process.env.NODE_ENV === 'development') {
      event = JSON.parse(payload)
    } else {
      return NextResponse.json({ error: 'Webhook Signature verification failed' }, { status: 400 })
    }
  }

  try {
    const dbClient = await getDbClient()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const businessId = session.metadata?.businessId
      const plan = session.metadata?.plan

      if (businessId && plan) {
        if (dbClient.type === 'd1') {
          await dbClient.db
            .prepare('UPDATE businesses SET subscription_tier = ?, stripe_subscription_id = ? WHERE id = ?')
            .bind(plan, session.subscription as string, businessId)
            .run()
        } else {
          const { error } = await supabaseAdmin
            .from('businesses')
            .update({
              subscription_tier: plan,
              stripe_subscription_id: session.subscription as string,
            })
            .eq('id', businessId)

          if (error) {
            console.error('Error updating business tier in DB:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
          }
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      if (dbClient.type === 'd1') {
        await dbClient.db
          .prepare("UPDATE businesses SET subscription_tier = 'Free', stripe_subscription_id = NULL WHERE stripe_subscription_id = ?")
          .bind(subscription.id)
          .run()
      } else {
        const { error } = await supabaseAdmin
          .from('businesses')
          .update({
            subscription_tier: 'Free',
            stripe_subscription_id: null,
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating business tier on subscription deletion:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
