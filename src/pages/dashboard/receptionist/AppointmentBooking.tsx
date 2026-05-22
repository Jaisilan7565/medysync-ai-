import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, MessageSquare } from 'lucide-react'
import { mockDoctors, mockPatients } from '../../../data/mockData'
import toast from 'react-hot-toast'

export default function AppointmentBooking() {
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', time: '', type: 'Consultation', notes: '' })
  const [booked, setBooked] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId || !form.doctorId || !form.date || !form.time) { toast.error('Please fill required fields'); return }
    setBooked(true)
    toast.success('Appointment booked successfully!')
    setTimeout(() => setShowWhatsApp(true), 1000)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Book Appointment</h1>
        <p className="text-gray-500 text-sm mt-0.5">Schedule a new patient appointment</p>
      </div>

      {!booked ? (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card space-y-5">
          <div>
            <label className="form-label">Patient *</label>
            <select className="form-input" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
              <option value="">Select patient...</option>
              {mockPatients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.id}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Doctor *</label>
            <select className="form-input" value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })}>
              <option value="">Select doctor...</option>
              {mockDoctors.filter(d => d.status !== 'On Leave').map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} min="2026-05-15" />
            </div>
            <div>
              <label className="form-label">Time *</label>
              <select className="form-input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                <option value="">Select time...</option>
                {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Appointment Type</label>
            <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {['Consultation', 'Follow-up', 'Emergency', 'Procedure', 'Lab Results'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-input h-20 resize-none" placeholder="Reason for visit, symptoms..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button type="submit" className="w-full btn-primary py-3.5 justify-center text-sm">
            <Calendar size={16} /> Confirm Appointment
          </button>
        </motion.form>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="dashboard-card text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Appointment Booked!</h2>
          <p className="text-gray-500 text-sm mb-4">The appointment has been confirmed and added to the queue.</p>

          {showWhatsApp && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#075E54] rounded-2xl p-4 text-left mt-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={16} className="text-white" />
                <span className="text-white font-semibold text-sm">WhatsApp Reminder Sent</span>
                <span className="ml-auto text-[10px] text-emerald-300">✓✓ Delivered</span>
              </div>
              <div className="bg-[#DCF8C6] rounded-xl p-3 text-xs text-gray-800">
                <p className="font-semibold">MediSync AI Reminder</p>
                <p className="mt-1">Your appointment has been confirmed at MediSync Hospital. Please arrive 10 minutes early.</p>
                <p className="text-gray-500 mt-1 text-right">Just now ✓✓</p>
              </div>
            </motion.div>
          )}

          <button onClick={() => { setBooked(false); setShowWhatsApp(false); setForm({ patientId: '', doctorId: '', date: '', time: '', type: 'Consultation', notes: '' }) }}
            className="btn-primary text-sm py-2.5">Book Another Appointment</button>
        </motion.div>
      )}
    </div>
  )
}
