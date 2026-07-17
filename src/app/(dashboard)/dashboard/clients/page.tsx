'use client'

import React from 'react'
import { useBusinessStore } from '../../../../store/business'
import { User, Phone, Mail, History, Home } from 'lucide-react'

export default function ClientsPage() {
  const { appointments, properties } = useBusinessStore()

  // Aggregate unique clients from appointments
  const uniqueClientsMap = new Map()
  appointments.forEach((appt) => {
    if (!uniqueClientsMap.has(appt.client_email)) {
      uniqueClientsMap.set(appt.client_email, {
        name: appptName(appt.client_name),
        phone: appt.client_phone,
        email: appt.client_email,
        bookingsCount: 0,
        viewingsList: [],
      })
    }
    const client = uniqueClientsMap.get(appt.client_email)
    client.bookingsCount += 1
    const prop = properties.find((p) => p.id === appt.property_id)
    client.viewingsList.push({
      id: appt.id,
      date: new Date(appt.slot_time).toLocaleDateString(),
      title: prop ? prop.title : 'Deleted Property',
      status: appt.status,
    })
  })

  // Safe client name formatter
  function appptName(nameStr: string) {
    return nameStr || 'Prospect Client'
  }

  const clientsList = Array.from(uniqueClientsMap.values())

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Client Directory</h2>
        <p className="text-xs text-slate-400">List qualified home buyer prospects, call history logs, and viewing profiles</p>
      </div>

      {clientsList.length === 0 ? (
        <div className="card-surface p-12 text-center flex flex-col items-center justify-center space-y-2">
          <User className="w-8 h-8 text-slate-350" />
          <h4 className="text-sm font-semibold text-slate-700">No client files found</h4>
          <p className="text-xs text-slate-400 max-w-xs">When clients schedule slots via voice call or forms, their contact card profile compiles here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientsList.map((client, idx) => (
            <div key={idx} className="card-surface p-5 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{client.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{client.bookingsCount} Scheduled Viewings</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {client.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {client.phone}</div>
                </div>
              </div>

              {/* History trail */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <History className="w-3.5 h-3.5" /> Viewing Activity Trail
                </span>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {client.viewingsList.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-[10px] bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-slate-700 truncate max-w-[150px]">{item.title}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-slate-400">{item.date}</span>
                        <span className="font-bold text-slate-500 uppercase">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
