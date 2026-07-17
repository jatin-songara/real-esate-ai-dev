'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Settings, CreditCard, Sparkles, Check, Globe, MapPin, Clock, Phone, Mail } from 'lucide-react'

export default function SettingsDashboard() {
  const { business, setBusiness } = useBusinessStore()

  // Form states
  const [name, setName] = useState(business?.name || '')
  const [slug, setSlug] = useState(business?.slug || '')
  const [stripeSecretKey, setStripeSecretKey] = useState(business?.stripe_secret_key || '')
  const [stripePublishableKey, setStripePublishableKey] = useState(business?.stripe_publishable_key || '')
  const [contactPhone, setContactPhone] = useState(business?.contact_phone || '')
  const [supportEmail, setSupportEmail] = useState(business?.support_email || '')
  const [websiteUrl, setWebsiteUrl] = useState(business?.website_url || '')
  const [timezone, setTimezone] = useState(business?.timezone || 'UTC')
  const [mapsLatitude, setMapsLatitude] = useState(business?.maps_latitude?.toString() || '')
  const [mapsLongitude, setMapsLongitude] = useState(business?.maps_longitude?.toString() || '')

  // Parse operating hours
  let initialHours: any = {}
  try {
    initialHours = JSON.parse(business?.operating_hours || '{}')
  } catch (_) {
    initialHours = {}
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const defaultHours = daysOfWeek.reduce((acc: any, day) => {
    acc[day] = initialHours[day] || { active: true, start: '09:00', end: '17:00' }
    return acc
  }, {})

  const [operatingHours, setOperatingHours] = useState<any>(defaultHours)
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
          contact_phone: contactPhone,
          support_email: supportEmail,
          website_url: websiteUrl,
          timezone,
          maps_latitude: mapsLatitude ? parseFloat(mapsLatitude) : null,
          maps_longitude: mapsLongitude ? parseFloat(mapsLongitude) : null,
          operating_hours: operatingHours,
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

  const handleUpgrade = async (tier: 'Pro' | 'Business' | 'WebsiteAddon') => {
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
        if (data.url.includes('placeholder')) {
          // Mock success locally
          if (tier === 'WebsiteAddon') {
            const upRes = await fetch('/api/dashboard/settings', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...business,
                website_addon_subscribed: true,
              }),
            })
            const upData = await upRes.json()
            if (upRes.ok && upData.business) setBusiness(upData.business)
          }
          setMessage(`${tier} subscription updated successfully!`)
        } else {
          window.location.href = data.url
        }
      } else {
        setMessage(data.error || 'Failed to create checkout session')
      }
    } catch (err: any) {
      setMessage(err.message || 'An error occurred during upgrade')
    } finally {
      setUpgrading(false)
    }
  }

  const handleHourChange = (day: string, field: string, value: any) => {
    setOperatingHours((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Settings</h2>
        <p className="text-xs text-slate-400">Configure agency profiles, Stripe keys, timezone scheduling, and weekly availability constraints</p>
      </div>

      {message && (
        <div className="p-3 text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-lg">
          {message}
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <div className="card-surface p-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-500" /> Agency Integration Profile
          </h3>
          <div className="space-y-4">
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

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Contact Phone
                </label>
                <input type="tel" className="input-field" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+1 234-5678" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Support Email
                </label>
                <input type="email" className="input-field" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="help@agency.com" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Website URL
                </label>
                <input type="url" className="input-field" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://agency.com" />
              </div>
            </div>
          </div>
        </div>

        {/* Map Coordinates & Timezone */}
        <div className="card-surface p-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" /> Geolocation & Timezone Configuration
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Operational Timezone</label>
                <select className="input-field py-2 text-xs" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="UTC">UTC (GMT)</option>
                  <option value="America/New_York">America/New York (EST)</option>
                  <option value="America/Chicago">America/Chicago (CST)</option>
                  <option value="America/Denver">America/Denver (MST)</option>
                  <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Google Maps Latitude</label>
                <input type="number" step="any" className="input-field" value={mapsLatitude} onChange={(e) => setMapsLatitude(e.target.value)} placeholder="e.g. 40.7128" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Google Maps Longitude</label>
                <input type="number" step="any" className="input-field" value={mapsLongitude} onChange={(e) => setMapsLongitude(e.target.value)} placeholder="e.g. -74.0060" />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Availability Constraints */}
        <div className="card-surface p-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Weekly Hours Constraints
          </h3>
          <div className="space-y-3.5 divide-y divide-slate-100/60">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center justify-between pt-3.5 first:pt-0">
                <div className="w-32 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={operatingHours[day].active}
                    onChange={(e) => handleHourChange(day, 'active', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-xs font-bold text-slate-700 capitalize">{day}</span>
                </div>
                {operatingHours[day].active ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={operatingHours[day].start}
                      onChange={(e) => handleHourChange(day, 'start', e.target.value)}
                      className="input-field py-1 px-2.5 text-xs w-28"
                    />
                    <span className="text-slate-400 text-xs">to</span>
                    <input
                      type="time"
                      value={operatingHours[day].end}
                      onChange={(e) => handleHourChange(day, 'end', e.target.value)}
                      className="input-field py-1 px-2.5 text-xs w-28"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-red-500 font-semibold uppercase">Blocked (Closed)</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stripe Keys */}
        <div className="card-surface p-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-500" /> Payment & Key Connections
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Your Stripe Publishable Key</label>
              <input type="text" className="input-field" value={stripePublishableKey} onChange={(e) => setStripePublishableKey(e.target.value)} placeholder="pk_test_..." />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Your Stripe Secret Key</label>
              <input type="password" className="input-field" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} placeholder="sk_test_..." />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3">
            Connecting your personal Stripe keys allows you to charge client consultation/viewing fees ($50) directly from the booking portal.
          </p>

          <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving Profile...' : 'Save All Settings'}
            </button>
          </div>
        </div>
      </form>

      {/* Subscription SaaS upgrading plan */}
      <div className="card-surface p-6 space-y-6">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-500" /> SaaS Billing Subscriptions & Add-ons
        </h3>

        {/* Main plans */}
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Active Tier</span>
            <div className="text-base font-extrabold text-slate-800 uppercase">{business?.subscription_tier} Plan</div>
          </div>
          {business?.subscription_tier === 'Free' && (
            <div className="inline-flex gap-2">
              <button onClick={() => handleUpgrade('Pro')} disabled={upgrading} className="btn-primary text-xs py-2">
                Upgrade to Pro ($49/mo)
              </button>
              <button onClick={() => handleUpgrade('Business')} disabled={upgrading} className="btn-secondary text-xs py-2 text-slate-800">
                Upgrade to Business ($199/mo)
              </button>
            </div>
          )}
        </div>

        {/* Addon */}
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Site Builder Add-on</span>
            <div className="text-xs font-extrabold text-slate-800 mt-1">
              {business?.website_addon_subscribed ? (
                <span className="text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Subscribed ($29/mo)</span>
              ) : (
                <span>Not Subscribed ($29/mo)</span>
              )}
            </div>
          </div>
          {!business?.website_addon_subscribed && (
            <button onClick={() => handleUpgrade('WebsiteAddon')} disabled={upgrading} className="btn-primary text-xs py-2 bg-indigo-600 hover:bg-indigo-700">
              Subscribe to Builder Add-on
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
