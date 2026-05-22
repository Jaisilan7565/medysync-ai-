import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Clock, AlertTriangle, Filter } from 'lucide-react'
import { mockAppointments } from '../../../data/mockData'
import toast from 'react-hot-toast'

const statusColor: Record<string, string> = {
  Confirmed: 'badge-success', Waiting: 'badge-warning', 'In Progress': 'badge-info',
  Scheduled: 'badge-info', Cancelled: 'badge-danger',
}

export default function DoctorAppointments() {
  const [filter, setFilter] = useState('All')
  const appts = mockAppointments.filter(a => a.doctorName.includes('Priya') || a.doctorName.includes('Mehta'))
  const filtered = filter === 'All' ? appts : appts.filter(a => a.status === filter)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Appointments</h1>
        <p className="text-gray-500 text-sm mt-0.5">{filtered.length} appointments</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['All', 'Scheduled', 'Confirmed', 'Waiting', 'In Progress', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>{s}</button>
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
              <div className="text-xs text-gray-500">{a.type} · {a.department} · {a.notes}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${statusColor[a.status] || 'badge-info'}`}>{a.status}</span>
              <div className="flex gap-2">
                <button onClick={() => toast.success('Starting consultation...')} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">Start</button>
                <button onClick={() => toast.success('Appointment rescheduled')} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">Reschedule</button>
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
    </div>
  )
}
