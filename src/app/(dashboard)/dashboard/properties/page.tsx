'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Plus, Trash2, Edit3, X, Home, ShieldCheck } from 'lucide-react'
import { Property } from '../../../../types'

export default function PropertiesDashboard() {
  const { business, properties, addProperty, updateProperty, deleteProperty } = useBusinessStore()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState<'sale' | 'rent'>('sale')
  const [category, setCategory] = useState<'House' | 'Apartment' | 'Commercial'>('House')
  const [status, setStatus] = useState<'Available' | 'Pending' | 'Sold'>('Available')
  const [bedrooms, setBedrooms] = useState('2')
  const [bathrooms, setBathrooms] = useState('1')
  const [parkingSpaces, setParkingSpaces] = useState('1')
  const [sqft, setSqft] = useState('1000')
  const [yearBuilt, setYearBuilt] = useState('')
  const [amenities, setAmenities] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // Double-Confirmation Security Constraint
  const [isManuallyVerified, setIsManuallyVerified] = useState(false)

  const openAddModal = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setAddress('')
    setCity('')
    setState('')
    setZip('')
    setPrice('')
    setType('sale')
    setCategory('House')
    setStatus('Available')
    setBedrooms('2')
    setBathrooms('1')
    setParkingSpaces('1')
    setSqft('1000')
    setYearBuilt('')
    setAmenities('')
    setImageUrl('')
    setIsManuallyVerified(false)
    setShowModal(true)
  }

  const openEditModal = (p: any) => {
    setEditingId(p.id)
    setTitle(p.title)
    setDescription(p.description || '')
    setAddress(p.address)
    setCity(p.city || '')
    setState(p.state || '')
    setZip(p.zip || '')
    setPrice(p.price.toString())
    setType(p.type)
    setCategory(p.category || 'House')
    setStatus(p.status || 'Available')
    setBedrooms(p.bedrooms.toString())
    setBathrooms(p.bathrooms.toString())
    setParkingSpaces((p.parking_spaces || 0).toString())
    setSqft(p.sqft.toString())
    setYearBuilt(p.year_built?.toString() || '')
    setAmenities(p.amenities?.join(', ') || '')
    setImageUrl(p.images?.[0] || '')
    setIsManuallyVerified(false) // Force manual double-check for every save/update
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business || !isManuallyVerified) return

    const amenitiesArray = amenities.split(',').map((x) => x.trim()).filter(Boolean)
    const imagesArray = imageUrl ? [imageUrl] : []

    const payload = {
      title,
      description,
      address,
      city,
      state,
      zip,
      price: parseFloat(price),
      type,
      category,
      status,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseFloat(bathrooms),
      parking_spaces: parseInt(parkingSpaces),
      sqft: parseFloat(sqft),
      year_built: yearBuilt ? parseInt(yearBuilt) : null,
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
    <div className="space-y-6 pb-12">
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
            <div key={p.id} className="card-surface overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
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
                      p.type === 'rent' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      For {p.type === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                    <span className={`badge ${
                      p.status === 'Available' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mt-3 line-clamp-1">{p.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{p.address}, {p.city}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{p.description}</p>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div>🛏️ {p.bedrooms} Beds</div>
                    <div>🚿 {p.bathrooms} Baths</div>
                    <div>🚗 {p.parking_spaces || 0} Parking</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                  <div className="text-sm font-bold text-blue-600">
                    ₹{p.price.toLocaleString()}
                    {p.type === 'rent' && <span className="text-[9px] text-slate-400 font-normal">/mo</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(p)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in border border-slate-100">
            <header className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                {editingId ? 'Edit Property Listing' : 'Add Property Listing'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-200 rounded">
                <X className="w-4.5 h-4.5 text-slate-400" />
              </button>
            </header>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Listing Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Beautiful Downtown Loft" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value as any)} className="input-field py-2 text-xs">
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="input-field py-2 text-xs">
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input-field" placeholder="Describe the listing details..." />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" placeholder="123 Main St" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input-field" placeholder="Miami" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">State</label>
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="input-field" placeholder="FL" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Zip</label>
                    <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className="input-field" placeholder="33131" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Price (₹)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" placeholder="450000" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Bedrooms</label>
                  <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Bathrooms</label>
                  <input type="number" step="0.5" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Parking</label>
                  <input type="number" value={parkingSpaces} onChange={(e) => setParkingSpaces(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Sq Ft</label>
                  <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Year Built</label>
                  <input type="number" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} className="input-field" placeholder="e.g. 2018" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="input-field py-2 text-xs">
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Predefined Amenities (comma separated)</label>
                  <input type="text" value={amenities} onChange={(e) => setAmenities(e.target.value)} className="input-field" placeholder="Pool, Smart Home, Balcony" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Image URL</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-field" placeholder="https://r2.cdn.com/property.jpg" />
                </div>
              </div>

              {/* Security Constraint Verification Checkbox */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-2.5 mt-4">
                <input
                  type="checkbox"
                  id="confirm-verified"
                  checked={isManuallyVerified}
                  onChange={(e) => setIsManuallyVerified(e.target.checked)}
                  className="rounded text-blue-600 mt-1 cursor-pointer"
                  required
                />
                <label htmlFor="confirm-verified" className="text-xs text-blue-900 font-semibold cursor-pointer select-none">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4.5 h-4.5 text-blue-700" /> Security Verification Constraint</span>
                  <span className="block font-normal text-[10px] text-blue-700 mt-0.5">
                    I manually verify that the pricing, availability, and critical description fields of this real estate listing are accurate and correct.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={!isManuallyVerified} className="btn-primary">
                  {editingId ? 'Save Changes' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
