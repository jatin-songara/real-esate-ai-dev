'use client'

import React, { useState } from 'react'
import { Plus, Tag, HelpCircle, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react'

export default function ServicesPage() {
  const [services, setServices] = useState([
    { id: '1', title: 'Property Viewing Visit', type: 'Viewing Property', price: 50, active: true, desc: 'Clients tour residential, commercial, or apartment properties in person.' },
    { id: '2', title: 'Home Buyer Consultation meeting', type: 'Buyer Consultation', price: 0, active: true, desc: 'Introductory call or meeting to analyze credit parameters and budget options.' },
    { id: '3', title: 'Commercial Lease Walkthrough', type: 'Commercial Rental', price: 100, active: false, desc: 'Comprehensive property tour for retail or corporate commercial offices.' }
  ])

  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newType, setNewType] = useState('Viewing Property')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return
    setServices([
      ...services,
      {
        id: Math.random().toString(),
        title: newTitle,
        type: newType,
        price: parseFloat(newPrice || '0'),
        active: true,
        desc: newDesc
      }
    ])
    setNewTitle('')
    setNewPrice('')
    setNewDesc('')
    setShowForm(false)
  }

  const toggleActive = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Services Catalog</h2>
          <p className="text-xs text-slate-400">Configure trackable viewing consultations and assign fixed deposit fees</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Custom Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card-surface p-6 space-y-4 max-w-xl">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Configure New Service</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Service Title</label>
              <input type="text" className="input-field" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. VIP Penthouse Tour" required />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Pricing Fee ($)</label>
              <input type="number" className="input-field" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Service Type Category</label>
              <select className="input-field py-2 text-xs" value={newType} onChange={(e) => setNewType(e.target.value)}>
                <option value="Viewing Property">Viewing Property</option>
                <option value="Buyer Consultation">Buyer Consultation</option>
                <option value="Commercial Rental">Commercial Rental</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Short Description</label>
              <input type="text" className="input-field" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Tours and walk-throughs..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Service</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.id} className="card-surface p-5 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="badge bg-blue-50 border-blue-200 text-blue-700">{s.type}</span>
                <button onClick={() => toggleActive(s.id)}>
                  {s.active ? (
                    <ToggleRight className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-300" />
                  )}
                </button>
              </div>

              <h4 className="font-bold text-slate-800 text-sm leading-tight">{s.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{s.desc}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Service Deposit
              </span>
              <span className="text-sm font-bold text-blue-600">
                {s.price === 0 ? 'Free' : `$${s.price}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
