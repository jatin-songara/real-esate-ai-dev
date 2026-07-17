'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, Check, ArrowRight, Mic, Globe, Shield, CalendarRange, Lock, HelpCircle } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      title: 'Customizable AI Calling Agents',
      desc: 'Inject preset properties and custom Q&As to train the voice agent. Supports over 60 languages.',
      icon: Mic,
      tag: 'Omnichannel'
    },
    {
      title: 'Embeddable Voice Widget',
      desc: 'Add a floating voice assistant to any website with just a single copy-paste HTML code line.',
      icon: Globe,
      tag: 'Widget'
    },
    {
      title: 'Site Builder Integration',
      desc: 'Instantly publish a premium real estate page with map pins and contact form integration.',
      icon: Shield,
      tag: 'Add-on'
    },
    {
      title: 'Auto Booking & Client Portal',
      desc: 'Real-time calendar verification hooks allow voice agents to register viewing slots mid-call.',
      icon: CalendarRange,
      tag: 'Portal'
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
      features: ['10 Active AI Agents', '5,099 Bookings per month', 'Web Widget Embed', 'Custom Q&A Training', 'Stripe Client Payments'],
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans relative selection:bg-blue-500/30 selection:text-blue-200">
      {/* Light Beams and Radial Mesh Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 blur-[150px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-transparent z-0" />
      <div className="absolute top-[800px] right-0 w-96 h-96 pointer-events-none opacity-20 blur-[120px] bg-blue-500/20 rounded-full" />

      {/* Navigation */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
            Nuvanta AI
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-all uppercase tracking-wider">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary py-2 px-5 text-xs shadow-lg shadow-blue-600/15">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-28 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-300 animate-fade-in shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Auto-pilot calling for real estate agencies
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
          Intelligent Voice Agents for{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-600 bg-clip-text text-transparent">
            Real Estate Booking
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Deploy an autonomous AI voice assistant that speaks over 60 languages, explains property amenities, screen client leads, and books viewing appointments 24/7.
        </p>
        <div className="flex justify-center gap-4 pt-6">
          <Link href="/signup" className="btn-primary px-8 py-3.5 text-xs font-bold shadow-xl shadow-blue-600/20">
            Launch Your Agent
          </Link>
          <Link href="#pricing" className="btn-secondary px-8 py-3.5 text-xs font-bold text-slate-300 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
            View Pricing Tiers
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-950/40 border-y border-white/5 py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Fully Loaded SaaS Ecosystem</h2>
            <p className="text-xs text-slate-400 leading-relaxed">Everything you need to capture, converse, and convert property leads automatically.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon
              return (
                <div key={feat.title} className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl space-y-4 hover:border-blue-500/20 hover:bg-slate-900 transition-all group">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-blue-500/80 bg-blue-500/5 px-2 py-0.5 rounded-full border border-blue-500/10">{feat.tag}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section id="pricing" className="max-w-7xl w-full mx-auto px-6 py-28 space-y-20 relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">SaaS Subscription Plans</h2>
          <p className="text-xs text-slate-400">Flexible tiers scaling with your agency operations and monthly inquiry volumes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
                plan.glow
                  ? 'bg-gradient-to-b from-blue-950/20 to-slate-950 border-blue-500/40 shadow-2xl shadow-blue-500/5'
                  : 'bg-slate-900/40 border-white/5'
              }`}
            >
              {plan.glow && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] uppercase font-bold tracking-widest px-3.5 py-1 rounded-full text-white shadow-lg shadow-blue-600/25 border border-blue-400/20">
                  Most Popular
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wide">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
                <ul className="space-y-4 border-t border-white/5 pt-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={plan.href}
                className={`w-full mt-8 text-center py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                  plan.glow
                    ? 'btn-primary shadow-lg shadow-blue-600/10'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-slate-300'
                }`}
              >
                {plan.btn}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Website Builder Add-on Promotion */}
      <section className="max-w-4xl w-full mx-auto px-6 pb-28 relative z-10">
        <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">Optional Add-on</span>
            <h3 className="text-xl font-bold text-white mt-1">SaaS Subdomain Website Builder</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Unlock a dedicated landing page builder with map coordinates, themes, and instant voice widgets. Stand up a digital home listing in minutes for **$29/month**.
            </p>
          </div>
          <Link href="/signup" className="btn-primary py-3 px-6 text-xs bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/15 whitespace-nowrap">
            Subscribe Add-on <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-xs text-slate-500 bg-slate-950 relative z-10">
        &copy; {new Date().getFullYear()} Nuvanta Software Solutions. All rights reserved.
      </footer>
    </div>
  )
}
