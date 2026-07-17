'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          businessName,
          slug: formattedSlug,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Signup failed')
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
    <form onSubmit={handleSignup} className="space-y-4">
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
          placeholder="Min 6 characters"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
          Agency / Business Name
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => {
            setBusinessName(e.target.value)
            if (!slug) {
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
            }
          }}
          className="input-field"
          placeholder="Apex Real Estate"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
          Site URL Slug (Subdomain)
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
          className="input-field"
          placeholder="apex-properties"
          required
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Your custom sub-site will be hosted at `/sites/{slug || 'your-slug'}`
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-2.5 mt-2"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <div className="text-center text-xs text-slate-500 mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline font-semibold">
          Log in here
        </Link>
      </div>
    </form>
  )
}
