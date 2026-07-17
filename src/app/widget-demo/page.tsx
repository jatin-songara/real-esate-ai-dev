'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRealtimeVoice } from '../../hooks/useRealtimeVoice'
import { useVoiceStore } from '../../store/voice'
import { Mic, PhoneOff, User, Bot, Sparkles } from 'lucide-react'

function WidgetDemoContent() {
  const searchParams = useSearchParams()
  const agentId = searchParams.get('agentId') || ''

  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { isConnecting, isConnected, startSession, stopSession } = useRealtimeVoice()
  const { messages } = useVoiceStore()

  useEffect(() => {
    if (!agentId) return
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/widget/details?agentId=${agentId}`)
        if (res.ok) {
          const data = await res.json()
          setAgent(data.agent)
        }
      } catch (err) {
        console.error('Error fetching widget agent config:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAgent()
  }, [agentId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-xs text-slate-400">
        Loading assistant...
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-xs text-red-500">
        Agent configuration not found
      </div>
    )
  }

  const isDark = agent.widget_theme === 'dark'
  const accentColor = agent.widget_color || '#2563eb'

  return (
    <div className={`h-screen flex flex-col justify-between p-4 font-sans select-none transition-colors ${
      isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
    }`}>
      {/* Header */}
      <header className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full status-dot animate-pulse" style={{ backgroundColor: isConnected ? '#10b981' : '#cbd5e1' }} />
          <div>
            <h4 className="font-bold text-xs">{agent.name}</h4>
            <p className="text-[9px] text-slate-400">{isConnected ? 'Talking...' : 'Ready to talk'}</p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-blue-400" />
      </header>

      {/* Message Transcripts */}
      <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[11px] text-slate-400 p-6 space-y-2">
            <Bot className="w-8 h-8 opacity-40" />
            <p>Click the microphone button to initiate a live voice conversation about this property.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user'
            return (
              <div key={idx} className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  isUser ? 'bg-blue-100 text-blue-600' : 'bg-slate-150 text-slate-600 dark:bg-white/10 dark:text-slate-300'
                }`}>
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={`p-2.5 rounded-xl max-w-[80%] leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 dark:bg-white/5 dark:text-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Call interaction panel */}
      <footer className="flex flex-col items-center justify-center pt-3 border-t border-slate-100 dark:border-white/5 space-y-3">
        {/* Animated wave bars */}
        {isConnected && (
          <div className="flex items-center gap-1 h-5 mb-1">
            <span className="waveform-bar h-4" />
            <span className="waveform-bar h-5" />
            <span className="waveform-bar h-3" />
            <span className="waveform-bar h-5" />
            <span className="waveform-bar h-2" />
          </div>
        )}

        <div className="flex items-center gap-4">
          {isConnected ? (
            <button
              onClick={stopSession}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => startSession(agent.id)}
              disabled={isConnecting}
              style={{ backgroundColor: accentColor }}
              className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
            >
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

export default function WidgetDemoPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-white text-xs text-slate-400">Loading component...</div>}>
      <WidgetDemoContent />
    </Suspense>
  )
}
