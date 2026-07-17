import React from 'react'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default function SiteNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4 p-6">
      <ShieldAlert className="w-12 h-12 text-red-500" />
      <h2 className="text-xl font-bold text-slate-800">Agency Portal Not Found</h2>
      <p className="text-xs text-slate-500 max-w-xs text-center">
        The custom real estate page you are looking for does not exist, or the owner has changed their subdomain slug.
      </p>
      <Link href="/" className="btn-primary text-xs px-6 py-2">
        Back to Home
      </Link>
    </div>
  )
}
