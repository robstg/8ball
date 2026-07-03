// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
    }

    // Skip duplicates
    const existing = await client.fetch(
      `count(*[_type == "subscriber" && email == $email])`,
      { email: email.toLowerCase().trim() }
    )
    if (existing > 0) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
    }

    await client.create({
      _type: 'subscriber',
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      source: source || 'unknown',
    })

    return NextResponse.json({ message: 'Subscribed' }, { status: 200 })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 })
  }
}