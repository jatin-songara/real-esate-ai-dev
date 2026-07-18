'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Plus, Trash2, Edit3, X, Mic, Copy, Check, Sparkles, BookOpen } from 'lucide-react'
import { PREDEFINED_REAL_ESTATE_QA } from '../../../../constants/predefinedQA'

export default function AgentsDashboard() {
  const { business, agents, properties, addAgent, updateAgent, deleteAgent } = useBusinessStore()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Form states
  const [name, setName] = useState('')
  const [propertyId, setPropertyId] = useState('')
  const [voice, setVoice] = useState('alloy')
  const [personality, setPersonality] = useState('professional')
  const [greeting, setGreeting] = useState('')
  const [language, setLanguage] = useState('English')
  const [customQa, setCustomQa] = useState<any[]>([])
  const [widgetColor, setWidgetColor] = useState('#2563eb')
  const [widgetTheme, setWidgetTheme] = useState<'light' | 'dark'>('light')
  const [interpretationLevel, setInterpretationLevel] = useState('medium')
  const [serviceType, setServiceType] = useState('Viewing Property')

  // QA edit helpers
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')

  const openAddModal = () => {
    setEditingId(null)
    setName('')
    setPropertyId('')
    setVoice('alloy')
    setPersonality('professional')
    setGreeting('Hello! Thank you for calling. How can I help you today?')
    setLanguage('English')
    setCustomQa([])
    setWidgetColor('#2563eb')
    setWidgetTheme('light')
    setInterpretationLevel('medium')
    setServiceType('Viewing Property')
    setErrorMsg('')
    setShowModal(true)
  }

  const openEditModal = (a: any) => {
    setEditingId(a.id)
    setName(a.name)
    setPropertyId(a.property_id || '')
    setVoice(a.voice)
    setPersonality(a.personality)
    setGreeting(a.greeting)
    setLanguage(a.language)
    setCustomQa(a.custom_qa || [])
    setWidgetColor(a.widget_color)
    setWidgetTheme(a.widget_theme)
    setInterpretationLevel(a.interpretation_level || 'medium')
    setServiceType(a.service_type || 'Viewing Property')
    setErrorMsg('')
    setShowModal(true)
  }

  const loadPredefinedQA = () => {
    // Merge or load predefined Q&As
    setCustomQa([...customQa, ...PREDEFINED_REAL_ESTATE_QA])
  }

  const applyTemplate = (type: 'sales' | 'reception') => {
    if (type === 'sales') {
      setName('Residential Sales Assistant')
      setPersonality('Enthusiastic, helpful, and highly persuasive')
      setGreeting('Hello! Thank you for calling. I can guide you through our premium residential homes for sale. What size bedroom are you looking for?')
      setInterpretationLevel('medium')
      setServiceType('Viewing Property')
    } else {
      setName('Client Reception Coordinator')
      setPersonality('Warm, polite, organized, and professional')
      setGreeting('Hi! Welcome to our reception desk. How can I direct your inquiry or help you book an appointment today?')
      setInterpretationLevel('medium')
      setServiceType('Buyer Consultation')
    }
  }

  const addQaPair = () => {
    if (!newQuestion || !newAnswer) return
    setCustomQa([...customQa, { question: newQuestion, answer: newAnswer }])
    setNewQuestion('')
    setNewAnswer('')
  }

  const removeQaPair = (index: number) => {
    setCustomQa(customQa.filter((_, i) => i !== index))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return
    setErrorMsg('')

    const payload = {
      property_id: propertyId || null,
      name,
      voice,
      personality,
      greeting,
      language,
      custom_qa: customQa,
      widget_color: widgetColor,
      widget_theme: widgetTheme,
      interpretation_level: interpretationLevel,
      service_type: serviceType,
    }

    try {
      if (editingId) {
        const res = await fetch('/api/dashboard/agents', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
        const data = await res.json()
        if (res.ok && data.agent) {
          updateAgent(data.agent)
          setShowModal(false)
        } else {
          setErrorMsg(data.error || 'Failed to update agent')
        }
      } else {
        const res = await fetch('/api/dashboard/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (res.ok && data.agent) {
          addAgent(data.agent)
          setShowModal(false)
        } else {
          setErrorMsg(data.error || 'Failed to create agent')
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this AI voice agent?')) return
    try {
      const res = await fetch(`/api/dashboard/agents?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        deleteAgent(id)
      }
    } catch (err) {
      console.error('Error deleting agent:', err)
    }
  }

  const copyWidgetScript = (agentId: string) => {
    const script = `<script src="${window.location.origin}/api/widget?agentId=${agentId}"></script>`
    navigator.clipboard.writeText(script)
    setCopiedId(agentId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">AI Voice Assistants</h2>
          <p className="text-xs text-slate-400">Configure professional calling personalities, custom scripts, and language parameters</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Build Agent
        </button>
      </div>

      {agents.length === 0 ? (
        <div className="card-surface p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Mic className="w-8 h-8 text-slate-300" />
          <div className="text-sm font-semibold text-slate-600">No AI agents active</div>
          <p className="text-xs text-slate-400 max-w-xs">Create your first assistant to begin answering customer questions about your properties.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((a: any) => {
            const boundProperty = properties.find((p) => p.id === a.property_id)
            return (
              <div key={a.id} className="card-surface p-5 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{a.name}</h4>
                      <span className="badge bg-blue-50 border-blue-200 text-blue-700 mt-1.5">{a.language} Voice</span>
                      <span className="badge bg-slate-50 border-slate-200 text-slate-700 ml-1.5">{a.service_type}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditModal(a)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 italic">&quot;{a.greeting}&quot;</p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>👤 Voice: <span className="font-bold text-slate-700 capitalize">{a.voice}</span></div>
                    <div>🧠 Level: <span className="font-bold text-slate-700 capitalize">{a.interpretation_level || 'medium'}</span></div>
                    <div className="col-span-2 truncate">
                      🏢 Listing Context:{' '}
                      <span className="font-bold text-slate-700">
                        {boundProperty ? boundProperty.title : 'All Agency Listings'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-3.5 border-t border-slate-100">
                  <button onClick={() => copyWidgetScript(a.id)} className="flex-1 btn-secondary py-2 text-[11px] flex items-center justify-center gap-1.5">
                    {copiedId === a.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Snippet
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Get Web Widget Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in border border-slate-100">
            <header className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                {editingId ? 'Modify Assistant Parameters' : 'Build AI Assistant'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-200 rounded">
                <X className="w-4.5 h-4.5 text-slate-400" />
              </button>
            </header>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg">
                  {errorMsg}
                </div>
              )}
              {/* Template Buttons */}
              {!editingId && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Predefined Templates</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applyTemplate('sales')}
                      className="btn-secondary py-1.5 px-3 text-[10px] flex items-center gap-1 bg-blue-50 border-blue-200 text-blue-700"
                    >
                      <Sparkles className="w-3 h-3" /> Residential Sales Agent
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('reception')}
                      className="btn-secondary py-1.5 px-3 text-[10px] flex items-center gap-1 bg-indigo-50 border-indigo-200 text-indigo-700"
                    >
                      <Sparkles className="w-3 h-3" /> Client Reception Coordinator
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Assistant Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="e.g. Sarah (Sales Coordinator)" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Assigned Property Listing (Context)</label>
                  <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} className="input-field py-2 text-xs">
                    <option value="">All Agency Listings (Full Knowledge)</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (${p.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Voice Accent</label>
                  <select value={voice} onChange={(e) => setVoice(e.target.value)} className="input-field py-2 text-xs">
                    <option value="alloy">Alloy (Neutral)</option>
                    <option value="echo">Echo (Soft male)</option>
                    <option value="fable">Fable (British accent)</option>
                    <option value="onyx">Onyx (Deep male)</option>
                    <option value="nova">Nova (Energetic female)</option>
                    <option value="shimmer">Shimmer (Professional female)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field py-2 text-xs">
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Bengali">Bengali (বাংলা)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Interpretation Level</label>
                  <select value={interpretationLevel} onChange={(e) => setInterpretationLevel(e.target.value)} className="input-field py-2 text-xs">
                    <option value="low">Low (Literal replies)</option>
                    <option value="medium">Medium (Recommended)</option>
                    <option value="high">High (Creative replies)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Allocated Service</label>
                  <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="input-field py-2 text-xs">
                    <option value="Viewing Property">Viewing Property ($50 Fee)</option>
                    <option value="Buyer Consultation">Buyer Consultation (Free)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Personality System Prompt</label>
                <textarea
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  rows={2}
                  className="input-field"
                  placeholder="You are professional, polite, and enthusiastically try to book home viewing slots..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Greeting Message</label>
                <input
                  type="text"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="input-field"
                  placeholder="Hello! Thank you for calling. How can I help you today?"
                  required
                />
              </div>

              {/* Knowledge Base Training */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Knowledge Base Training Q&As ({customQa.length})
                  </label>
                  <button
                    type="button"
                    onClick={loadPredefinedQA}
                    className="btn-secondary py-1 px-3 text-[10px] flex items-center gap-1 bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Load 30+ Predefined Real Estate Q&As
                  </button>
                </div>

                {/* Predefined preview or list */}
                {customQa.length > 0 && (
                  <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {customQa.map((qa, index) => (
                      <div key={index} className="flex justify-between items-start text-[11px] bg-white p-2 rounded border border-slate-100">
                        <div className="flex-1">
                          <span className="font-semibold text-slate-700">Q: {qa.question}</span>
                          <span className="block text-slate-500 mt-0.5">A: {qa.answer}</span>
                        </div>
                        <button type="button" onClick={() => removeQaPair(index)} className="text-red-500 hover:text-red-700 ml-2">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom QA Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="input-field text-xs"
                      placeholder="Add custom question (e.g. What are the key rules?)"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      className="input-field text-xs"
                      placeholder="Add custom answer..."
                    />
                    <button type="button" onClick={addQaPair} className="btn-secondary py-2 px-4 text-xs">
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Widget styling */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Widget Branding Color</label>
                  <input type="color" value={widgetColor} onChange={(e) => setWidgetColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border border-slate-100" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Widget Theme</label>
                  <select value={widgetTheme} onChange={(e) => setWidgetTheme(e.target.value as any)} className="input-field py-2 text-xs">
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Save Changes' : 'Build Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
