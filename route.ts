import { NextResponse } from 'next/server'
import { calculateTariff } from '@/lib/tariffCalculator' // Assume this is your backend function

export async function POST(request: Request) {
  const body = await request.json()
  
  try {
    const result = calculateTariff(body)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate tariff' }, { status: 500 })
  }
}

