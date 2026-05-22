import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react'
import { mockAppointments } from '../../../data/mockData'
import toast from 'react-hot-toast'

export default function QueueManagement() {
  const [queue, setQueue] = useState(mockAppointments.map((a, i) => ({ ...a, queueNum: i + 1 })))

  const checkIn = (id: string) => {
    setQueue(prev => prev.map(a => a.id === id ? { ...a, status: 'In Progress' } : a))
    toast.success('Patient checked in!')
  }

  const complete = (id: string) => {
    setQueue(prev => prev.map(a => a.id === id ? { ...a, status: 'Confirmed' } : a))
    toast.success('Consultation complete!')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Queue Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">Real-time patient queue for today</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Waiting', count: queue.filter(a => a.status === 'Waiting').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'In Progress', count: queue.filter(a => a.status === 'In Progress').length, icon: ArrowRight, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', count: queue.filter(a => a.status === 'Confirmed').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className="stat-card text-center">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}><s.icon size={20} className={s.color} /></div>
            <div className="text-3xl font-black text-gray-900">{s.count}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Live Queue</h3>
        <div className="space-y-3">
          {queue.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${a.priority === 'Emergency' ? 'border-red-200 bg-red-50' : a.status === 'In Progress' ? 'border-blue-200 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
              <div className={`w-10 h-10 rounded-full text-white font-black flex items-center justify-center text-sm flex-shrink-0 ${a.priority === 'Emergency' ? 'bg-red-500' : 'bg-gradient-to-br from-blue-500 to-cyan-400'}`}>
                {a.priority === 'Emergency' ? <AlertTriangle size={16} /> : a.queueNum}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-sm">{a.patientName}</div>
                <div className="text-xs text-gray-500">{a.doctorName} · {a.time} · {a.type}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${a.status === 'Waiting' ? 'badge-warning' : a.status === 'In Progress' ? 'badge-info' : 'badge-success'}`}>{a.status}</span>
                {a.status === 'Waiting' && (
                  <button onClick={() => checkIn(a.id)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1">
                    <UserCheck size={12} /> Check In
                  </button>
                )}
                {a.status === 'In Progress' && (
                  <button onClick={() => complete(a.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1">
                    <CheckCircle size={12} /> Complete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
