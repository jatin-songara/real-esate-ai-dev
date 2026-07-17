'use client'

import React, { useEffect, useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { PhoneCall, X, Clock, Calendar } from 'lucide-react'
import { Agent } from '../../../../types'

export default function ConversationsDashboard() {
  const { business, agents } = useBusinessStore()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<any>(null)

  useEffect(() => {
    if (!business) return

    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/dashboard/conversations')
        if (res.ok) {
          const data = await res.json()
          setLogs(data.logs || [])
        }
      } catch (err) {
        console.error('Error fetching call logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [business])

  if (loading) {
    return <div className="text-xs text-slate-500 py-4">Loading call records...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Call Logs</h2>
        <p className="text-xs text-slate-400">View complete call records and AI conversations with your clients</p>
      </div>

      {logs.length === 0 ? (
        <div className="card-surface p-12 text-center flex flex-col items-center justify-center space-y-3">
          <PhoneCall className="w-8 h-8 text-slate-300" />
          <div className="text-sm font-semibold text-slate-600">No calls recorded yet</div>
          <p className="text-xs text-slate-400 max-w-xs">When users speak with your AI calling agents, transcripts will be logged here in real-time.</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="p-4">Client Phone</th>
                <th className="p-4">AI Agent</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => {
                const agent = agents.find((a: Agent) => a.id === log.agent_id)
                return (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">{log.client_phone}</td>
                    <td className="p-4 text-slate-600 font-medium">
                      {agent ? agent.name : 'General Assistant'}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {log.duration}s
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="btn-secondary py-1 px-3 text-[11px]"
                      >
                        Inspect Transcript
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Transcript inspection modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-slate-100 animate-slide-up flex flex-col h-[75vh]">
            <header className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Call Details - {selectedLog.client_phone}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Duration: {selectedLog.duration} seconds</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Transcript scrollable bubbles */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50">
              {(!selectedLog.transcript || selectedLog.transcript.length === 0) ? (
                <div className="text-xs text-slate-400 text-center py-12">No transcript recorded for this session.</div>
              ) : (
                selectedLog.transcript.map((msg: any, idx: number) => {
                  const isUser = msg.role === 'user'
                  return (
                    <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div className="text-[9px] text-slate-400 uppercase font-semibold mb-0.5 px-1">
                        {isUser ? 'Client' : 'AI Assistant'}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
