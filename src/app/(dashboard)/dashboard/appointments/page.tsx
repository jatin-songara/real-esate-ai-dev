'use client'

import React, { useState } from 'react'
import { useBusinessStore } from '../../../../store/business'
import { Calendar, Trash2, Edit3, X, Check, Clock } from 'lucide-react'

export default function AppointmentsDashboard() {
  const { business, appointments, properties, setAppointments } = useBusinessStore()
  const [showModal, setShowModal] = useState(false)
  const [selectedAppt, setSelectedAppt] = useState<any>(null)

  // Edit states
  const [status, setStatus] = useState<any>('pending')
  const [paymentStatus, setPaymentStatus] = useState<any>('unpaid')
  const [slotTime, setSlotTime] = useState('')

  const openEditModal = (appt: any) => {
    setSelectedAppt(appt)
    setStatus(appt.status)
    setPaymentStatus(appt.payment_status)
    // format slot_time (YYYY-MM-DDTHH:MM)
    const date = new Date(appt.slot_time)
    const formatted = date.toISOString().slice(0, 16)
    setSlotTime(formatted)
    setShowModal(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAppt || !business) return

    try {
      const res = await fetch('/api/dashboard/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAppt.id,
          status,
          payment_status: paymentStatus,
          slot_time: new Date(slotTime).toISOString(),
        }),
      })
      const data = await res.json()
      if (res.ok && data.appointment) {
        setAppointments(appointments.map((a: any) => (a.id === data.appointment.id ? data.appointment : a)))
        setShowModal(false)
      }
    } catch (err) {
      console.error('Error updating appointment:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment booking?')) return
    try {
      const res = await fetch(`/api/dashboard/appointments?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setAppointments(appointments.filter((a: any) => a.id !== id))
      }
    } catch (err) {
      console.error('Error deleting appointment:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Appointments</h2>
        <p className="text-xs text-slate-400">View and manage scheduled property viewings or consultations</p>
      </div>

      {appointments.length === 0 ? (
        <div className="card-surface p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Calendar className="w-8 h-8 text-slate-300" />
          <div className="text-sm font-semibold text-slate-600">No scheduled appointments</div>
          <p className="text-xs text-slate-400 max-w-xs">Appointments booked by your clients online or via the AI calling agent will appear here.</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="p-4">Client</th>
                <th className="p-4">Property</th>
                <th className="p-4">Slot Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((appt: any) => {
                const linkedProp = properties.find((p: any) => p.id === appt.property_id)
                return (
                  <tr key={appt.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{appt.client_name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{appt.client_phone} | {appt.client_email}</div>
                    </td>
                    <td className="p-4 text-slate-600 max-w-[200px] truncate">
                      {linkedProp ? linkedProp.title : 'General Consultation'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(appt.slot_time).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${
                        appt.status === 'confirmed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : appt.status === 'pending'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-[11px] text-slate-600">
                        <span className="font-semibold">${appt.payment_amount}</span> ({appt.payment_status.replace('_', ' ')})
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => openEditModal(appt)} className="p-1 hover:bg-slate-100 rounded text-slate-600 inline-block">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(appt.id)} className="p-1 hover:bg-red-50 rounded text-red-600 inline-block">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-100 animate-slide-up">
            <header className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Update Appointment
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </header>
            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Client Name</label>
                <div className="text-slate-800 font-bold bg-slate-50 p-2.5 rounded-lg text-xs">
                  {selectedAppt.client_name}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Slot Date & Time</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Status</label>
                  <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Payment Status</label>
                  <select className="input-field" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid_cash">Paid Cash</option>
                    <option value="paid_stripe">Paid Online (Stripe)</option>
                  </select>
                </div>
              </div>

              <footer className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
