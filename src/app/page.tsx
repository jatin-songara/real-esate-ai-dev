'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, Check, ArrowRight, Mic, Globe, Shield, CalendarRange, DollarSign } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      title: 'Customizable AI Calling Agents',
      desc: 'Inject preset properties and custom Q&As to train the voice agent. Supports over 60 languages.',
      icon: Mic,
    },
    {
      title: 'Embeddable Voice Widget',
      desc: 'Add a floating voice assistant to any website with just a single copy-paste HTML code line.',
      icon: Globe,
    },
    {
      title: 'Site Builder Integration',
      desc: 'Instantly publish a premium real estate page with map pins and contact form integration.',
      icon: Shield,
    },
    {
      title: 'Auto Booking & Client Portal',
      desc: 'Real-time calendar verification hooks allow voice agents to register viewing slots mid-call.',
      icon: CalendarRange,
    },
  ]

  const pricing = [
    {
      name: 'Free',
      price: '$0',
      desc: 'Perfect to test the voice agent capabilities.',
      features: ['1 Active AI Agent', '5 Bookings per month', 'Web Widget Embed', 'Standard Personality'],
      btn: 'Get Started',
      href: '/signup',
      glow: false,
    },
    {
      name: 'Pro',
      price: '$49',
      desc: 'Built for independent real estate brokers.',
      features: ['10 Active AI Agents', '99 Bookings per month', 'Web Widget Embed', 'Custom Q&A Training', 'Stripe Client Payments'],
      btn: 'Upgrade to Pro',
      href: '/signup',
      glow: true,
    },
    {
      name: 'Business',
      price: '$199',
      desc: 'Perfect for real estate agencies and firms.',
      features: ['Unlimited AI Agents', 'Unlimited Bookings', 'Custom site subdomain builder', 'Priority Call Latency', 'Multi-lingual Support'],
      btn: 'Upgrade to Business',
      href: '/signup',
      glow: false,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between overflow-x-hidden">
      {/* Navigation */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
            AgentFlow AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-all">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary px-5 py-2">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300">
          <Sparkles className="w-3 h-3 text-blue-400" /> Auto-pilot calling for real estate listings
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Intelligent Voice Assistants for <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-400 bg-clip-text text-transparent">
            Real Estate Booking
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Automate property description walkthroughs, screen leads, and book client viewing appointments directly through live, conversational AI phone calls.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/signup" className="btn-primary px-7 py-3 text-sm">
            Launch Your Agent
          </Link>
          <Link href="#pricing" className="btn-secondary px-7 py-3 text-sm text-white bg-white/5 border-white/10 hover:bg-white/10">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-950/60 border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Fully Loaded SaaS Ecosystem</h2>
            <p className="text-sm text-slate-400">Everything you need to capture, converse, and convert property leads automatically.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon
              return (
                <div key={feat.title} className="bg-slate-900 border border-white/5 p-6 rounded-xl space-y-4">
                  <div className="w-10 h-10 rounded-lg gradient-teal flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-base">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section id="pricing" className="max-w-7xl w-full mx-auto px-6 py-24 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">SaaS Subscription Plans</h2>
          <p className="text-sm text-slate-400">Flexible tiers scaling with your agency operations and monthly inquiry volumes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col justify-between relative ${
                plan.glow
                  ? 'bg-gradient-to-b from-blue-950/40 to-slate-900 border-blue-500/50 shadow-xl shadow-blue-500/5'
                  : 'bg-slate-900/40 border-white/5'
              }`}
            >
              {plan.glow && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full text-white">
                  Most Popular
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <ul className="space-y-3.5 border-t border-white/5 pt-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={plan.href}
                className={`w-full mt-8 text-center py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  plan.glow
                    ? 'btn-primary'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                }`}
              >
                {plan.btn}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} AgentFlow AI Inc. All rights reserved.
      </footer>
    </div>
  )
}
