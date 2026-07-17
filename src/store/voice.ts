import { create } from 'zustand'
import { CallTranscriptMessage } from '../types'

interface VoiceState {
  isConnecting: boolean;
  isConnected: boolean;
  isMuted: boolean;
  messages: CallTranscriptMessage[];
  setConnecting: (isConnecting: boolean) => void;
  setConnected: (isConnected: boolean) => void;
  setMuted: (isMuted: boolean) => void;
  addMessage: (message: CallTranscriptMessage) => void;
  clearMessages: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isConnecting: false,
  isConnected: false,
  isMuted: false,
  messages: [],
  setConnecting: (isConnecting) => set({ isConnecting }),
  setConnected: (isConnected) => set({ isConnected }),
  setMuted: (isMuted) => set({ isMuted }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}))