import { motion } from 'framer-motion'
import { Users, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { useDataStore } from '../../../store/dataStore'

export default function ReceptionistDashboard() {
  const { user } = useAuthStore()
  const { appointments } = useDataStore()
  const waiting = appointments.filter(a => a.status === 'Waiting')
  const confirmed = appointments.filter(a => a.status === 'Confirmed')
  const emergency = appointments.filter(a => a.priority === 'Emergency')

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Reception Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome, {user?.name} 👋 — Front Desk Queue Manager</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Today', value: appointments.length, icon: Calendar, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Waiting', value: waiting.length, icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
          { label: 'Confirmed', value: confirmed.length, icon: CheckCircle, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Emergency', value: emergency.length, icon: AlertTriangle, bg: 'bg-red-50', color: 'text-red-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon size={18} className={s.color} /></div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Emergency alerts */}
      {emergency.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-600 animate-pulse" />
            <h3 className="font-bold text-red-800">Active Emergency Cases</h3>
          </div>
          <div className="space-y-2">
            {emergency.map(e => (
              <div key={e.id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white font-bold flex items-center justify-center text-sm">{e.patientName[0]}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{e.patientName}</div>
                  <div className="text-xs text-gray-500">{e.notes} · {e.time}</div>
                </div>
                <span className="badge badge-danger">Emergency</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Queue */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Today's Queue</h3>
        <div className="space-y-3">
          {appointments.slice(0, 6).map((a, idx) => (
            <div key={a.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold text-xs flex items-center justify-center">{String(idx + 1).padStart(2, '0')}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">{a.patientName}</div>
                <div className="text-xs text-gray-500">{a.doctorName} · {a.department}</div>
              </div>
              <div className="text-sm font-bold text-gray-700">{a.time}</div>
              <span className={`badge ${a.status === 'Waiting' ? 'badge-warning' : a.status === 'In Progress' ? 'badge-info' : a.status === 'Confirmed' ? 'badge-success' : a.status === 'Cancelled' ? 'badge-danger' : 'badge-info'}`}>{a.status}</span>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">No appointments in the queue.</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
