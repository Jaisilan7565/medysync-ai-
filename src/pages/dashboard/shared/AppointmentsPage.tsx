import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Plus, Search, AlertTriangle } from 'lucide-react'
import { mockAppointments } from '../../../data/mockData'
import toast from 'react-hot-toast'

const statusColor: Record<string, string> = {
  Confirmed: 'badge-success', Waiting: 'badge-warning', 'In Progress': 'badge-info',
  Scheduled: 'badge-info', Cancelled: 'badge-danger',
}

export default function AppointmentsPage() {
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('today')

  const filtered = mockAppointments.filter(a =>
    a.patientName.toLowerCase().includes(search.toLowerCase()) ||
    a.doctorName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Appointments</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} appointments found</p>
        </div>
        <button onClick={() => toast.success('Opening appointment booking...')} className="btn-primary text-sm py-2.5">
          <Plus size={15} /> Book Appointment
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-9" placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['today', 'tomorrow', 'week', 'all'].map(d => (
            <button key={d} onClick={() => setDateFilter(d)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${dateFilter === d ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>{d}</button>
          ))}
        </div>
      </div>

      {/* Emergency banner */}
      {filtered.some(a => a.priority === 'Emergency') && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
          <AlertTriangle size={20} className="text-red-600 animate-pulse flex-shrink-0" />
          <span className="font-bold text-red-800">Emergency case active — Rajesh Gupta requires immediate attention</span>
        </div>
      )}

      <div className="dashboard-card p-0 overflow-hidden">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Type</th><th>Department</th><th>Priority</th><th>Status</th><th>Fee</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((a, i) => (
              <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td><span className="font-mono text-xs text-gray-500">{a.id}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs font-bold flex items-center justify-center">{a.patientName[0]}</div>
                    <span className="text-sm font-medium text-gray-900">{a.patientName}</span>
                  </div>
                </td>
                <td><span className="text-sm text-gray-700">{a.doctorName.replace('Dr. ', '')}</span></td>
                <td><div className="text-sm font-medium text-gray-900">{a.date}</div><div className="text-xs text-gray-400">{a.time}</div></td>
                <td><span className="text-xs text-gray-600">{a.type}</span></td>
                <td><span className="text-xs text-gray-600">{a.department}</span></td>
                <td><span className={`text-xs font-semibold ${a.priority === 'Emergency' ? 'text-red-600' : a.priority === 'High' ? 'text-amber-600' : 'text-gray-500'}`}>{a.priority}</span></td>
                <td><span className={`badge ${statusColor[a.status] || 'badge-info'}`}>{a.status}</span></td>
                <td><span className="text-sm font-semibold text-gray-800">₹{a.fee.toLocaleString()}</span></td>
                <td>
                  <div className="flex gap-1.5">
                    <button onClick={() => toast.success('Opening appointment details...')} className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">View</button>
                    <button onClick={() => toast.success('Appointment rescheduled!')} className="px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 transition-colors">Reschedule</button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
