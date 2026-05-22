import { motion } from 'framer-motion'
import { Users, Stethoscope, Calendar, TrendingUp, AlertTriangle, CreditCard, Activity, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { adminStats, mockRevenueData, mockDepartmentRevenue, mockAppointments, mockPatients, mockNotifications } from '../../../data/mockData'
import { useAuthStore } from '../../../store/authStore'

const statCards = [
  { label: 'Total Patients', value: adminStats.totalPatients.toLocaleString(), icon: Users, change: '+8.2%', positive: true, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { label: 'Active Doctors', value: adminStats.totalDoctors, icon: Stethoscope, change: '+2', positive: true, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  { label: "Today's Appointments", value: adminStats.todayAppointments, icon: Calendar, change: '+12%', positive: true, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50', iconColor: 'text-violet-500' },
  { label: 'Monthly Revenue', value: `₹${(adminStats.monthlyRevenue / 100000).toFixed(1)}L`, icon: TrendingUp, change: '+6.4%', positive: true, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
  { label: 'Pending Bills', value: adminStats.pendingBills, icon: CreditCard, change: '-3', positive: false, color: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', iconColor: 'text-rose-500' },
  { label: 'Emergency Cases', value: adminStats.emergencyCases, icon: AlertTriangle, change: 'Live', positive: false, color: 'from-red-500 to-rose-600', bg: 'bg-red-50', iconColor: 'text-red-500' },
  { label: 'Bed Occupancy', value: `${adminStats.bedOccupancy}%`, icon: Activity, change: '+3%', positive: false, color: 'from-sky-500 to-blue-500', bg: 'bg-sky-50', iconColor: 'text-sky-500' },
  { label: 'Avg Wait Time', value: `${adminStats.avgWaitTime} min`, icon: Clock, change: '-4 min', positive: true, color: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-50', iconColor: 'text-indigo-500' },
]

const statusColor: Record<string, string> = {
  Confirmed: 'badge-success', Waiting: 'badge-warning', 'In Progress': 'badge-info',
  Scheduled: 'badge-info', Cancelled: 'badge-danger', Emergency: 'badge-danger',
}

const priorityColor: Record<string, string> = {
  Normal: 'text-gray-500', High: 'text-amber-600', Emergency: 'text-red-600',
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const todayAppts = mockAppointments.slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0]} 👋 — Thursday, May 15, 2026</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-emerald-700">System Operational</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={18} className={s.iconColor} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${s.positive ? 'text-emerald-600' : 'text-rose-500'}`}>
                {s.change !== 'Live' && (s.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
                {s.change}
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500 font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-500 mt-0.5">Last 7 months performance</p>
            </div>
            <span className="badge badge-success">+6.4% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockRevenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#00B4D8" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#6366F1" strokeWidth={2} fill="url(#expGrad)" name="Expenses" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Revenue Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="dashboard-card">
          <h3 className="font-bold text-gray-900 mb-1">Revenue by Dept</h3>
          <p className="text-xs text-gray-500 mb-4">May 2026</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={mockDepartmentRevenue} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {mockDepartmentRevenue.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {mockDepartmentRevenue.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Today's Appointments + Recent Notifications */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Appointments table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-3 dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Today's Appointments</h3>
            <span className="text-xs text-medical-cyan font-semibold cursor-pointer hover:underline">View All →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th><th>Doctor</th><th>Time</th><th>Type</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppts.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{a.patientName[0]}</div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{a.patientName}</div>
                          <div className="text-xs text-gray-400">{a.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td><div className="text-sm text-gray-700">{a.doctorName.replace('Dr. ', '')}</div><div className="text-xs text-gray-400">{a.department}</div></td>
                    <td><span className="text-sm font-medium text-gray-700">{a.time}</span></td>
                    <td><span className="text-xs text-gray-600">{a.type}</span></td>
                    <td><span className={`badge ${statusColor[a.status] || 'badge-info'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="lg:col-span-2 dashboard-card">
          <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockNotifications.map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${!n.read ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
