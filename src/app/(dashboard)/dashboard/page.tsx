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

  useEffect(() => {
    if (!business) return

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/dashboard/conversations')
        if (res.ok) {
          const data = await res.json()
          const logs = data.logs || []
          setCallCount(logs.length)
          setRecentCalls(logs.slice(0, 5))
          if (logs.length > 0) {
            const totalDur = logs.reduce((sum: number, item: any) => sum + (item.duration || 0), 0)
            setAvgDuration(Math.round(totalDur / logs.length))
          }
        }
      } catch (err) {
        console.error('Error fetching call logs analytics:', err)
      }
    }

    fetchAnalytics()
  }, [business])

  // Mock chart data representing conversation volume trends
  const chartData = [
    { name: 'Mon', calls: 4 },
    { name: 'Tue', calls: 7 },
    { name: 'Wed', calls: 5 },
    { name: 'Thu', calls: 12 },
    { name: 'Fri', calls: 9 },
    { name: 'Sat', calls: 15 },
    { name: 'Sun', calls: 18 },
  ]

  const metrics = [
    { label: 'Active Listings', value: properties.length, icon: Home, color: 'text-blue-500' },
    { label: 'Total Calls', value: callCount, icon: PhoneCall, color: 'text-teal-500' },
    { label: 'Avg Call Duration', value: `${avgDuration}s`, icon: Clock, color: 'text-indigo-500' },
    { label: 'Confirmed Bookings', value: appointments.filter(a => a.status === 'confirmed').length, icon: Calendar, color: 'text-purple-500' },
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
            Your real estate voice calling assistant is ready. Monitor active inquiries below.
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
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Conversation Volume</h3>
            <p className="text-[11px] text-slate-400">Total calls handled by the voice assistant this week</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +24% vs last week
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-Side: Recent calls & appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <div className="card-surface p-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Recent Calls</h3>
          {recentCalls.length === 0 ? (
            <div className="text-xs text-slate-400 py-8 text-center">No call records found.</div>
          ) : (
            <div className="space-y-4">
              {recentCalls.map((log) => (
                <div key={log.id} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <div className="font-semibold text-slate-700">{log.client_phone}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{new Date(log.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-600">{log.duration}s call duration</div>
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
    </div>
  )
}
