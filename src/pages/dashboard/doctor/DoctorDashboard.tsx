import { motion } from 'framer-motion'
import { Calendar, Users, Clock, CheckCircle, Activity, Stethoscope } from 'lucide-react'
import { mockAppointments, mockPatients } from '../../../data/mockData'
import { useAuthStore } from '../../../store/authStore'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { mockAppointmentStats } from '../../../data/mockData'

export default function DoctorDashboard() {
  const { user } = useAuthStore()
  const myAppts = mockAppointments.filter(a => a.doctorName.includes('Priya'))
  const todayAppts = myAppts.slice(0, 4)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name?.split(' ').slice(-1)[0]} 👨‍⚕️ — Thursday, May 15, 2026</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm font-semibold text-blue-700">
          {user?.department || 'Cardiology'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Patients", value: '12', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Appointments', value: myAppts.length, icon: Calendar, bg: 'bg-violet-50', color: 'text-violet-600' },
          { label: 'Avg Wait Time', value: '14 min', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
          { label: 'Completed Today', value: '8', icon: CheckCircle, bg: 'bg-emerald-50', color: 'text-emerald-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon size={18} className={s.color} /></div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 dashboard-card">
          <h3 className="font-bold text-gray-900 mb-4">Weekly Appointment Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockAppointmentStats}>
              <defs>
                <linearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00B4D8" stopOpacity={0.15} /><stop offset="95%" stopColor="#00B4D8" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="appointments" stroke="#00B4D8" strokeWidth={2.5} fill="url(#docGrad)" name="Appointments" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="dashboard-card">
          <h3 className="font-bold text-gray-900 mb-4">Today's Overview</h3>
          <div className="space-y-3">
            {[
              { label: 'Waiting', count: 2, color: 'bg-amber-500' },
              { label: 'In Progress', count: 1, color: 'bg-blue-500' },
              { label: 'Completed', count: 8, color: 'bg-emerald-500' },
              { label: 'Upcoming', count: 3, color: 'bg-violet-500' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <span className="text-sm text-gray-600">{s.label}</span>
                </div>
                <span className="font-bold text-gray-900">{s.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Activity size={14} className="text-blue-500" />
              <span>All systems operational</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Today's appointments */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Today's Appointments</h3>
        <div className="space-y-3">
          {todayAppts.map(a => (
            <div key={a.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-bold flex items-center justify-center flex-shrink-0">{a.patientName[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">{a.patientName}</div>
                <div className="text-xs text-gray-500">{a.type} · {a.notes}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800 text-sm">{a.time}</div>
                <span className={`badge text-[10px] ${a.priority === 'Emergency' ? 'badge-danger' : 'badge-info'}`}>{a.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
