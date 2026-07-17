'use client'

import { useRef } from 'react'
import { useVoiceStore } from '../store/voice'

export const useRealtimeVoice = () => {
  const {
    isConnecting,
    isConnected,
    isMuted,
    setConnecting,
    setConnected,
    setMuted,
    addMessage,
    clearMessages,
  } = useVoiceStore()

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  const startSession = async (agentId: string) => {
    if (isConnecting || isConnected) return
    setConnecting(true)
    clearMessages()

    try {
      // 1. Fetch ephemeral token from our secure server route
      const tokenRes = await fetch('/api/voice/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      })
      const { client_secret, agent } = await tokenRes.json()

      if (!client_secret) {
        throw new Error('Failed to retrieve ephemeral voice session token')
      }

      // 2. Set up WebRTC Peer Connection
      const pc = new RTCPeerConnection()
      pcRef.current = pc

      // Listen for remote audio track and play it
      pc.ontrack = (e) => {
        const el = document.createElement('audio')
        el.srcObject = e.streams[0]
        el.autoplay = true
        document.body.appendChild(el)
      }

      // 3. Request microphone access and attach local track
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = localStream
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream))

      // 4. Set up Data Channel for conversational data & tools
      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc

      dc.onopen = () => {
        setConnected(true)
        setConnecting(false)
        console.log('Realtime voice session established successfully.')
      }

      dc.onmessage = async (e) => {
        try {
          const serverEvent = JSON.parse(e.data)

          // Handle speech transcript updates
          if (serverEvent.type === 'conversation.item.input_audio_transcription.completed') {
            addMessage({
              role: 'user',
              content: serverEvent.transcript || '',
              timestamp: new Date().toLocaleTimeString(),
            })
          }

          if (serverEvent.type === 'response.audio_transcript.done') {
            addMessage({
              role: 'assistant',
              content: serverEvent.transcript || '',
              timestamp: new Date().toLocaleTimeString(),
            })
          }

          // Handle function calls (tool executions)
          if (serverEvent.type === 'response.done') {
            const outputItems = serverEvent.response?.output || []
            for (const item of outputItems) {
              if (item.type === 'function_call') {
                const { name, arguments: argsString, call_id } = item
                if (name === 'book_appointment') {
                  const args = JSON.parse(argsString)
                  // Call backend API to record appointment
                  const bookRes = await fetch('/api/voice/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      businessId: agent.business_id,
                      propertyId: agent.property_id || args.propertyId, // Fallback if general
                      clientName: args.clientName,
                      clientEmail: args.clientEmail,
                      clientPhone: args.clientPhone,
                      dateTime: args.dateTime,
                    }),
                  })
                  const bookResult = await bookRes.json()

                  // Send execution response back to OpenAI
                  dc.send(JSON.stringify({
                    type: 'conversation.item.create',
                    item: {
                      type: 'function_call_output',
                      call_id,
                      output: JSON.stringify(bookResult),
                    },
                  }))

                  // Request response regeneration
                  dc.send(JSON.stringify({ type: 'response.create' }))
                }
              }
            }
          }
        } catch (err) {
          console.error('Error handling data channel event:', err)
        }
      }

      // 5. Exchange SDP offer with OpenAI WebRTC endpoint
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const baseUrl = 'https://api.openai.com/v1/realtime'
      const model = 'gpt-4o-realtime-preview-2024-12-17'
      const response = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${client_secret}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      })

      const answerSdp = await response.text()
      await pc.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: answerSdp,
      }))
    } catch (err) {
      console.error('Error starting WebRTC voice call:', err)
      setConnecting(false)
      setConnected(false)
    }
  }

  const stopSession = () => {
    if (pcRef.current) pcRef.current.close()
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    pcRef.current = null
    dcRef.current = null
    localStreamRef.current = null
    setConnected(false)
    setConnecting(false)
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setMuted(!audioTrack.enabled)
      }
    }
  }

  return {
    isConnecting,
    isConnected,
    isMuted,
    startSession,
    stopSession,
    toggleMute,
  }
}