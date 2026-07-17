'use client'

export const runtime = 'edge'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Home, Calendar, Phone, Mail, MapPin, Sparkles, MessageSquare, Send, X, ShieldAlert } from 'lucide-react'

export default function AgentSitePage() {
  const { slug } = useParams()

  const [business, setBusiness] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Booking states
  const [bookingPropId, setBookingPropId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [slotTime, setSlotTime] = useState('')
  const [bookingMsg, setBookingMsg] = useState('')

  // Support Chat states
  const [showChat, setShowChat] = useState(false)
  const [chatName, setChatName] = useState('')
  const [chatEmail, setChatEmail] = useState('')
  const [activeTicket, setActiveTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [messageText, setMessageText] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // Fetch site data
  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/sites/details?slug=${slug}`)
        if (res.ok) {
          const data = await res.json()
          setBusiness(data.business)
          setProperties(data.properties || [])
          setAgents(data.agents || [])
        }
      } catch (err) {
        console.error('Error fetching site details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  // Inject voice widget script dynamically
  useEffect(() => {
    if (agents.length === 0) return
    const activeAgent = agents[0] // Load first agent

    const script = document.createElement('script')
    script.src = `/api/widget?agentId=${activeAgent.id}`
    script.async = true
    document.body.appendChild(script)

    return () => {
      const el = document.getElementById('agentflow-voice-widget')
      if (el) el.remove()
      script.remove()
    }
  }, [agents])

  // Support chat messages polling
  const fetchMessages = async () => {
    if (!activeTicket) return
    try {
      const res = await fetch(`/api/sites/support?ticketId=${activeTicket.id}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err)
    }
  }

  useEffect(() => {
    fetchMessages()
    const msgInterval = setInterval(fetchMessages, 4000) // Poll messages every 4s
    return () => clearInterval(msgInterval)
  }, [activeTicket])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingPropId || !clientName || !clientEmail || !clientPhone || !slotTime) return
    setBookingMsg('')

    try {
      const res = await fetch('/api/voice/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          propertyId: bookingPropId,
          clientName,
          clientEmail,
          clientPhone,
          dateTime: slotTime,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setBookingMsg(`Viewing successfully confirmed! Viewing fee paid. (Booking ID: ${data.appointmentId})`)
        setClientName('')
        setClientEmail('')
        setClientPhone('')
        setSlotTime('')
      } else {
        setBookingMsg(data.error || 'Failed to book viewing')
      }
    } catch (err: any) {
      setBookingMsg(err.message || 'An error occurred')
    }
  }

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatName || !chatEmail || !business) return

    try {
      const res = await fetch('/api/sites/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_ticket',
          businessId: business.id,
          clientName: chatName,
          clientEmail: chatEmail,
        }),
      })

      const data = await res.json()
      if (res.ok && data.ticket) {
        setActiveTicket(data.ticket)
      }
    } catch (err) {
      console.error('Error starting support ticket:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() && !imageUrl) return
    if (!activeTicket) return

    try {
      const res = await fetch('/api/sites/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          ticketId: activeTicket.id,
          sender: 'client',
          message: messageText,
          imageUrl: imageUrl || null,
        }),
      })

      if (res.ok) {
        setMessageText('')
        setImageUrl('')
        fetchMessages()
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-medium text-slate-500 animate-pulse">Loading listing details...</div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-slate-500 space-y-3">
        <ShieldAlert className="w-8 h-8 text-red-500 animate-bounce" />
        <div className="text-sm font-semibold">Subdomain site not found</div>
        <p className="text-xs">The agency website is offline or does not exist.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header banner */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
              {business.name[0]}
            </div>
            <h1 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{business.name}</h1>
          </div>
          <button
            onClick={() => setShowChat(true)}
            className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" /> Live Help Desk
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listings column */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Featured Property Listings</h2>
          {properties.length === 0 ? (
            <div className="card-surface p-12 text-center text-slate-400">
              <Home className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <div className="text-xs font-semibold text-slate-500">No properties available</div>
            </div>
          ) : (
            properties.map((p) => (
              <div key={p.id} className="card-surface overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full md:w-56 h-40 object-cover" />
                ) : (
                  <div className="w-full md:w-56 h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                    <Home className="w-8 h-8" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{p.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {p.address}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{p.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                    <div className="text-base font-bold text-blue-600">
                      ₹{p.price.toLocaleString()}
                      <span className="text-[10px] text-slate-400 font-normal">
                        {p.type === 'rent' ? '/mo' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => setBookingPropId(p.id)}
                      className="btn-primary py-1.5 px-3.5 text-[11px]"
                    >
                      Book Tour
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Sidebar Booking Form */}
        <section className="space-y-6">
          <div className="card-surface p-5 sticky top-24">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" /> Book Viewing Appointment
            </h3>
            {bookingMsg && (
              <div className="p-3 text-xs mb-4 text-blue-800 bg-blue-50 border border-blue-200 rounded-lg">
                {bookingMsg}
              </div>
            )}
            <form onSubmit={handleBook} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Select Property</label>
                <select
                  value={bookingPropId}
                  onChange={(e) => setBookingPropId(e.target.value)}
                  className="input-field py-2 text-xs"
                  required
                >
                  <option value="">-- Choose Listing --</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (₹{p.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input-field py-2 text-xs"
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="input-field py-2 text-xs"
                    placeholder="jane@doe.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="input-field py-2 text-xs"
                    placeholder="+12345678"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Preferred Slot</label>
                <input
                  type="datetime-local"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="input-field py-2 text-xs"
                  required
                />
              </div>

              <button type="submit" className="w-full btn-primary py-2 text-xs mt-2">
                Pay viewing fee & book
              </button>
            </form>
          </div>

          {/* Office Location Card */}
          {business.maps_latitude && business.maps_longitude && (
            <div className="card-surface p-5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Office Location</h3>
              <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-100">
                <iframe
                  title="Office Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${business.maps_latitude},${business.maps_longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Support Chat Drawer */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col justify-between">
          <header className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Live Help Desk</h3>
            </div>
            <button onClick={() => setShowChat(false)} className="p-1 hover:bg-slate-200 rounded">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </header>

          {!activeTicket ? (
            <form onSubmit={handleStartChat} className="p-6 space-y-4 flex-1 flex flex-col justify-center">
              <div className="text-center mb-4">
                <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-pulse" />
                <h4 className="font-bold text-slate-800 text-xs">Start a Live Inquiry</h4>
                <p className="text-[10px] text-slate-400 mt-1">Provide your details to connect with agents.</p>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1 font-bold">Your Name</label>
                <input
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="input-field py-2 text-xs"
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1 font-bold">Your Email</label>
                <input
                  type="email"
                  value={chatEmail}
                  onChange={(e) => setChatEmail(e.target.value)}
                  className="input-field py-2 text-xs"
                  placeholder="jane@doe.com"
                  required
                />
              </div>

              <button type="submit" className="w-full btn-primary py-2 text-xs">
                Start Chatting
              </button>
            </form>
          ) : (
            <>
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {messages.map((m) => {
                  const isClient = m.sender === 'client'
                  return (
                    <div key={m.id} className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
                      <span className="text-[8px] text-slate-400 font-semibold mb-0.5 uppercase px-1">
                        {isClient ? 'You' : 'Agent'}
                      </span>
                      <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${
                        isClient
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}>
                        {m.message}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex-shrink-0 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 bg-slate-50 rounded-xl px-3 py-2 text-xs outline-none border border-slate-100 focus:border-blue-500/50"
                  placeholder="Write a message..."
                />
                <button type="submit" className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  )
}
