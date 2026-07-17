import React from 'react'
import '../styles/globals.css'
import { BusinessProvider } from '../providers/BusinessProvider'

export const metadata = {
  title: 'AI Calling Agent SaaS - Real Estate Appointment Booking',
  description: 'Automate client property inquiries and scheduling with intelligent AI voice agents.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="gradient-mesh min-h-screen">
        <BusinessProvider>
          {children}
        </BusinessProvider>
      </body>
    </html>
  )
}
