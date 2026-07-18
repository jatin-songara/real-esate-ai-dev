import { create } from 'zustand'
import { Business, Property, Agent, Appointment, Service } from '../types'

interface BusinessState {
  business: Business | null;
  properties: Property[];
  agents: Agent[];
  appointments: Appointment[];
  services: Service[];
  isLoading: boolean;
  setBusiness: (business: Business | null) => void;
  setProperties: (properties: Property[]) => void;
  setAgents: (agents: Agent[]) => void;
  setAppointments: (appointments: Appointment[]) => void;
  setServices: (services: Service[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  business: null,
  properties: [],
  agents: [],
  appointments: [],
  services: [],
  isLoading: false,
  setBusiness: (business) => set({ business }),
  setProperties: (properties) => set({ properties }),
  setAgents: (agents) => set({ agents }),
  setAppointments: (appointments) => set({ appointments }),
  setServices: (services) => set({ services }),
  setIsLoading: (isLoading) => set({ isLoading }),
  addProperty: (property) => set((state) => ({ properties: [...state.properties, property] })),
  updateProperty: (property) =>
    set((state) => ({
      properties: state.properties.map((p) => (p.id === property.id ? property : p)),
    })),
  deleteProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
    })),
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  updateAgent: (agent) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agent.id ? agent : a)),
    })),
  deleteAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
    })),
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  updateAppointment: (appointment) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === appointment.id ? appointment : a)),
    })),
  addService: (service) => set((state) => ({ services: [...state.services, service] })),
  updateService: (service) =>
    set((state) => ({
      services: state.services.map((s) => (s.id === service.id ? service : s)),
    })),
  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    })),
}))