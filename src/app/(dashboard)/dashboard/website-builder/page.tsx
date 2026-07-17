'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Layout, Globe, Image as ImageIcon, MapPin, CheckCircle, ExternalLink } from 'lucide-react'

export default function WebsiteBuilderPage() {
  const { business, agents, setBusiness } = useBusinessStore()

  // Form states
  const [slug, setSlug] = useState(business?.slug || '')
  const [theme, setTheme] = useState(business?.website_addon_subscribed ? 'light' : 'dark')
  const [typography, setTypography] = useState('Outfit')
  const [heroTitle, setHeroTitle] = useState('Find Your Dream Property Today')
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [mapsLat, setMapsLat] = useState(business?.maps_latitude?.toString() || '')
  const [mapsLng, setMapsLng] = useState(business?.maps_longitude?.toString() || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return
    setSaving(true)
    setMsg('')

    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...business,
          slug,
          maps_latitude: mapsLat ? parseFloat(mapsLat) : null,
          maps_longitude: mapsLng ? parseFloat(mapsLng) : null,
        }),
      })

      const data = await res.json()
      if (res.ok && data.business) {
        setBusiness(data.business)
        setMsg('Website builder configuration updated successfully!')
      } else {
        setMsg(data.error || 'Failed to save configuration')
      }
    } catch (err: any) {
      setMsg(err.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (!business?.website_addon_subscribed) {
    return (
      <div className="card-surface p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto">
        <Layout className="w-10 h-10 text-slate-350" />
        <h4 className="text-sm font-semibold text-slate-700">Subdomain Site Builder Add-on Required</h4>
        <p className="text-xs text-slate-400">
          Unlock a dedicated subdomain template featuring map coordinates, visual custom images, and automated widget loading for **$29/month**.
        </p>
        <a href="/dashboard/settings" className="btn-primary py-2 px-6 text-xs">
          Activate Builder in Settings
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Website Builder</h2>
          <p className="text-xs text-slate-400">Launch a premium, SEO-optimized landing page with Google Maps coordinates and connected AI widget</p>
        </div>
        <a href={`/sites/${business.slug}`} target="_blank" rel="noreferrer" className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5">
          View Live Page <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {msg && (
        <div className="p-3 text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-lg">
          {msg}
        </div>
      )}

      <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurations */}
        <div className="card-surface p-6 space-y-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Layout className="w-4 h-4 text-slate-500" /> Landing Page Layout
          </h3>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Target Subdomain Slug</label>
            <div className="flex items-center">
              <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-400 text-xs px-3 py-2 rounded-l-xl">/sites/</span>
              <input type="text" className="input-field rounded-l-none" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Typography Font</label>
              <select value={typography} onChange={(e) => setTypography(e.target.value)} className="input-field py-2 text-xs">
                <option value="Outfit">Outfit (Modern Geometric)</option>
                <option value="Inter">Inter (Clean sans-serif)</option>
                <option value="Merriweather">Merriweather (Classic serif)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Theme Scheme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field py-2 text-xs">
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Hero Section Headline</label>
            <input type="text" className="input-field" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Maps Latitude</label>
              <input type="number" step="any" className="input-field" value={mapsLat} onChange={(e) => setMapsLat(e.target.value)} placeholder="e.g. 40.7128" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Maps Longitude</label>
              <input type="number" step="any" className="input-field" value={mapsLng} onChange={(e) => setMapsLng(e.target.value)} placeholder="e.g. -74.0060" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Publishing Changes...' : 'Publish Website'}
            </button>
          </div>
        </div>

        {/* Hero image and template previews */}
        <div className="card-surface p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-500" /> Header Hero Media
          </h3>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Custom Hero Banner Image URL</label>
            <input type="url" className="input-field" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} placeholder="https://r2.cdn.com/hero.jpg" />
          </div>
          <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50 h-52 flex flex-col justify-end p-5 relative shadow-inner">
            {heroImageUrl ? (
              <img src={heroImageUrl} alt="Hero Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-850 opacity-90" />
            )}
            <div className="relative z-10 space-y-1">
              <h4 className="text-white font-extrabold text-sm leading-tight max-w-xs" style={{ fontFamily: typography === 'Outfit' ? 'Outfit' : 'inherit' }}>
                {heroTitle}
              </h4>
              <p className="text-[10px] text-blue-200">Agency: {business?.name}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
