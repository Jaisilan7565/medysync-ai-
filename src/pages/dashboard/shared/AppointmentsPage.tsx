import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, Search, AlertTriangle, ChevronLeft, ChevronRight, X, User } from 'lucide-react'
import { useDataStore, Appointment } from '../../../store/dataStore'
import toast from 'react-hot-toast'

const statusColor: Record<string, string> = {
  Scheduled: 'bg-slate-100 text-slate-700',
  Confirmed: 'badge-success', 
  Waiting: 'badge-warning', 
  'In Progress': 'badge-info',
  Cancelled: 'badge-danger',
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function AppointmentsPage() {
  const { appointments } = useDataStore()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)) // May 2026 for demo
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)

  // Filter based on search
  const searchedAppts = appointments.filter(a =>
    a.patientName.toLowerCase().includes(search.toLowerCase()) ||
    a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  )

  // Date filters for list view
  const todayStr = '2026-05-16' // Fix anchor today for demo
  const filtered = searchedAppts.filter(a => {
    if (dateFilter === 'today') return a.date === todayStr
    if (dateFilter === 'tomorrow') return a.date === '2026-05-17'
    if (dateFilter === 'week') {
      const day = parseInt(a.date.split('-')[2])
      return day >= 16 && day <= 22
    }
    return true
  })

  // Calendar math
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const startDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const paddingStart = Array.from({ length: startDay }, (_, i) => {
    const d = prevMonthDays - startDay + i + 1
    const m = month === 0 ? 12 : month
    const y = month === 0 ? year - 1 : year
    return {
      day: d,
      isCurrentMonth: false,
      dateString: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    }
  })

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1
    return {
      day: d,
      isCurrentMonth: true,
      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    }
  })

  const totalDaysSoFar = paddingStart.length + currentMonthDays.length
  const remaining = totalDaysSoFar % 7 === 0 ? 0 : 7 - (totalDaysSoFar % 7)
  
  const paddingEnd = Array.from({ length: remaining }, (_, i) => {
    const d = i + 1
    const m = month === 11 ? 1 : month + 2
    const y = month === 11 ? year + 1 : year
    return {
      day: d,
      isCurrentMonth: false,
      dateString: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    }
  })

  const calendarDays = [...paddingStart, ...currentMonthDays, ...paddingEnd]

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Appointments Schedule</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} scheduled sessions</p>
        </div>
        <div className="flex gap-2.5">
          <div className="flex bg-gray-100 p-0.5 rounded-xl border border-gray-200">
            <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-650 shadow-sm border border-black/5' : 'text-gray-500 hover:text-gray-900'}`}>List</button>
            <button onClick={() => setViewMode('calendar')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-blue-650 shadow-sm border border-black/5' : 'text-gray-500 hover:text-gray-900'}`}>Calendar</button>
          </div>
          <button onClick={() => toast.success('To book appointments, log in as Receptionist')} className="btn-primary text-sm py-2.5">
            <Plus size={15} /> Book Appointment
          </button>
        </div>
      </div>

      {/* Search and filtering */}
      {viewMode === 'list' && (
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="form-input pl-9" placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['today', 'tomorrow', 'week', 'all'].map(d => (
              <button key={d} onClick={() => setDateFilter(d)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${dateFilter === d ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>{d}</button>
            ))}
          </div>
        </div>
      )}

      {/* Emergency banner */}
      {appointments.some(a => a.priority === 'Emergency') && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
          <AlertTriangle size={20} className="text-red-600 animate-pulse flex-shrink-0" />
          <span className="font-bold text-red-800">Critical: There is an active Emergency patient requiring attention.</span>
        </div>
      )}

      {/* Main View Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="dashboard-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Type</th><th>Priority</th><th>Status</th><th>Fee</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr key={a.id}>
                      <td><span className="font-mono text-xs text-gray-500">{a.id}</span></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs font-bold flex items-center justify-center">{a.patientName[0]}</div>
                          <span className="text-sm font-medium text-gray-900">{a.patientName}</span>
                        </div>
                      </td>
                      <td><span className="text-sm text-gray-700">{a.doctorName}</span></td>
                      <td><div className="text-sm font-medium text-gray-900">{a.date}</div><div className="text-xs text-gray-400">{a.time}</div></td>
                      <td><span className="text-xs text-gray-600">{a.type}</span></td>
                      <td><span className={`text-xs font-semibold ${a.priority === 'Emergency' ? 'text-red-650' : a.priority === 'High' ? 'text-amber-600' : 'text-gray-500'}`}>{a.priority}</span></td>
                      <td><span className={`badge ${statusColor[a.status] || 'badge-info'}`}>{a.status}</span></td>
                      <td><span className="text-sm font-semibold text-gray-800">₹{a.fee.toLocaleString()}</span></td>
                      <td>
                        <button onClick={() => setSelectedAppt(a)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">View Details</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-gray-400">No appointments match the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div key="calendar" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="dashboard-card">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-gray-900">{months[month]} {year}</h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"><ChevronLeft size={16} /></button>
                <button onClick={nextMonth} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"><ChevronRight size={16} /></button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
              {/* Day names */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-slate-50 py-3 text-center text-xs font-bold text-gray-500 border-b border-gray-200">{day}</div>
              ))}

              {/* Day cells */}
              {calendarDays.map((cell, idx) => {
                const cellAppts = searchedAppts.filter(a => a.date === cell.dateString)
                return (
                  <div key={idx} className={`bg-white min-h-[100px] p-2 flex flex-col justify-between hover:bg-slate-50/50 transition-colors group relative ${!cell.isCurrentMonth ? 'opacity-40' : ''}`}>
                    <div className="text-xs font-bold text-gray-400 group-hover:text-gray-700 transition-colors mb-1">{cell.day}</div>
                    
                    <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scroll">
                      {cellAppts.map(appt => (
                        <div
                          key={appt.id}
                          onClick={() => setSelectedAppt(appt)}
                          className={`text-[10px] px-2 py-1 rounded-md font-semibold cursor-pointer truncate border transition-all ${appt.priority === 'Emergency' ? 'bg-red-50 border-red-200 text-red-750 hover:bg-red-100' : 'bg-blue-50 border-blue-150 text-blue-800 hover:bg-blue-100'}`}
                          title={`${appt.time} - ${appt.patientName} (${appt.doctorName})`}
                        >
                          <span className="font-bold">{appt.time}</span> {appt.patientName}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900">Appointment Details</h2>
              <button onClick={() => setSelectedAppt(null)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
            </div>
            
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm"><User size={16} /></div>
              <div>
                <div className="font-black text-gray-900 text-base">{selectedAppt.patientName}</div>
                <div className="text-xs text-blue-600 font-semibold mt-0.5">ID: {selectedAppt.patientId}</div>
              </div>
            </div>

            <div className="space-y-3.5 text-sm mb-6">
              {[
                ['Doctor Assigned', selectedAppt.doctorName],
                ['Department', selectedAppt.department],
                ['Scheduled Date', selectedAppt.date],
                ['Scheduled Time', selectedAppt.time],
                ['Consultation Type', selectedAppt.type],
                ['Appointment Status', selectedAppt.status],
                ['Priority Level', selectedAppt.priority],
                ['Total Charges', `₹${selectedAppt.fee.toLocaleString()}`]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">{k}</span>
                  <span className={`font-semibold text-gray-900 ${k === 'Appointment Status' ? 'capitalize text-blue-600' : ''}`}>{v}</span>
                </div>
              ))}
              {selectedAppt.notes && (
                <div className="pt-2">
                  <span className="text-gray-500 font-medium block mb-1">Notes:</span>
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-100">{selectedAppt.notes}</div>
                </div>
              )}
            </div>

            <button onClick={() => setSelectedAppt(null)} className="w-full btn-primary py-3 justify-center text-sm">Close details</button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
