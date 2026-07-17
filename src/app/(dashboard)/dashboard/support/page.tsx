'use client'

import React, { useEffect, useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { MessageSquare, Send, X, Image as ImageIcon } from 'lucide-react'

export default function SupportDashboard() {
  const { business } = useBusinessStore()
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [replyText, setReplyText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)

  const fetchTickets = async () => {
    if (!business) return
    try {
      const res = await fetch('/api/dashboard/support')
      if (res.ok) {
        const data = await res.json()
        setTickets(data.tickets || [])
      }
    } catch (err) {
      console.error('Error fetching tickets:', err)
    }
  }

  // Fetch tickets on mount / business change
  useEffect(() => {
    fetchTickets()
    const ticketInterval = setInterval(fetchTickets, 8000) // Poll tickets every 8s
    return () => clearInterval(ticketInterval)
  }, [business])

  // Fetch messages when ticket selected
  const fetchMessages = async () => {
    if (!selectedTicket) return
    try {
      const res = await fetch(`/api/dashboard/support?ticketId=${selectedTicket.id}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  useEffect(() => {
    fetchMessages()
    const msgInterval = setInterval(fetchMessages, 4000) // Poll messages every 4s
    return () => clearInterval(msgInterval)
  }, [selectedTicket])

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() && !imageUrl) return
    if (!selectedTicket) return

    const payload = {
      ticketId: selectedTicket.id,
      sender: 'agent',
      message: replyText,
      imageUrl: imageUrl || null,
    }

    try {
      const res = await fetch('/api/dashboard/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setReplyText('')
        setImageUrl('')
        setShowImageInput(false)
        fetchMessages()
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const resolveTicket = async (ticketId: string) => {
    try {
      const res = await fetch('/api/dashboard/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, status: 'closed' }),
      })

      if (res.ok) {
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket((prev: any) => ({ ...prev, status: 'closed' }))
        }
        setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: 'closed' } : t)))
      }
    } catch (err) {
      console.error('Error resolving ticket:', err)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 overflow-hidden">
      {/* Tickets List */}
      <div className="w-1/3 card-surface overflow-hidden flex flex-col">
        <header className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex-shrink-0">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Support Inbox</h3>
        </header>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {tickets.length === 0 ? (
            <div className="text-xs text-slate-400 p-8 text-center">No support tickets found.</div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 cursor-pointer hover:bg-slate-50/50 transition-all ${
                  selectedTicket?.id === t.id ? 'bg-blue-50/40 border-l-2 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{t.client_name}</span>
                  <span className={`badge ${
                    t.status === 'open' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">{t.client_email}</div>
                <div className="text-[9px] text-slate-400 mt-1">{new Date(t.created_at).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messaging Panel */}
      <div className="flex-1 card-surface overflow-hidden flex flex-col justify-between">
        {selectedTicket ? (
          <>
            {/* Header info */}
            <header className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h4 className="font-bold text-slate-800 text-xs">{selectedTicket.client_name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{selectedTicket.client_email}</p>
              </div>
              {selectedTicket.status === 'open' && (
                <button
                  onClick={() => resolveTicket(selectedTicket.id)}
                  className="btn-secondary px-3 py-1 text-[11px] text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                >
                  Resolve Ticket
                </button>
              )}
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
              {messages.map((m) => {
                const isAgent = m.sender === 'agent'
                return (
                  <div key={m.id} className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
                    <div className="text-[9px] text-slate-400 uppercase font-semibold mb-0.5 px-1">
                      {isAgent ? 'You (Agent)' : selectedTicket.client_name}
                    </div>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs ${
                      isAgent
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}>
                      {m.message}
                      {m.image_url && (
                        <img src={m.image_url} alt="Shared property ref" className="mt-2 rounded-lg max-h-40 object-cover" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
              {showImageInput && (
                <div className="flex items-center gap-2 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-transparent text-xs outline-none"
                    placeholder="Paste image CDN URL (e.g. from R2 upload)..."
                  />
                  <button type="button" onClick={() => setShowImageInput(false)}>
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowImageInput(true)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500/50"
                  placeholder="Type a support reply..."
                />
                <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-2 p-12 text-slate-400 text-center">
            <MessageSquare className="w-8 h-8 text-slate-300" />
            <div className="text-sm font-semibold text-slate-600">No ticket selected</div>
            <p className="text-xs max-w-xs">Select a support ticket from the sidebar to inspect conversation details and reply to queries.</p>
          </div>
        )}
      </div>
    </div>
  )
}
