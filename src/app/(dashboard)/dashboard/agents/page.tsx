'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Plus, Trash2, Edit3, X, Mic, Copy, Check } from 'lucide-react'

export default function AgentsDashboard() {
  const { business, agents, properties, addAgent, updateAgent, deleteAgent } = useBusinessStore()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
    setShowModal(true)
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
        }
      }
      setShowModal(false)
    } catch (err) {
      console.error('Error saving agent:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return
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

  const copyEmbedCode = (agentId: string) => {
    const code = `<script
  src="${window.location.origin}/api/widget?agentId=${agentId}"
  async
></script>`
    navigator.clipboard.writeText(code)
    setCopiedId(agentId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">AI Voice Agents</h2>
          <p className="text-xs text-slate-400">Configure your calling assistants and embed them into target websites</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Create Agent
        </button>
      </div>

      {agents.length === 0 ? (
        <div className="card-surface p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Mic className="w-8 h-8 text-slate-300" />
          <div className="text-sm font-semibold text-slate-600">No agents built yet</div>
          <p className="text-xs text-slate-400 max-w-xs">Create your first AI voice agent to handle automatic property client interactions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((a: any) => {
            const linkedProp = properties.find((p: any) => p.id === a.property_id)
            return (
              <div key={a.id} className="card-surface p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{a.name}</h3>
                        <p className="text-[10px] text-slate-400">Language: {a.language} | Voice: {a.voice}</p>
                      </div>
                    </div>
                    <span className="badge bg-slate-50 border-slate-200 text-slate-600 capitalize">
                      {a.personality}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                    <strong>Greeting:</strong> &ldquo;{a.greeting}&rdquo;
                  </p>

                  <div className="mt-4 p-2 bg-slate-50 rounded border border-slate-100 text-[10px] text-slate-500">
                    <strong>Assigned Listing:</strong> {linkedProp ? linkedProp.title : 'All listings / General Inquiries'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => copyEmbedCode(a.id)}
                    className="btn-secondary text-[11px] px-3 py-1.5 flex items-center gap-1"
                  >
                    {copiedId === a.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Embed
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Embed Script
                      </>
                    )}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(a)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Configuration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl overflow-hidden border border-slate-100 animate-slide-up">
            <header className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {editingId ? 'Edit Agent' : 'Create AI Calling Agent'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </header>
            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Agent Name</label>
                  <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Alex" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Target Property</label>
                  <select className="input-field" value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>
                    <option value="">General (All Properties)</option>
                    {properties.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Voice Style</label>
                  <select className="input-field" value={voice} onChange={(e) => setVoice(e.target.value)}>
                    <option value="alloy">Alloy (Neut)</option>
                    <option value="echo">Echo (Male)</option>
                    <option value="shimmer">Shimmer (Fem)</option>
                    <option value="nova">Nova (Fem)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Persona Tone</label>
                  <select className="input-field" value={personality} onChange={(e) => setPersonality(e.target.value)}>
                    <option value="professional">Professional</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="supportive">Supportive & Helpful</option>
                    <option value="casual">Casual & Direct</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Language</label>
                  <input type="text" className="input-field" value={language} onChange={(e) => setLanguage(e.target.value)} required placeholder="English" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Greeting Prompt</label>
                <textarea rows={2} className="input-field" value={greeting} onChange={(e) => setGreeting(e.target.value)} required placeholder="Hi, thanks for calling..." />
              </div>

              {/* Custom Q&A section */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/60 space-y-3">
                <h4 className="text-xs font-bold text-slate-700">Custom Q&A Training Base</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {customQa.map((qa, index) => (
                    <div key={index} className="flex justify-between items-center text-[11px] bg-white border border-slate-100 p-2 rounded">
                      <div className="flex-1 mr-2 truncate">
                        <strong>Q:</strong> {qa.question} | <strong>A:</strong> {qa.answer}
                      </div>
                      <button type="button" onClick={() => removeQaPair(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" className="input-field py-1 text-xs" placeholder="Question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
                  <input type="text" className="input-field py-1 text-xs" placeholder="Answer" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
                </div>
                <button type="button" onClick={addQaPair} className="btn-secondary w-full py-1 text-xs font-semibold">
                  + Add training Q&A
                </button>
              </div>

              {/* Widget Theme Details */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Widget Accent Color</label>
                  <input type="color" className="w-full h-8 rounded border" value={widgetColor} onChange={(e) => setWidgetColor(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Widget Mode</label>
                  <select className="input-field" value={widgetTheme} onChange={(e) => setWidgetTheme(e.target.value as any)}>
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                  </select>
                </div>
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
