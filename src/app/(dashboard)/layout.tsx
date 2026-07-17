'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useBusinessStore } from '../../store/business'
import { useBusinessContext } from '../../providers/BusinessProvider'
import Link from 'next/link'
import {
  LayoutDashboard,
  Home,
  Mic,
  Calendar,
  PhoneCall,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { business } = useBusinessStore()
  const { isLoading } = useBusinessContext()

  useEffect(() => {
    if (!isLoading && !business) {
      router.push('/login')
    }
  }, [isLoading, business, router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-medium text-slate-500 animate-pulse">
          Loading dashboard...
        </div>
      </div>
    )
  }

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/dashboard/properties', icon: Home },
    { name: 'AI Voice Agents', href: '/dashboard/agents', icon: Mic },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Call Logs', href: '/dashboard/conversations', icon: PhoneCall },
    { name: 'Support', href: '/dashboard/support', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 gradient-sidebar flex flex-col justify-between text-white p-4">
        <div>
          {/* Logo & Agency Info */}
          <div className="mb-8 mt-2 px-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-lg tracking-tight">AgentFlow AI</span>
            </div>
            {business && (
              <div className="text-xs text-blue-200 mt-1 truncate bg-blue-950/40 p-1.5 rounded border border-blue-900/50">
                {business.name} ({business.subscription_tier} Plan)
              </div>
            )}
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-lg text-red-300 hover:bg-white/5 transition-all duration-100 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            {menuItems.find((m) => m.href === pathname)?.name || 'Dashboard'}
          </h1>
          {business && (
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-500">Subdomain:</span>
              <a
                href={`/sites/${business.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-medium hover:underline bg-blue-50 px-2 py-1 rounded"
              >
                /sites/{business.slug}
              </a>
            </div>
          )}
        </header>

        {/* Dynamic page contents */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
