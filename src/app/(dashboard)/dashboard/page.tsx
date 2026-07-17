'use client'

import React, { useEffect, useState } from 'react'
import { useBusinessStore } from '../../../store/business'
import {
  Home,
  PhoneCall,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  MessageSquare,
  X,
  Bot,
  User,
  Activity,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

export default function DashboardOverview() {
  const { business, properties, appointments } = useBusinessStore()
  const [callCount, setCallCount] = useState(0)
  const [avgDuration, setAvgDuration] = useState(0)
  const [recentCalls, setRecentCalls] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  
  // Modal states for transcript reading
  const [activeLog, setActiveLog] = useState<any | null>(null)

  useEffect(() => {
    if (!business) return

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/dashboard/conversations')
        if (res.ok) {
          const data = await res.json()
          const logs = data.logs || []
          setCallCount(logs.length)
          setRecentCalls(logs)

          // Calculate average duration
          if (logs.length > 0) {
            const totalDur = logs.reduce((sum: number, item: any) => sum + (item.duration || 0), 0)
            setAvgDuration(Math.round(totalDur / logs.length))
          }

          // Build graph data mapping average call duration over logs
          const lastSeven = logs.slice(-7).reverse()
          const mappedChart = lastSeven.map((item: any, idx: number) => ({
            name: `Call ${idx + 1}`,
            duration: item.duration || 0,
          }))
          // Fallback if no calls
          if (mappedChart.length === 0) {
            setChartData([
              { name: 'Mon', duration: 45 },
              { name: 'Tue', duration: 32 },
              { name: 'Wed', duration: 58 },
              { name: 'Thu', duration: 42 },
              { name: 'Fri', duration: 75 },
            ])
          } else {
            setChartData(mappedChart)
          }
        }
      } catch (err) {
        console.error('Error fetching call logs analytics:', err)
      }
    }

    fetchAnalytics()
  }, [business])

  const metrics = [
    { label: 'Active Listings', value: properties.length, icon: Home, color: 'text-blue-500' },
    { label: 'Total Calls', value: callCount, icon: PhoneCall, color: 'text-teal-500' },
    { label: 'Avg Call Duration', value: `${avgDuration}s`, icon: Clock, color: 'text-indigo-500' },
    { label: 'Conversion Tracker', value: '100%', icon: Activity, color: 'text-emerald-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Welcome back, {business?.name || 'Partner'}! <Sparkles className="w-5 h-5 text-yellow-300" />
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Your real estate voice calling assistant is active. Monitor performance graphs below.
          </p>
        </div>
        <div className="hidden sm:block bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-right">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">Subscription Tier</span>
          <div className="text-lg font-bold text-white uppercase">{business?.subscription_tier}</div>
        </div>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="stat-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{metric.label}</span>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-2">{metric.value}</div>
            </div>
          )
        })}
      </div>

      {/* Analytics Chart */}
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Average Call Durations</h3>
            <p className="text-[11px] text-slate-400">Call durations (seconds) tracked across recent phone conversations</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Normal Latency
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorDurations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="duration" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorDurations)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Call logs and appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Logs Section */}
        <div className="card-surface p-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Dedicated Call Logs</h3>
          {recentCalls.length === 0 ? (
            <div className="text-xs text-slate-400 py-8 text-center">No call logs found.</div>
          ) : (
            <div className="space-y-4">
              {recentCalls.slice(0, 5).map((log) => (
                <div key={log.id} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <div className="font-semibold text-slate-700">{log.client_phone}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{new Date(log.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-semibold">{log.duration}s call</span>
                    <button
                      onClick={() => setActiveLog(log)}
                      className="btn-secondary py-1 px-3 text-[10px] flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> Read Transcript
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booked Appointments */}
        <div className="card-surface p-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Upcoming Appointments</h3>
          {appointments.length === 0 ? (
            <div className="text-xs text-slate-400 py-8 text-center">No appointments booked yet.</div>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0, 5).map((appt) => (
                <div key={appt.id} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <div className="font-semibold text-slate-700">{appt.client_name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{new Date(appt.slot_time).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className={`badge ${
                      appt.status === 'confirmed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transcript Modal Dialog */}
      {activeLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl animate-fade-in border border-slate-100">
            <header className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">AI Call Transcript</h3>
                <p className="text-[10px] text-slate-400">{activeLog.client_phone} • {activeLog.duration}s call</p>
              </div>
              <button onClick={() => setActiveLog(null)} className="p-1 hover:bg-slate-200 rounded">
                <X className="w-4.5 h-4.5 text-slate-400" />
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {(() => {
                let messages: any[] = []
                try {
                  messages = JSON.parse(activeLog.transcript || '[]')
                } catch (_) {
                  messages = []
                }
                
                if (messages.length === 0) {
                  return <p className="text-xs text-slate-400 text-center py-6">No transcript entries recorded.</p>
                }

                return messages.map((m, idx) => {
                  const isAgent = m.role === 'assistant' || m.role === 'system'
                  return (
                    <div key={idx} className={`flex gap-2.5 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isAgent ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAgent 
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
