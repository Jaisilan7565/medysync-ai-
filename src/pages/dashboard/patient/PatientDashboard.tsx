import { motion } from 'framer-motion'
import { Calendar, Activity, CreditCard, Pill, HeartPulse } from 'lucide-react'
import { useDataStore } from '../../../store/dataStore'
import { useAuthStore } from '../../../store/authStore'

export default function PatientDashboard() {
  const { user } = useAuthStore()
  const { appointments, invoices, prescriptions, patients } = useDataStore()

  // Find this patient profile by matching user name or email
  const patientProfile = patients.find(
    p => p.email.toLowerCase() === user?.email?.toLowerCase() || p.name.toLowerCase() === user?.name?.toLowerCase()
  )

  const patientId = patientProfile?.id || 'P001'
  const patientName = patientProfile?.name || user?.name || 'Aarav Sharma'
  const bloodGroup = patientProfile?.bloodGroup || 'O+'
  const allergies = patientProfile?.allergies || 'Penicillin'
  const primaryDoctor = patientProfile?.doctor || 'Dr. Priya Mehta'
  const lastVisit = patientProfile?.lastVisit || '2026-05-10'

  const myAppts = appointments.filter(a => a.patientId === patientId)
  const myInvoices = invoices.filter(i => i.patientId === patientId)
  const myPrescriptions = prescriptions.filter(p => p.patientId === patientId)

  const upcomingVisits = myAppts.filter(a => a.status === 'Scheduled' || a.status === 'Waiting' || a.status === 'In Progress')
  const completedVisits = myAppts.filter(a => a.status === 'Confirmed')
  const pendingBills = myInvoices.filter(i => i.status !== 'Paid')

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Health Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back, {patientName.split(' ')[0]} 💊 — Stay healthy!</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Visits', value: upcomingVisits.length, icon: Calendar, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Total Visits', value: completedVisits.length, icon: Activity, bg: 'bg-violet-50', color: 'text-violet-600' },
          { label: 'Prescriptions', value: myPrescriptions.length, icon: Pill, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Pending Bills', value: pendingBills.length, icon: CreditCard, bg: 'bg-amber-50', color: 'text-amber-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon size={18} className={s.color} /></div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Health profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <HeartPulse size={20} className="text-cyan-300" />
            <h3 className="font-bold text-white">My Health Profile</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['Blood Group', bloodGroup], 
              ['Allergies', allergies], 
              ['Primary Doctor', primaryDoctor], 
              ['Last Visit', lastVisit]
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-blue-200">{k}</div>
                <div className="font-bold text-white mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 w-48 h-full opacity-10">
          <div className="w-full h-full" style={{ background: 'radial-gradient(circle at 100% 50%, white, transparent)' }} />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dashboard-card">
          <h3 className="font-bold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcomingVisits.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex flex-col items-center justify-center flex-shrink-0">
                  <div className="text-xs font-black text-blue-600">{a.date.split('-')[2] || '16'}</div>
                  <div className="text-[10px] text-blue-400">MAY</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{a.doctorName}</div>
                  <div className="text-xs text-gray-500">{a.department} · {a.time}</div>
                </div>
                <span className={`badge ${a.status === 'Confirmed' ? 'badge-success' : 'badge-info'}`}>{a.status}</span>
              </div>
            ))}
            {upcomingVisits.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No upcoming appointments scheduled.</p>
            )}
          </div>
        </motion.div>

        {/* Bills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="dashboard-card">
          <h3 className="font-bold text-gray-900 mb-4">Recent Bills</h3>
          <div className="space-y-3">
            {myInvoices.slice(0, 3).map(inv => (
              <div key={inv.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={16} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm font-mono">{inv.id}</div>
                  <div className="text-xs text-gray-500">Due: {inv.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-gray-900 text-sm">₹{inv.amount.toLocaleString()}</div>
                  <span className={`badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{inv.status}</span>
                </div>
              </div>
            ))}
            {myInvoices.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No bills found.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
