'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid credentials')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="agent@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-2.5 mt-2"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="text-center text-xs text-slate-500 mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
          Create one now
        </Link>
      </div>
    </form>
  )
}
