import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Clock, AlertTriangle, Filter } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { useDataStore, Appointment } from '../../../store/dataStore'
import toast from 'react-hot-toast'

const statusColor: Record<string, string> = {
  Scheduled: 'bg-slate-100 text-slate-700',
  Confirmed: 'badge-success', 
  Waiting: 'badge-warning', 
  'In Progress': 'badge-info',
  Cancelled: 'badge-danger',
}

export default function DoctorAppointments() {
  const { user } = useAuthStore()
  const { appointments, updateAppointmentStatus, rescheduleAppointment } = useDataStore()
  const [filter, setFilter] = useState('All')
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' })

  const appts = appointments.filter(a => {
    if (!user?.name) return false
    const cleanDocName = user.name.replace('Dr. ', '').toLowerCase().trim()
    return a.doctorName.toLowerCase().includes(cleanDocName)
  })

  const filtered = filter === 'All' ? appts : appts.filter(a => a.status === filter)

  const handleStartConsultation = (id: string) => {
    updateAppointmentStatus(id, 'In Progress')
    toast.success('Consultation started! Patient is in progress.')
  }

  const handleOpenReschedule = (a: Appointment) => {
    setRescheduleId(a.id)
    setRescheduleForm({ date: a.date, time: a.time })
  }

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rescheduleForm.date || !rescheduleForm.time) {
      toast.error('Please select date and time')
      return
    }
    if (rescheduleId) {
      rescheduleAppointment(rescheduleId, rescheduleForm.date, rescheduleForm.time)
      toast.success('Appointment rescheduled successfully!')
      setRescheduleId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Appointments</h1>
        <p className="text-gray-500 text-sm mt-0.5">{filtered.length} appointments</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['All', 'Scheduled', 'Waiting', 'In Progress', 'Confirmed', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            className="dashboard-card flex items-center gap-4">
            <div className="flex-shrink-0 text-center">
              <div className="text-2xl font-black text-blue-600">{a.time.split(':')[0]}</div>
              <div className="text-xs text-gray-400">:{a.time.split(':')[1]}</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">{a.patientName}</span>
                {a.priority === 'Emergency' && <span className="badge badge-danger flex items-center gap-1"><AlertTriangle size={10} /> Emergency</span>}
              </div>
              <div className="text-xs text-gray-500">{a.type} · {a.notes}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${statusColor[a.status] || 'badge-info'}`}>{a.status}</span>
              <div className="flex gap-2">
                {a.status !== 'Confirmed' && a.status !== 'Cancelled' && a.status !== 'In Progress' && (
                  <button onClick={() => handleStartConsultation(a.id)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">Start</button>
                )}
                {a.status === 'In Progress' && (
                  <button onClick={() => updateAppointmentStatus(a.id, 'Confirmed')} className="px-3 py-1.5 rounded-lg bg-emerald-650 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">Complete</button>
                )}
                {a.status !== 'Confirmed' && a.status !== 'Cancelled' && (
                  <button onClick={() => handleOpenReschedule(a)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">Reschedule</button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center dashboard-card">
            <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No appointments found</p>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-black text-gray-900 mb-6 font-sans">Reschedule Appointment</h2>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="form-label">New Date *</label>
                <input type="date" className="form-input" value={rescheduleForm.date} onChange={e => setRescheduleForm({ ...rescheduleForm, date: e.target.value })} required min="2026-05-15" />
              </div>
              <div>
                <label className="form-label">New Time *</label>
                <select className="form-input" value={rescheduleForm.time} onChange={e => setRescheduleForm({ ...rescheduleForm, time: e.target.value })} required>
                  {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary text-sm justify-center py-2.5">Confirm</button>
                <button type="button" className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50" onClick={() => setRescheduleId(null)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
