'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Plus, Trash2, Edit3, X, Home } from 'lucide-react'
import { Property } from '../../../../types'

export default function PropertiesDashboard() {
  const { business, properties, addProperty, updateProperty, deleteProperty } = useBusinessStore()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState<'sale' | 'rent'>('sale')
  const [bedrooms, setBedrooms] = useState('2')
  const [bathrooms, setBathrooms] = useState('1')
  const [sqft, setSqft] = useState('1000')
  const [amenities, setAmenities] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const openAddModal = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setAddress('')
    setPrice('')
    setType('sale')
    setBedrooms('2')
    setBathrooms('1')
    setSqft('1000')
    setAmenities('')
    setImageUrl('')
    setShowModal(true)
  }

  const openEditModal = (p: any) => {
    setEditingId(p.id)
    setTitle(p.title)
    setDescription(p.description || '')
    setAddress(p.address)
    setPrice(p.price.toString())
    setType(p.type)
    setBedrooms(p.bedrooms.toString())
    setBathrooms(p.bathrooms.toString())
    setSqft(p.sqft.toString())
    setAmenities(p.amenities.join(', '))
    setImageUrl(p.images?.[0] || '')
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return

    const amenitiesArray = amenities.split(',').map((x) => x.trim()).filter(Boolean)
    const imagesArray = imageUrl ? [imageUrl] : []

    const payload = {
      title,
      description,
      address,
      price: parseFloat(price),
      type,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseFloat(bathrooms),
      sqft: parseFloat(sqft),
      amenities: amenitiesArray,
      images: imagesArray,
    }

    try {
      if (editingId) {
        const res = await fetch('/api/dashboard/properties', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
        const data = await res.json()
        if (res.ok && data.property) {
          updateProperty(data.property)
        }
      } else {
        const res = await fetch('/api/dashboard/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (res.ok && data.property) {
          addProperty(data.property)
        }
      }
      setShowModal(false)
    } catch (err) {
      console.error('Error saving property:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property listing?')) return
    try {
      const res = await fetch(`/api/dashboard/properties?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        deleteProperty(id)
      }
    } catch (err) {
      console.error('Error deleting property:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Property Listings</h2>
          <p className="text-xs text-slate-400">Add, edit, or delete listings managed by the AI assistants</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="card-surface p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Home className="w-8 h-8 text-slate-300" />
          <div className="text-sm font-semibold text-slate-600">No properties added yet</div>
          <p className="text-xs text-slate-400 max-w-xs">Create your first property listing to attach customizable AI calling agents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p: Property) => (
            <div key={p.id} className="card-surface overflow-hidden flex flex-col justify-between">
              {p.images?.[0] ? (
                <img src={p.images[0]} alt={p.title} className="h-44 w-full object-cover" />
              ) : (
                <div className="h-44 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Home className="w-10 h-10" />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`badge ${
                      p.type === 'sale' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-teal-50 border-teal-200 text-teal-700'
                    }`}>
                      For {p.type === 'sale' ? 'Sale' : 'Rent'}
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      ${p.price.toLocaleString()}{p.type === 'rent' ? '/mo' : ''}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mt-2 text-sm">{p.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">{p.address}</p>

                  <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                    <span>{p.bedrooms} Beds</span>
                    <span>•</span>
                    <span>{p.bathrooms} Baths</span>
                    <span>•</span>
                    <span>{p.sqft} sqft</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button onClick={() => openEditModal(p)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-slate-100 animate-slide-up">
            <header className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {editingId ? 'Edit Property' : 'Add Property Listing'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </header>
            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Title</label>
                <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Luxury Penthouse in Downtown" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Description</label>
                <textarea rows={3} className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Stunning views, modern finishes..." />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Address</label>
                <input type="text" className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 Ocean Drive, Miami, FL" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Price</label>
                  <input type="number" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="1200000" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Listing Type</label>
                  <select className="input-field" value={type} onChange={(e) => setType(e.target.value as any)}>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Bedrooms</label>
                  <input type="number" className="input-field" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Bathrooms</label>
                  <input type="number" step="0.5" className="input-field" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Square Feet</label>
                  <input type="number" className="input-field" value={sqft} onChange={(e) => setSqft(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Image URL</label>
                <input type="url" className="input-field" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-..." />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Amenities (comma-separated)</label>
                <input type="text" className="input-field" value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="Pool, Gym, Parking, Balcony" />
              </div>
              <footer className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
