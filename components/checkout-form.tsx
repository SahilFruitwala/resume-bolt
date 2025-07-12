'use client'

import { PaymentElement, useCheckout } from '@stripe/react-stripe-js'
import { Button } from './ui/button'

export const CheckoutForm = () => {
  const checkout = useCheckout()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!checkout) {
      return
    }

    const result = await checkout.confirm()

    if (result.type === 'error') {
      console.log(result.error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" className="mt-4 w-full">
        Submit
      </Button>
    </form>
  )
}
