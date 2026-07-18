'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Plus, Tag, ToggleLeft, ToggleRight, Sparkles, Trash2, Edit, X, Layers } from 'lucide-react'

export default function ServicesPage() {
  const { business, services, addService, updateService, deleteService } = useBusinessStore()

  // Form states
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [descText, setDescText] = useState('')
  const [type, setType] = useState('Viewing Property')
  const [active, setActive] = useState(true)

  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const openAddModal = () => {
    setEditingId(null)
    setTitle('')
    setPrice('')
    setDescText('')
    setType('Viewing Property')
    setActive(true)
    setErrorMsg('')
    setShowForm(true)
  }

  const openEditModal = (s: any) => {
    setEditingId(s.id)
    setTitle(s.title)
    setPrice(s.price.toString())
    setDescText(s.desc_text || '')
    setType(s.type)
    setActive(s.active)
    setErrorMsg('')
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return
    if (!title) {
      setErrorMsg('Service title is required')
      return
    }

    setSaving(true)
    setErrorMsg('')

    const payload = {
      title,
      type,
      price: parseFloat(price || '0'),
      active,
      desc_text: descText,
    }

    try {
      if (editingId) {
        const res = await fetch('/api/dashboard/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
        const data = await res.json()
        if (res.ok && data.service) {
          updateService(data.service)
          setShowForm(false)
        } else {
          setErrorMsg(data.error || 'Failed to update service')
        }
      } else {
        const res = await fetch('/api/dashboard/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (res.ok && data.service) {
          addService(data.service)
          setShowForm(false)
        } else {
          setErrorMsg(data.error || 'Failed to create service')
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (s: any) => {
    try {
      const res = await fetch('/api/dashboard/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: s.id, active: !s.active }),
      })
      const data = await res.json()
      if (res.ok && data.service) {
        updateService(data.service)
      }
    } catch (err) {
      console.error('Error toggling service status:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    try {
      const res = await fetch(`/api/dashboard/services?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        deleteService(id)
      }
    } catch (err) {
      console.error('Error deleting service:', err)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Services Catalog</h2>
          <p className="text-xs text-slate-400">Configure trackable viewing consultations and assign fixed deposit fees</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-1.5 shadow-md">
          <Plus className="w-4 h-4" /> Add Custom Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="card-surface p-16 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            <Layers className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">No Services Configured</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Create services to offer viewing slots, consultation blocks, or lease reviews to clients via the widget.
            </p>
          </div>
          <button onClick={openAddModal} className="btn-primary text-xs py-1.5 px-4 shadow">
            Create First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className={`card-surface p-6 flex flex-col justify-between transition-all duration-200 relative ${
                !s.active ? 'opacity-70 bg-slate-50/50' : 'bg-white hover:-translate-y-1'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`badge ${
                    s.type === 'Viewing Property' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                    s.type === 'Buyer Consultation' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                    'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {s.type}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleActive(s)}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                      title={s.active ? 'Disable Service' : 'Enable Service'}
                    >
                      {s.active ? (
                        <ToggleRight className="w-6 h-6 text-blue-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-350" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-blue-600">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                    {s.desc_text || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> Service Deposit
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {s.price === 0 ? 'Free' : `₹${s.price.toLocaleString()}`}
                </span>
              </div>

              {/* Hover actions */}
              <div className="absolute top-4 right-4 flex gap-1 items-center bg-white/90 backdrop-blur rounded-lg px-2 py-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity shadow-sm border border-slate-100">
                <button
                  onClick={() => openEditModal(s)}
                  className="p-1 text-slate-500 hover:text-blue-600 rounded transition-colors"
                  title="Edit Parameters"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                  title="Remove Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-slide-up">
            <header className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                {editingId ? 'Modify Service Settings' : 'Configure New Service'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </header>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Service Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Premium Penthouse VIP Tour"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Price / Fee (₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0 for Free"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Service Category</label>
                  <select
                    className="input-field py-2 text-xs"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Viewing Property">Viewing Property</option>
                    <option value="Buyer Consultation">Buyer Consultation</option>
                    <option value="Commercial Rental">Commercial Rental</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Description</label>
                <textarea
                  className="input-field min-h-24 resize-none py-2"
                  value={descText}
                  onChange={(e) => setDescText(e.target.value)}
                  placeholder="Summarize the walkthrough, duration, or meeting terms..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-350 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="activeCheck" className="text-xs font-medium text-slate-700 cursor-pointer select-none">
                  Enable and show this service in customer widget catalog
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary py-1.5 px-4"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-1.5 px-5 shadow-lg"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
