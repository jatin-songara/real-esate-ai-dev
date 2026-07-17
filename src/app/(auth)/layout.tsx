import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="text-2xl font-bold tracking-tight text-slate-800">
            Real Estate <span className="text-blue-600">AI calling</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">SaaS Partner Portal</p>
        </div>
        {children}
      </div>
    </div>
  )
}
