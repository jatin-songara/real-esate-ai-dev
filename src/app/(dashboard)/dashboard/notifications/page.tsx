'use client'

import React, { useState } from 'react'
import { Bell, Sparkles, MessageSquare, Calendar, PhoneCall, Trash2 } from 'lucide-react'

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState([
    { id: '1', title: 'New Viewing Appointment Booked', desc: 'Client Jane Doe booked a tour at 10:00 AM for Beautiful Downtown Loft.', type: 'booking', time: '10 mins ago' },
    { id: '2', title: 'Support Desk Ticket Opened', desc: 'Client email jane@doe.com started a chat regarding rental procedures.', type: 'chat', time: '1 hour ago' },
    { id: '3', title: 'Call Log Record Created', desc: 'AI assistant handled a 45-second call with prospect +12345678.', type: 'call', time: '2 hours ago' }
  ])

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

      {alerts.length === 0 ? (
        <div className="card-surface p-12 text-center flex flex-col items-center justify-center space-y-2">
          <Bell className="w-8 h-8 text-slate-350" />
          <h4 className="text-sm font-semibold text-slate-700">Inbox is empty</h4>
          <p className="text-xs text-slate-400">All live events and notification alerts have been cleared.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((a) => (
            <div key={a.id} className="card-surface p-4 flex justify-between items-center hover:bg-slate-50/40 transition-all">
              <div className="flex gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  a.type === 'booking' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  a.type === 'chat' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  'bg-indigo-50 text-indigo-600 border border-indigo-100'
                }`}>
                  {a.type === 'booking' ? <Calendar className="w-4 h-4" /> :
                   a.type === 'chat' ? <MessageSquare className="w-4 h-4" /> :
                   <PhoneCall className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">{a.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{a.desc}</p>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-1.5 uppercase tracking-wider">{a.time}</span>
                </div>
              </div>

              <button onClick={() => deleteAlert(a.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100">
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
