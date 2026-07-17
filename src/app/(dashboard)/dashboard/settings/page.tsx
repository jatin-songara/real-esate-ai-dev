'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Settings, CreditCard, Sparkles, Check, Globe } from 'lucide-react'

export default function SettingsDashboard() {
  const { business, setBusiness } = useBusinessStore()
  const [name, setName] = useState(business?.name || '')
  const [slug, setSlug] = useState(business?.slug || '')
  const [stripeSecretKey, setStripeSecretKey] = useState(business?.stripe_secret_key || '')
  const [stripePublishableKey, setStripePublishableKey] = useState(business?.stripe_publishable_key || '')
  const [upgrading, setUpgrading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          stripe_secret_key: stripeSecretKey,
          stripe_publishable_key: stripePublishableKey,
        }),
      })

      const data = await res.json()
      if (res.ok && data.business) {
        setBusiness(data.business)
        setMessage('Settings saved successfully!')
      } else {
        setMessage(data.error || 'Error saving settings')
      }
    } catch (err: any) {
      setMessage(err.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleUpgrade = async (tier: 'Pro' | 'Business') => {
    if (!business) return
    setUpgrading(true)
    setMessage('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: tier,
          businessId: business.id,
          successUrl: `${window.location.origin}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage(data.error || 'Failed to create checkout session')
      }
    } catch (err: any) {
      setMessage(err.message || 'An error occurred during upgrade')
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Settings</h2>
        <p className="text-xs text-slate-400">Configure agency profiles, Stripe keys, and manage billing tiers</p>
      </div>

      {message && (
        <div className="p-3 text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-lg">
          {message}
        </div>
      )}

      {/* Main Profile & API Settings */}
      <div className="card-surface p-6">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-500" /> Agency Integration Profile
        </h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Agency Name</label>
              <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Subdomain Slug</label>
              <input type="text" className="input-field" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Your Stripe Publishable Key</label>
              <input type="text" className="input-field" value={stripePublishableKey} onChange={(e) => setStripePublishableKey(e.target.value)} placeholder="pk_test_..." />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Your Stripe Secret Key</label>
              <input type="password" className="input-field" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} placeholder="sk_test_..." />
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Connecting your personal Stripe keys allows you to charge client consultation/viewing fees ($50) directly from the booking portal.
          </p>

          <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Subscription SaaS upgrading plan */}
      <div className="card-surface p-6 space-y-6">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-500" /> SaaS Billing Subscriptions
        </h3>
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Active Tier</span>
            <div className="text-base font-extrabold text-slate-800 uppercase">{business?.subscription_tier} Plan</div>
          </div>
          {business?.subscription_tier === 'Free' && (
            <div className="inline-flex gap-2">
              <button
                onClick={() => handleUpgrade('Pro')}
                disabled={upgrading}
                className="btn-primary text-xs py-2"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => handleUpgrade('Business')}
                disabled={upgrading}
                className="btn-secondary text-xs py-2 text-white bg-slate-900 border-transparent hover:bg-slate-850"
              >
                Upgrade to Business
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
