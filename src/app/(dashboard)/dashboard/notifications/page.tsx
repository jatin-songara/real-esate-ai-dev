'use client'

import React, { useEffect, useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Bell, Sparkles, MessageSquare, Calendar, PhoneCall, Trash2, ShieldAlert } from 'lucide-react'

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  type: 'booking' | 'chat' | 'call';
  time: string;
  timestamp: Date;
}

export default function NotificationsPage() {
  const { business, appointments, properties } = useBusinessStore()
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<NotificationItem[]>([])

  useEffect(() => {
    if (!business) return

    const loadNotifications = async () => {
      setLoading(true)
      try {
        // Fetch tickets and call logs from APIs
        const [ticketsRes, callsRes] = await Promise.all([
          fetch('/api/dashboard/data').then((r) => r.json()),
          fetch('/api/dashboard/conversations').then((r) => r.json()),
        ])

        const liveTickets = ticketsRes.tickets || []
        const liveCalls = callsRes.logs || []

        const aggregated: NotificationItem[] = []

        // 1. Map appointments
        appointments.forEach((appt) => {
          const prop = properties.find((p) => p.id === appt.property_id)
          const propTitle = prop ? prop.title : 'Listing'
          aggregated.push({
            id: `booking-${appt.id}`,
            title: 'New Viewing Appointment Booked',
            desc: `Client ${appt.client_name} scheduled a tour for "${propTitle}" at ${new Date(appt.slot_time).toLocaleString()}.`,
            type: 'booking',
            timestamp: new Date(appt.created_at || appt.slot_time),
            time: getRelativeTime(appt.created_at || appt.slot_time),
          })
        })

        // 2. Map tickets
        liveTickets.forEach((ticket: any) => {
          aggregated.push({
            id: `ticket-${ticket.id}`,
            title: 'Support Desk Ticket Opened',
            desc: `Client ${ticket.client_name} (${ticket.client_email}) initiated a support desk ticket. Status is ${ticket.status}.`,
            type: 'chat',
            timestamp: new Date(ticket.created_at),
            time: getRelativeTime(ticket.created_at),
          })
        })

        // 3. Map call logs
        liveCalls.forEach((call: any) => {
          aggregated.push({
            id: `call-${call.id}`,
            title: 'Call Log Record Created',
            desc: `AI assistant handled a ${call.duration}s call with prospect client at ${call.client_phone}.`,
            type: 'call',
            timestamp: new Date(call.created_at),
            time: getRelativeTime(call.created_at),
          })
        })

        // Sort by timestamp descending
        aggregated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        setAlerts(aggregated)
      } catch (err) {
        console.error('Error loading notifications:', err)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [business, appointments, properties])

  function getRelativeTime(dateStr: string) {
    try {
      const now = new Date()
      const date = new Date(dateStr)
      const diffMs = now.getTime() - date.getTime()
      const diffSec = Math.floor(diffMs / 1000)
      const diffMin = Math.floor(diffSec / 60)
      const diffHour = Math.floor(diffMin / 60)
      const diffDay = Math.floor(diffHour / 24)

      if (diffSec < 60) return 'Just now'
      if (diffMin < 60) return `${diffMin} mins ago`
      if (diffHour < 24) return `${diffHour} hours ago`
      if (diffDay === 1) return 'Yesterday'
      return `${diffDay} days ago`
    } catch (_) {
      return 'Recent'
    }
  }

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Notifications Inbox</h2>
          <p className="text-xs text-slate-400">Review recent call logs activity alerts, support desks, and viewing schedules</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card-surface p-5 animate-pulse flex gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-2 bg-slate-100 rounded w-1/6 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="card-surface p-16 text-center flex flex-col items-center justify-center space-y-4 border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            <Bell className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">Inbox is Clear</h4>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Any live events, calls, support requests, or booking schedules handled by the system will generate alerts here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="card-surface p-5 flex justify-between items-center bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  a.type === 'booking' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  a.type === 'chat' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-indigo-50 text-indigo-600 border-indigo-100'
                }`}>
                  {a.type === 'booking' ? <Calendar className="w-4.5 h-4.5" /> :
                   a.type === 'chat' ? <MessageSquare className="w-4.5 h-4.5" /> :
                   <PhoneCall className="w-4.5 h-4.5" />}
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                    {a.title}
                    {a.time === 'Just now' && (
                      <span className="bg-blue-500 w-1.5 h-1.5 rounded-full inline-block animate-ping" />
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{a.desc}</p>
                  <span className="text-[9px] text-slate-400 font-bold block mt-2.5 uppercase tracking-wider">
                    {a.time}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteAlert(a.id)}
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors"
                title="Dismiss Notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
