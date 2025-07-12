import { db } from '@/db'
import { users } from '@/db/schema'
import { stripe } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    if (!session?.metadata?.userId) {
      return new NextResponse('User id is required', { status: 400 })
    }

    await db
      .update(users)
      .set({
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionStatus: subscription.status,
      })
      .where(eq(users.id, session.metadata.userId))
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription

    await db
      .update(users)
      .set({
        stripeSubscriptionStatus: subscription.status,
      })
      .where(eq(users.stripeSubscriptionId, subscription.id))
  }

  return new NextResponse(null, { status: 200 })
}
