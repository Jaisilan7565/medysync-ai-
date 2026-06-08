import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { mockRevenueData, mockAppointmentStats, mockDepartmentRevenue, mockDepartments } from '../../../data/mockData'
import { TrendingUp, Users, Calendar, CreditCard } from 'lucide-react'
import { useDataStore } from '../../../store/dataStore'

export default function AnalyticsPage() {
  const { adminStats, patients, appointments, invoices } = useDataStore()

  const avgInvoice = invoices.length > 0 ? Math.round(invoices.reduce((s, iv) => s + iv.amount, 0) / invoices.length) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">Comprehensive live insights</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${adminStats.monthlyRevenue.toLocaleString()}`, sub: '+6.4% vs last month', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Patients', value: patients.length.toString(), sub: '+18% this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Appointments Count', value: appointments.length.toString(), sub: '97.2% completion rate', icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Avg. Invoice', value: `₹${avgInvoice.toLocaleString()}`, sub: '+12% vs last month', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon size={18} className={k.color} />
            </div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{k.value}</div>
            <div className="text-xs text-gray-500">{k.label}</div>
            <div className={`text-xs font-medium mt-1 ${k.color}`}>{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue + Appointments */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="dashboard-card">
          <h3 className="font-bold text-gray-900 mb-1">Revenue vs Expenses</h3>
          <p className="text-xs text-gray-400 mb-4">Last 7 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockRevenueData}>
              <defs>
                <linearGradient id="r1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                <linearGradient id="e1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#r1)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fill="url(#e1)" name="Expenses" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="dashboard-card">
          <h3 className="font-bold text-gray-900 mb-1">Weekly Appointments</h3>
          <p className="text-xs text-gray-400 mb-4">Booked vs Completed</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockAppointmentStats} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Bar dataKey="appointments" fill="#00B4D8" radius={[4, 4, 0, 0]} name="Booked" />
              <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Department + Patient trend */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dashboard-card">
          <h3 className="font-bold text-gray-900 mb-1">Revenue by Department</h3>
          <p className="text-xs text-gray-400 mb-4">May 2026 breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={mockDepartmentRevenue} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {mockDepartmentRevenue.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {mockDepartmentRevenue.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} /><span className="text-gray-600">{d.name}</span></div>
                <span className="font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 dashboard-card">
          <h3 className="font-bold text-gray-900 mb-1">Patient Growth Trend</h3>
          <p className="text-xs text-gray-400 mb-4">Monthly patient registrations</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Line type="monotone" dataKey="patients" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4 }} name="Patients" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Department stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Department Performance</h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockDepartments.map(dep => (
            <div key={dep.id} className="text-center p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors">
              <div className="text-3xl mb-2">{dep.icon}</div>
              <div className="font-bold text-gray-900 text-sm">{dep.name}</div>
              <div className="text-xs text-gray-500 mt-1">{dep.doctors} doctors</div>
              <div className="text-xs font-semibold text-blue-600 mt-0.5">{dep.patients} patients</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
