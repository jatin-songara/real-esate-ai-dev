'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Copy, Check, Palette, Eye, Layout, ShieldAlert } from 'lucide-react'

export default function WidgetPage() {
  const { business, agents } = useBusinessStore()
  const [activeAgentId, setActiveAgentId] = useState(agents[0]?.id || '')
  const [color, setColor] = useState('#2563eb')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [copiedType, setCopiedType] = useState<string | null>(null)

  const handleCopy = (type: 'html' | 'react') => {
    if (!activeAgentId) return
    const code =
      type === 'html'
        ? `<script src="${window.location.origin}/api/widget?agentId=${activeAgentId}"></script>`
        : `import { RealEstateWidget } from '@realestate-ai/widget';\n\n<RealEstateWidget agentId="${activeAgentId}" theme="${theme}" color="${color}" />`

    navigator.clipboard.writeText(code)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }

  if (agents.length === 0) {
    return (
      <div className="card-surface p-12 text-center flex flex-col items-center justify-center space-y-3">
        <ShieldAlert className="w-8 h-8 text-red-500" />
        <h4 className="text-sm font-semibold text-slate-700">No agents available for widget generation</h4>
        <p className="text-xs text-slate-400">Build an AI agent first to generate copy-paste widget integrations.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Widget Integration</h2>
        <p className="text-xs text-slate-400">Generate, customize, and copy code snippets to embed the AI calling agent into external sites</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customization controls */}
        <div className="card-surface p-6 space-y-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-500" /> Branding Parameters
          </h3>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Select AI Assistant Target</label>
            <select value={activeAgentId} onChange={(e) => setActiveAgentId(e.target.value)} className="input-field py-2 text-xs">
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Theme Variation</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className="input-field py-2 text-xs">
                <option value="light">Light Card</option>
                <option value="dark">Dark Card</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Branding Hex Accent</label>
              <input type="color" className="w-full h-10 rounded-xl cursor-pointer border border-slate-100" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
          </div>

          {/* Copy segments */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Standard HTML script (copy-paste inside &lt;body&gt;)</span>
                <button onClick={() => handleCopy('html')} className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                  {copiedType === 'html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy HTML
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 text-[10px] p-3 rounded-lg overflow-x-auto select-all">
                {`<script src="${window.location.origin}/api/widget?agentId=${activeAgentId}"></script>`}
              </pre>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">React integration snippet</span>
                <button onClick={() => handleCopy('react')} className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                  {copiedType === 'react' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy Component
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 text-[10px] p-3 rounded-lg overflow-x-auto select-all">
                {`import { RealEstateWidget } from '@realestate-ai/widget';\n\n<RealEstateWidget agentId="${activeAgentId}" theme="${theme}" color="${color}" />`}
              </pre>
            </div>
          </div>
        </div>

        {/* Live Simulator Preview */}
        <div className="card-surface p-6 flex flex-col justify-between min-h-[350px]">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-slate-500" /> Interactive Simulator
          </h3>
          <div className="flex-1 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-center relative p-6">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Simulator Window</span>
            
            {/* Mock floating widget */}
            <div className={`absolute bottom-4 right-4 rounded-full px-4 py-2 text-xs font-semibold shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105`} style={{ backgroundColor: color, color: '#fff' }}>
              <span>💬 Ask Assistant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
