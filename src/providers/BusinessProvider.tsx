'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useBusinessStore } from '../store/business'
import { Business, Property, Agent, Appointment, Service } from '../types'

const BusinessContext = createContext<any>(null)

export const BusinessProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    setBusiness,
    setProperties,
    setAgents,
    setAppointments,
    setServices,
  } = useBusinessStore()

  const [isLoading, setIsLoading] = useState(true)

  const hydrateStore = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/dashboard/data')
      if (res.ok) {
        const data = await res.json()
        setBusiness(data.business as Business)
        setProperties((data.properties || []) as Property[])
        setAgents((data.agents || []) as Agent[])
        setAppointments((data.appointments || []) as Appointment[])
        setServices((data.services || []) as Service[])
      } else {
        setBusiness(null)
        setProperties([])
        setAgents([])
        setAppointments([])
        setServices([])
      }
    } catch (err) {
      console.error('Error hydrating business store from D1:', err)
      setBusiness(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    hydrateStore()
  }, [])

  return (
    <BusinessContext.Provider value={{ isLoading, refresh: hydrateStore }}>
      {children}
    </BusinessContext.Provider>
  )
}

export const useBusinessContext = () => useContext(BusinessContext)
