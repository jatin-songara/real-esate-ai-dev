'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'

export default function SchedulePage() {
  const { appointments, properties } = useBusinessStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Generate calendar days
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const daysArray = []
  // Empty spaces for padding first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(new Date(year, month, d))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Schedule Timeline</h2>
        <p className="text-xs text-slate-400">View upcoming viewing schedules, slot availability, and manage client time blocks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar visualizer */}
        <div className="lg:col-span-2 card-surface p-5">
          <header className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded border border-slate-200">
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
              <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded border border-slate-200">
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </header>

          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 mt-2 h-72">
            {daysArray.map((day, idx) => {
              if (!day) return <div key={idx} className="bg-slate-50/20" />
              const dayStr = day.toDateString()
              const count = appointments.filter((a) => new Date(a.slot_time).toDateString() === dayStr).length
              return (
                <div key={idx} className="relative bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex flex-col justify-between hover:border-blue-500/20 hover:bg-slate-100/50 transition-all cursor-pointer">
                  <span className="text-[10px] font-bold text-slate-500">{day.getDate()}</span>
                  {count > 0 && (
                    <span className="bg-blue-600 text-white text-[8px] font-extrabold px-1 py-0.5 rounded-md text-center truncate">
                      {count} Viewings
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Appointment Agenda */}
        <div className="card-surface p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Scheduled Slots Agenda</h3>
          {appointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No agenda listings found.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {appointments.map((a) => {
                const prop = properties.find((p) => p.id === a.property_id)
                return (
                  <div key={a.id} className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex flex-col justify-between gap-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block leading-tight">{a.client_name}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{a.client_email}</span>
                      </div>
                      <span className={`badge ${
                        a.status === 'confirmed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {a.status}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 space-y-0.5 pt-2 border-t border-slate-200 mt-2">
                      <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(a.slot_time).toLocaleString()}</div>
                      {prop && <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {prop.title}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
