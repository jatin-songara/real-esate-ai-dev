import React from 'react'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
        <span className="font-extrabold text-sm tracking-tight text-slate-800 uppercase">Client Booking Portal</span>
      </header>
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 flex-shrink-0">
        &copy; {new Date().getFullYear()} Nuvanta Software Solutions. All rights reserved.
      </footer>
    </div>
  )
}
