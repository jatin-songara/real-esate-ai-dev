import { create } from 'zustand'
import { Business, Property, Agent, Appointment } from '../types'

interface BusinessState {
  business: Business | null;
  properties: Property[];
  agents: Agent[];
  appointments: Appointment[];
  isLoading: boolean;
  setBusiness: (business: Business | null) => void;
  setProperties: (properties: Property[]) => void;
  setAgents: (agents: Agent[]) => void;
  setAppointments: (appointments: Appointment[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  business: null,
  properties: [],
  agents: [],
  appointments: [],
  isLoading: false,
  setBusiness: (business) => set({ business }),
  setProperties: (properties) => set({ properties }),
  setAgents: (agents) => set({ agents }),
  setAppointments: (appointments) => set({ appointments }),
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
}))