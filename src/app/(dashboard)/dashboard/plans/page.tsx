'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { CreditCard, Check, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react'

export default function PlansPage() {
  const { business, setBusiness } = useBusinessStore()
  const [upgrading, setUpgrading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleUpgrade = async (tier: 'Pro' | 'Business') => {
    if (!business) return
    setUpgrading(true)
    setMsg('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: tier,
          businessId: business.id,
          successUrl: `${window.location.origin}/dashboard/plans?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href,
        }),
      })

      const data = await res.json()
      if (data.url) {
        if (data.url.includes('placeholder')) {
          // Mock update locally
          const upRes = await fetch('/api/dashboard/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...business,
              subscription_tier: tier,
            }),
          })
          const upData = await upRes.json()
          if (upRes.ok && upData.business) setBusiness(upData.business)
          setMsg(`${tier} Subscription updated successfully!`)
        } else {
          window.location.href = data.url
        }
      }
    } catch (err: any) {
      setMsg(err.message || 'An error occurred')
    } finally {
      setUpgrading(false)
    }
  }

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      desc: 'Test out voice agents and custom dashboards.',
      features: ['1 Active AI Agent', '5 Bookings per month', 'Web Widget Embed', 'Standard Response Speeds'],
      tierKey: 'Free',
    },
    {
      name: 'Pro',
      price: '$49',
      desc: 'Built for independent real estate agents and brokers.',
      features: ['10 Active AI Agents', '5,099 Bookings per month', 'Web Widget Embed', 'Custom Q&A Training', 'Priority Call Latency'],
      tierKey: 'Pro',
    },
    {
      name: 'Business',
      price: '$199',
      desc: 'Best for agency firms and real estate firms.',
      features: ['Unlimited AI Agents', 'Unlimited Bookings', 'Subdomain website builder inclusion', 'Google Maps mapping embeds', 'Priority Call Latency'],
      tierKey: 'Business',
    },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Billing & Plans</h2>
        <p className="text-xs text-slate-400">Manage SaaS subscriptions, upgrade account limits, and inspect active plans</p>
      </div>

      {msg && (
        <div className="p-3 text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-lg">
          {msg}
        </div>
      )}

      {/* Active Tier */}
      <div className="card-surface p-5 bg-slate-50/50 border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Active Membership Plan</span>
          <h4 className="text-lg font-bold text-slate-800 uppercase">{business?.subscription_tier} Account Tier</h4>
        </div>
        <CreditCard className="w-8 h-8 text-blue-600 opacity-80" />
      </div>

      {/* Grid of pricing options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => {
          const isCurrent = business?.subscription_tier === t.tierKey
          return (
            <div key={t.name} className={`card-surface p-6 flex flex-col justify-between relative ${
              isCurrent ? 'border-blue-500 bg-blue-50/10' : ''
            }`}>
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] uppercase font-bold tracking-wider px-3.5 py-0.5 rounded-full border border-blue-400/20">
                  Active Tier
                </span>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-extrabold text-slate-800">{t.price}</span>
                  <span className="text-xs text-slate-400">/ mo</span>
                </div>
                <ul className="space-y-3.5 border-t border-slate-100 pt-4 mt-2">
                  {t.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!isCurrent && t.tierKey !== 'Free' && (
                <button
                  onClick={() => handleUpgrade(t.tierKey as any)}
                  disabled={upgrading}
                  className="w-full btn-primary mt-6 py-2 text-xs"
                >
                  {upgrading ? 'Upgrading...' : `Select ${t.name}`}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
