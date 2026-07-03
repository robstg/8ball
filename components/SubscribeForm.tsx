// components/SubscribeForm.tsx
'use client'

import { useState } from 'react'

export default function SubscribeForm({ source = 'unknown' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
        return
      }

      setStatus('success')
      setMessage("You're on the list.")
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')
    }
  }

  return (
    <div style={styles.wrapper}>
      <p style={styles.heading}>Get the weekly wrap-up</p>
      <p style={styles.subheading}>Pool, snooker, 9-ball and Heyball news, straight to your inbox.</p>

      {status === 'success' ? (
        <p style={styles.success}>{message}</p>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button type="submit" disabled={status === 'loading'} style={styles.button}>
            {status === 'loading' ? 'Joining...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && <p style={styles.error}>{message}</p>}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: 'linear-gradient(135deg, #0b5c3f 0%, #08402c 100%)',
    borderRadius: 14,
    padding: '1.5rem',
    maxWidth: 480,
    color: '#f6f1e4',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  heading: { fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem' },
  subheading: { fontSize: '0.9rem', opacity: 0.8, margin: '0 0 1rem' },
  form: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  input: {
    flex: '1 1 200px',
    padding: '0.6rem 0.8rem',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    fontSize: '0.95rem',
  },
  button: {
    background: '#d4a94a',
    color: '#08402c',
    fontWeight: 700,
    border: 'none',
    borderRadius: 8,
    padding: '0.6rem 1.2rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  success: { fontWeight: 600, margin: 0 },
  error: { fontSize: '0.85rem', color: '#f2a4a4', marginTop: '0.5rem' },
}