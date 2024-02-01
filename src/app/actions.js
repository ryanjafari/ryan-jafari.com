'use server'

import { redirect } from 'next/navigation'

export async function subscribeToNewsletter(formData) {
  const email = formData.get('email')

  const ckApiEndpoint = process.env.CONVERTKIT_API_ENDPOINT
  const ckApiKey = process.env.CONVERTKIT_API_KEY
  const ckFormId = process.env.CONVERTKIT_FORM_ID

  const ckEndpoint = `${ckApiEndpoint}/${ckFormId}/subscribe`

  try {
    const response = await fetch(ckEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        api_key: ckApiKey,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'No message returned from ConvertKit')
    } else {
      // console.log(
      //   '%c[ryan-jafari.com]%c [subscribe]',
      //   'color: rgb(120, 120, 120)',
      //   'color: inherit',
      //   data,
      // )
    }
  } catch (error) {
    // console.error(
    //   '%c[ryan-jafari.com]%c [subscribe]',
    //   'color: rgb(120, 120, 120)',
    //   'color: inherit',
    // )
    throw error
  }

  redirect('/thank-you', 'push')
}
