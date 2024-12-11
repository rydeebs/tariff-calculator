import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  
  // Process the data here
  console.log('Received webhook data:', body)

  // Send the data to Zapier
  try {
    const zapierResponse = await fetch('YOUR_ZAPIER_WEBHOOK_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!zapierResponse.ok) {
      throw new Error('Failed to send data to Zapier')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending data to Zapier:', error)
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 })
  }
}

