import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'
import { auth, currentUser } from '@clerk/nextjs/server'

const settingsUrl = absoluteUrl('/settings')

export async function POST(req: Request) {
  try {
    const { planId } = await req.json()
    const { userId } = auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const session = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    })
    return NextResponse.json({ checkoutSessionClientSecret: session.client_secret })
  } catch (error) {
    console.log('[STRIPE_ERROR]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
