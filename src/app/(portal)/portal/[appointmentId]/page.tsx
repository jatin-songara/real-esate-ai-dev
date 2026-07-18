'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, Clock, DollarSign, CreditCard, Sparkles, MessageSquare, Send, X, ShieldAlert } from 'lucide-react'

export default function ClientPortalPage() {
  const { appointmentId } = useParams()

  const [appointment, setAppointment] = useState<any>(null)
  const [property, setProperty] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  // Reschedule state
  const [newSlotTime, setNewSlotTime] = useState('')

  // Chat state
  const [ticket, setTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [chatMessage, setChatMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const fetchData = async () => {
    if (!appointmentId) return
    try {
      const res = await fetch(`/api/sites/portal?appointmentId=${appointmentId}`)
      if (res.ok) {
        const data = await res.json()
        setAppointment(data.appointment)
        setProperty(data.property)
        setBusiness(data.business)
        setTicket(data.ticket)

        if (data.appointment) {
          const date = new Date(data.appointment.slot_time)
          setNewSlotTime(date.toISOString().slice(0, 16))
        }
      }
    } catch (err) {
      console.error('Error fetching portal data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [appointmentId])

  // Fetch ticket messages
  const fetchMsg = async () => {
    if (!ticket) return
    try {
      const res = await fetch(`/api/sites/support?ticketId=${ticket.id}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err)
    }
  }

  useEffect(() => {
    fetchMsg()
    const msgInterval = setInterval(fetchMsg, 4000) // Poll messages every 4s
    return () => clearInterval(msgInterval)
  }, [ticket])

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSlotTime || !appointmentId) return
    setMsg('')

    try {
      const res = await fetch('/api/sites/portal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          slotTime: new Date(newSlotTime).toISOString(),
        }),
      })

      if (res.ok) {
        setMsg('Appointment rescheduled successfully!')
        fetchData()
      } else {
        setMsg('Failed to reschedule viewing')
      }
    } catch (err: any) {
      setMsg(err.message || 'An error occurred')
    }
  }

  const handlePayStripe = async () => {
    if (!appointment || !business) return
    setMsg('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'BookingFee',
          businessId: business.id,
          successUrl: `${window.location.origin}/portal/${appointment.id}?payment=success`,
          cancelUrl: window.location.href,
        }),
      })

      const data = await res.json()
      if (data.url) {
        // Mock success redirect for local testing if Stripe key is empty
        if (data.url.includes('placeholder')) {
          await fetch('/api/sites/portal', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appointmentId: appointment.id, paymentStatus: 'paid_stripe' }),
          })
          setMsg('Payment successful! Your slot is confirmed.')
          fetchData()
        } else {
          window.location.href = data.url
        }
      }
    } catch (err: any) {
      setMsg(err.message || 'An error occurred during payment')
    }
  }

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim() && !imageUrl) return
    if (!ticket) return

    try {
      const res = await fetch('/api/sites/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          ticketId: ticket.id,
          sender: 'client',
          message: chatMessage,
          imageUrl: imageUrl || null,
        }),
      })

      if (res.ok) {
        setChatMessage('')
        setImageUrl('')
        fetchMsg()
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-medium text-slate-500 animate-pulse">Loading viewing portal...</div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-slate-500 space-y-3">
        <ShieldAlert className="w-8 h-8 text-red-500" />
        <div className="text-sm font-semibold">Viewing record not found</div>
        <p className="text-xs">The booking reference link is invalid or has expired.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <div className="card-surface p-6">
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Viewing Appointment Portal <Sparkles className="w-5 h-5 text-blue-500" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Hi {appointment.client_name}, review property listing information and reschedule options below.
            </p>

            {msg && (
              <div className="mt-4 p-3 text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-lg">
                {msg}
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Viewing Date</div>
                  <div className="text-xs font-bold text-slate-800">
                    {new Date(appointment.slot_time).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Time Slot</div>
                  <div className="text-xs font-bold text-slate-800">
                    {new Date(appointment.slot_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Listing Reference */}
          {property && (
            <div className="card-surface overflow-hidden flex flex-col sm:flex-row shadow-sm/50">
              {property.images?.[0] ? (
                <img src={property.images[0]} alt={property.title} className="w-full sm:w-48 h-36 object-cover" />
              ) : (
                <div className="w-full sm:w-48 h-36 bg-slate-100 flex items-center justify-center text-slate-400">
                  <Calendar className="w-8 h-8" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{property.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{property.address}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{property.description}</p>
                </div>
                <div className="text-sm font-bold text-blue-600 border-t border-slate-100 pt-2.5 mt-3">
                  ₹{property.price.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Reschedule Viewing Form */}
          <div className="card-surface p-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Reschedule Viewing</h3>
            <form onSubmit={handleReschedule} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">New Date and Time</label>
                <input
                  type="datetime-local"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="input-field py-2 text-xs"
                  required
                />
              </div>
              <button type="submit" className="btn-primary py-2 px-5 text-xs">
                Confirm Reschedule
              </button>
            </form>
          </div>
        </div>

        {/* Payments & Live Help column */}
        <div className="space-y-6">
          {/* Payment Card */}
          <div className="card-surface p-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-slate-500 font-bold text-sm">₹</span> Billing and Fees
            </h3>
            <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-lg border border-slate-100 mb-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Viewing Deposit</span>
                <div className="text-sm font-bold text-slate-800">₹{appointment.payment_amount}</div>
              </div>
              <span className={`badge ${
                appointment.payment_status === 'paid_stripe' || appointment.payment_status === 'paid_cash'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {appointment.payment_status === 'paid_stripe' || appointment.payment_status === 'paid_cash' ? 'Paid' : 'Unpaid'}
              </span>
            </div>

            {appointment.payment_status === 'unpaid' && (
              <button
                onClick={handlePayStripe}
                className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CreditCard className="w-4 h-4" /> Pay Deposit online
              </button>
            )}
          </div>

          {/* Live Support Portal */}
          {ticket && (
            <div className="card-surface p-5 flex flex-col h-96 justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" /> Agency Help Desk
              </h3>

              {/* Chat log */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 bg-slate-50/40 p-3.5 rounded-lg border border-slate-100">
                {messages.map((m) => {
                  const isClient = m.sender === 'client'
                  return (
                    <div key={m.id} className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
                      <span className="text-[8px] text-slate-400 font-semibold mb-0.5 uppercase">
                        {isClient ? 'You' : 'Agency Assistant'}
                      </span>
                      <div className={`max-w-[80%] rounded-xl px-3 py-1.5 text-[11px] ${
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

              {/* Message inputs */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-slate-50 rounded-xl px-3 py-2 text-xs outline-none border border-slate-100 focus:border-blue-500/50"
                  placeholder="Ask a question..."
                />
                <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
