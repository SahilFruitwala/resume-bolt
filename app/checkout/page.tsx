'use client'

import { CheckoutForm } from '@/components/checkout-form'
import { CheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

import { useSearchParams } from 'next/navigation'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('planId')

  const fetchClientSecret = () => {
    return fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: planId,
      }),
    })
      .then((response) => response.json())
      .then((json) => json.checkoutSessionClientSecret)
  }

  return (
    <CheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <CheckoutForm />
    </CheckoutProvider>
  )
}
